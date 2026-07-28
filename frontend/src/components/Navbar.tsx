// Navbar público del sitio: logo, links de navegación y contador del carrito.
// Mobile-first: en pantallas chicas los links se pliegan detrás de un botón.

import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { useUiStore } from '../stores/uiStore'

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const totalItems = useCartStore((state) => state.totalItems())
  const openCart = useUiStore((state) => state.openCart)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors hover:text-yerba-400 ${isActive ? 'text-yerba-400' : 'text-yerba-300'}`

  return (
    <header className="sticky top-0 z-40 border-b border-yerba-700 bg-yerba-900/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-2xl font-bold text-yerba-300">
          Yerbas <span className="text-yerba-400">BM</span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Links de escritorio */}
          <div className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Carrito con badge de cantidad — abre el CartDrawer */}
          <button
            type="button"
            onClick={openCart}
            className="relative text-yerba-300 transition-colors hover:text-yerba-400"
            title="Carrito"
            aria-label="Abrir carrito"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-yerba-400 text-xs font-bold text-yerba-950">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón hamburguesa (mobile) */}
          <button
            type="button"
            className="text-yerba-300 sm:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Menú desplegable mobile */}
      {menuOpen && (
        <div className="border-t border-yerba-700 px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
