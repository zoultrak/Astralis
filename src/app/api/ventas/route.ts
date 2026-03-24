import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export async function GET(_req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const ventas = await prisma.venta.findMany({
        include: {
            boletos: { include: { asiento: true, cliente: true } },
            comprobanteFiscal: true,
        },
        orderBy: { fechaHora: 'desc' },
        take: 50,
    })
    return NextResponse.json({ ventas })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { horarioID, asientoID, cliente: clienteData, metodoPago, montoEntregado } = await req.json()

    if (!horarioID || !asientoID || !clienteData?.nombre || !metodoPago) {
        return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    // Verificar que el asiento esté disponible
    const asiento = await prisma.asiento.findUnique({ where: { asientoID } })
    if (!asiento || !asiento.disponible) {
        return NextResponse.json({ error: 'El asiento ya no está disponible' }, { status: 409 })
    }

    // Obtener el horario con precio
    const horario = await prisma.horario.findUnique({ where: { horarioID } })
    if (!horario) return NextResponse.json({ error: 'Horario no encontrado' }, { status: 404 })

    const precio = horario.precioBase
    const cambio = metodoPago === 'EFECTIVO' && montoEntregado > precio
        ? montoEntregado - Number(precio)
        : 0

    // Transacción: crear cliente, venta y boleto atomicamente
    const result = await prisma.$transaction(async (tx) => {
        // Crear o buscar cliente
        const cliente = await tx.cliente.create({
            data: {
                nombre:    clienteData.nombre,
                email:     clienteData.email   || null,
                edad:      clienteData.edad     ? parseInt(clienteData.edad) : null,
                documento: clienteData.documento || null,
            },
        })

        // Crear venta
        const venta = await tx.venta.create({
            data: {
                vendedorID:      session.user!.id as string,
                metodoPago,
                montoTotal:      precio,
                cambioEntregado: cambio > 0 ? cambio : null,
                estado:          'COMPLETADA',
            },
        })

        // Crear boleto con código QR único
        const codigoQR = `AST-${randomUUID().replace(/-/g, '').toUpperCase().slice(0, 16)}`
        const boleto = await tx.boleto.create({
            data: {
                horarioID,
                clienteID: cliente.clienteID,
                ventaID:   venta.ventaID,
                asientoID,
                precio,
                codigoQR,
                estado:     'VENDIDO',
                fechaVenta: new Date(),
            },
        })

        // Marcar asiento como no disponible
        await tx.asiento.update({
            where: { asientoID },
            data:  { disponible: false },
        })

        return { venta, boleto, cliente, asiento: { numero: asiento.numero } }
    })

    await prisma.logAuditoria.create({
        data: {
            usuarioID: session.user!.id as string,
            accion:    'BOLETO_VENDER',
            modulo:    'ventas',
            resultado: 'Exito',
            detalles:  `Boleto vendido: ${result.boleto.codigoQR} — Pasajero: ${clienteData.nombre}`,
        },
    })

    return NextResponse.json(result, { status: 201 })
}
