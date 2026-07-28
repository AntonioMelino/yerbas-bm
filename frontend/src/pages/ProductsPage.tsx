// Catálogo público (/productos): chips de filtro por categoría (sincronizados
// con el query param ?categoria={slug}, que también usa la home), búsqueda por
// nombre en el cliente y grid de productos activos de la API real.

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categorySlug = searchParams.get('categoria') ?? undefined
  const [search, setSearch] = useState('')

  const products = useProducts(categorySlug)
  const categories = useCategories()

  const setCategory = (slug?: string) => {
    setSearchParams(slug ? { categoria: slug } : {})
  }

  // Búsqueda por nombre sobre los productos ya filtrados por categoría.
  const filtered = (products.data ?? []).filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  const chipClass = (active: boolean) =>
    `px-5 py-2.5 rounded-full text-sm border transition-all duration-300 ${
      active
        ? 'bg-lime text-ink border-lime font-semibold'
        : 'border-olive/60 text-cream/70 hover:border-gold hover:text-lime'
    }`

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24">
      <div className="text-center mb-10">
        <p className="text-gold uppercase eyebrow text-xs mb-4">Todo lo que necesitás</p>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-cream">
          Nuestro <span className="text-lime">catálogo</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
        <div className="flex flex-wrap gap-2.5 flex-1">
          <button
            type="button"
            className={chipClass(!categorySlug)}
            onClick={() => setCategory()}
          >
            Todos
          </button>
          {(categories.data ?? []).map((category) => (
            <button
              key={category.id}
              type="button"
              className={chipClass(categorySlug === category.slug)}
              onClick={() => setCategory(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar producto..."
            className="bg-forest/60 border border-olive/60 rounded-full pl-11 pr-5 py-3 text-sm w-full sm:w-64 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition"
          />
          <svg
            className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-cream/40"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>

      {products.isPending ? (
        <Spinner label="Cargando productos…" />
      ) : products.isError ? (
        <p className="text-center text-red-400 py-16">
          No se pudieron cargar los productos. ¿Está corriendo el backend?
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-cream/50 py-16 font-light">
          No encontramos productos con ese filtro 🧉
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
