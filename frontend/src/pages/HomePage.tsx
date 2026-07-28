// Home pública: hero, chips de categorías, productos destacados
// (isFeatured=true vía useFeaturedProducts), sección "Nosotros", catálogo
// completo con filtros y CTA de WhatsApp.
// El orden respeta el preview visual estático: Hero → Categorías → Destacados
// → Nosotros → Catálogo → CTA WhatsApp.

import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useFeaturedProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useUiStore } from '../stores/uiStore'
import ProductCard from '../components/ProductCard'
import CatalogSection from '../components/CatalogSection'
import Spinner from '../components/Spinner'

const WHATSAPP_NUMBER: string = import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491151225690'

export default function HomePage() {
  const featured = useFeaturedProducts()
  const categories = useCategories()
  const openCart = useUiStore((state) => state.openCart)
  const location = useLocation()

  // Scroll suave al hash #nosotros cuando se navega a /#nosotros.
  useEffect(() => {
    if (location.hash === '#nosotros') {
      const element = document.getElementById('nosotros')
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  return (
    <div className="bg-ink">
      {/* Hero */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/hero.jpg"
            alt="Mate, termo y yerba sobre mesa rústica"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 w-full">
          <p className="animate-fade-up animation-delay-100 text-lime uppercase eyebrow text-[10px] sm:text-xs md:text-sm mb-4 sm:mb-6">
            Yerba mate · Mates · Accesorios
          </p>
          <h1 className="animate-fade-up animation-delay-250 font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] max-w-3xl text-cream">
            El ritual del mate,
            <br />
            <span className="text-lime">en cada detalle</span>
          </h1>
          <p className="animate-fade-up animation-delay-400 mt-5 sm:mt-7 max-w-xl text-cream/75 text-sm sm:text-base md:text-lg font-light leading-relaxed">
            Yerbas seleccionadas, mates artesanales y todo lo que necesitás para cebar como se debe.
            Tradición gaucha, directo a tu casa.
          </p>
          <div className="animate-fade-up animation-delay-550 mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link
              to="/productos"
              className="bg-lime text-ink font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-gold hover:text-cream transition-all duration-300 shadow-lg shadow-lime/20 text-sm sm:text-base"
            >
              Ver catálogo
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-cream/30 hover:border-wa text-cream px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 backdrop-blur-sm bg-ink/30 text-sm sm:text-base"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.83 9.83 0 01-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 016.99 2.9 9.82 9.82 0 012.9 7c0 5.45-4.45 9.87-9.9 9.87m8.42-18.3A11.8 11.8 0 0012.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 005.68 1.44h.01c6.55 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.16-3.47-8.4" />
              </svg>
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float-down text-cream/50">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </svg>
        </div>
      </section>

      {/* Categorías: ocultas en la Home porque el catálogo completo más abajo cumple esta función */}
      <section className="hidden max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="ornament flex items-center gap-4 mb-12">
          <span className="font-display text-lime text-lg">✦</span>
        </div>
        {categories.isPending ? (
          <Spinner label="Cargando categorías…" />
        ) : categories.isError ? null : (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {(categories.data ?? []).map((category) => (
              <Link
                key={category.id}
                to={`/productos?categoria=${category.slug}`}
                className="px-5 py-2.5 rounded-full text-sm border border-olive/60 text-cream/70 hover:border-gold hover:text-lime transition-all duration-300"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Destacados */}
      <section id="destacados" className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-16 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-gold uppercase eyebrow text-xs mb-4">Los elegidos de la casa</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-5xl text-cream">
            Productos <span className="text-lime">destacados</span>
          </h2>
        </div>
        {featured.isPending ? (
          <Spinner label="Cargando destacados…" />
        ) : featured.isError ? (
          <p className="text-center text-red-400">
            No se pudieron cargar los productos. ¿Está corriendo el backend?
          </p>
        ) : featured.data.length === 0 ? (
          <p className="text-center text-cream/50">Todavía no hay productos destacados.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7">
            {featured.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="relative py-16 sm:py-24 bg-night border-y border-olive/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 grid lg:grid-cols-2 gap-8 sm:gap-14 items-center">
          <div className="img-zoom rounded-2xl overflow-hidden border border-olive/50 shadow-2xl rotate-[-1deg] sm:rotate-[-1.5deg]">
            <img
              src="/assets/mate-imperial.jpg"
              alt="Mate imperial de cuero y alpaca"
              className="w-full h-full object-cover aspect-square"
            />
          </div>
          <div>
            <p className="text-gold uppercase eyebrow text-xs mb-4">Nuestra historia</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl leading-snug mb-4 sm:mb-6 text-cream">
              Hecho con las manos,
              <br />
              <span className="text-lime">cebado con el corazón</span>
            </h2>
            <p className="text-cream/70 font-light leading-relaxed mb-4 text-sm sm:text-base">
              Yerbas BM nace de la pasión por el mate: ese momento de pausa, de charla y de ronda.
              Seleccionamos cada yerba y trabajamos con artesanos para que cada mate, bombilla y
              yerbero cuente una historia.
            </p>
            <p className="text-cream/70 font-light leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
              Del campo a tu mesa, sin vueltas. Pedís por WhatsApp y lo tenés en tu casa.
            </p>
            <div className="flex gap-6 sm:gap-10">
              <div>
                <p className="font-display text-2xl sm:text-3xl text-lime font-bold">100%</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-cream/50 mt-1">Artesanal</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl text-lime font-bold">+500</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-cream/50 mt-1">Mates cebados</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl text-lime font-bold">24h</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-cream/50 mt-1">Envío CABA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <CatalogSection />

      {/* CTA WhatsApp */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/assets/canasta.jpg" className="w-full h-full object-cover opacity-25" alt="" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
        <div className="relative text-center max-w-2xl mx-auto px-4 sm:px-5 md:px-8">
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-5 text-cream">
            ¿Listo para tu <span className="text-lime">próxima ronda</span>?
          </h2>
          <p className="text-cream/70 font-light mb-6 sm:mb-8 text-sm sm:text-base">
            Armá tu pedido en el carrito y enviánoslo directo por WhatsApp. Te respondemos al toque.
          </p>
          <button
            type="button"
            onClick={openCart}
            className="bg-wa text-ink font-bold px-7 sm:px-9 py-3.5 sm:py-4 rounded-full hover:brightness-110 transition shadow-xl shadow-wa/25 inline-flex items-center gap-2.5 text-sm sm:text-base"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.83 9.83 0 01-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 016.99 2.9 9.82 9.82 0 012.9 7c0 5.45-4.45 9.87-9.9 9.87m8.42-18.3A11.8 11.8 0 0012.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 005.68 1.44h.01c6.55 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.16-3.47-8.4" />
            </svg>
            Armar mi pedido
          </button>
        </div>
      </section>
    </div>
  )
}
