'use client'

import { useEffect, useState } from 'react'

type Ruta = {
    rutaID: string
    codigoRuta: string
    nombreRuta: string
    ciudadOrigen: string
    ciudadDestino: string
    distanciaKm: number
    tiempoEstimadoHrs: number
    tipoRuta: 'DIRECTA' | 'CON_PARADAS'
    tarifaBase: number
    estado: 'ACTIVA' | 'INACTIVA'
}

const EMPTY: Omit<Ruta, 'rutaID' | 'codigoRuta'> = {
    nombreRuta: '', ciudadOrigen: '', ciudadDestino: '',
    distanciaKm: 0, tiempoEstimadoHrs: 0,
    tipoRuta: 'DIRECTA', tarifaBase: 0, estado: 'INACTIVA',
}

export default function RutasTable() {
    const [rutas, setRutas]       = useState<Ruta[]>([])
    const [loading, setLoading]   = useState(true)
    const [search, setSearch]     = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing]   = useState<Ruta | null>(null)
    const [form, setForm]         = useState(EMPTY)
    const [saving, setSaving]     = useState(false)
    const [error, setError]       = useState('')

    async function load() {
        setLoading(true)
        const res = await fetch('/api/rutas')
        const data = await res.json()
        setRutas(data.rutas ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    function openCreate() {
        setEditing(null)
        setForm(EMPTY)
        setError('')
        setShowModal(true)
    }

    function openEdit(r: Ruta) {
        setEditing(r)
        const { rutaID, codigoRuta, ...rest } = r
        setForm(rest)
        setError('')
        setShowModal(true)
    }

    async function handleSave() {
        setSaving(true)
        setError('')
        try {
            const url    = editing ? `/api/rutas/${editing.rutaID}` : '/api/rutas'
            const method = editing ? 'PUT' : 'POST'
            const res    = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Error al guardar')
            setShowModal(false)
            load()
        } catch (e: any) {
            setError(e.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Desactivar esta ruta?')) return
        await fetch(`/api/rutas/${id}`, { method: 'DELETE' })
        load()
    }

    const filtered = rutas.filter(r =>
        r.nombreRuta.toLowerCase().includes(search.toLowerCase()) ||
        r.ciudadOrigen.toLowerCase().includes(search.toLowerCase()) ||
        r.ciudadDestino.toLowerCase().includes(search.toLowerCase()) ||
        r.codigoRuta.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <div className="table-wrapper">
                <div className="table-header">
                    <span className="table-title">Todas las rutas ({rutas.length})</span>
                    <div className="flex items-center gap-2">
                        <div className="search-wrapper">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                            <input className="search-input" placeholder="Buscar ruta..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={openCreate}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Nueva ruta
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state">
                        <div className="empty-state-icon" style={{ animation: 'pulse 1.5s infinite' }}>⏳</div>
                        <div className="empty-state-title">Cargando rutas...</div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🗺️</div>
                        <div className="empty-state-title">Sin rutas</div>
                        <div className="empty-state-desc">No se encontraron rutas. Crea la primera.</div>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Ruta</th>
                                <th>Origen → Destino</th>
                                <th>Distancia</th>
                                <th>Tiempo est.</th>
                                <th>Tarifa base</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(r => (
                                <tr key={r.rutaID}>
                                    <td>
                                        <span className="badge badge-default">{r.codigoRuta}</span>
                                    </td>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.nombreRuta}</td>
                                    <td>{r.ciudadOrigen} → {r.ciudadDestino}</td>
                                    <td>{Number(r.distanciaKm).toLocaleString()} km</td>
                                    <td>{Number(r.tiempoEstimadoHrs).toFixed(1)} h</td>
                                    <td style={{ color: 'var(--success)' }}>${Number(r.tarifaBase).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td>
                                        <span className={`badge ${r.tipoRuta === 'DIRECTA' ? 'badge-info' : 'badge-warning'}`}>
                                            {r.tipoRuta === 'DIRECTA' ? 'Directa' : 'Con paradas'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${r.estado === 'ACTIVA' ? 'badge-success' : 'badge-default'}`}>
                                            {r.estado === 'ACTIVA' ? '● Activa' : '○ Inactiva'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}>Editar</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.rutaID)}>Desactivar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <span className="modal-title">{editing ? 'Editar ruta' : 'Nueva ruta'}</span>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-error">{error}</div>}

                            <div className="form-grid form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Nombre de la ruta <span className="form-required">*</span></label>
                                    <input className="form-input" value={form.nombreRuta}
                                        onChange={e => setForm(f => ({ ...f, nombreRuta: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tipo de ruta</label>
                                    <select className="form-select" value={form.tipoRuta}
                                        onChange={e => setForm(f => ({ ...f, tipoRuta: e.target.value as any }))}>
                                        <option value="DIRECTA">Directa</option>
                                        <option value="CON_PARADAS">Con paradas</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-grid form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Ciudad origen <span className="form-required">*</span></label>
                                    <input className="form-input" value={form.ciudadOrigen}
                                        onChange={e => setForm(f => ({ ...f, ciudadOrigen: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ciudad destino <span className="form-required">*</span></label>
                                    <input className="form-input" value={form.ciudadDestino}
                                        onChange={e => setForm(f => ({ ...f, ciudadDestino: e.target.value }))} />
                                </div>
                            </div>

                            <div className="form-grid form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Terminal origen</label>
                                    <input className="form-input" placeholder="Nombre de la terminal"
                                        value={(form as any).terminalOrigen ?? ''}
                                        onChange={e => setForm(f => ({ ...f, terminalOrigen: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Terminal destino</label>
                                    <input className="form-input" placeholder="Nombre de la terminal"
                                        value={(form as any).terminalDestino ?? ''}
                                        onChange={e => setForm(f => ({ ...f, terminalDestino: e.target.value }))} />
                                </div>
                            </div>

                            <div className="form-grid form-grid-3">
                                <div className="form-group">
                                    <label className="form-label">Distancia (km)</label>
                                    <input className="form-input" type="number" min="0" step="0.1"
                                        value={form.distanciaKm}
                                        onChange={e => setForm(f => ({ ...f, distanciaKm: parseFloat(e.target.value) }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tiempo estimado (h)</label>
                                    <input className="form-input" type="number" min="0" step="0.5"
                                        value={form.tiempoEstimadoHrs}
                                        onChange={e => setForm(f => ({ ...f, tiempoEstimadoHrs: parseFloat(e.target.value) }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tarifa base ($)</label>
                                    <input className="form-input" type="number" min="0" step="0.01"
                                        value={form.tarifaBase}
                                        onChange={e => setForm(f => ({ ...f, tarifaBase: parseFloat(e.target.value) }))} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Estado</label>
                                <select className="form-select" value={form.estado}
                                    onChange={e => setForm(f => ({ ...f, estado: e.target.value as any }))}>
                                    <option value="ACTIVA">Activa</option>
                                    <option value="INACTIVA">Inactiva</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear ruta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
