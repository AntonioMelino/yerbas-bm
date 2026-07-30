# Yerbas BM

E-commerce de yerba mate y productos relacionados: catálogo, carrito y pedido por WhatsApp, con panel de administración propio para el dueño del emprendimiento.

**🔗 Demo en vivo:** [yerbas-bm.vercel.app](https://yerbas-bm.vercel.app/)

> Toda la documentación de arquitectura, modelo de datos, contrato de API, diseño y flujo de trabajo está en [`CONTEXTO.md`](./CONTEXTO.md). Este README es solo la puerta de entrada rápida al proyecto.

---

## Estructura del repositorio

```
yerbas-bm/
├── backend/        # .NET 8 Web API (Clean Architecture)
├── frontend/       # React + TypeScript + Vite
├── CONTEXTO.md     # Documento maestro del proyecto (leer primero)
├── CHANGELOG.md    # Historial de cambios por feature
└── README.md       # Este archivo
```

Cada carpeta principal (`backend/`, `frontend/`) tiene su propio `README.md` con instrucciones específicas de instalación y estructura interna.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | .NET 8 Web API + Entity Framework Core |
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Estado global | Zustand |
| Datos (cliente) | TanStack Query |
| Base de datos | PostgreSQL (Supabase) |
| Almacenamiento de imágenes | Supabase Storage |
| Deploy backend | Railway |
| Deploy frontend | Vercel |

**Estado:** deployado y funcionando en producción (backend en Railway conectado a Supabase vía connection pooler, frontend en Vercel).

---

## Cómo levantar el proyecto localmente

### Backend
```bash
cd backend
dotnet restore
dotnet run
```
Variables de entorno necesarias: ver `backend/README.md`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Variables de entorno necesarias: ver `frontend/README.md` (`.env` con `VITE_API_URL`, `VITE_SUPABASE_URL`, etc.).

---

## Flujo de trabajo

Este proyecto sigue un flujo Git con rama `main` (estable), `develop` (integración) y ramas `feature/*` por cada cambio. El detalle completo, paso a paso, está en la sección 16 de [`CONTEXTO.md`](./CONTEXTO.md).

Toda función o cambio debe documentarse (comentarios en código + entrada en `CHANGELOG.md`) según la sección 15 de `CONTEXTO.md`.

---

## Roles de desarrollo

- **Backend (.NET):** desarrollado con Claude Code.
- **Frontend (React/TS):** desarrollado con Kimi AI.

---

*Desarrollado por Antonio Melino.*
