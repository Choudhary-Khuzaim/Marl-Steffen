import { useEffect, useId, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import MegaMenu from './MegaMenu'
import SearchModal from './SearchModal'
import ThemeToggle from './ThemeToggle'
import { useCart } from '../../context/CartContext'
import { categories } from '../../data/categories'

const primaryLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/shop', hasMegaMenu: true },
  { label: 'Books', href: '/shop?category=books' },
  { label: 'Merchandise', href: '/shop?category=merchandise' },
  { label: 'Products', href: '/shop?category=products' },
]

function linkClass({ isActive }) {
  return [
    'text-sm tracking-wide transition-colors duration-300',
    isActive ? 'text-brand-gold' : 'text-brand-text/85 hover:text-brand-gold',
  ].join(' ')
}

export default function Navbar() {
  const { cartItemCount, openCart, wishlistCount, openWishlist } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [expandedMobileSection, setExpandedMobileSection] = useState(null)
  const drawerId = useId()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setMegaOpen(false)
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function closeMobile() {
    setMobileOpen(false)
    setExpandedMobileSection(null)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-border glass-header">
        <div className="relative" onMouseLeave={() => setMegaOpen(false)}>
          <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 lg:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center text-brand-text lg:hidden"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls={drawerId}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
              </button>

              <ul className="hidden items-center gap-6 lg:flex">
                {primaryLinks.map((link) => (
                  <li key={link.href + link.label}>
                    {link.hasMegaMenu ? (
                      <button
                        type="button"
                        className={`inline-flex items-center gap-1 text-sm tracking-wide transition-colors duration-300 ${
                          megaOpen ? 'text-brand-gold' : 'text-brand-text/85 hover:text-brand-gold'
                        }`}
                        aria-expanded={megaOpen}
                        aria-haspopup="true"
                        onMouseEnter={() => setMegaOpen(true)}
                        onClick={() => setMegaOpen((open) => !open)}
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          strokeWidth={2}
                          className={`transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    ) : (
                      <NavLink
                        to={link.href}
                        className={linkClass}
                        end={link.href === '/'}
                      >
                        {link.label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
              onClick={closeMobile}
            >
              <span className="font-serif text-sm font-semibold tracking-[0.28em] text-brand-text sm:text-base">
                MARK STEFFEN
              </span>
              <span className="mt-0.5 block text-[9px] font-medium tracking-[0.28em] text-brand-gold uppercase">
                Official Store
              </span>
            </Link>

            <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
              <ThemeToggle />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center text-brand-text transition-colors duration-300 hover:text-brand-gold"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={openWishlist}
                className="relative inline-flex h-10 w-10 items-center justify-center text-brand-text transition-colors duration-300 hover:text-brand-gold"
                aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
              >
                <Heart size={20} strokeWidth={1.75} />
                {wishlistCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-gradient px-1 text-[10px] font-semibold leading-none text-brand-bg">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </button>
              <Link
                to="/account"
                className="hidden h-10 w-10 items-center justify-center text-brand-text transition-colors duration-300 hover:text-brand-gold sm:inline-flex"
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.75} />
              </Link>
              <button
                type="button"
                onClick={openCart}
                className="relative inline-flex h-10 w-10 items-center justify-center text-brand-text transition-colors duration-300 hover:text-brand-gold"
                aria-label={`Shopping bag${cartItemCount > 0 ? `, ${cartItemCount} items` : ''}`}
              >
                <ShoppingBag size={20} strokeWidth={1.75} />
                {cartItemCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-gradient px-1 text-[10px] font-semibold leading-none text-brand-bg">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </nav>

          <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
        </div>

        <div
          className={`modal-backdrop fixed inset-0 z-40 transition-opacity lg:hidden ${
            mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={!mobileOpen}
          onClick={closeMobile}
        />

        <aside
          id={drawerId}
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(100%,20rem)] flex-col border-r border-brand-border bg-brand-bg shadow-2xl transition-transform duration-300 lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-hidden={!mobileOpen}
        >
          <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
            <span className="font-serif text-sm tracking-[0.2em] text-brand-gold">MENU</span>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-brand-text"
              aria-label="Close menu"
              onClick={closeMobile}
            >
              <X size={22} strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  end
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `block px-2 py-3 text-sm tracking-wide ${isActive ? 'text-brand-gold' : 'text-brand-text'}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="border-b border-brand-border pb-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-2 py-3 text-left text-sm tracking-wide text-brand-text"
                  aria-expanded={expandedMobileSection === 'shop'}
                  onClick={() =>
                    setExpandedMobileSection((current) =>
                      current === 'shop' ? null : 'shop',
                    )
                  }
                >
                  Shop All
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${expandedMobileSection === 'shop' ? 'rotate-90' : ''}`}
                  />
                </button>
                {expandedMobileSection === 'shop' && (
                  <div className="space-y-4 pb-3 pl-2">
                    {categories.map((category) => (
                      <div key={category.id}>
                        <Link
                          to={`/shop?category=${category.slug}`}
                          onClick={closeMobile}
                          className="font-serif text-xs tracking-[0.16em] text-brand-gold uppercase"
                        >
                          {category.label}
                        </Link>
                        <ul className="mt-2 space-y-1">
                          {category.subcategories.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                to={`/shop?category=${category.slug}&subcategory=${sub.slug}`}
                                onClick={closeMobile}
                                className="block py-1.5 text-sm text-brand-muted hover:text-brand-text"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/shop?category=${category.slug}`}
                    onClick={closeMobile}
                    className="block px-2 py-3 text-sm tracking-wide text-brand-text"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
