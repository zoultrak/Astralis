import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/boletos/asientos?horarioID=xxx
export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const horarioID = searchParams.get('horarioID')

    if (!horarioID) return NextResponse.json({ error: 'horarioID requerido' }, { status: 400 })

    const horario = await prisma.horario.findUnique({
        where: { horarioID },
        include: { autobus: { include: { asientos: { orderBy: { numero: 'asc' } } } } },
    })

    if (!horario) return NextResponse.json({ error: 'Horario no encontrado' }, { status: 404 })

    // Asientos vendidos en este horario
    const boletosVendidos = await prisma.boleto.findMany({
        where: { horarioID, estado: 'VENDIDO' },
        select: { asientoID: true },
    })
    const vendidosSet = new Set(boletosVendidos.map(b => b.asientoID))

    const asientos = horario.autobus.asientos.map(a => ({
        asientoID:  a.asientoID,
        numero:     a.numero,
        disponible: !vendidosSet.has(a.asientoID),
    }))

    return NextResponse.json({ asientos })
}
