import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const horario = await prisma.horario.findUnique({
        where: { horarioID: params.id },
        include: { ruta: true, autobus: true, conductor: true, boletos: true },
    })
    if (!horario) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ horario })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    await prisma.horario.update({
        where: { horarioID: params.id },
        data: { estado: 'CANCELADO' },
    })

    await prisma.logAuditoria.create({
        data: {
            usuarioID: session.user!.id as string,
            accion:    'HORARIO_CANCELAR',
            modulo:    'horarios',
            resultado: 'Exito',
            detalles:  `Horario cancelado: ${params.id}`,
        },
    })

    return NextResponse.json({ ok: true })
}
