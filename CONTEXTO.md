# CONTEXTO.md — Yerbas BM

# Proyecto Fullstack: Catálogo + Carrito + Pedido por WhatsApp

# Última actualización: 2026-07-29

---

## 1. INFORMACIÓN GENERAL

**Nombre del proyecto:** Yerbas BM  
**Tipo:** E-commerce de yerba mate y productos relacionados  
**Dueño del negocio:** Yerbas BM (emprendimiento)  
**Desarrollador:** Antonio Melino

**Repositorio GitHub:** `yerbas-bm`  
**Carpeta raíz:** `yerbas-bm/`

**Backend en producción (Railway):** `https://yerbas-bm-production.up.railway.app`  
**Frontend en producción (Vercel):** `https://yerbas-bm.vercel.app`

---

## 2. OBJETIVO DEL PROYECTO

Crear una página de venta de yerba mate y productos relacionados donde:

- Los clientes puedan ver el catálogo, filtrar por categorías y agregar productos al carrito.
- El pedido se envíe por WhatsApp (se abre WhatsApp con la lista de productos armada).
- No haya registro ni login de clientes.
- El dueño del emprendimiento pueda cargar productos, imágenes y precios desde un panel de administración propio.
- El diseño transmita sensación tradicional, rústica, gaucha — con la identidad visual del logo proporcionado.

**Fase actual:** MVP (sin pago online, sin registro de clientes).  
**Futuro:** Posible integración de pagos online (MercadoPago).

---

## 3. STACK TECNOLÓGICO

| Capa                           | Tecnología                                        |
| ------------------------------ | ------------------------------------------------- |
| **Backend**                    | .NET 8 Web API                                    |
| **Frontend**                   | React 18 + TypeScript + Vite                      |
| **Estilos**                    | Tailwind CSS                                      |
| **Estado global**              | Zustand                                           |
| **Datos (cliente)**            | TanStack Query (React Query)                      |
| **ORM**                        | Entity Framework Core                             |
| **Base de datos**              | PostgreSQL (Supabase)                             |
| **Almacenamiento de imágenes** | Supabase Storage                                  |
| **Auth admin**                 | Login propio (usuario/contraseña en backend .NET) |
| **Deploy backend**             | Railway                                           |
| **Deploy frontend**            | Vercel                                            |

---

## 4. ARQUITECTURA

### Backend (.NET 8) — Clean Architecture

```
YerbasBM.API/
├── Controllers/           # Endpoints REST
│   ├── ProductsController.cs
│   ├── CategoriesController.cs
│   └── AuthController.cs
├── Program.cs
└── appsettings.json

YerbasBM.Application/
├── DTOs/                  # Data Transfer Objects
├── Interfaces/            # Contratos (IProductService, etc.)
├── Services/              # Lógica de negocio
└── Mappings/              # AutoMapper profiles

YerbasBM.Domain/
├── Entities/              # Entidades puras (Product, Category, AdminUser)
└── Enums/                 # Enumeraciones

YerbasBM.Infrastructure/
├── Data/                  # DbContext, migrations
├── Repositories/          # Implementaciones de acceso a datos
└── Services/              # Servicios externos (Supabase Storage)
```

### Frontend (React + TypeScript) — Feature-based

