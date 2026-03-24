import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const autobuses = await prisma.autobus.findMany({
        where: { estadoOperativo: { not: 'FUERA_DE_SERVICIO' } },
        include: { _count: { select: { asientos: true } } },
        orderBy: { fechaRegistro: 'desc' },
    })
    return NextResponse.json({ autobuses })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { numeroEconomico, placas, vin, marca, modelo, anio, capacidadAsientos, tipoServicio, estadoOperativo } = await req.json()

    if (!numeroEconomico || !placas || !vin || !marca || !modelo) {
        return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const autobus = await prisma.autobus.create({
        data: { numeroEconomico, placas, vin, marca, modelo, anio, capacidadAsientos, tipoServicio, estadoOperativo: estadoOperativo ?? 'DISPONIBLE' },
    })

    // Crear asientos automáticamente
    const asientos = Array.from({ length: capacidadAsientos }, (_, i) => ({
        autobusID: autobus.autobusID,
        numero: `A${String(i + 1).padStart(2, '0')}`,
    }))
    await prisma.asiento.createMany({ data: asientos })

    await prisma.logAuditoria.create({
        data: { usuarioID: session.user!.id as string, accion: 'AUTOBUS_CREAR', modulo: 'autobuses', resultado: 'Exito', detalles: `Autobús registrado: ${numeroEconomico}` },
    })

    return NextResponse.json({ autobus }, { status: 201 })
}
