import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const horarios = await prisma.horario.findMany({
        include: {
            ruta:      { select: { codigoRuta: true, nombreRuta: true } },
            autobus:   { select: { numeroEconomico: true, marca: true, modelo: true } },
            conductor: { select: { nombreCompleto: true } },
        },
        orderBy: { creadoEn: 'desc' },
    })

    return NextResponse.json({ horarios })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { rutaID, autobusID, conductorID, horaSalida, fechaInicio, frecuencia, vigencia, fechaFin, precioBase } = await req.json()

    if (!rutaID || !autobusID || !conductorID || !horaSalida || !fechaInicio) {
        return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Parsear hora de salida (HH:mm) a Date
    const [hh, mm] = horaSalida.split(':').map(Number)
    const horaSalidaDate = new Date(1970, 0, 1, hh, mm)

    const horario = await prisma.horario.create({
        data: {
            rutaID,
            autobusID,
            conductorID,
            programadoPorID: session.user!.id as string,
            fechaInicio:     new Date(fechaInicio),
            horaSalida:      horaSalidaDate,
            frecuencia,
            vigencia:        vigencia ?? 'INDEFINIDA',
            fechaFin:        fechaFin ? new Date(fechaFin) : null,
            precioBase,
        },
    })

    await prisma.logAuditoria.create({
        data: {
            usuarioID: session.user!.id as string,
            accion:    'HORARIO_CREAR',
            modulo:    'horarios',
            resultado: 'Exito',
            detalles:  `Horario creado: ${horario.horarioID}`,
        },
    })

    return NextResponse.json({ horario }, { status: 201 })
}
