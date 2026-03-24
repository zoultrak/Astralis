'use client'

import { useEffect, useState } from 'react'

type Conductor = {
    conductorID: string
    nombreCompleto: string
    curp: string
    numeroLicencia: string
    vigenciaLicencia: string
    domicilio?: string
    numeroTelefonico?: string
    horasAcumuladas: number
    disponible: boolean
    estado: 'ACTIVO' | 'NO_DISPONIBLE' | 'INACTIVO'
    motivoBaja?: string
}

const EMPTY = {
    nombreCompleto: '', curp: '', numeroLicencia: '',
    vigenciaLicencia: '', domicilio: '', numeroTelefonico: '',
    disponible: true, estado: 'ACTIVO',
}

const estadoColor: Record<string, string> = {
    ACTIVO:         'badge-success',
    NO_DISPONIBLE:  'badge-warning',
    INACTIVO:       'badge-danger',
}

export default function ConductoresTable() {
    const [conductores, setConductores] = useState<Conductor[]>([])
    const [loading, setLoading]         = useState(true)
    const [search, setSearch]           = useState('')
    const [showModal, setShowModal]     = useState(false)
    const [editing, setEditing]         = useState<Conductor | null>(null)
    const [form, setForm]               = useState<any>(EMPTY)
    const [saving, setSaving]           = useState(false)
    const [error, setError]             = useState('')

    async function load() {
        setLoading(true)
        const res = await fetch('/api/conductores')
        const data = await res.json()
        setConductores(data.conductores ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    function openCreate() { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true) }

    function openEdit(c: Conductor) {
        setEditing(c)
        const { conductorID, ...rest } = c
        setForm({ ...rest, vigenciaLicencia: rest.vigenciaLicencia?.slice(0, 10) })
        setError(''); setShowModal(true)
    }

    async function handleSave() {
        setSaving(true); setError('')
        try {
            const url    = editing ? `/api/conductores/${editing.conductorID}` : '/api/conductores'
            const method = editing ? 'PUT' : 'POST'
            const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const data   = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Error al guardar')
            setShowModal(false); load()
        } catch (e: any) { setError(e.message) }
        finally { setSaving(false) }
    }

    async function handleInactivar(id: string) {
        const motivo = prompt('Motivo de baja:')
        if (!motivo) return
        await fetch(`/api/conductores/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ motivoBaja: motivo }),
        })
        load()
    }

    // Verificar si la licencia vence pronto (30 días)
    function licenciaVencida(fecha: string) {
        const dias = (new Date(fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        return dias < 30
    }

    const filtered = conductores.filter(c =>
        c.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
        c.curp.toLowerCase().includes(search.toLowerCase()) ||
        c.numeroLicencia.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <div className="table-wrapper">
                <div className="table-header">
                    <span className="table-title">Conductores registrados ({conductores.length})</span>
                    <div className="flex items-center gap-2">
                        <div className="search-wrapper">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                            <input className="search-input" placeholder="Buscar conductor..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={openCreate}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Nuevo conductor
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ animation: 'pulse 1.5s infinite' }}>⏳</div><div className="empty-state-title">Cargando...</div></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👤</div>
                        <div className="empty-state-title">Sin conductores</div>
                        <div className="empty-state-desc">Registra el primer conductor de la línea.</div>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Conductor</th>
                                <th>CURP</th>
                                <th>Licencia</th>
                                <th>Vigencia licencia</th>
                                <th>Teléfono</th>
                                <th>Horas acum.</th>
                                <th>Disponible</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.conductorID}>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.nombreCompleto}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.curp}</td>
                                    <td style={{ fontFamily: 'monospace' }}>{c.numeroLicencia}</td>
                                    <td>
                                        <span className={`badge ${licenciaVencida(c.vigenciaLicencia) ? 'badge-warning' : 'badge-success'}`}>
                                            {new Date(c.vigenciaLicencia).toLocaleDateString('es-MX')}
                                            {licenciaVencida(c.vigenciaLicencia) && ' ⚠️'}
                                        </span>
                                    </td>
                                    <td>{c.numeroTelefonico ?? '—'}</td>
                                    <td>{Number(c.horasAcumuladas).toFixed(1)} h</td>
                                    <td>
                                        <span className={`badge ${c.disponible ? 'badge-success' : 'badge-default'}`}>
                                            {c.disponible ? '● Sí' : '○ No'}
                                        </span>
                                    </td>
                                    <td><span className={`badge ${estadoColor[c.estado]}`}>{c.estado.replace('_', ' ')}</span></td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Editar</button>
                                            {c.estado !== 'INACTIVO' && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleInactivar(c.conductorID)}>Dar baja</button>
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
                    <div className="modal modal-lg">
                        <div className="modal-header">
                            <span className="modal-title">{editing ? 'Editar conductor' : 'Registrar conductor'}</span>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-error">{error}</div>}

                            <div className="form-grid form-grid-2">
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Nombre completo <span className="form-required">*</span></label>
                                    <input className="form-input" value={form.nombreCompleto}
                                        onChange={e => setForm((f: any) => ({ ...f, nombreCompleto: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">CURP <span className="form-required">*</span></label>
                                    <input className="form-input" placeholder="18 caracteres" value={form.curp}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={e => setForm((f: any) => ({ ...f, curp: e.target.value.toUpperCase() }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">N° de licencia <span className="form-required">*</span></label>
                                    <input className="form-input" value={form.numeroLicencia}
                                        onChange={e => setForm((f: any) => ({ ...f, numeroLicencia: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Vigencia de licencia <span className="form-required">*</span></label>
                                    <input className="form-input" type="date" value={form.vigenciaLicencia}
                                        onChange={e => setForm((f: any) => ({ ...f, vigenciaLicencia: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Teléfono</label>
                                    <input className="form-input" placeholder="10 dígitos" value={form.numeroTelefonico ?? ''}
                                        onChange={e => setForm((f: any) => ({ ...f, numeroTelefonico: e.target.value }))} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Domicilio</label>
                                    <input className="form-input" value={form.domicilio ?? ''}
                                        onChange={e => setForm((f: any) => ({ ...f, domicilio: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Estado</label>
                                    <select className="form-select" value={form.estado}
                                        onChange={e => setForm((f: any) => ({ ...f, estado: e.target.value }))}>
                                        <option value="ACTIVO">Activo</option>
                                        <option value="NO_DISPONIBLE">No disponible</option>
                                        <option value="INACTIVO">Inactivo</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                                    <input type="checkbox" id="disponible" checked={form.disponible}
                                        onChange={e => setForm((f: any) => ({ ...f, disponible: e.target.checked }))}
                                        style={{ width: 16, height: 16, accentColor: 'var(--brand-primary)' }} />
                                    <label htmlFor="disponible" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                                        Disponible para viajes
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Registrar conductor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
