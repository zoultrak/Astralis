import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json()
    const conductor = await prisma.conductor.update({
        where: { conductorID: params.id },
        data: {
            nombreCompleto:  body.nombreCompleto,
            numeroLicencia:  body.numeroLicencia,
            vigenciaLicencia: body.vigenciaLicencia ? new Date(body.vigenciaLicencia) : undefined,
            domicilio:       body.domicilio,
            numeroTelefonico: body.numeroTelefonico,
            disponible:      body.disponible,
            estado:          body.estado,
        },
    })

    await prisma.logAuditoria.create({
        data: { usuarioID: session.user!.id as string, accion: 'CONDUCTOR_EDITAR', modulo: 'conductores', resultado: 'Exito', detalles: `Conductor actualizado: ${params.id}` },
    })

    return NextResponse.json({ conductor })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { motivoBaja } = await req.json().catch(() => ({ motivoBaja: 'Sin motivo' }))

    await prisma.conductor.update({
        where: { conductorID: params.id },
        data: { estado: 'INACTIVO', disponible: false, motivoBaja },
    })

    await prisma.logAuditoria.create({
        data: { usuarioID: session.user!.id as string, accion: 'CONDUCTOR_BAJA', modulo: 'conductores', resultado: 'Exito', detalles: `Conductor dado de baja: ${params.id} — ${motivoBaja}` },
    })

    return NextResponse.json({ ok: true })
}
