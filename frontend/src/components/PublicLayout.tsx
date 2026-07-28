// Layout de las páginas públicas: Navbar arriba, contenido de la ruta al
// centro y Footer abajo. Las rutas /admin usan AdminLayout en su lugar.
// También monta el CartDrawer y el ProductModal, que flotan sobre cualquier
// página pública y se controlan con uiStore.

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import ProductModal from './ProductModal'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-yerba-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ProductModal />
    </div>
  )
}
