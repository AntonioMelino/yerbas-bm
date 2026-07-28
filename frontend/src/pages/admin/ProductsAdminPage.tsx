// Lista de productos del panel admin (/admin/productos): tabla con imagen,
// nombre, categoría, precio, stock y estado; acciones de editar y eliminar
// (con confirmación). El alta/edición se hace en ProductFormPage.
// Diseño alineado a la identidad visual rústica oscura del sitio público.

import { Link } from 'react-router-dom'
import { useDeleteProduct, useProducts } from '../../hooks/useProducts'
import { formatPrice } from '../../utils/format'
import Spinner from '../../components/Spinner'

export default function ProductsAdminPage() {
  const products = useProducts()
  const deleteProduct = useDeleteProduct()

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      deleteProduct.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Gestión de stock</p>
          <h1 className="font-display text-3xl font-bold text-cream">Productos</h1>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-gold hover:text-cream"
        >
          + Nuevo producto
        </Link>
      </div>

      {deleteProduct.isError && (
        <p className="mt-4 text-sm text-red-400">
          No se pudo eliminar: {deleteProduct.error.message}
        </p>
      )}

      {products.isPending ? (
        <Spinner label="Cargando productos…" />
      ) : products.isError ? (
        <p className="mt-6 text-red-400">No se pudieron cargar los productos.</p>
      ) : products.data.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-olive/50 bg-forest/30 p-8 text-center text-cream/60">
          <p className="text-4xl mb-3">🧉</p>
          <p>No hay productos cargados.</p>
          <p className="text-sm text-cream/40">Creá el primero con "Nuevo producto".</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-olive/50">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-forest/60 text-cream/70">
              <tr>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-olive/40">
              {products.data.map((product) => (
                <tr key={product.id} className="bg-forest/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover border border-olive/40"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-olive/40 bg-night text-xs text-cream/30">
                          —
                        </div>
                      )}
                      <span className="text-cream">
                        {product.name}
                        {product.isFeatured && (
                          <span className="ml-2 rounded-full bg-lime px-2 py-0.5 text-xs font-semibold text-ink">
                            Destacado
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cream/60">
                    {product.categoryName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-cream">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-cream">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.isActive
                          ? 'bg-yerba/30 text-lime'
                          : 'bg-red-900/30 text-red-300'
                      }`}
                    >
                      {product.isActive ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/productos/${product.id}/editar`}
                        className="rounded-full border border-olive/60 px-3 py-1.5 text-xs text-cream transition hover:border-gold hover:text-lime"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleteProduct.isPending}
                        className="rounded-full border border-red-900/60 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-900/30 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
