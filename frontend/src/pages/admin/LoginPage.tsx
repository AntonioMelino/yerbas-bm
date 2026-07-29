// Login del panel admin (/admin/login). Llama a POST /api/auth/login; si las
// credenciales son válidas guarda el JWT en localStorage (vía authStore) y
// redirige al listado de productos. Si ya hay sesión, redirige directo.
// Diseño alineado a la identidad visual del sitio público: fondo oscuro,
// tarjeta rústica con bordes oliva y acentos lime/gold.

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { ApiError } from '../../services/api'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuthStore()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin/productos" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate('/admin/productos', { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo conectar con el servidor.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-full border border-olive/60 bg-ink/50 px-5 py-4 text-base text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none transition'

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-olive/60 bg-night p-6 sm:p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-lime/60 bg-forest">
            <span className="font-display text-xl sm:text-2xl font-bold text-lime">BM</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-cream">Yerbas BM</h1>
          <p className="mt-1 text-sm text-cream/50">Panel de administración</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-gold" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-gold" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-900/60 bg-red-900/20 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-lime py-4 text-base font-bold text-ink transition hover:bg-gold hover:text-cream disabled:opacity-50"
        >
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
