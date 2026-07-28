// Lista de productos del panel admin (/admin/productos): tabla con imagen,
// nombre, categoría, precio, stock y estado; acciones de editar y eliminar
// (con confirmación). El alta/edición se hace en ProductFormPage.

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
        <h1 className="font-display text-2xl text-yerba-300">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="rounded-lg bg-yerba-400 px-4 py-2 text-sm font-semibold text-yerba-950 transition-colors hover:bg-yerba-500"
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
        <p className="mt-6 text-yerba-500">
          No hay productos cargados. Creá el primero con "Nuevo producto".
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-yerba-700">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-yerba-800 text-yerba-400">
              <tr>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yerba-700">
              {products.data.map((product) => (
                <tr key={product.id} className="bg-yerba-900/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yerba-800 text-xs text-yerba-600">
                          —
                        </div>
                      )}
                      <span className="text-yerba-300">
                        {product.name}
                        {product.isFeatured && (
                          <span className="ml-2 rounded-full bg-yerba-400 px-2 py-0.5 text-xs font-semibold text-yerba-950">
                            Destacado
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-yerba-400">
                    {product.categoryName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-yerba-300">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-yerba-300">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        product.isActive
                          ? 'bg-yerba-700 text-yerba-300'
                          : 'bg-red-900/60 text-red-300'
                      }`}
                    >
                      {product.isActive ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/productos/${product.id}/editar`}
                        className="rounded-lg border border-yerba-700 px-3 py-1 text-yerba-300 transition-colors hover:bg-yerba-800"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleteProduct.isPending}
                        className="rounded-lg border border-red-900 px-3 py-1 text-red-400 transition-colors hover:bg-red-900/40 disabled:opacity-50"
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
