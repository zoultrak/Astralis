import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/rutas
export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const estado = searchParams.get('estado')
    const q      = searchParams.get('q') ?? ''

    const rutas = await prisma.ruta.findMany({
        where: {
            ...(estado ? { estado: estado as any } : {}),
            ...(q ? {
                OR: [
                    { nombreRuta:     { contains: q } },
                    { ciudadOrigen:   { contains: q } },
                    { ciudadDestino:  { contains: q } },
                    { codigoRuta:     { contains: q } },
                ],
            } : {}),
        },
        include: { paradas: { orderBy: { ordenEnRuta: 'asc' } } },
        orderBy: { creadoEn: 'desc' },
    })

    return NextResponse.json({ rutas })
}

// POST /api/rutas
export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json()

    const {
        nombreRuta, ciudadOrigen, ciudadDestino,
        terminalOrigen = '', terminalDestino = '',
        distanciaKm, tiempoEstimadoHrs, tipoRuta = 'DIRECTA',
        tarifaBase, estado = 'INACTIVA',
    } = body

    if (!nombreRuta || !ciudadOrigen || !ciudadDestino) {
        return NextResponse.json({ error: 'Nombre, origen y destino son requeridos' }, { status: 400 })
    }

    // Auto-generar código
    const count = await prisma.ruta.count()
    const codigoRuta = `RUT-${String(count + 1).padStart(3, '0')}`

    const ruta = await prisma.ruta.create({
        data: {
            codigoRuta,
            nombreRuta,
            ciudadOrigen,
            ciudadDestino,
            terminalOrigen,
            terminalDestino,
            distanciaKm,
            tiempoEstimadoHrs,
            tipoRuta,
            tarifaBase,
            estado,
            creadoPorID: session.user!.id as string,
        },
    })

    await prisma.logAuditoria.create({
        data: {
            usuarioID: session.user!.id as string,
            accion:    'RUTA_CREAR',
            modulo:    'rutas',
            resultado: 'Exito',
            detalles:  `Ruta creada: ${codigoRuta} — ${nombreRuta}`,
        },
    })

    return NextResponse.json({ ruta }, { status: 201 })
}
