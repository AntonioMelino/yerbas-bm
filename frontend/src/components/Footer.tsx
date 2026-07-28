// Footer público: fondo night con marca, navegación, contacto
// (Instagram y WhatsApp del negocio) y crédito.

import { Link } from 'react-router-dom'

const WHATSAPP_NUMBER: string = import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491151225690'

export default function Footer() {
  return (
    <footer className="bg-night border-t border-olive/40 pt-14 pb-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid sm:grid-cols-3 gap-10 mb-10">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border border-lime/60 bg-forest flex items-center justify-center">
              <span className="font-display font-bold text-lime">BM</span>
            </div>
            <p className="font-display font-bold text-lg text-cream">Yerbas BM</p>
          </div>
          <p className="text-sm text-cream/50 font-light leading-relaxed">
            Tradición matera, yerba seleccionada y artesanía gaucha. Del campo a tu casa.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <p className="text-xs uppercase eyebrow text-lime mb-4">Navegación</p>
          <ul className="space-y-2.5 text-sm text-cream/60">
            <li>
              <Link to="/" className="hover:text-lime transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/productos" className="hover:text-lime transition">
                Catálogo
              </Link>
            </li>
            <li>
              <a href="/#nosotros" className="hover:text-lime transition">
                Nosotros
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <p className="text-xs uppercase eyebrow text-lime mb-4">Contacto</p>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-olive/60 flex items-center justify-center hover:border-gold hover:text-lime transition text-cream/70"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full border border-olive/60 flex items-center justify-center hover:border-wa hover:text-wa transition text-cream/70"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 01 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-cream/50 mt-4">+54 9 11 5122-5690</p>
        </div>
      </div>
      <div className="border-t border-olive/30 pt-6 text-center text-xs text-cream/40">
        <p>
          © 2026 Yerbas BM · Desarrollado por{' '}
          <span className="text-lime/80">Antonio Melino</span>
        </p>
      </div>
    </footer>
  )
}
