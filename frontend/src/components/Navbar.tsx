// Navbar público: fijo, oscuro con blur, logo circular BM, links de
// navegación, botón del carrito con badge y menú hamburguesa en mobile.
// Suma fondo y sombra al hacer scroll (efecto del preview visual).

import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { useUiStore } from '../stores/uiStore'

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Catálogo' },
  { to: '/#nosotros', label: 'Nosotros', isAnchor: true },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore((state) => state.totalItems())
  const openCart = useUiStore((state) => state.openCart)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink/85 backdrop-blur-md border-b border-olive/40 shadow-lg'
          : ''
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full border border-lime/60 bg-night/80 flex items-center justify-center shadow-lg group-hover:border-gold transition">
            <span className="font-display font-bold text-lime text-lg leading-none">BM</span>
          </div>
          <div className="leading-tight">
            <p className="font-display font-bold tracking-wide text-cream text-lg">Yerbas BM</p>
            <p className="text-[10px] uppercase eyebrow text-lime/80">Tradición matera</p>
          </div>
        </Link>

        {/* Links de escritorio */}
        <div className="hidden md:flex items-center gap-9 text-sm text-cream/80">
          {NAV_LINKS.map((link) =>
            link.isAnchor ? (
              <a
                key={link.to}
                href={link.to}
                className="hover:text-lime transition"
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition ${isActive ? 'text-lime' : 'hover:text-lime'}`
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Carrito con badge */}
          <button
            type="button"
            onClick={openCart}
            title="Carrito"
            aria-label="Abrir carrito"
            className="relative flex items-center gap-2 bg-forest hover:bg-yerba border border-olive/60 hover:border-gold rounded-full pl-4 pr-5 py-2.5 text-sm font-medium transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-lime text-ink text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón hamburguesa (mobile) */}
          <button
            type="button"
            className="flex md:hidden w-10 h-10 rounded-full border border-olive/60 items-center justify-center text-cream hover:border-gold hover:text-lime transition"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Menú desplegable mobile */}
      {menuOpen && (
        <div className="border-t border-olive/40 bg-night/95 backdrop-blur-md px-5 sm:px-8 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm text-cream/80">
            {NAV_LINKS.map((link) =>
              link.isAnchor ? (
                <a
                  key={link.to}
                  href={link.to}
                  className="hover:text-lime transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `transition ${isActive ? 'text-lime' : 'hover:text-lime'}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ),
            )}
          </div>
        </div>
      )}
    </header>
  )
}
