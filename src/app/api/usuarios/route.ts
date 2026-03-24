import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(_req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const usuarios = await prisma.usuario.findMany({
        include: { rol: { select: { rolID: true, nombre: true } } },
        orderBy: { creadoEn: 'desc' },
    })

    // Nunca exponer el hash
    const safe = usuarios.map(({ contrasenaHash, ...u }) => u)
    return NextResponse.json({ usuarios: safe })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { nombreCompleto, email, password, rolID } = await req.json()

    if (!nombreCompleto || !email || !password || !rolID) {
        return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    if (password.length < 8) {
        return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
    }

    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 409 })

    const contrasenaHash = await bcrypt.hash(password, 12)

    const usuario = await prisma.usuario.create({
        data: { nombreCompleto, email, contrasenaHash, rolID },
        include: { rol: true },
    })

    await prisma.logAuditoria.create({
        data: {
            usuarioID: session.user!.id as string,
            accion:    'USUARIO_CREAR',
            modulo:    'usuarios',
            resultado: 'Exito',
            detalles:  `Usuario creado: ${email} con rol ${usuario.rol.nombre}`,
        },
    })

    const { contrasenaHash: _, ...safe } = usuario
    return NextResponse.json({ usuario: safe }, { status: 201 })
}