```
src/
├── components/            # Componentes reutilizables
│   ├── Navbar.tsx         # Navbar público (fijo, oscuro con blur, logo BM, carrito)
│   ├── Footer.tsx         # Footer público (marca, navegación, contacto)
│   ├── ProductCard.tsx    # Tarjeta de producto — click abre ProductModal
│   ├── ProductModal.tsx   # Modal de detalle con selector de cantidad
│   ├── CartDrawer.tsx     # Drawer lateral del carrito + pedido por WhatsApp
│   ├── Toast.tsx          # Notificación flotante (confirmaciones)
│   ├── Spinner.tsx        # Indicador de carga
│   ├── PublicLayout.tsx   # Marco de páginas públicas
│   └── AdminLayout.tsx    # Marco del panel admin + guarda de sesión
├── pages/
│   ├── HomePage.tsx       # Hero, categorías, destacados, nosotros, CTA WhatsApp
│   ├── ProductsPage.tsx   # Catálogo con filtros y búsqueda
│   └── admin/
│       ├── LoginPage.tsx          # Login del admin
│       ├── ProductsAdminPage.tsx  # Lista de productos con editar/eliminar
│       ├── ProductFormPage.tsx    # Alta/edición de producto (multipart)
│       └── CategoriesAdminPage.tsx# Gestión de categorías
├── hooks/                 # TanStack Query hooks (useProducts, useCategories)
├── stores/                # Zustand: cartStore, authStore, uiStore
├── services/              # Cliente HTTP y servicios por recurso
├── types/                 # TypeScript interfaces (DTOs del backend)
├── utils/                 # Helpers (formatPrice, buildWhatsAppUrl)
├── App.tsx                # Definición de rutas
└── main.tsx               # Entry point + QueryClientProvider
```

**Assets públicos:** imágenes estáticas del sitio (hero, sección nosotros, CTA) en `public/assets/`.

---

## 5. MODELO DE DATOS (PostgreSQL / Supabase)

### Tabla: `categories`

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Categorías iniciales:**

```sql
INSERT INTO categories (name, slug) VALUES
('Yerba Mate', 'yerba-mate'),
('Mate', 'mate'),
('Termos', 'termos'),
('Bombillas', 'bombillas'),
('Canastas', 'canastas'),
('Yerberos', 'yerberos'),
('Accesorios', 'accesorios');
```

### Tabla: `products`

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    category_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: `admin_users`

```sql
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Notas:**

- Las categorías se crean dinámicamente desde el panel admin (no son enum fijo).
- Cada producto tiene un precio fijo (no hay variaciones por presentación).
- `is_active` permite ocultar productos sin borrarlos.
- `is_featured` para destacar productos en la home.

---

## 6. CONTRATO DE API (Endpoints REST)

### Productos

| Método | Endpoint                        | Descripción                        |
| ------ | ------------------------------- | ---------------------------------- |
| GET    | `/api/products`                 | Listar todos los productos activos |
| GET    | `/api/products?category={slug}` | Filtrar por categoría              |
| GET    | `/api/products/{id}`            | Detalle de un producto             |
| POST   | `/api/products`                 | Crear producto (admin, requiere JWT) |
| PUT    | `/api/products/{id}`            | Actualizar producto (admin, requiere JWT) |
| DELETE | `/api/products/{id}`            | Eliminar producto (admin, requiere JWT) |

### Categorías

| Método | Endpoint               | Descripción                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/api/categories`      | Listar todas las categorías  |
| POST   | `/api/categories`      | Crear categoría (admin, requiere JWT) |
| PUT    | `/api/categories/{id}` | Actualizar categoría (admin, requiere JWT) |
| DELETE | `/api/categories/{id}` | Eliminar categoría (admin, requiere JWT) |

### Autenticación (Admin)

| Método | Endpoint           | Descripción     | Estado |
| ------ | ------------------ | --------------- | ------ |
| POST   | `/api/auth/login`  | Login del dueño. Devuelve un JWT (`token`, `expiresAtUtc`, `username`) que se envía como `Authorization: Bearer {token}` en las rutas de admin. | Implementado |
| POST   | `/api/auth/logout` | No aplica: al ser JWT stateless, el "logout" es del lado del cliente (descartar el token guardado en `localStorage`). | No implementado (por diseño) |

### Sistema

| Método | Endpoint      | Descripción                                                                                                 |
| ------ | ------------- | -------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/health` | Chequeo de salud de la API (no depende de la base de datos). Implementado en el setup inicial del backend. |

### DTOs principales

```typescript
// ProductDto
interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  isFeatured: boolean;
}

// CreateProductDto
interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image: File; // se sube a Supabase Storage
}

// CategoryDto
interface CategoryDto {
  id: string;
  name: string;
  slug: string;
}

