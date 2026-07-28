// Hooks de TanStack Query para productos: queries públicas del catálogo y
// mutaciones del panel admin (crear/editar/eliminar con multipart/form-data).

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as productService from '../services/products'

/** Lista los productos activos, opcionalmente filtrados por slug de categoría. */
export function useProducts(categorySlug?: string) {
  return useQuery({
    queryKey: ['products', categorySlug ?? 'all'],
    queryFn: () => productService.getProducts(categorySlug),
  })
}

/** Productos destacados (isFeatured) para la home — se filtran en el cliente. */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productService.getProducts(),
    select: (products) => products.filter((p) => p.isFeatured),
  })
}

/** Detalle de un producto por id. No dispara la query si el id es vacío. */
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getProduct(id),
    enabled: id !== '',
  })
}

/** Invalida todas las queries de productos tras una mutación del admin. */
function useInvalidateProducts() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['products'] })
}

/** Crea un producto (multipart, imagen obligatoria). Lanza ApiError si falla. */
export function useCreateProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: (formData: FormData) => productService.createProduct(formData),
    onSuccess: invalidate,
  })
}

/** Actualiza un producto (multipart, imagen opcional). Lanza ApiError si falla. */
export function useUpdateProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      productService.updateProduct(id, formData),
    onSuccess: invalidate,
  })
}

/** Elimina un producto por id. Lanza ApiError si falla. */
export function useDeleteProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: invalidate,
  })
}
