// Catálogo público (/productos): chips de filtro por categoría (sincronizados
// con el query param ?categoria={slug}, que también usa la home), búsqueda por
// nombre en el cliente y grid de productos activos de la API real.

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CatalogSection from '../components/CatalogSection'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categorySlug = searchParams.get('categoria') ?? undefined
  const [search, setSearch] = useState('')

  const setCategory = (slug?: string) => {
    setSearchParams(slug ? { categoria: slug } : {})
  }

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
      <CatalogSection
        categorySlug={categorySlug}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />
    </div>
  )
}