// LoginDto
interface LoginDto {
  username: string;
  password: string;
}
```

---

## 7. DISEÑO Y EXPERIENCIA DE USUARIO (UX/UI)

### Identidad visual

- **Logo:** Proporcionado por el cliente (imagen con "BM", mate, yerba, bombilla).
- **Sensación:** Tradicional, rústica, gaucha — madera, mate, naturaleza.
- **Estilo:** Orgánico, cálido, auténtico.

### Paleta de colores (extraída del logo)

| Color              | Hex       | Uso                                |
| ------------------ | --------- | ---------------------------------- |
| **Negro profundo** | `#120f09` | Fondos oscuros, textos principales |
| **Verde oscuro**   | `#282311` | Fondos alternativos, navbar        |
| **Verde bosque**   | `#3f3b1a` | Tarjetas, contenedores             |
| **Oliva**          | `#595526` | Bordes, separadores                |
| **Verde yerba**    | `#757132` | Acentos, botones secundarios       |
| **Verde dorado**   | `#958e43` | Hover states                       |
| **Lima mate**      | `#bdb062` | Destacados, etiquetas              |
| **Crema**          | `#ebd792` | Fondos claros, textos sobre oscuro |
| **WhatsApp**       | `#25d366` | Botón de pedido por WhatsApp       |

### Tipografía

- **Títulos / Display:** `Cinzel Decorative` (Google Fonts) — Serif elegante con carácter artesanal y tradicional.
- **Cuerpo / UI:** `Inter` (Google Fonts) — Sans-serif moderna, legible, ideal para mobile.
- **Alternativa de títulos:** `Playfair Display` (más sobria que Cinzel Decorative).

**Importación:**

```css
@import url("https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap");
```

**Config Tailwind:**

```js
// tailwind.config.js
fontFamily: {
  display: ['Cinzel Decorative', 'Playfair Display', 'serif'],
  body: ['Inter', 'sans-serif'],
}
```

### Estructura de páginas

#### Home (`/`)

- **Hero:** Pantalla completa con imagen de fondo rústica, gradientes oscuros, logo BM, slogan y botones a catálogo/WhatsApp.
- **Categorías:** Chips que navegan al catálogo filtrado.
- **Productos destacados:** Grid de productos marcados como `isFeatured`.
- **Nosotros:** Imagen del mate imperial, historia de la marca y datos destacados (artesanal, envíos).
- **CTA WhatsApp:** Franja con imagen de fondo y botón para abrir el carrito.

#### Catálogo (`/productos`)

- **Filtros arriba:** Chips por categoría (sincronizados con `?categoria={slug}`).
- **Búsqueda:** Campo de búsqueda por nombre en el cliente.
- **Grid de productos:** Tarjetas con imagen, categoría, nombre, descripción, precio y badge de destacado.

#### Modal de producto

- Al hacer click en una tarjeta se abre un **modal** (no página aparte) con:
  - Imagen grande
  - Categoría, nombre, descripción, precio
  - Selector de cantidad (limitado al stock)
  - Botón "Agregar al carrito"
- Al agregar, se cierra el modal y se abre el drawer del carrito (feedback inmediato).

#### Carrito (Drawer lateral)

- Se desliza desde la **derecha**.
- Lista de ítems con imagen, cantidad (+/−), subtotal y quitar ítem.
- Campo opcional para el nombre del cliente.
- Total y botón "Hacer pedido por WhatsApp" (verde prominente).
- Al hacer click, arma el mensaje y abre `https://wa.me/{numero}?text={mensaje}`.

#### Panel Admin (protegido por login)

- `/admin/login` — Login del dueño (usuario/contraseña, JWT en `localStorage`).
- `/admin/productos` — Tabla de productos con editar y eliminar; en mobile se muestra como tarjetas apiladas para evitar scroll horizontal.
- `/admin/productos/nuevo` — Formulario multipart para crear producto (imagen obligatoria).
- `/admin/productos/:id/editar` — Edición de producto (imagen opcional).
- `/admin/categorias` — Alta, renombrado inline y eliminación de categorías.
- **Responsive:** el panel admin usa menú hamburguesa en mobile, formularios apilados y botones táctiles; el dueño puede cargar y editar productos desde su celular.

