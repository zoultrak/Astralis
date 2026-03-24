import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Astralis — Sistema de Gestión de Transporte',
    description: 'Plataforma integral para la administración de rutas, horarios, flota y venta de boletos.',
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    )
}
