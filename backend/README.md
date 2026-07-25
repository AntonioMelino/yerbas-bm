# YerbasBM Backend — .NET 8 Web API

API REST para el e-commerce de Yerbas BM. Sigue Clean Architecture (ver sección 4 de [`../CONTEXTO.md`](../CONTEXTO.md)) y expone el contrato definido en la sección 6 del mismo documento.

---

## Requisitos previos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Una base de datos PostgreSQL (proyecto de [Supabase](https://supabase.com) en producción; puede usarse cualquier Postgres local para desarrollar)
- (Opcional) [`dotnet-ef`](https://learn.microsoft.com/ef/core/cli/dotnet) como herramienta global, para correr migrations:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

## Instalación y arranque local

```bash
cd backend
dotnet restore
```

### Configurar la connection string

La connection string a PostgreSQL **no se commitea** (queda vacía en `appsettings.json`). Configurala localmente con user-secrets o una variable de entorno:

```bash
# Opción A: User Secrets (recomendado en desarrollo)
cd YerbasBM.API
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=xxxx.supabase.co;Database=postgres;Username=postgres;Password=xxxx;Port=5432;SSL Mode=Require;Trust Server Certificate=true"

# Opción B: Variable de entorno (Railway, CI, etc.)
export ConnectionStrings__DefaultConnection="Host=xxxx.supabase.co;Database=postgres;Username=postgres;Password=xxxx;Port=5432;SSL Mode=Require;Trust Server Certificate=true"
```

### Aplicar las migrations

```bash
dotnet ef database update --project YerbasBM.Infrastructure --startup-project YerbasBM.API
```

### Levantar la API

```bash
dotnet run --project YerbasBM.API
```

Por defecto queda escuchando en `http://localhost:5035` (ver `YerbasBM.API/Properties/launchSettings.json`). Con `ASPNETCORE_ENVIRONMENT=Development` (default), Swagger UI queda disponible en `/swagger`.

### Verificar que levantó bien

```bash
curl http://localhost:5035/api/health
# {"status":"ok","timestampUtc":"..."}
```

---

## Variables de entorno

| Variable                                     | Dónde se usa                          | Descripción                                                                 |
| --------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| `ConnectionStrings__DefaultConnection`        | `Program.cs`                           | Connection string a PostgreSQL (Supabase). Formato Npgsql.                   |
| `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience`     | Autenticación admin (a implementar)     | Configuración del JWT para el login del panel admin (sección 10 de CONTEXTO.md). |
| `Supabase__Url`, `Supabase__ServiceKey`       | Subida de imágenes (a implementar)      | Acceso a Supabase Storage para las imágenes de productos.                    |

`__` (doble guion bajo) es el separador que usa .NET para mapear variables de entorno a secciones anidadas de `appsettings.json` (ej. `ConnectionStrings__DefaultConnection` → `ConnectionStrings:DefaultConnection`).

---

## Estructura de carpetas (Clean Architecture)

```
backend/
├── YerbasBM.sln                    # Solución
├── YerbasBM.API/                   # Capa de presentación
│   ├── Controllers/                 # Endpoints REST (HealthController, CategoriesController, ProductsController, y a futuro Auth)
│   ├── Program.cs                   # Composición de servicios y pipeline HTTP
│   └── appsettings.json             # Configuración (sin secretos)
├── YerbasBM.Application/            # Casos de uso / lógica de negocio
│   ├── DTOs/                        # Data Transfer Objects (Category*, Product*, y a agregar por feature)
│   ├── Interfaces/                  # Contratos (ICategoryRepository/Service, IProductRepository/Service, y a futuro Auth)
│   ├── Services/                    # Implementación de la lógica de negocio (CategoryService, ProductService, y a futuro Auth)
│   └── Common/                      # Utilidades compartidas (SlugGenerator)
├── YerbasBM.Domain/                 # Núcleo del dominio, sin dependencias externas
│   ├── Entities/                    # Category, Product, AdminUser
│   └── Enums/                       # Enumeraciones (a agregar según se necesiten)
└── YerbasBM.Infrastructure/         # Detalles de infraestructura
    ├── Data/                        # DbContext (YerbasBMDbContext) y Migrations
    ├── Repositories/                # Implementaciones de acceso a datos (CategoryRepository, ProductRepository, y a futuro Auth)
    └── Services/                    # Servicios externos, ej. Supabase Storage (a agregar)
```

**Regla de dependencias:** `Domain` no depende de nada. `Application` depende de `Domain`. `Infrastructure` depende de `Application` y `Domain`. `API` depende de `Application` e `Infrastructure`. Esto permite cambiar la base de datos o servicios externos sin tocar la lógica de negocio.

---

## Endpoints disponibles

| Método | Endpoint                | Descripción                                                    |
| ------ | ------------------------ | --------------------------------------------------------------- |
| GET    | `/api/health`            | Chequeo de salud de la API (no depende de la base de datos).    |
| GET    | `/api/categories`        | Lista todas las categorías.                                     |
| POST   | `/api/categories`        | Crea una categoría (el slug se genera automáticamente del nombre). |
| PUT    | `/api/categories/{id}`   | Actualiza el nombre de una categoría (regenera el slug si cambia). |
| DELETE | `/api/categories/{id}`   | Elimina una categoría.                                          |
| GET    | `/api/products`          | Lista los productos activos. Acepta `?category={slug}` para filtrar. |
| GET    | `/api/products/{id}`     | Devuelve el detalle de un producto.                             |
| POST   | `/api/products`          | Crea un producto (`imageUrl` se recibe como texto; la subida a Supabase Storage queda pendiente). |
| PUT    | `/api/products/{id}`     | Actualiza un producto, incluyendo `isActive`/`isFeatured`.       |
| DELETE | `/api/products/{id}`     | Elimina un producto.                                            |

El resto de los endpoints (autenticación admin — sección 6 de `CONTEXTO.md`) se implementan en features siguientes, cada uno en su propia rama `feature/*`.

---

## Modelo de datos

Ver sección 5 de [`../CONTEXTO.md`](../CONTEXTO.md). La migration inicial (`YerbasBM.Infrastructure/Data/Migrations/*_InitialCreate.cs`) crea las tablas `categories`, `products` y `admin_users` con los mismos nombres de columna (snake_case) del esquema SQL de Supabase.