### Responsive

- **Mobile-first:** La mayoría del público compra desde celular.
- El panel admin también debe ser usable desde celular (el dueño carga productos desde su móvil).

### Animaciones

- Transiciones suaves en tarjetas (hover: elevación, sombra).
- Fade-in en carga de productos.
- Slide del drawer del carrito.
- Transiciones suaves en modales.

### Footer

- Redes sociales: Instagram
- Número de WhatsApp del negocio
- Crédito: "Desarrollado por Antonio Melino"

---

## 8. FLUJO DEL CARRITO → WHATSAPP

```
1. Cliente agrega productos al carrito (Zustand + localStorage)
2. Abre el drawer del carrito
3. Revisa productos, puede modificar cantidades o eliminar
4. Click "Hacer pedido por WhatsApp"
5. Frontend genera mensaje formateado:

   "¡Hola Yerbas BM! Quiero hacer un pedido:

   - Yerba Taragüi 1kg x2 = $8000
   - Mate Imperial de Alpaca x1 = $15000

   Total: $23000

   Mi nombre: [opcional, se puede pedir en el drawer]"

6. Abre: https://wa.me/5491151225690?text={mensaje_codificado}
7. WhatsApp Web o App se abre con el mensaje listo para enviar
```

**Número de WhatsApp (testing):** `+54 9 1151225690`  
**Nota:** Este número es para testing. El dueño lo cambiará al número real del negocio antes del lanzamiento.

---

## 9. ALMACENAMIENTO DE IMÁGENES

- **Servicio:** Supabase Storage
- **Bucket:** `product-images`
- **Flujo:**
  1. Dueño sube imagen desde el panel admin (`POST`/`PUT /api/products` con `multipart/form-data`, campo `Image`; obligatorio al crear, opcional al actualizar — si no se envía, se conserva la imagen actual).
  2. Backend valida tamaño/formato, sube el archivo a Supabase Storage con un nombre único (GUID) y `Content-Type` explícito.
  3. Supabase devuelve URL pública.
  4. Backend guarda la URL en `products.image_url`.
- **Validación del archivo (backend):** máximo 2 MB, formatos JPG/PNG/WebP. Se valida el `Content-Type` declarado y también los primeros bytes del archivo (magic bytes), para no confiar ciegamente en lo que manda el cliente. El frontend debería validar lo mismo antes de subir, para dar feedback inmediato al dueño.
- **Límites:** Plan gratuito de Supabase incluye 1 GB de almacenamiento — suficiente para <30 productos.

---

## 10. AUTENTICACIÓN (Solo Admin)

- **No hay registro de clientes.**
- **Solo un usuario admin:** el dueño del emprendimiento.
- **Mecanismo:** JWT (JSON Web Tokens) generados en el backend .NET.
- **Almacenamiento:** Token guardado en `localStorage` del navegador.
- **Protección:** Middleware en .NET que verifica JWT en rutas `/api/admin/*`.
- **Contraseña:** Hasheada con bcrypt/argon2 en la base de datos.

---

## 11. DECISIONES PENDIENTES

| #   | Decisión                                                             | Estado                              |
| --- | -------------------------------------------------------------------- | ----------------------------------- |
| 1   | Imágenes del hero (¿usar foto propia o stock?)                       | Resuelto: se usan assets del preview visual (`public/assets/hero.jpg`, `canasta.jpg`, `mate-imperial.jpg`) hasta conseguir fotos propias. |
| 2   | ¿El dueño necesita ver historial de pedidos?                         | PENDIENTE (por ahora solo WhatsApp) |
| 3   | Cambiar número de WhatsApp al real del negocio antes del lanzamiento | PENDIENTE                           |
| 4   | Rate limiting / lockout en `POST /api/auth/login` (hoy sin throttling) | PENDIENTE (bajo riesgo, un solo admin) |
| 5   | Timing side-channel en `AuthService.LoginAsync` (permite enumerar el username por latencia) | PENDIENTE (bajo riesgo, mismo motivo) |
| 6   | Al borrar un producto o reemplazar su imagen, el archivo viejo no se borra de Supabase Storage (queda huérfano) | PENDIENTE (bajo riesgo, solo ocupa espacio del plan gratuito) |

