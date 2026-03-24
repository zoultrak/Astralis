'use client'

import { useEffect, useState } from 'react'

type Horario = {
    horarioID: string
    ruta: { codigoRuta: string; nombreRuta: string }
    autobus: { numeroEconomico: string; marca: string; modelo: string }
    conductor: { nombreCompleto: string }
    horaSalida: string
    frecuencia: string
    vigencia: string
    precioBase: number
    estado: string
    fechaInicio: string
}

const FRECS = ['UNICO', 'DIARIO', 'SEMANAL']
const VIGS  = ['INDEFINIDA', 'DEFINIDA']

export default function HorariosTable() {
    const [horarios, setHorarios] = useState<Horario[]>([])
    const [loading, setLoading]   = useState(true)
    const [rutas, setRutas]       = useState<any[]>([])
    const [autobuses, setAutobuses] = useState<any[]>([])
    const [conductores, setConductores] = useState<any[]>([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm]         = useState<any>({})
    const [saving, setSaving]     = useState(false)
    const [error, setError]       = useState('')

    async function load() {
        setLoading(true)
        const [h, r, a, c] = await Promise.all([
            fetch('/api/horarios').then(r => r.json()),
            fetch('/api/rutas').then(r => r.json()),
            fetch('/api/autobuses').then(r => r.json()),
            fetch('/api/conductores').then(r => r.json()),
        ])
        setHorarios(h.horarios ?? [])
        setRutas(r.rutas ?? [])
        setAutobuses(a.autobuses ?? [])
        setConductores(c.conductores ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    function openCreate() {
        setForm({ frecuencia: 'DIARIO', vigencia: 'INDEFINIDA', estado: 'ACTIVO', precioBase: 0 })
        setError('')
        setShowModal(true)
    }

    async function handleSave() {
        setSaving(true)
        setError('')
        try {
            const res = await fetch('/api/horarios', {
                method: 'POST',
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

    async function handleCancelar(id: string) {
        if (!confirm('¿Cancelar este horario?')) return
        await fetch(`/api/horarios/${id}`, { method: 'DELETE' })
        load()
    }

    const estadoBadge = (e: string) => {
        if (e === 'ACTIVO')     return 'badge-success'
        if (e === 'CANCELADO')  return 'badge-danger'
        if (e === 'COMPLETADO') return 'badge-info'
        return 'badge-default'
    }

    return (
        <>
            <div className="table-wrapper">
                <div className="table-header">
                    <span className="table-title">Horarios programados ({horarios.length})</span>
                    <button className="btn btn-primary" onClick={openCreate}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Nuevo horario
                    </button>
                </div>

                {loading ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ animation: 'pulse 1.5s infinite' }}>⏳</div><div className="empty-state-title">Cargando...</div></div>
                ) : horarios.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🕐</div>
                        <div className="empty-state-title">Sin horarios</div>
                        <div className="empty-state-desc">Programa el primer viaje de la línea.</div>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Ruta</th>
                                <th>Autobús</th>
                                <th>Conductor</th>
                                <th>Salida</th>
                                <th>Frecuencia</th>
                                <th>Vigencia</th>
                                <th>Precio base</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {horarios.map(h => (
                                <tr key={h.horarioID}>
                                    <td>
                                        <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{h.ruta?.nombreRuta}</div>
                                        <div className="text-xs text-muted">{h.ruta?.codigoRuta}</div>
                                    </td>
                                    <td>{h.autobus?.numeroEconomico} — {h.autobus?.marca} {h.autobus?.modelo}</td>
                                    <td>{h.conductor?.nombreCompleto}</td>
                                    <td style={{ fontFamily: 'monospace' }}>
                                        {h.horaSalida ? new Date(h.horaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                    </td>
                                    <td><span className="badge badge-info">{h.frecuencia}</span></td>
                                    <td><span className="badge badge-default">{h.vigencia}</span></td>
                                    <td style={{ color: 'var(--success)' }}>${Number(h.precioBase).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td><span className={`badge ${estadoBadge(h.estado)}`}>{h.estado}</span></td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleCancelar(h.horarioID)}>Cancelar</button>
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
                            <span className="modal-title">Nuevo horario</span>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-error">{error}</div>}

                            <div className="form-grid form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Ruta <span className="form-required">*</span></label>
                                    <select className="form-select" value={form.rutaID ?? ''}
                                        onChange={e => setForm((f: any) => ({ ...f, rutaID: e.target.value }))}>
                                        <option value="">Seleccionar ruta...</option>
                                        {rutas.filter(r => r.estado === 'ACTIVA').map((r: any) => (
                                            <option key={r.rutaID} value={r.rutaID}>{r.codigoRuta} — {r.nombreRuta}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Autobús <span className="form-required">*</span></label>
                                    <select className="form-select" value={form.autobusID ?? ''}
                                        onChange={e => setForm((f: any) => ({ ...f, autobusID: e.target.value }))}>
                                        <option value="">Seleccionar autobús...</option>
                                        {autobuses.filter((a: any) => a.estadoOperativo === 'DISPONIBLE').map((a: any) => (
                                            <option key={a.autobusID} value={a.autobusID}>{a.numeroEconomico} — {a.marca} {a.modelo}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-grid form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Conductor <span className="form-required">*</span></label>
                                    <select className="form-select" value={form.conductorID ?? ''}
                                        onChange={e => setForm((f: any) => ({ ...f, conductorID: e.target.value }))}>
                                        <option value="">Seleccionar conductor...</option>
                                        {conductores.filter((c: any) => c.disponible && c.estado === 'ACTIVO').map((c: any) => (
                                            <option key={c.conductorID} value={c.conductorID}>{c.nombreCompleto}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Hora de salida <span className="form-required">*</span></label>
                                    <input className="form-input" type="time" value={form.horaSalida ?? ''}
                                        onChange={e => setForm((f: any) => ({ ...f, horaSalida: e.target.value }))} />
                                </div>
                            </div>

                            <div className="form-grid form-grid-3">
                                <div className="form-group">
                                    <label className="form-label">Fecha inicio</label>
                                    <input className="form-input" type="date" value={form.fechaInicio ?? ''}
                                        onChange={e => setForm((f: any) => ({ ...f, fechaInicio: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Frecuencia</label>
                                    <select className="form-select" value={form.frecuencia}
                                        onChange={e => setForm((f: any) => ({ ...f, frecuencia: e.target.value }))}>
                                        {FRECS.map(f => <option key={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Vigencia</label>
                                    <select className="form-select" value={form.vigencia}
                                        onChange={e => setForm((f: any) => ({ ...f, vigencia: e.target.value }))}>
                                        {VIGS.map(v => <option key={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-grid form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Precio base ($)</label>
                                    <input className="form-input" type="number" min="0" step="0.01"
                                        value={form.precioBase}
                                        onChange={e => setForm((f: any) => ({ ...f, precioBase: parseFloat(e.target.value) }))} />
                                </div>
                                {form.vigencia === 'DEFINIDA' && (
                                    <div className="form-group">
                                        <label className="form-label">Fecha fin</label>
                                        <input className="form-input" type="date" value={form.fechaFin ?? ''}
                                            onChange={e => setForm((f: any) => ({ ...f, fechaFin: e.target.value }))} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : 'Programar horario'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
