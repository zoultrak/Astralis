'use client'

import { useEffect, useState } from 'react'

type Autobus = {
    autobusID: string
    numeroEconomico: string
    placas: string
    vin: string
    marca: string
    modelo: string
    anio: number
    capacidadAsientos: number
    tipoServicio: 'ECONOMICO' | 'EJECUTIVO' | 'LUJO'
    estadoOperativo: 'DISPONIBLE' | 'ASIGNADO' | 'EN_MANTENIMIENTO' | 'FUERA_DE_SERVICIO'
    ultimoMantenimiento?: string
}

const EMPTY = {
    numeroEconomico: '', placas: '', vin: '', marca: '', modelo: '',
    anio: new Date().getFullYear(), capacidadAsientos: 40,
    tipoServicio: 'ECONOMICO', estadoOperativo: 'DISPONIBLE',
}

const estadoColor: Record<string, string> = {
    DISPONIBLE:        'badge-success',
    ASIGNADO:          'badge-info',
    EN_MANTENIMIENTO:  'badge-warning',
    FUERA_DE_SERVICIO: 'badge-danger',
}

const servicioColor: Record<string, string> = {
    ECONOMICO: 'badge-default',
    EJECUTIVO: 'badge-info',
    LUJO:      'badge-warning',
}

export default function AutobusesTable() {
    const [autobuses, setAutobuses] = useState<Autobus[]>([])
    const [loading, setLoading]     = useState(true)
    const [search, setSearch]       = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing]     = useState<Autobus | null>(null)
    const [form, setForm]           = useState<any>(EMPTY)
    const [saving, setSaving]       = useState(false)
    const [error, setError]         = useState('')

    async function load() {
        setLoading(true)
        const res = await fetch('/api/autobuses')
        const data = await res.json()
        setAutobuses(data.autobuses ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    function openCreate() {
        setEditing(null); setForm(EMPTY); setError(''); setShowModal(true)
    }

    function openEdit(a: Autobus) {
        setEditing(a)
        const { autobusID, ...rest } = a
        setForm(rest)
        setError(''); setShowModal(true)
    }

    async function handleSave() {
        setSaving(true); setError('')
        try {
            const url    = editing ? `/api/autobuses/${editing.autobusID}` : '/api/autobuses'
            const method = editing ? 'PUT' : 'POST'
            const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const data   = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Error al guardar')
            setShowModal(false); load()
        } catch (e: any) { setError(e.message) }
        finally { setSaving(false) }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Poner autobús fuera de servicio?')) return
        await fetch(`/api/autobuses/${id}`, { method: 'DELETE' })
        load()
    }

    const filtered = autobuses.filter(a =>
        a.numeroEconomico.toLowerCase().includes(search.toLowerCase()) ||
        a.placas.toLowerCase().includes(search.toLowerCase()) ||
        a.marca.toLowerCase().includes(search.toLowerCase()) ||
        a.modelo.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <div className="table-wrapper">
                <div className="table-header">
                    <span className="table-title">Flota registrada ({autobuses.length})</span>
                    <div className="flex items-center gap-2">
                        <div className="search-wrapper">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                            <input className="search-input" placeholder="Buscar autobús..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={openCreate}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Agregar autobús
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ animation: 'pulse 1.5s infinite' }}>⏳</div><div className="empty-state-title">Cargando...</div></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🚌</div>
                        <div className="empty-state-title">Sin autobuses</div>
                        <div className="empty-state-desc">Registra el primer vehículo de la flota.</div>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Económico</th>
                                <th>Vehículo</th>
                                <th>Placas / VIN</th>
                                <th>Año</th>
                                <th>Asientos</th>
                                <th>Servicio</th>
                                <th>Estado</th>
                                <th>Último mant.</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => (
                                <tr key={a.autobusID}>
                                    <td><span className="badge badge-default" style={{ fontFamily: 'monospace' }}>{a.numeroEconomico}</span></td>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.marca} {a.modelo}</td>
                                    <td>
                                        <div>{a.placas}</div>
                                        <div className="text-xs text-muted" style={{ fontFamily: 'monospace' }}>{a.vin}</div>
                                    </td>
                                    <td>{a.anio}</td>
                                    <td>{a.capacidadAsientos} asientos</td>
                                    <td><span className={`badge ${servicioColor[a.tipoServicio]}`}>{a.tipoServicio}</span></td>
                                    <td><span className={`badge ${estadoColor[a.estadoOperativo]}`}>{a.estadoOperativo.replace('_', ' ')}</span></td>
                                    <td className="text-muted text-sm">
                                        {a.ultimoMantenimiento ? new Date(a.ultimoMantenimiento).toLocaleDateString('es-MX') : '—'}
                                    </td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(a)}>Editar</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.autobusID)}>Baja</button>
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
                            <span className="modal-title">{editing ? 'Editar autobús' : 'Registrar autobús'}</span>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-error">{error}</div>}

                            <div className="form-grid form-grid-3">
                                <div className="form-group">
                                    <label className="form-label">N° Económico <span className="form-required">*</span></label>
                                    <input className="form-input" placeholder="AS-0001" value={form.numeroEconomico}
                                        onChange={e => setForm((f: any) => ({ ...f, numeroEconomico: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Placas <span className="form-required">*</span></label>
                                    <input className="form-input" placeholder="ABC-1234" value={form.placas}
                                        onChange={e => setForm((f: any) => ({ ...f, placas: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">VIN <span className="form-required">*</span></label>
                                    <input className="form-input" placeholder="17 caracteres" value={form.vin}
                                        onChange={e => setForm((f: any) => ({ ...f, vin: e.target.value }))} />
                                </div>
                            </div>

                            <div className="form-grid form-grid-3">
                                <div className="form-group">
                                    <label className="form-label">Marca <span className="form-required">*</span></label>
                                    <input className="form-input" placeholder="Volvo, Mercedes..." value={form.marca}
                                        onChange={e => setForm((f: any) => ({ ...f, marca: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Modelo <span className="form-required">*</span></label>
                                    <input className="form-input" placeholder="9700, Tourismo..." value={form.modelo}
                                        onChange={e => setForm((f: any) => ({ ...f, modelo: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Año <span className="form-required">*</span></label>
                                    <input className="form-input" type="number" min="2000" max="2030" value={form.anio}
                                        onChange={e => setForm((f: any) => ({ ...f, anio: parseInt(e.target.value) }))} />
                                </div>
                            </div>

                            <div className="form-grid form-grid-3">
                                <div className="form-group">
                                    <label className="form-label">Capacidad (asientos)</label>
                                    <input className="form-input" type="number" min="1" max="60" value={form.capacidadAsientos}
                                        onChange={e => setForm((f: any) => ({ ...f, capacidadAsientos: parseInt(e.target.value) }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tipo de servicio</label>
                                    <select className="form-select" value={form.tipoServicio}
                                        onChange={e => setForm((f: any) => ({ ...f, tipoServicio: e.target.value }))}>
                                        <option value="ECONOMICO">Económico</option>
                                        <option value="EJECUTIVO">Ejecutivo</option>
                                        <option value="LUJO">Lujo</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Estado operativo</label>
                                    <select className="form-select" value={form.estadoOperativo}
                                        onChange={e => setForm((f: any) => ({ ...f, estadoOperativo: e.target.value }))}>
                                        <option value="DISPONIBLE">Disponible</option>
                                        <option value="ASIGNADO">Asignado</option>
                                        <option value="EN_MANTENIMIENTO">En mantenimiento</option>
                                        <option value="FUERA_DE_SERVICIO">Fuera de servicio</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Registrar autobús'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
