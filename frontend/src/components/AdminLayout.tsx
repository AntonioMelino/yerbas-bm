// Layout de las rutas /admin: actúa a la vez de guarda de sesión (redirige a
// /admin/login si no hay JWT) y de marco visual del panel (barra superior con
// navegación entre secciones, usuario logueado y botón de salir).
// Estética alineada al sitio público: fondos oscuros, bordes oliva y acentos
// lime/gold.

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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-1 text-sm transition-colors hover:text-lime ${
      isActive ? 'font-semibold text-lime' : 'text-cream/80'
    }`

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-olive/40 bg-night/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-lime/60 bg-forest">
              <span className="font-display font-bold text-lime">BM</span>
            </div>
            <div>
              <span className="font-display text-lg font-bold text-cream">Yerbas BM</span>
              <span className="ml-2 text-sm text-cream/50">Panel admin</span>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            {ADMIN_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {username && <span className="text-cream/60">{username}</span>}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-olive/60 px-4 py-2 text-cream/80 transition hover:border-gold hover:text-lime"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
