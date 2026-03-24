'use client'

import { useEffect, useState } from 'react'

type Usuario = {
    usuarioID: string
    nombreCompleto: string
    email: string
    estado: 'ACTIVO' | 'BLOQUEADO' | 'INACTIVO'
    intentosFallidos: number
    creadoEn: string
    rol: { rolID: string; nombre: string }
}

type Rol = { rolID: string; nombre: string }

const estadoColor: Record<string, string> = {
    ACTIVO:   'badge-success',
    BLOQUEADO: 'badge-warning',
    INACTIVO: 'badge-danger',
}

export default function UsuariosTable() {
    const [usuarios, setUsuarios]   = useState<Usuario[]>([])
    const [roles, setRoles]         = useState<Rol[]>([])
    const [loading, setLoading]     = useState(true)
    const [search, setSearch]       = useState('')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm]           = useState<any>({ nombreCompleto: '', email: '', password: '', rolID: '' })
    const [saving, setSaving]       = useState(false)
    const [error, setError]         = useState('')

    async function load() {
        setLoading(true)
        const [u, r] = await Promise.all([
            fetch('/api/usuarios').then(r => r.json()),
            fetch('/api/usuarios/roles').then(r => r.json()),
        ])
        setUsuarios(u.usuarios ?? [])
        setRoles(r.roles ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    async function handleSave() {
        setSaving(true); setError('')
        try {
            const res  = await fetch('/api/usuarios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Error al crear usuario')
            setShowModal(false); load()
        } catch (e: any) { setError(e.message) }
        finally { setSaving(false) }
    }

    async function handleDesbloquear(id: string) {
        await fetch(`/api/usuarios/${id}/desbloquear`, { method: 'POST' })
        load()
    }

    async function handleInactivar(id: string) {
        if (!confirm('¿Desactivar este usuario?')) return
        await fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
        load()
    }

    const filtered = usuarios.filter(u =>
        u.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.rol?.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <div className="table-wrapper">
                <div className="table-header">
                    <span className="table-title">Usuarios registrados ({usuarios.length})</span>
                    <div className="flex items-center gap-2">
                        <div className="search-wrapper">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                            <input className="search-input" placeholder="Buscar usuario..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={() => { setForm({ nombreCompleto: '', email: '', password: '', rolID: roles[0]?.rolID ?? '' }); setError(''); setShowModal(true) }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Nuevo usuario
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ animation: 'pulse 1.5s infinite' }}>⏳</div><div className="empty-state-title">Cargando...</div></div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Intentos fallidos</th>
                                <th>Estado</th>
                                <th>Creado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.usuarioID}>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{u.nombreCompleto}</td>
                                    <td className="text-secondary">{u.email}</td>
                                    <td><span className="badge badge-info">{u.rol?.nombre}</span></td>
                                    <td>
                                        <span className={u.intentosFallidos > 0 ? 'text-warning' : 'text-muted'}>
                                            {u.intentosFallidos} / 3
                                        </span>
                                    </td>
                                    <td><span className={`badge ${estadoColor[u.estado]}`}>{u.estado}</span></td>
                                    <td className="text-muted text-sm">{new Date(u.creadoEn).toLocaleDateString('es-MX')}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            {u.estado === 'BLOQUEADO' && (
                                                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--success)' }} onClick={() => handleDesbloquear(u.usuarioID)}>
                                                    Desbloquear
                                                </button>
                                            )}
                                            {u.estado !== 'INACTIVO' && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleInactivar(u.usuarioID)}>Desactivar</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <span className="modal-title">Nuevo usuario</span>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-error">{error}</div>}
                            <div className="form-group">
                                <label className="form-label">Nombre completo <span className="form-required">*</span></label>
                                <input className="form-input" value={form.nombreCompleto}
                                    onChange={e => setForm((f: any) => ({ ...f, nombreCompleto: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Correo electrónico <span className="form-required">*</span></label>
                                <input className="form-input" type="email" value={form.email}
                                    onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contraseña inicial <span className="form-required">*</span></label>
                                <input className="form-input" type="password" placeholder="Mínimo 8 caracteres" value={form.password}
                                    onChange={e => setForm((f: any) => ({ ...f, password: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Rol <span className="form-required">*</span></label>
                                <select className="form-select" value={form.rolID}
                                    onChange={e => setForm((f: any) => ({ ...f, rolID: e.target.value }))}>
                                    <option value="">Seleccionar rol...</option>
                                    {roles.map(r => (
                                        <option key={r.rolID} value={r.rolID}>{r.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Creando...' : 'Crear usuario'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
