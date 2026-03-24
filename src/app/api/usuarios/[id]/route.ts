import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    await prisma.usuario.update({
        where: { usuarioID: params.id },
        data: { estado: 'INACTIVO' },
    })

    await prisma.logAuditoria.create({
        data: { usuarioID: session.user!.id as string, accion: 'USUARIO_DESACTIVAR', modulo: 'usuarios', resultado: 'Exito', detalles: `Usuario desactivado: ${params.id}` },
    })

    return NextResponse.json({ ok: true })
}
