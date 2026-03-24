import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json()
    const anden = await prisma.anden.update({
        where: { andenID: params.id },
        data: { numero: body.numero, capacidad: body.capacidad, estado: body.estado, horarioDisponible: body.horarioDisponible },
    })
    return NextResponse.json({ anden })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    await prisma.anden.delete({ where: { andenID: params.id } })
    return NextResponse.json({ ok: true })
}
