// Layout de las rutas /admin: actúa a la vez de guarda de sesión (redirige a
// /admin/login si no hay JWT) y de marco visual del panel (barra superior con
// navegación entre secciones, usuario logueado y botón de salir).

import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const ADMIN_LINKS = [
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
]

export default function AdminLayout() {
  const { isAuthenticated, username, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-yerba-950">
      <header className="border-b border-yerba-700 bg-yerba-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="font-display text-xl font-bold text-yerba-300">
            Yerbas BM <span className="text-sm font-normal text-yerba-500">— Panel admin</span>
          </span>

          <nav className="flex items-center gap-4 text-sm">
            {ADMIN_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors hover:text-yerba-400 ${
                    isActive ? 'font-semibold text-yerba-400' : 'text-yerba-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {username && <span className="text-yerba-500">{username}</span>}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-yerba-700 px-3 py-1 text-yerba-300 transition-colors hover:bg-yerba-800"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