---

## 12. ROLES DE LAS IAs

### Claude Code — Backend (.NET)

- Arquitectura Clean Architecture.
- API REST con Entity Framework Core.
- Autenticación JWT.
- Integración con Supabase (PostgreSQL + Storage).
- Tests unitarios.

### Kimi AI — Frontend (React + TypeScript)

- Diseño UI/UX según especificaciones de este documento.
- Componentes con Tailwind CSS.
- Estado global con Zustand (carrito).
- Integración con API REST.
- Responsive mobile-first.
- Panel de administración.

---

## 13. NOTAS PARA EL DESARROLLO

### Variables de entorno (frontend `.env`)

```
VITE_API_URL=https://yerbas-bm-api.railway.app/api
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
VITE_WHATSAPP_NUMBER=5491151225690
```

### Variables de entorno (backend `appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=xxxx.supabase.co;Database=postgres;..."
  },
  "Jwt": {
    "Key": "super-secret-key",
    "Issuer": "YerbasBM",
    "Audience": "YerbasBM"
  },
  "Supabase": {
    "Url": "https://xxxx.supabase.co",
    "ServiceKey": "xxxx"
  },
  "Cors": {
    "AllowedOrigins": ["https://yerbas-bm.vercel.app"]
  }
}
```

**Nota sobre CORS:** sin al menos un origen en `Cors:AllowedOrigins` (o la variable de entorno `Cors__AllowedOrigins__0` en Railway), el frontend deployado no puede llamar a la API — el backend no habilita ningún origen por defecto (fail-closed). Hay que configurarlo con la URL final de Vercel antes de que el frontend en producción funcione.

---

## 14. CRONOGRAMA ESTIMADO

| Fase | Tarea                                            | Días estimados |
| ---- | ------------------------------------------------ | -------------- |
| 1    | Setup repos, .NET API, React+Vite, Supabase      | 1-2            |
| 2    | Modelo de datos, EF Core, migrations             | 1              |
| 3    | API Backend (productos, categorías, auth)        | 2-3            |
| 4    | Frontend público (home, catálogo, producto)      | 2-3            |
| 5    | Carrito + WhatsApp                               | 1-2            |
| 6    | Panel Admin (CRUD productos, subida de imágenes) | 2-3            |
| 7    | Deploy (Railway + Vercel)                        | 1              |
|      | **Total**                                        | **10-15 días** |

---

## 15. ESTÁNDAR DE DOCUMENTACIÓN (obligatorio — Claude y Kimi)

Ambas IAs deben documentar todo lo que construyan, de forma que cualquiera (incluido Antonio) entienda qué hace cada cosa sin tener que leer el código línea por línea.

### Qué se documenta y dónde

1. **Comentarios en el código**, en cada función/método/componente no trivial:
   - Qué hace (propósito, en 1-2 líneas).
   - Qué recibe y qué devuelve (parámetros, tipos, valor de retorno).
   - Cualquier decisión no obvia (por qué se hizo así y no de otra forma).
   - En backend (.NET): comentarios XML (`/// <summary>...</summary>`) en controllers, services e interfaces.
   - En frontend (React/TS): comentario corto arriba de cada componente/hook explicando su rol, y tipado explícito de props.

2. **Un archivo `CHANGELOG.md`** en la raíz del proyecto, actualizado por cada IA después de cada feature terminada, con este formato:

   ```
   ## [Fecha] - Feature: <nombre>
   - Rama: feature/nombre-rama
   - Qué se hizo: <descripción breve>
   - Archivos principales afectados: <lista>
   - Autor: Claude / Kimi
   ```

