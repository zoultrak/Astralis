import { auth } from '@/auth'
import Topbar from '@/components/Topbar'
import { prisma } from '@/lib/prisma'

async function getStats() {
    const [rutas, autobuses, conductores, ventasHoy] = await Promise.all([
        prisma.ruta.count({ where: { estado: 'ACTIVA' } }),
        prisma.autobus.count({ where: { estadoOperativo: 'DISPONIBLE' } }),
        prisma.conductor.count({ where: { estado: 'ACTIVO', disponible: true } }),
        prisma.venta.count({
            where: {
                fechaHora: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                estado: 'COMPLETADA',
            },
        }),
    ])
    return { rutas, autobuses, conductores, ventasHoy }
}

export default async function DashboardPage() {
    const session = await auth()
    const stats = await getStats()

    const statCards = [
        { label: 'Rutas activas',       value: stats.rutas,       delta: 'Operando hoy',         color: 'var(--brand-primary)' },
        { label: 'Autobuses disponibles', value: stats.autobuses,  delta: 'Listos para asignar',  color: 'var(--success)' },
        { label: 'Conductores activos',  value: stats.conductores, delta: 'Disponibles hoy',      color: 'var(--info)' },
        { label: 'Ventas hoy',           value: stats.ventasHoy,   delta: 'Boletos emitidos',     color: 'var(--warning)' },
    ]

    return (
        <>
            <Topbar title="Dashboard" />
            <div className="page-content animate-fade-in">
                <div className="page-header">
                    <h1 className="page-title">
                        Bienvenido, {session?.user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="page-subtitle">
                        Aquí tienes un resumen de las operaciones del día.
                    </p>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    {statCards.map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-label">{s.label}</div>
                            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                            <div className="stat-delta">{s.delta}</div>
                        </div>
                    ))}
                </div>

                {/* Quick links */}
                <div className="grid-cols-2" style={{ marginTop: '1.5rem' }}>
                    <div className="card">
                        <h2 className="font-display font-semibold text-primary" style={{ marginBottom: '0.75rem' }}>
                            Accesos rápidos
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { href: '/boletos',     label: '🎟️  Vender boleto' },
                                { href: '/rutas',       label: '🗺️  Gestionar rutas' },
                                { href: '/horarios',    label: '🕐  Programar horario' },
                                { href: '/autobuses',   label: '🚌  Ver flota' },
                            ].map(link => (
                                <a key={link.href} href={link.href}
                                    className="sidebar-link"
                                    style={{ padding: '0.5rem 0.75rem' }}>
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="font-display font-semibold text-primary" style={{ marginBottom: '0.75rem' }}>
                            Estado del sistema
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {[
                                { label: 'Base de datos',  ok: true },
                                { label: 'Autenticación',  ok: true },
                                { label: 'API Rutas',      ok: true },
                                { label: 'API Horarios',   ok: true },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <span className="text-secondary text-sm">{item.label}</span>
                                    <span className={`badge ${item.ok ? 'badge-success' : 'badge-danger'}`}>
                                        {item.ok ? '● Activo' : '● Error'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
