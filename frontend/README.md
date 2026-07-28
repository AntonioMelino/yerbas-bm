# Yerbas BM — Frontend

Frontend del e-commerce Yerbas BM: catálogo público de productos y panel de
administración para el dueño del emprendimiento. Consume la API real del
backend .NET (ver `../backend/README.md` y `../CONTEXTO.md`).

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** (paleta y tipografías de la identidad visual — CONTEXTO.md sección 7)
- **TanStack Query** para las llamadas a la API (cache + revalidación)
- **Zustand** para estado global (carrito y sesión de admin)
- **React Router** para la navegación

## Levantar el proyecto localmente

Requisitos: Node.js 20+ y el backend corriendo (por defecto en
`http://localhost:5035`).

```bash
cd frontend
npm install
cp .env.example .env   # en Windows: copy .env.example .env
npm run dev
```

La app queda en `http://localhost:5173`.

En desarrollo **no hace falta configurar CORS en el backend**: el dev server de
Vite proxifica `/api` → `http://localhost:5035` (ver `vite.config.ts`). Si el
backend corre en otro puerto, ajustar el `target` del proxy en ese archivo.

### Variables de entorno (`.env`)

| Variable               | Descripción                                                                 | Default local |
| ---------------------- | --------------------------------------------------------------------------- | ------------- |
| `VITE_API_URL`         | URL base de la API. En dev se usa `/api` (proxy de Vite); en producción, la URL real de Railway. | `/api` |
| `VITE_WHATSAPP_NUMBER` | Número de WhatsApp del negocio (lo usará la feature carrito → WhatsApp).    | `5491151225690` (testing) |

### Scripts

```bash
npm run dev       # dev server con hot reload
npm run build     # type-check (tsc) + build de producción en dist/
npm run preview   # sirve el build de producción localmente
npm run lint      # oxlint
```

## Estructura de carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.tsx       # Navbar público (links, badge del carrito)
│   ├── Footer.tsx       # Footer público (redes, WhatsApp, crédito)
│   ├── ProductCard.tsx  # Tarjeta de producto del catálogo
│   ├── Spinner.tsx      # Indicador de carga
│   ├── PublicLayout.tsx # Marco de las páginas públicas (Navbar + Outlet + Footer)
│   └── AdminLayout.tsx  # Marco del panel admin + guarda de sesión (redirige a login)
├── pages/
│   ├── HomePage.tsx     # Hero, destacados (isFeatured) y categorías
│   ├── ProductsPage.tsx # Catálogo con filtro por categoría (?categoria={slug}) y búsqueda
│   └── admin/
│       ├── LoginPage.tsx          # Login del admin (POST /api/auth/login)
│       ├── ProductsAdminPage.tsx  # Lista de productos con editar/eliminar
│       ├── ProductFormPage.tsx    # Alta y edición de producto (multipart/form-data)
│       └── CategoriesAdminPage.tsx# Alta, renombrado y eliminación de categorías
├── hooks/               # Hooks de TanStack Query (useProducts, useCategories + mutaciones)
├── stores/              # Zustand: cartStore (carrito) y authStore (sesión admin)
├── services/            # Cliente HTTP (api.ts) y servicios por recurso
├── types/               # Interfaces TypeScript que reflejan los DTOs del backend
├── utils/               # Helpers (formato de precios)
├── App.tsx              # Definición de rutas
└── main.tsx             # Entry point + QueryClientProvider
```

## Rutas

### Públicas (sin login)

| Ruta         | Descripción                                                        |
| ------------ | ------------------------------------------------------------------ |
| `/`          | Home: hero, productos destacados y acceso a categorías             |
| `/productos` | Catálogo completo con chips de filtro por categoría y búsqueda por nombre |

### Panel admin (protegidas por JWT)

| Ruta                           | Descripción                                      |
| ------------------------------ | ------------------------------------------------ |
| `/admin/login`                 | Login (usuario/contraseña del dueño)             |
| `/admin/productos`             | Lista de productos, editar y eliminar            |
| `/admin/productos/nuevo`       | Alta de producto con subida de imagen            |
| `/admin/productos/:id/editar`  | Edición de producto (imagen opcional)            |
| `/admin/categorias`            | Alta, renombrado y eliminación de categorías     |

## Notas sobre la integración con la API

- **Imágenes**: `POST`/`PUT /api/products` reciben `multipart/form-data`. La
  imagen va en el campo `Image` como archivo real (obligatoria al crear,
  opcional al editar). El formulario valida en el cliente tipo (JPG/PNG/WebP) y
  tamaño (máx. 2 MB) antes de enviar — las mismas reglas del backend.
- **Auth**: el JWT se guarda en `localStorage` y se envía como
  `Authorization: Bearer {token}` en las mutaciones. El logout es descartar el
  token (no hay endpoint de logout, por diseño del backend).
- **Slugs de categoría**: los genera siempre el backend; el frontend solo envía
  el nombre.
- **imageUrl**: es la URL pública final de Supabase Storage; se usa directo en
  los `<img>`, sin procesamiento adicional.

## Pendiente (features siguientes)

- Carrito → pedido por WhatsApp (el store del carrito ya existe en
  `src/stores/cartStore.ts`; falta el drawer y el armado del mensaje).
