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
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${
      active
        ? 'border-yerba-400 bg-yerba-400 font-semibold text-yerba-950'
        : 'border-yerba-700 bg-yerba-800 text-yerba-300 hover:border-yerba-500'
    }`

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-yerba-300">Productos</h1>

      {/* Filtros por categoría */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className={chipClass(!categorySlug)} onClick={() => setCategory()}>
          Todas
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

      {/* Búsqueda por nombre */}
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por nombre…"
        className="mt-4 w-full max-w-sm rounded-lg border border-yerba-700 bg-yerba-900 px-4 py-2 text-yerba-300 placeholder:text-yerba-600 focus:border-yerba-500 focus:outline-none"
      />

      {/* Grid de productos */}
      {products.isPending ? (
        <Spinner label="Cargando productos…" />
      ) : products.isError ? (
        <p className="mt-10 text-red-400">
          No se pudieron cargar los productos. ¿Está corriendo el backend?
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-yerba-500">No hay productos para este filtro.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
