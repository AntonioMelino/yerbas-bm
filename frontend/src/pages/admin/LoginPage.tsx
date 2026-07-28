// Login del panel admin (/admin/login). Llama a POST /api/auth/login; si las
// credenciales son válidas guarda el JWT en localStorage (vía authStore) y
// redirige al listado de productos. Si ya hay sesión, redirige directo.

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-yerba-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-yerba-700 bg-yerba-800 p-8 shadow-lg"
      >
        <h1 className="text-center font-display text-2xl font-bold text-yerba-300">
          Yerbas BM
        </h1>
        <p className="mt-1 text-center text-sm text-yerba-500">Panel de administración</p>

        <label className="mt-6 block text-sm text-yerba-400" htmlFor="username">
          Usuario
        </label>
        <input
          id="username"
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-1 w-full rounded-lg border border-yerba-700 bg-yerba-900 px-3 py-2 text-yerba-300 focus:border-yerba-500 focus:outline-none"
        />

        <label className="mt-4 block text-sm text-yerba-400" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-yerba-700 bg-yerba-900 px-3 py-2 text-yerba-300 focus:border-yerba-500 focus:outline-none"
        />

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-lg bg-yerba-400 py-2 font-semibold text-yerba-950 transition-colors hover:bg-yerba-500 disabled:opacity-50"
        >
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
