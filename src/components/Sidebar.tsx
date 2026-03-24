'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

// ─── Iconos SVG inline ligeros ────────────────────────────────
function Icon({ d, size = 18 }: { d: string; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d={d} />
        </svg>
    )
}

const icons = {
    dashboard:   'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
    rutas:       'M3 12h18M3 6h18M3 18h18',
    horarios:    'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 5v5l4 2',
    boletos:     'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z',
    autobuses:   'M8 6v6m0 0v4m0-4h8m0-6v6m0 0v4M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
    conductores: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    andenes:     'M4 20h16M4 4h16v12H4z M8 4v4 M12 4v4 M16 4v4',
    usuarios:    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    logout:      'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
}

const navItems = [
    { href: '/dashboard',    label: 'Dashboard',   icon: 'dashboard',   section: 'Principal' },
    { href: '/rutas',        label: 'Rutas',        icon: 'rutas',       section: 'Operaciones' },
    { href: '/horarios',     label: 'Horarios',     icon: 'horarios',    section: 'Operaciones' },
    { href: '/boletos',      label: 'Venta Boletos', icon: 'boletos',    section: 'Operaciones' },
    { href: '/autobuses',    label: 'Flota',        icon: 'autobuses',   section: 'Recursos' },
    { href: '/conductores',  label: 'Conductores',  icon: 'conductores', section: 'Recursos' },
    { href: '/andenes',      label: 'Andenes',      icon: 'andenes',     section: 'Recursos' },
    { href: '/usuarios',     label: 'Usuarios',     icon: 'usuarios',    section: 'Administración' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    // Agrupar por sección
    const sections = Array.from(new Set(navItems.map(i => i.section)))

    const initials = session?.user?.name
        ?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() ?? 'U'

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-mark">A</div>
                <div>
                    <div className="sidebar-logo-text">ASTRALIS</div>
                    <div className="sidebar-logo-sub">Transporte</div>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                {sections.map(section => (
                    <div key={section}>
                        <div className="sidebar-section-label">{section}</div>
                        {navItems
                            .filter(item => item.section === section)
                            .map(item => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`sidebar-link${isActive ? ' active' : ''}`}
                                    >
                                        <Icon d={icons[item.icon as keyof typeof icons]} size={17} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                    </div>
                ))}
            </nav>

            {/* Footer / usuario */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">{initials}</div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{session?.user?.name ?? 'Usuario'}</div>
                        <div className="sidebar-user-role">{(session?.user as any)?.role ?? 'Rol'}</div>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="sidebar-link w-full"
                    style={{ marginTop: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                >
                    <Icon d={icons.logout} size={17} />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}
