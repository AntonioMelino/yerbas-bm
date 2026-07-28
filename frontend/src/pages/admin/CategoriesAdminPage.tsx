// Gestión de categorías del admin (/admin/categorias): alta con el campo de
// arriba y lista con renombrado inline y eliminación (con confirmación).
// El slug nunca se toca acá: lo genera y regenera el backend a partir del nombre.

import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../../hooks/useCategories'
import { ApiError } from '../../services/api'
import Spinner from '../../components/Spinner'

export default function CategoriesAdminPage() {
  const categories = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [newName, setNewName] = useState('')
  /** id de la categoría que se está renombrando inline (null = ninguna). */
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mutationError = (err: unknown) =>
    setError(err instanceof ApiError ? err.message : 'Ocurrió un error inesperado.')

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    const name = newName.trim()
    if (!name) return
    setError(null)
    try {
      await createCategory.mutateAsync(name)
      setNewName('')
    } catch (err) {
      mutationError(err)
    }
  }

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault()
    const name = editingName.trim()
    if (!editingId || !name) return
    setError(null)
    try {
      await updateCategory.mutateAsync({ id: editingId, name })
      setEditingId(null)
    } catch (err) {
      mutationError(err)
    }
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar la categoría "${name}"?`)) {
      setError(null)
      deleteCategory.mutate(id, { onError: mutationError })
    }
  }

  const inputClass =
    'rounded-lg border border-yerba-700 bg-yerba-900 px-3 py-2 text-yerba-300 focus:border-yerba-500 focus:outline-none'

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-yerba-300">Categorías</h1>

      {/* Alta de categoría */}
      <form onSubmit={handleCreate} className="mt-6 flex gap-2">
        <input
          type="text"
          required
          maxLength={100}
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Nombre de la nueva categoría"
          className={`${inputClass} flex-1`}
        />
        <button
          type="submit"
          disabled={createCategory.isPending}
          className="rounded-lg bg-yerba-400 px-4 py-2 text-sm font-semibold text-yerba-950 transition-colors hover:bg-yerba-500 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {categories.isPending ? (
        <Spinner label="Cargando categorías…" />
      ) : categories.isError ? (
        <p className="mt-6 text-red-400">No se pudieron cargar las categorías.</p>
      ) : categories.data.length === 0 ? (
        <p className="mt-6 text-yerba-500">Todavía no hay categorías.</p>
      ) : (
        <ul className="mt-6 divide-y divide-yerba-700 rounded-xl border border-yerba-700">
          {categories.data.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              {editingId === category.id ? (
                /* Renombrado inline */
                <form onSubmit={handleUpdate} className="flex flex-1 gap-2">
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    className={`${inputClass} flex-1 py-1 text-sm`}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={updateCategory.isPending}
                    className="rounded-lg bg-yerba-400 px-3 py-1 text-sm font-semibold text-yerba-950 hover:bg-yerba-500 disabled:opacity-50"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-yerba-700 px-3 py-1 text-sm text-yerba-300 hover:bg-yerba-800"
                  >
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <div>
                    <span className="text-yerba-300">{category.name}</span>
                    <span className="ml-2 text-xs text-yerba-600">/{category.slug}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(category.id)
                        setEditingName(category.name)
                      }}
                      className="rounded-lg border border-yerba-700 px-3 py-1 text-sm text-yerba-300 transition-colors hover:bg-yerba-800"
                    >
                      Renombrar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deleteCategory.isPending}
                      className="rounded-lg border border-red-900 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-900/40 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
