import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const autobus = await prisma.autobus.findUnique({
        where: { autobusID: params.id },
        include: { asientos: true, mantenimientos: { orderBy: { fechaInicio: 'desc' }, take: 5 } },
    })
    if (!autobus) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ autobus })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json()
    const autobus = await prisma.autobus.update({
        where: { autobusID: params.id },
        data: {
            marca: body.marca, modelo: body.modelo, anio: body.anio,
            placas: body.placas, tipoServicio: body.tipoServicio, estadoOperativo: body.estadoOperativo,
        },
    })

    await prisma.logAuditoria.create({
        data: { usuarioID: session.user!.id as string, accion: 'AUTOBUS_EDITAR', modulo: 'autobuses', resultado: 'Exito', detalles: `Autobús actualizado: ${params.id}` },
    })

    return NextResponse.json({ autobus })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    await prisma.autobus.update({
        where: { autobusID: params.id },
        data: { estadoOperativo: 'FUERA_DE_SERVICIO' },
    })

    await prisma.logAuditoria.create({
        data: { usuarioID: session.user!.id as string, accion: 'AUTOBUS_BAJA', modulo: 'autobuses', resultado: 'Exito', detalles: `Autobús dado de baja: ${params.id}` },
    })

    return NextResponse.json({ ok: true })
}
