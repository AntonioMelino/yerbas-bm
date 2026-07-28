// Home pública: hero con la identidad de la marca, productos destacados
// (isFeatured=true, vía useFeaturedProducts) y acceso a las categorías.

import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'

export default function HomePage() {
  const featured = useFeaturedProducts()
  const categories = useCategories()

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-yerba-700 bg-gradient-to-b from-yerba-900 to-yerba-950 px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-bold text-yerba-300 sm:text-5xl">
          Yerbas <span className="text-yerba-400">BM</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-yerba-400">
          Yerba mate y todo lo que rodea al ritual: mates, termos, bombillas y
          accesorios. Tradición gaucha, directo a tu casa.
        </p>
        <Link
          to="/productos"
          className="mt-8 inline-block rounded-lg bg-yerba-400 px-6 py-3 font-semibold text-yerba-950 transition-colors hover:bg-yerba-500"
        >
          Ver catálogo
        </Link>
      </section>

      {/* Productos destacados */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-2xl text-yerba-300">Destacados</h2>
        {featured.isPending ? (
          <Spinner label="Cargando destacados…" />
        ) : featured.isError ? (
          <p className="mt-6 text-red-400">
            No se pudieron cargar los productos. ¿Está corriendo el backend?
          </p>
        ) : featured.data.length === 0 ? (
          <p className="mt-6 text-yerba-500">
            Todavía no hay productos destacados.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="font-display text-2xl text-yerba-300">Categorías</h2>
        {categories.isPending ? (
          <Spinner label="Cargando categorías…" />
        ) : categories.isError ? null : (
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.data.map((category) => (
              <Link
                key={category.id}
                to={`/productos?categoria=${category.slug}`}
                className="rounded-full border border-yerba-700 bg-yerba-800 px-4 py-2 text-sm text-yerba-300 transition-colors hover:border-yerba-500 hover:text-yerba-400"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
