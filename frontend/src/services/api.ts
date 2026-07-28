// Cliente HTTP base para hablar con la API del backend.
// Centraliza: URL base, header Authorization con el JWT y el parseo de errores,
// para que los servicios (products, categories, auth) no repitan esa lógica.

const BASE_URL: string = import.meta.env.VITE_API_URL ?? '/api'

const TOKEN_KEY = 'yerbasbm_token'

/** Devuelve el JWT guardado en localStorage (null si no hay sesión de admin). */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** Guarda el JWT en localStorage (lo lee api.ts en cada request protegida). */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** Descarta el JWT — es el "logout": al ser stateless no hay endpoint de logout. */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/** Error de la API con el status HTTP y un mensaje listo para mostrar al usuario. */
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Extrae un mensaje legible del body de error del backend, que puede venir en
 * tres formas según el origen del error:
 * - { message } — errores de negocio (ej. login fallido)
 * - { error } — validaciones manuales (ej. imagen inválida)
 * - ProblemDetails de ASP.NET ({ title, errors }) — validación de DataAnnotations
 */
async function parseErrorMessage(response: Response): Promise<string> {
  const fallback = `Error ${response.status}: ${response.statusText}`
  try {
    const body = await response.json()
    if (typeof body?.message === 'string') return body.message
    if (typeof body?.error === 'string') return body.error
    if (body?.errors && typeof body.errors === 'object') {
      const messages = Object.values(body.errors).flat() as string[]
      if (messages.length > 0) return messages.join(' ')
    }
    if (typeof body?.title === 'string') return body.title
    return fallback
  } catch {
    return fallback
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** JSON (objeto) o FormData (multipart). Con FormData no se fija Content-Type: el browser agrega el boundary. */
  body?: unknown
  /** Si es true agrega Authorization: Bearer {token}. Requerido en las mutaciones de admin. */
  auth?: boolean
}

/**
 * Ejecuta un request contra la API y devuelve el body parseado.
 * Lanza ApiError si el status no es 2xx. Devuelve undefined en 204 (DELETE).
 */
export async function apiRequest<T = undefined>(
  path: string,
  { method = 'GET', body, auth = false }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {}

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  let requestBody: BodyInit | undefined
  if (body instanceof FormData) {
    requestBody = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: requestBody,
  })

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response))
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
