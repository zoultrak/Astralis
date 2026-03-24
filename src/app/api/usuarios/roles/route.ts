import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const roles = await prisma.rol.findMany({ orderBy: { nombre: 'asc' } })
    return NextResponse.json({ roles })
}
