// Formulario de producto del admin: sirve tanto para crear
// (/admin/productos/nuevo) como para editar (/admin/productos/:id/editar).
//
// Envía multipart/form-data (no JSON) porque el backend recibe la imagen como
// archivo en el campo Image (CreateProductFormRequest/UpdateProductFormRequest):
// - Al crear, la imagen es obligatoria.
// - Al editar, es opcional: si no se adjunta una nueva, se conserva la actual.
//
// La imagen se valida en el cliente (tipo JPG/PNG/WebP, máx. 2 MB) para dar
// feedback inmediato; el backend repite la misma validación.
// Diseño alineado a la identidad visual rústica oscura del sitio público.

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

  const labelClass = 'mb-1.5 block text-xs uppercase tracking-widest text-gold'
  const inputClass =
    'mt-1 w-full rounded-xl border border-olive/60 bg-ink/50 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none transition'
  const selectClass = `${inputClass} appearance-none`

  return (
    <div className="max-w-xl">
      <p className="text-xs uppercase tracking-widest text-gold">
        {isEdit ? 'Editando artículo' : 'Nuevo artículo'}
      </p>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-cream">
        {isEdit ? 'Editar producto' : 'Cargar producto'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div>
          <label className={labelClass} htmlFor="name">
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
          <label className={labelClass} htmlFor="description">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="price">
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
            <label className={labelClass} htmlFor="stock">
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
          <label className={labelClass} htmlFor="category">
            Categoría
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={selectClass}
          >
            <option value="" className="bg-night">Sin categoría</option>
            {(categories.data ?? []).map((category) => (
              <option key={category.id} value={category.id} className="bg-night">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
          <label className="flex items-center gap-2 text-sm text-cream">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(event) => setIsFeatured(event.target.checked)}
              className="h-4 w-4 accent-lime"
            />
            Destacado en la home
          </label>
          {isEdit && (
            <label className="flex items-center gap-2 text-sm text-cream">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-4 w-4 accent-lime"
              />
              Visible en el catálogo
            </label>
          )}
        </div>

        <div className="rounded-2xl border border-olive/50 bg-forest/20 p-4 sm:p-5">
          <label className={labelClass} htmlFor="image">
            Imagen {isEdit ? '(opcional — se conserva la actual si no elegís otra)' : '*'}
          </label>
          <p className="text-xs text-cream/50">JPG, PNG o WebP — máximo 2 MB.</p>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="mt-3 w-full text-sm text-cream/70 file:mr-3 file:rounded-full file:border-0 file:bg-olive file:px-4 file:py-2 file:text-cream hover:file:bg-gold"
          />
          {imageError && <p className="mt-3 text-sm text-red-400">{imageError}</p>}
          {(previewUrl ?? (isEdit ? existing.data?.imageUrl : null)) && (
            <img
              src={previewUrl ?? existing.data?.imageUrl ?? ''}
              alt="Vista previa"
              className="mt-4 h-36 w-full rounded-xl border border-olive/50 object-cover sm:w-36"
            />
          )}
        </div>

        {submitError && (
          <p className="rounded-xl border border-red-900/60 bg-red-900/20 px-4 py-3 text-sm text-red-300">
            {submitError}
          </p>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-lime px-6 py-3 text-center font-bold text-ink transition hover:bg-gold hover:text-cream disabled:opacity-50 sm:w-auto sm:py-2.5"
          >
            {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <Link
            to="/admin/productos"
            className="w-full rounded-full border border-olive/60 px-6 py-3 text-center text-cream transition hover:border-gold hover:text-lime sm:w-auto sm:py-2.5"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
