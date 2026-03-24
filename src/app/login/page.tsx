'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const bloqueoDesdeUrl = searchParams.get('code') === 'cuenta_bloqueada'

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const form = e.currentTarget
        const email    = (form.elements.namedItem('email')    as HTMLInputElement).value
        const password = (form.elements.namedItem('password') as HTMLInputElement).value

        const result = await signIn('credentials', { email, password, redirect: false })
        setLoading(false)

        if (result?.code === 'cuenta_bloqueada') {
            setError('Cuenta bloqueada temporalmente. Intenta de nuevo en 15 minutos.')
            return
        }

        if (result?.error) {
            setError('Correo o contraseña incorrectos.')
            return
        }

        router.push('/dashboard')
    }

    return (
        <div className="login-bg">
            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <div className="login-logo-mark">A</div>
                    <div className="login-title">ASTRALIS</div>
                    <div className="login-sub">Sistema de Gestión de Transporte</div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="usuario@astralis.mx"
                            required
                            autoComplete="email"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            className="form-input"
                        />
                    </div>

                    {(error || bloqueoDesdeUrl) && (
                        <div className="alert alert-error" role="alert">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error || 'Cuenta bloqueada temporalmente. Intenta de nuevo en 15 minutos.'}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '0.5rem', justifyContent: 'center', padding: '0.7rem 1rem' }}
                    >
                        {loading ? (
                            <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    style={{ animation: 'spin 1s linear infinite' }}>
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                </svg>
                                Ingresando...
                            </>
                        ) : 'Ingresar al sistema'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Línea Astralis S.A. de C.V. — Acceso restringido al personal autorizado
                </p>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    )
}
