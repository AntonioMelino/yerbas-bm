// Layout de las páginas públicas: Navbar arriba, contenido de la ruta al
// centro y Footer abajo. Las rutas /admin usan AdminLayout en su lugar.

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-yerba-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
