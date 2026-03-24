'use client'

import { useEffect, useState } from 'react'

type Horario = {
    horarioID: string
    ruta: { codigoRuta: string; nombreRuta: string; ciudadOrigen: string; ciudadDestino: string }
    horaSalida: string
    precioBase: number
    fechaInicio: string
    autobus: { numeroEconomico: string; capacidadAsientos: number }
}

type Asiento = {
    asientoID: string
    numero: string
    disponible: boolean
}

type Step = 'horario' | 'asiento' | 'cliente' | 'pago' | 'confirmacion'

const METODOS = ['EFECTIVO', 'TARJETA_DEBITO', 'TARJETA_CREDITO']

export default function BoletosPos() {
    const [step, setStep]             = useState<Step>('horario')
    const [horarios, setHorarios]     = useState<Horario[]>([])
    const [asientos, setAsientos]     = useState<Asiento[]>([])
    const [loading, setLoading]       = useState(true)
    const [error, setError]           = useState('')
    const [saving, setSaving]         = useState(false)

    // Selecciones
    const [horarioSel, setHorarioSel]   = useState<Horario | null>(null)
    const [asientoSel, setAsientoSel]   = useState<Asiento | null>(null)
    const [cliente, setCliente]         = useState({ nombre: '', email: '', edad: '', documento: '' })
    const [pago, setPago]               = useState({ metodoPago: 'EFECTIVO', montoEntregado: '' })
    const [ventaResult, setVentaResult] = useState<any>(null)

    useEffect(() => {
        fetch('/api/horarios')
            .then(r => r.json())
            .then(d => { setHorarios((d.horarios ?? []).filter((h: any) => h.estado === 'ACTIVO')); setLoading(false) })
    }, [])

    async function seleccionarHorario(h: Horario) {
        setHorarioSel(h)
        const res  = await fetch(`/api/boletos/asientos?horarioID=${h.horarioID}`)
        const data = await res.json()
        setAsientos(data.asientos ?? [])
        setStep('asiento')
    }

    async function confirmarVenta() {
        if (!horarioSel || !asientoSel) return
        setSaving(true); setError('')
        try {
            const res = await fetch('/api/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    horarioID:      horarioSel.horarioID,
                    asientoID:      asientoSel.asientoID,
                    cliente,
                    metodoPago:     pago.metodoPago,
                    montoEntregado: parseFloat(pago.montoEntregado) || horarioSel.precioBase,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Error al procesar venta')
            setVentaResult(data)
            setStep('confirmacion')
        } catch (e: any) { setError(e.message) }
        finally { setSaving(false) }
    }

    function nuevaVenta() {
        setStep('horario'); setHorarioSel(null); setAsientoSel(null)
        setCliente({ nombre: '', email: '', edad: '', documento: '' })
        setPago({ metodoPago: 'EFECTIVO', montoEntregado: '' })
        setVentaResult(null); setError('')
    }

    const steps = [
        { key: 'horario',      label: '1. Horario' },
        { key: 'asiento',      label: '2. Asiento' },
        { key: 'cliente',      label: '3. Pasajero' },
        { key: 'pago',         label: '4. Pago' },
        { key: 'confirmacion', label: '5. Ticket' },
    ]

    const stepIdx = steps.findIndex(s => s.key === step)

    return (
        <div>
            {/* Stepper */}
            {step !== 'confirmacion' && (
                <div className="flex items-center gap-0" style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
                    {steps.slice(0, 4).map((s, i) => (
                        <div key={s.key} className="flex items-center gap-0">
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.4rem 0.75rem', borderRadius: 8,
                                background: i === stepIdx ? 'var(--brand-glow)' : 'transparent',
                                color: i === stepIdx ? 'var(--brand-accent)' : i < stepIdx ? 'var(--success)' : 'var(--text-muted)',
                                fontSize: '0.82rem', fontWeight: i === stepIdx ? 600 : 400,
                                whiteSpace: 'nowrap',
                            }}>
                                {i < stepIdx ? '✓' : `${i + 1}.`} {s.label.replace(/^\d+\. /, '')}
                            </div>
                            {i < 3 && <span style={{ color: 'var(--border-default)', margin: '0 0.2rem' }}>›</span>}
                        </div>
                    ))}
                </div>
            )}

            {/* STEP 1: Seleccionar horario */}
            {step === 'horario' && (
                <div className="table-wrapper">
                    <div className="table-header">
                        <span className="table-title">Horarios disponibles hoy</span>
                    </div>
                    {loading ? (
                        <div className="empty-state"><div className="empty-state-icon" style={{ animation: 'pulse 1.5s infinite' }}>⏳</div><div className="empty-state-title">Cargando horarios...</div></div>
                    ) : horarios.length === 0 ? (
                        <div className="empty-state"><div className="empty-state-icon">🕐</div><div className="empty-state-title">Sin horarios activos</div></div>
                    ) : (
                        <table>
                            <thead><tr><th>Ruta</th><th>Salida</th><th>Autobús</th><th>Precio base</th><th></th></tr></thead>
                            <tbody>
                                {horarios.map(h => (
                                    <tr key={h.horarioID}>
                                        <td>
                                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{h.ruta?.nombreRuta}</div>
                                            <div className="text-xs text-muted">{h.ruta?.ciudadOrigen} → {h.ruta?.ciudadDestino}</div>
                                        </td>
                                        <td style={{ fontFamily: 'monospace' }}>
                                            {h.horaSalida ? new Date(h.horaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                        </td>
                                        <td>{h.autobus?.numeroEconomico}</td>
                                        <td style={{ color: 'var(--success)', fontWeight: 500 }}>
                                            ${Number(h.precioBase).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td>
                                            <button className="btn btn-primary btn-sm" onClick={() => seleccionarHorario(h)}>
                                                Seleccionar →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* STEP 2: Seleccionar asiento */}
            {step === 'asiento' && horarioSel && (
                <div>
                    <div className="card" style={{ marginBottom: '1rem' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{horarioSel.ruta?.nombreRuta}</div>
                                <div className="text-sm text-muted">
                                    Salida: {horarioSel.horaSalida ? new Date(horarioSel.horaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                    {' · '}Precio: ${Number(horarioSel.precioBase).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => setStep('horario')}>← Cambiar</button>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="font-display font-semibold" style={{ marginBottom: '1rem' }}>
                            Selecciona un asiento
                            <span className="text-muted text-sm font-body" style={{ marginLeft: '0.5rem' }}>
                                ({asientos.filter(a => a.disponible).length} disponibles)
                            </span>
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: '0.5rem' }}>
                            {asientos.map(a => (
                                <button key={a.asientoID}
                                    disabled={!a.disponible}
                                    onClick={() => { setAsientoSel(a); setStep('cliente') }}
                                    style={{
                                        padding: '0.6rem 0.4rem',
                                        borderRadius: 8,
                                        border: `1px solid ${a.asientoID === asientoSel?.asientoID ? 'var(--brand-primary)' : a.disponible ? 'var(--border-default)' : 'transparent'}`,
                                        background: !a.disponible ? 'rgba(244,63,94,0.08)' : a.asientoID === asientoSel?.asientoID ? 'var(--brand-glow)' : 'var(--bg-elevated)',
                                        color: !a.disponible ? 'var(--text-muted)' : 'var(--text-primary)',
                                        fontSize: '0.8rem', fontWeight: 500, cursor: a.disponible ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.15s',
                                    }}>
                                    {a.numero}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3" style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>🟦 Disponible</span>
                            <span>🟥 Ocupado</span>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: Datos del pasajero */}
            {step === 'cliente' && (
                <div className="card">
                    <h3 className="font-display font-semibold" style={{ marginBottom: '1.25rem' }}>Datos del pasajero</h3>
                    <div className="form-grid form-grid-2">
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Nombre completo <span className="form-required">*</span></label>
                            <input className="form-input" value={cliente.nombre}
                                onChange={e => setCliente(c => ({ ...c, nombre: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Correo electrónico</label>
                            <input className="form-input" type="email" value={cliente.email}
                                onChange={e => setCliente(c => ({ ...c, email: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Edad</label>
                            <input className="form-input" type="number" min="0" max="120" value={cliente.edad}
                                onChange={e => setCliente(c => ({ ...c, edad: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Documento (INE / Pasaporte)</label>
                            <input className="form-input" value={cliente.documento}
                                onChange={e => setCliente(c => ({ ...c, documento: e.target.value }))} />
                        </div>
                    </div>
                    <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none' }}>
                        <button className="btn btn-ghost" onClick={() => setStep('asiento')}>← Atrás</button>
                        <button className="btn btn-primary" disabled={!cliente.nombre} onClick={() => setStep('pago')}>
                            Continuar →
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: Pago */}
            {step === 'pago' && horarioSel && asientoSel && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem' }}>
                    <div className="card">
                        <h3 className="font-display font-semibold" style={{ marginBottom: '1.25rem' }}>Método de pago</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            {METODOS.map(m => (
                                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', padding: '0.75rem', borderRadius: 8, border: `1px solid ${pago.metodoPago === m ? 'var(--brand-primary)' : 'var(--border-subtle)'}`, background: pago.metodoPago === m ? 'var(--brand-glow)' : 'transparent', transition: 'all 0.15s' }}>
                                    <input type="radio" name="metodo" value={m} checked={pago.metodoPago === m}
                                        onChange={() => setPago(p => ({ ...p, metodoPago: m }))}
                                        style={{ accentColor: 'var(--brand-primary)' }} />
                                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                        {m === 'EFECTIVO' ? '💵 Efectivo' : m === 'TARJETA_DEBITO' ? '💳 Tarjeta de débito' : '💳 Tarjeta de crédito'}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {pago.metodoPago === 'EFECTIVO' && (
                            <div className="form-group">
                                <label className="form-label">Monto entregado por el cliente</label>
                                <input className="form-input" type="number" min={horarioSel.precioBase} step="0.01"
                                    placeholder={`Mínimo $${horarioSel.precioBase}`}
                                    value={pago.montoEntregado}
                                    onChange={e => setPago(p => ({ ...p, montoEntregado: e.target.value }))} />
                                {pago.montoEntregado && parseFloat(pago.montoEntregado) >= horarioSel.precioBase && (
                                    <div className="text-sm" style={{ color: 'var(--success)', marginTop: '0.25rem' }}>
                                        Cambio: ${(parseFloat(pago.montoEntregado) - horarioSel.precioBase).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        )}
                        {error && <div className="alert alert-error" style={{ marginTop: '0.75rem' }}>{error}</div>}
                        <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none' }}>
                            <button className="btn btn-ghost" onClick={() => setStep('cliente')}>← Atrás</button>
                            <button className="btn btn-primary" onClick={confirmarVenta} disabled={saving}>
                                {saving ? 'Procesando...' : '✓ Confirmar venta'}
                            </button>
                        </div>
                    </div>

                    {/* Resumen */}
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h4 className="font-display font-semibold text-sm" style={{ marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Resumen de compra
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.85rem' }}>
                            <div className="flex justify-between"><span className="text-muted">Ruta</span><span className="text-primary" style={{ textAlign: 'right', maxWidth: '160px' }}>{horarioSel.ruta?.nombreRuta}</span></div>
                            <div className="flex justify-between"><span className="text-muted">Asiento</span><span className="text-primary">{asientoSel.numero}</span></div>
                            <div className="flex justify-between"><span className="text-muted">Pasajero</span><span className="text-primary">{cliente.nombre || '—'}</span></div>
                            <div className="divider" />
                            <div className="flex justify-between" style={{ fontWeight: 700 }}>
                                <span className="text-muted">Total</span>
                                <span style={{ color: 'var(--success)', fontSize: '1.1rem' }}>
                                    ${Number(horarioSel.precioBase).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 5: Confirmación / Ticket */}
            {step === 'confirmacion' && ventaResult && (
                <div style={{ maxWidth: 480, margin: '0 auto' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎟️</div>
                        <h2 className="font-display font-bold" style={{ color: 'var(--success)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                            ¡Venta exitosa!
                        </h2>
                        <p className="text-secondary text-sm" style={{ marginBottom: '1.5rem' }}>
                            El boleto fue registrado correctamente.
                        </p>

                        <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
                                <span className="text-muted text-sm">Folio / QR</span>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--brand-accent)' }}>
                                    {ventaResult.boleto?.codigoQR?.slice(0, 20)}…
                                </span>
                            </div>
                            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
                                <span className="text-muted text-sm">Pasajero</span>
                                <span className="text-primary text-sm">{ventaResult.cliente?.nombre}</span>
                            </div>
                            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
                                <span className="text-muted text-sm">Asiento</span>
                                <span className="text-primary text-sm">{ventaResult.asiento?.numero}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted text-sm">Método de pago</span>
                                <span className="text-primary text-sm">{ventaResult.venta?.metodoPago}</span>
                            </div>
                            {ventaResult.venta?.cambioEntregado > 0 && (
                                <div className="flex justify-between" style={{ marginTop: '0.5rem' }}>
                                    <span className="text-muted text-sm">Cambio entregado</span>
                                    <span style={{ color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 600 }}>
                                        ${Number(ventaResult.venta.cambioEntregado).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2" style={{ justifyContent: 'center' }}>
                            <button className="btn btn-ghost" onClick={() => window.print()}>🖨️ Imprimir</button>
                            <button className="btn btn-primary" onClick={nuevaVenta}>+ Nueva venta</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
