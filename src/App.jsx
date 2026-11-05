import { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import AnnouncementBar from './components/common/AnnouncementBar'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import CursorSpotlight from './components/common/CursorSpotlight'
import { ScrollProgressBar } from './components/common/MotionPrimitives'
import CartDrawer from './components/cart/CartDrawer'
import WishlistDrawer from './components/common/WishlistDrawer'
import QuickViewModal from './components/common/QuickViewModal'
import BookPreviewModal from './components/common/BookPreviewModal'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' in window ? 'instant' : 'auto',
    })
  }, [pathname, search])

  return null
}

function StoreLayout() {
  return (
    <div className="relative flex min-h-svh flex-col bg-brand-bg text-brand-text">
      <ScrollProgressBar />
      <CursorSpotlight />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <BookPreviewModal />
    </div>
  )
}

function PlaceholderPage({ title, description }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
      <h1 className="font-serif text-3xl tracking-wide text-brand-text sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted">
        {description}
      </p>
    </section>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<StoreLayout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="product/:slug" element={<ProductDetailPage />} />
              <Route
                path="*"
                element={
                  <PlaceholderPage
                    title="Page Coming Soon"
                    description="This Mark Steffen destination is reserved for future concierge content."
                  />
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  )
}
