import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/rutas/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const ruta = await prisma.ruta.findUnique({
        where: { rutaID: params.id },
        include: { paradas: { orderBy: { ordenEnRuta: 'asc' } }, horarios: true },
    })

    if (!ruta) return NextResponse.json({ error: 'Ruta no encontrada' }, { status: 404 })

    return NextResponse.json({ ruta })
}

// PUT /api/rutas/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json()

    const ruta = await prisma.ruta.update({
        where: { rutaID: params.id },
        data: {
            nombreRuta:        body.nombreRuta,
            ciudadOrigen:      body.ciudadOrigen,
            ciudadDestino:     body.ciudadDestino,
            terminalOrigen:    body.terminalOrigen,
            terminalDestino:   body.terminalDestino,
            distanciaKm:       body.distanciaKm,
            tiempoEstimadoHrs: body.tiempoEstimadoHrs,
            tipoRuta:          body.tipoRuta,
            tarifaBase:        body.tarifaBase,
            estado:            body.estado,
        },
    })

    await prisma.logAuditoria.create({
        data: {
            usuarioID: session.user!.id as string,
            accion:    'RUTA_EDITAR',
            modulo:    'rutas',
            resultado: 'Exito',
            detalles:  `Ruta actualizada: ${params.id}`,
        },
    })

    return NextResponse.json({ ruta })
}

// DELETE /api/rutas/[id]  — desactiva, no borra físico
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    await prisma.ruta.update({
        where: { rutaID: params.id },
        data: { estado: 'INACTIVA' },
    })

    await prisma.logAuditoria.create({
        data: {
            usuarioID: session.user!.id as string,
            accion:    'RUTA_DESACTIVAR',
            modulo:    'rutas',
            resultado: 'Exito',
            detalles:  `Ruta desactivada: ${params.id}`,
        },
    })

    return NextResponse.json({ ok: true })
}
