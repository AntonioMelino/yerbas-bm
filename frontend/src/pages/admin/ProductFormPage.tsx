// Formulario de producto del admin: sirve tanto para crear
// (/admin/productos/nuevo) como para editar (/admin/productos/:id/editar).
//
// Envía multipart/form-data (no JSON) porque el backend recibe la imagen como
// archivo en el campo Image (CreateProductFormRequest/UpdateProductFormRequest):
// - Al crear, la imagen es obligatoria.
// - Al editar, es opcional: si no se adjunta una nueva, se conserva la actual.
//
// La imagen se valida en el cliente (tipo JPG/PNG/WebP, máx. 2 MB) para dar
// feedback inmediato; el backend repite la misma validación (incluye magic
// bytes) y su error también se muestra si igual se cuela algo inválido.

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'
import { useCreateProduct, useProduct, useUpdateProduct } from '../../hooks/useProducts'
import { ApiError } from '../../services/api'
import Spinner from '../../components/Spinner'

/** Restricciones de imagen — espejo de ProductImageValidator del backend. */
const MAX_IMAGE_BYTES = 2 * 1024 * 1024 // 2 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Valida el archivo de imagen elegido antes de enviarlo.
 * Devuelve un mensaje de error en español, o null si el archivo es válido.
 */
function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Formato no válido. La imagen debe ser JPG, PNG o WebP.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'La imagen supera el máximo de 2 MB.'
  }
  return null
}

interface ProductFormPageProps {
  /** 'create' = alta con imagen obligatoria; 'edit' = edición con imagen opcional. */
  mode: 'create' | 'edit'
}

export default function ProductFormPage({ mode }: ProductFormPageProps) {
  const isEdit = mode === 'edit'
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const categories = useCategories()
  const existing = useProduct(isEdit && id ? id : '')
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // En modo edición, precarga el formulario cuando llega el producto de la API.
  useEffect(() => {
    if (isEdit && existing.data) {
      setName(existing.data.name)
      setDescription(existing.data.description ?? '')
      setPrice(String(existing.data.price))
      setStock(String(existing.data.stock))
      setCategoryId(existing.data.categoryId ?? '')
      setIsActive(existing.data.isActive)
      setIsFeatured(existing.data.isFeatured)
    }
  }, [isEdit, existing.data])

  // Vista previa de la imagen nueva elegida; en edición sin imagen nueva se
  // muestra la actual (URL pública de Supabase).
  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image],
  )
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setImage(file)
    setImageError(file ? validateImage(file) : null)
  }

  const submitting = createProduct.isPending || updateProduct.isPending

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    // Validación de imagen del lado del cliente antes de enviar.
    if (!isEdit && !image) {
      setImageError('La imagen del producto es obligatoria.')
      return
    }
    if (image) {
      const error = validateImage(image)
      if (error) {
        setImageError(error)
        return
      }
    }

    // Nombres de campo en PascalCase: coinciden con las propiedades de
    // CreateProductFormRequest / UpdateProductFormRequest del backend.
    const formData = new FormData()
    formData.append('Name', name.trim())
    formData.append('Description', description.trim())
    formData.append('Price', price)
    formData.append('Stock', stock)
    if (categoryId) formData.append('CategoryId', categoryId)
    formData.append('IsFeatured', String(isFeatured))
    if (isEdit) formData.append('IsActive', String(isActive))
    if (image) formData.append('Image', image)

    try {
      if (isEdit && id) {
        await updateProduct.mutateAsync({ id, formData })
      } else {
        await createProduct.mutateAsync(formData)
      }
      navigate('/admin/productos')
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo guardar el producto.',
      )
    }
  }

  if (isEdit && existing.isPending) {
    return <Spinner label="Cargando producto…" />
  }
  if (isEdit && existing.isError) {
    return <p className="text-red-400">No se pudo cargar el producto.</p>
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-yerba-700 bg-yerba-900 px-3 py-2 text-yerba-300 focus:border-yerba-500 focus:outline-none'

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-yerba-300">
        {isEdit ? 'Editar producto' : 'Nuevo producto'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm text-yerba-400" htmlFor="name">
            Nombre *
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={200}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-yerba-400" htmlFor="description">
            Descripción
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-yerba-400" htmlFor="price">
              Precio *
            </label>
            <input
              id="price"
              type="number"
              required
              min="0.01"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-yerba-400" htmlFor="stock">
              Stock *
            </label>
            <input
              id="stock"
              type="number"
              required
              min="0"
              step="1"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-yerba-400" htmlFor="category">
            Categoría
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={inputClass}
          >
            <option value="">Sin categoría</option>
            {(categories.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-yerba-300">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(event) => setIsFeatured(event.target.checked)}
              className="h-4 w-4 accent-yerba-400"
            />
            Destacado en la home
          </label>
          {isEdit && (
            <label className="flex items-center gap-2 text-sm text-yerba-300">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-4 w-4 accent-yerba-400"
              />
              Visible en el catálogo
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm text-yerba-400" htmlFor="image">
            Imagen {isEdit ? '(opcional — se conserva la actual si no elegís otra)' : '*'}
          </label>
          <p className="mt-0.5 text-xs text-yerba-600">JPG, PNG o WebP — máximo 2 MB.</p>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="mt-2 w-full text-sm text-yerba-400 file:mr-3 file:rounded-lg file:border-0 file:bg-yerba-700 file:px-3 file:py-1.5 file:text-yerba-300 hover:file:bg-yerba-600"
          />
          {imageError && <p className="mt-2 text-sm text-red-400">{imageError}</p>}
          {(previewUrl ?? (isEdit ? existing.data?.imageUrl : null)) && (
            <img
              src={previewUrl ?? existing.data?.imageUrl ?? ''}
              alt="Vista previa"
              className="mt-3 h-32 w-32 rounded-lg border border-yerba-700 object-cover"
            />
          )}
        </div>

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-yerba-400 px-5 py-2 font-semibold text-yerba-950 transition-colors hover:bg-yerba-500 disabled:opacity-50"
          >
            {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <Link
            to="/admin/productos"
            className="rounded-lg border border-yerba-700 px-5 py-2 text-yerba-300 transition-colors hover:bg-yerba-800"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
