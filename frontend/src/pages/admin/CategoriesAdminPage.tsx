// Gestión de categorías del admin (/admin/categorias): alta con el campo de
// arriba y lista con renombrado inline y eliminación (con confirmación).
// El slug nunca se toca acá: lo genera y regenera el backend a partir del nombre.
// Diseño alineado a la identidad visual rústica oscura del sitio público.

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
    'rounded-xl border border-olive/60 bg-ink/50 px-4 py-3 text-base text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none transition'

  return (
    <div className="max-w-xl">
      <p className="text-xs uppercase tracking-widest text-gold">Clasificación</p>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-cream">Categorías</h1>

      {/* Alta de categoría */}
      <form onSubmit={handleCreate} className="mt-6 flex flex-col gap-3 sm:flex-row">
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
          className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink transition hover:bg-gold hover:text-cream disabled:opacity-50 sm:py-2"
        >
          Agregar
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-red-900/60 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {categories.isPending ? (
        <Spinner label="Cargando categorías…" />
      ) : categories.isError ? (
        <p className="mt-6 text-red-400">No se pudieron cargar las categorías.</p>
      ) : categories.data.length === 0 ? (
        <p className="mt-6 text-cream/50">Todavía no hay categorías.</p>
      ) : (
        <ul className="mt-6 divide-y divide-olive/40 rounded-2xl border border-olive/50 bg-forest/20">
          {categories.data.map((category) => (
            <li
              key={category.id}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              {editingId === category.id ? (
                /* Renombrado inline */
                <form onSubmit={handleUpdate} className="flex flex-col flex-1 gap-2 sm:flex-row">
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    className={`${inputClass} flex-1 py-2 text-sm sm:py-1.5`}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updateCategory.isPending}
                      className="flex-1 rounded-full bg-lime px-3 py-2 text-sm font-bold text-ink hover:bg-gold hover:text-cream disabled:opacity-50 sm:flex-none"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex-1 rounded-full border border-olive/60 px-3 py-2 text-sm text-cream transition hover:border-gold hover:text-lime sm:flex-none"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="min-w-0">
                    <span className="block truncate text-cream">{category.name}</span>
                    <span className="text-xs text-cream/40">/{category.slug}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(category.id)
                        setEditingName(category.name)
                      }}
                      className="flex-1 rounded-full border border-olive/60 px-4 py-2 text-sm text-cream transition hover:border-gold hover:text-lime sm:flex-none sm:px-3 sm:py-1.5"
                    >
                      Renombrar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deleteCategory.isPending}
                      className="flex-1 rounded-full border border-red-900/60 px-4 py-2 text-sm text-red-300 transition hover:bg-red-900/30 disabled:opacity-50 sm:flex-none sm:px-3 sm:py-1.5"
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
