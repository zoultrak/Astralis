import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const conductores = await prisma.conductor.findMany({
        orderBy: { fechaRegistro: 'desc' },
    })
    return NextResponse.json({ conductores })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { nombreCompleto, curp, numeroLicencia, vigenciaLicencia, domicilio, numeroTelefonico, disponible, estado } = await req.json()

    if (!nombreCompleto || !curp || !numeroLicencia || !vigenciaLicencia) {
        return NextResponse.json({ error: 'Nombre, CURP, licencia y vigencia son requeridos' }, { status: 400 })
    }

    const conductor = await prisma.conductor.create({
        data: {
            nombreCompleto, curp, numeroLicencia,
            vigenciaLicencia: new Date(vigenciaLicencia),
            domicilio, numeroTelefonico,
            disponible: disponible ?? true,
            estado: estado ?? 'ACTIVO',
        },
    })

    await prisma.logAuditoria.create({
        data: { usuarioID: session.user!.id as string, accion: 'CONDUCTOR_CREAR', modulo: 'conductores', resultado: 'Exito', detalles: `Conductor registrado: ${nombreCompleto}` },
    })

    return NextResponse.json({ conductor }, { status: 201 })
}
