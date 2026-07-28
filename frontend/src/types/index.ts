// Tipos TypeScript que reflejan los DTOs del backend (.NET).
// Fuente de verdad: CONTEXTO.md sección 6 y backend/YerbasBM.Application/DTOs.

/** Producto tal como lo devuelve GET /api/products (ProductDto del backend). */
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  /** URL pública final en Supabase Storage — se usa directo en <img src>. */
  imageUrl: string | null
  categoryId: string | null
  categoryName: string | null
  isActive: boolean
  isFeatured: boolean
}

/** Categoría tal como la devuelve GET /api/categories (CategoryDto del backend). */
export interface Category {
  id: string
  name: string
  /** Lo genera siempre el backend a partir del nombre — nunca se envía desde el frontend. */
  slug: string
}

/** Respuesta de POST /api/auth/login (LoginResponseDto del backend). */
export interface LoginResponse {
  token: string
  expiresAtUtc: string
  username: string
}

/** Item del carrito de compras (solo cliente, no existe en el backend). */
export interface CartItem {
  product: Product
  quantity: number
}
