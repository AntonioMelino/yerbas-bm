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

**Importante para deploys en la nube (Railway u otros):** usá el **connection pooler** de Supabase (`Project Settings → Database → Connection string → Session pooler`, host `aws-0-<region>.pooler.supabase.com`, usuario `postgres.<project-ref>`), no la conexión directa (`db.xxxx.supabase.co`). La conexión directa de Supabase resuelve solo por IPv6, y plataformas como Railway no tienen salida IPv6 — la conexión falla con `Network is unreachable` sin llegar a intentar el handshake. En desarrollo local esto no pasa (la mayoría de los ISPs sí dan salida IPv6), así que el síntoma solo aparece al deployar.

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

### Crear el primer admin

No hay endpoint de registro (solo existe un admin — el dueño del emprendimiento, sección 10 de CONTEXTO.md). Para crearlo, configurá `Seed:AdminUsername`/`Seed:AdminPassword` (user-secrets o variables de entorno) y arrancá la API una vez con la base ya migrada: si la tabla `admin_users` está vacía, `AdminUserSeeder` crea el usuario con la contraseña hasheada (bcrypt) y no vuelve a correr en los arranques siguientes.

```bash
cd YerbasBM.API
dotnet user-secrets set "Seed:AdminUsername" "antonio"
dotnet user-secrets set "Seed:AdminPassword" "una-contraseña-fuerte"
dotnet run --project ../YerbasBM.API
```

Después de confirmar que el login funciona, se recomienda borrar esas dos entradas de user-secrets (o desconfigurar las variables de entorno) para que no queden credenciales en texto plano dando vueltas.

---

## Variables de entorno

| Variable                                          | Dónde se usa                | Descripción                                                                                    |
| -------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `ConnectionStrings__DefaultConnection`             | `Program.cs`                 | Connection string a PostgreSQL (Supabase). Formato Npgsql.                                       |
| `Jwt__Key`                                         | Autenticación admin (JWT)     | Clave secreta para firmar/validar los tokens (mínimo 32 bytes / 256 bits, si no `AuthController` la rechaza). Sin configurar, el login queda deshabilitado (el resto de la API sigue funcionando) y se loguea un warning al arrancar. |
| `Jwt__Issuer`, `Jwt__Audience`, `Jwt__ExpirationMinutes` | Autenticación admin (JWT) | Issuer/audience del token y minutos de validez (default 480 = 8hs). Tienen valores por defecto en `appsettings.json`. |
| `Seed__AdminUsername`, `Seed__AdminPassword`       | Bootstrap del admin           | Credenciales del único admin, usadas solo una vez si `admin_users` está vacía (ver "Crear el primer admin"). |
| `Supabase__Url`, `Supabase__ServiceKey`             | Subida de imágenes (a implementar) | Acceso a Supabase Storage para las imágenes de productos.                                   |
| `Cors__AllowedOrigins__0`, `Cors__AllowedOrigins__1`, ... | CORS (frontend en otro dominio) | Orígenes autorizados a llamar a la API desde el navegador (ej. la URL de Vercel en producción). Sin ninguno configurado, la policy no habilita ningún origen (fail-closed) y se loguea un warning al arrancar. En desarrollo, `appsettings.Development.json` ya trae `http://localhost:5173` (dev server de Vite). |

`__` (doble guion bajo) es el separador que usa .NET para mapear variables de entorno a secciones anidadas de `appsettings.json` (ej. `ConnectionStrings__DefaultConnection` → `ConnectionStrings:DefaultConnection`).

---

## Estructura de carpetas (Clean Architecture)

```
backend/
├── YerbasBM.sln                    # Solución
├── YerbasBM.API/                   # Capa de presentación
│   ├── Controllers/                 # Endpoints REST (HealthController, CategoriesController, ProductsController, AuthController)
│   ├── Program.cs                   # Composición de servicios y pipeline HTTP (incluye auth JWT, CORS y el seed del admin)
│   └── appsettings.json             # Configuración (sin secretos)
├── YerbasBM.Application/            # Casos de uso / lógica de negocio
│   ├── DTOs/                        # Data Transfer Objects (Category*, Product*, Login*)
│   ├── Interfaces/                  # Contratos (ICategoryRepository/Service, IProductRepository/Service, IAuthService, IAdminUserRepository, ITokenGenerator)
│   ├── Services/                    # Implementación de la lógica de negocio (CategoryService, ProductService, AuthService)
│   └── Common/                      # Utilidades compartidas (SlugGenerator)
├── YerbasBM.Domain/                 # Núcleo del dominio, sin dependencias externas
│   ├── Entities/                    # Category, Product, AdminUser
│   └── Enums/                       # Enumeraciones (a agregar según se necesiten)
└── YerbasBM.Infrastructure/         # Detalles de infraestructura
    ├── Data/                        # DbContext (YerbasBMDbContext), Migrations y AdminUserSeeder
    ├── Repositories/                # Implementaciones de acceso a datos (CategoryRepository, ProductRepository, AdminUserRepository)
    └── Services/                    # Servicios externos: JwtTokenGenerator, SupabaseProductImageStorage
```

**Regla de dependencias:** `Domain` no depende de nada. `Application` depende de `Domain`. `Infrastructure` depende de `Application` y `Domain`. `API` depende de `Application` e `Infrastructure`. Esto permite cambiar la base de datos o servicios externos sin tocar la lógica de negocio.

---

## Endpoints disponibles

| Método | Endpoint                | Auth   | Descripción                                                    |
| ------ | ------------------------ | ------ | --------------------------------------------------------------- |
| GET    | `/api/health`            | No     | Chequeo de salud de la API (no depende de la base de datos).    |
| POST   | `/api/auth/login`        | No     | Login del admin. Devuelve el JWT (`token`, `expiresAtUtc`, `username`) si las credenciales son correctas. |
| GET    | `/api/categories`        | No     | Lista todas las categorías.                                     |
| POST   | `/api/categories`        | **Sí** | Crea una categoría (el slug se genera automáticamente del nombre). |
| PUT    | `/api/categories/{id}`   | **Sí** | Actualiza el nombre de una categoría (regenera el slug si cambia). |
| DELETE | `/api/categories/{id}`   | **Sí** | Elimina una categoría.                                          |
| GET    | `/api/products`          | No     | Lista los productos activos. Acepta `?category={slug}` para filtrar. |
| GET    | `/api/products/{id}`     | No     | Devuelve el detalle de un producto.                             |
| POST   | `/api/products`          | **Sí** | Crea un producto. `multipart/form-data`: campos del producto + `Image` (JPG/PNG/WebP, máx. 2 MB, obligatoria). Se sube a Supabase Storage antes de guardar el producto. |
| PUT    | `/api/products/{id}`     | **Sí** | Actualiza un producto, incluyendo `isActive`/`isFeatured`. `multipart/form-data`; `Image` es opcional (si no se envía, se conserva la imagen actual). |
| DELETE | `/api/products/{id}`     | **Sí** | Elimina un producto (no borra la imagen del bucket — ver decisión pendiente #6 en CONTEXTO.md). |

Los endpoints marcados con auth **Sí** requieren el header `Authorization: Bearer {token}` obtenido de `/api/auth/login`; sin él (o con un token inválido/expirado) devuelven `401 Unauthorized`.

---

## Modelo de datos

Ver sección 5 de [`../CONTEXTO.md`](../CONTEXTO.md). La migration inicial (`YerbasBM.Infrastructure/Data/Migrations/*_InitialCreate.cs`) crea las tablas `categories`, `products` y `admin_users` con los mismos nombres de columna (snake_case) del esquema SQL de Supabase.
