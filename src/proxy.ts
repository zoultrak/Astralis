import { auth } from '@/auth'
import { NextResponse } from 'next/server'


export { auth as proxy } from '@/auth'

export const config = {
    matcher: [
        '/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
}