3. **Un `README.md` por carpeta principal** (`backend/README.md` y `frontend/README.md`) que se mantiene actualizado con:
   - Cómo levantar el proyecto localmente (instalación, variables de entorno, comandos).
   - Estructura de carpetas y para qué sirve cada una.
   - Endpoints disponibles (backend) o páginas/rutas disponibles (frontend).

4. **Este mismo `CONTEXTO.md`** se actualiza cada vez que se agrega o cambia algo estructural (nuevo endpoint, nueva tabla, nueva decisión de diseño) — ver sección 16.

### Nivel de detalle esperado

- Explicar el **qué** y el **por qué**, no solo repetir en palabras lo que el código ya dice.
- Pensado para que Antonio (o cualquiera que retome el proyecto) entienda la lógica sin tener que preguntarle a la IA que lo escribió.

---

## 16. FLUJO DE TRABAJO CON GIT (obligatorio — Claude y Kimi)

Ambas IAs trabajan sobre el mismo repositorio remoto de GitHub (`yerbas-bm`), cada una dentro de su carpeta (`backend/` o `frontend/`), siguiendo siempre este flujo:

### Estructura de ramas

```
main                  ← rama estable, solo código probado y funcionando
└── develop           ← rama de integración, se crea una sola vez a partir de main
    └── feature/*      ← una rama nueva por cada cambio/agregado/borrado
```

### Paso a paso para CADA cambio (feature, fix, borrado, etc.)

1. Antes de empezar, actualizar `develop` local:

   ```bash
   git checkout develop
   git pull origin develop
   ```

2. Crear una rama nueva desde `develop`, con nombre descriptivo:

   ```bash
   git checkout -b feature/nombre-del-cambio
   ```

   Ejemplos de nombres: `feature/products-crud`, `feature/cart-drawer`, `fix/login-validation`, `feature/whatsapp-message-format`.

3. Desarrollar el cambio **solo dentro de esa rama**, con commits chicos y descriptivos (en inglés, según la convención ya usada en otros proyectos).

4. Documentar el cambio (ver sección 15): comentarios en código + entrada en `CHANGELOG.md`.

5. **Testeo antes de mergear:**
   - La IA correspondiente prueba que la funcionalidad ande (casos normales y algún caso límite).
   - Antonio también prueba manualmente el cambio.
   - Si falla algo, se corrige en la misma rama `feature/*` antes de continuar.

6. Una vez aprobado, mergear la rama a `develop`:

   ```bash
   git checkout develop
   git pull origin develop
   git merge feature/nombre-del-cambio
   git push origin develop
   ```

7. **Último test sobre `develop`** (con el cambio ya integrado a todo lo demás), para confirmar que no rompió nada existente.

8. Si ese test final es exitoso, mergear `develop` a `main`:

   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

9. Actualizar `CONTEXTO.md` con los cambios estructurales que correspondan (nuevos endpoints, nuevas tablas, nuevas decisiones), y commitear ese cambio también en `develop` → `main` siguiendo el mismo flujo.

10. **Borrar la rama `feature/*`** ya mergeada, tanto local como remota:
    ```bash
    git branch -d feature/nombre-del-cambio
    git push origin --delete feature/nombre-del-cambio
    ```

### Reglas importantes

- Nunca se trabaja directamente sobre `main` ni sobre `develop` — todo cambio pasa por una rama `feature/*`.
- `main` y `develop` deben quedar siempre actualizados y sincronizados con el remoto de GitHub al final de cada ciclo.
- Si Claude (backend) y Kimi (frontend) están trabajando en cambios relacionados al mismo tiempo (ej. un nuevo endpoint + la pantalla que lo consume), cada una crea su propia rama `feature/*` dentro de su carpeta, y ambas se coordinan a través de este documento antes de mergear, para asegurar que el contrato de API siga siendo el mismo de la sección 6.

---

_Documento elaborado por Kimi AI y Claude Code para el proyecto Yerbas BM._
_Desarrollador: Antonio Melino_
