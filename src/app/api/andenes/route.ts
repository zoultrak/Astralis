import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const andenes = await prisma.anden.findMany({
        include: { _count: { select: { asignaciones: true } } },
        orderBy: { numero: 'asc' },
    })
    return NextResponse.json({ andenes })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { numero, capacidad, estado, horarioDisponible } = await req.json()
    if (!numero) return NextResponse.json({ error: 'Número de andén requerido' }, { status: 400 })

    const anden = await prisma.anden.create({
        data: { numero, capacidad: capacidad ?? 1, estado: estado ?? 'DISPONIBLE', horarioDisponible },
    })
    return NextResponse.json({ anden }, { status: 201 })
}
