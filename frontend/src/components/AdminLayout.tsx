// Layout de las rutas /admin: actúa a la vez de guarda de sesión (redirige a
// /admin/login si no hay JWT) y de marco visual del panel (barra superior con
// navegación entre secciones, usuario logueado y botón de salir).
// Estética alineada al sitio público: fondos oscuros, bordes oliva y acentos
// lime/gold.

import { useState } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const ADMIN_LINKS = [
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
]

export default function AdminLayout() {
  const { isAuthenticated, username, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 text-sm transition-colors hover:text-lime ${
      isActive ? 'font-semibold text-lime' : 'text-cream/80'
    }`

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-olive/40 bg-night/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-lime/60 bg-forest">
              <span className="font-display text-sm sm:text-base font-bold text-lime">BM</span>
            </div>
            <div>
              <span className="font-display text-base sm:text-lg font-bold text-cream">Yerbas BM</span>
              <span className="ml-2 hidden sm:inline text-sm text-cream/50">Panel admin</span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-6">
            {ADMIN_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-3 text-sm">
            {username && <span className="text-cream/60">{username}</span>}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-olive/60 px-4 py-2 text-cream/80 transition hover:border-gold hover:text-lime"
            >
              Salir
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="sm:hidden rounded-full border border-olive/60 p-2 text-cream transition hover:border-gold hover:text-lime"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-olive/40 bg-night/95 px-4 pb-4 sm:hidden">
            <nav className="flex flex-col gap-1 pt-2">
              {ADMIN_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-olive/40 pt-3 text-sm">
              {username && <span className="px-3 text-cream/60">{username}</span>}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  handleLogout()
                }}
                className="rounded-full border border-olive/60 px-4 py-2 text-left text-cream/80 transition hover:border-gold hover:text-lime"
              >
                Salir
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
