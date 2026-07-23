# CHANGELOG.md — Yerbas BM

## [2026-07-22] - Feature: backend-initial-setup
- Rama: feature/backend-initial-setup
- Qué se hizo: Setup inicial del backend .NET 8 con Clean Architecture (proyectos API, Application, Domain, Infrastructure). Se configuró Entity Framework Core con Npgsql (PostgreSQL/Supabase), se crearon las entidades `Category`, `Product` y `AdminUser` según el modelo de datos de la sección 5 de CONTEXTO.md, y se generó la migration inicial (`InitialCreate`) que crea las tablas `categories`, `products` y `admin_users`. Se agregó un endpoint de salud (`GET /api/health`) y se verificó que el proyecto levanta y responde localmente.
- Archivos principales afectados: `backend/YerbasBM.sln`, `backend/YerbasBM.API/Program.cs`, `backend/YerbasBM.API/Controllers/HealthController.cs`, `backend/YerbasBM.Domain/Entities/*.cs`, `backend/YerbasBM.Infrastructure/Data/YerbasBMDbContext.cs`, `backend/YerbasBM.Infrastructure/Data/Migrations/*_InitialCreate.cs`, `backend/README.md`, `backend/.gitignore`
- Autor: Claude
