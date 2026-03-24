'use client'

import { useEffect, useState } from 'react'

type Anden = {
    andenID: string
    numero: number
    capacidad: number
    estado: 'DISPONIBLE' | 'RESERVADO' | 'OCUPADO'
    horarioDisponible?: string
    _count?: { asignaciones: number }
}

const estadoColor: Record<string, string> = {
    DISPONIBLE: 'badge-success',
    RESERVADO:  'badge-warning',
    OCUPADO:    'badge-danger',
}

const EMPTY = { numero: 1, capacidad: 1, estado: 'DISPONIBLE', horarioDisponible: '06:00-22:00' }

export default function AndenesTable() {
    const [andenes, setAndenes]     = useState<Anden[]>([])
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing]     = useState<Anden | null>(null)
    const [form, setForm]           = useState<any>(EMPTY)
    const [saving, setSaving]       = useState(false)
    const [error, setError]         = useState('')

    async function load() {
        setLoading(true)
        const res = await fetch('/api/andenes')
        const data = await res.json()
        setAndenes(data.andenes ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    function openCreate() { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true) }
    function openEdit(a: Anden) {
        setEditing(a)
        const { andenID, _count, ...rest } = a
        setForm(rest); setError(''); setShowModal(true)
    }

    async function handleSave() {
        setSaving(true); setError('')
        try {
            const url    = editing ? `/api/andenes/${editing.andenID}` : '/api/andenes'
            const method = editing ? 'PUT' : 'POST'
            const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const data   = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Error al guardar')
            setShowModal(false); load()
        } catch (e: any) { setError(e.message) }
        finally { setSaving(false) }
    }

    return (
        <>
            <div className="table-wrapper">
                <div className="table-header">
                    <span className="table-title">Andenes de la terminal ({andenes.length})</span>
                    <button className="btn btn-primary" onClick={openCreate}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Nuevo andén
                    </button>
                </div>

                {loading ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ animation: 'pulse 1.5s infinite' }}>⏳</div><div className="empty-state-title">Cargando...</div></div>
                ) : andenes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🏛️</div>
                        <div className="empty-state-title">Sin andenes registrados</div>
                        <div className="empty-state-desc">Registra los andenes de la terminal.</div>
                    </div>
                ) : (
                    <>
                        {/* Vista tarjetas */}
                        <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                            {andenes.map(a => (
                                <div key={a.andenID} className="card-elevated" style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                                    onClick={() => openEdit(a)}>
                                    <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                                        <span className="font-display font-bold" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                                            #{a.numero}
                                        </span>
                                        <span className={`badge ${estadoColor[a.estado]}`}>{a.estado}</span>
                                    </div>
                                    <div className="text-sm text-muted">Cap. {a.capacidad} vehículos</div>
                                    {a.horarioDisponible && (
                                        <div className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>🕐 {a.horarioDisponible}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {showModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <span className="modal-title">{editing ? `Editar andén #${editing.numero}` : 'Nuevo andén'}</span>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-error">{error}</div>}
                            <div className="form-grid form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Número de andén <span className="form-required">*</span></label>
                                    <input className="form-input" type="number" min="1" value={form.numero}
                                        onChange={e => setForm((f: any) => ({ ...f, numero: parseInt(e.target.value) }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Capacidad (vehículos)</label>
                                    <input className="form-input" type="number" min="1" value={form.capacidad}
                                        onChange={e => setForm((f: any) => ({ ...f, capacidad: parseInt(e.target.value) }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Estado</label>
                                <select className="form-select" value={form.estado}
                                    onChange={e => setForm((f: any) => ({ ...f, estado: e.target.value }))}>
                                    <option value="DISPONIBLE">Disponible</option>
                                    <option value="RESERVADO">Reservado</option>
                                    <option value="OCUPADO">Ocupado</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Horario disponible</label>
                                <input className="form-input" placeholder="06:00-22:00" value={form.horarioDisponible ?? ''}
                                    onChange={e => setForm((f: any) => ({ ...f, horarioDisponible: e.target.value }))} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear andén'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
