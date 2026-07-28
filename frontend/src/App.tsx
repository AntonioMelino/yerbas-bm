// Definición de rutas de la app.
// - Públicas (PublicLayout con Navbar/Footer): home y catálogo.
// - /admin/login: pantalla de login del panel.
// - /admin/* (AdminLayout, protegidas por JWT): CRUD de productos y categorías.

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import AdminLayout from './components/AdminLayout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import LoginPage from './pages/admin/LoginPage'
import ProductsAdminPage from './pages/admin/ProductsAdminPage'
import ProductFormPage from './pages/admin/ProductFormPage'
import CategoriesAdminPage from './pages/admin/CategoriesAdminPage'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/productos', element: <ProductsPage /> },
    ],
  },
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/productos" replace /> },
      { path: 'productos', element: <ProductsAdminPage /> },
      { path: 'productos/nuevo', element: <ProductFormPage mode="create" /> },
      { path: 'productos/:id/editar', element: <ProductFormPage mode="edit" /> },
      { path: 'categorias', element: <CategoriesAdminPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
