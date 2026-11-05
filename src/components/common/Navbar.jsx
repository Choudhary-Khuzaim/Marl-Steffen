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
          <nav className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-4 lg:px-6 lg:py-3.5">
            {/* Left: hamburger (mobile) / desktop links */}
            <div className="flex items-center justify-start">
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-brand-text lg:hidden"
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

            {/* Center: brand — flows in grid, no absolute overlap */}
            <Link
              to="/"
              className="min-w-0 justify-self-center px-1 text-center lg:px-4"
              onClick={closeMobile}
            >
              <span className="font-serif block truncate text-[11px] font-semibold tracking-[0.14em] text-brand-text sm:text-sm sm:tracking-[0.22em] lg:text-base lg:tracking-[0.28em]">
                MARK STEFFEN
              </span>
              <span className="mt-0.5 block truncate text-[8px] font-medium tracking-[0.18em] text-brand-gold uppercase sm:text-[9px] sm:tracking-[0.24em] lg:tracking-[0.28em]">
                Official Store
              </span>
            </Link>

            {/* Right: actions — compact on mobile */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1 lg:gap-2">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center text-brand-text transition-colors duration-300 hover:text-brand-gold sm:h-10 sm:w-10"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={18} strokeWidth={1.75} className="sm:hidden" />
                <Search size={20} strokeWidth={1.75} className="hidden sm:block" />
              </button>
              <button
                type="button"
                onClick={openWishlist}
                className="relative inline-flex h-9 w-9 items-center justify-center text-brand-text transition-colors duration-300 hover:text-brand-gold sm:h-10 sm:w-10"
                aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
              >
                <Heart size={18} strokeWidth={1.75} className="sm:hidden" />
                <Heart size={20} strokeWidth={1.75} className="hidden sm:block" />
                {wishlistCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold-gradient px-1 text-[9px] font-semibold leading-none text-brand-bg sm:right-1 sm:top-1 sm:h-4 sm:min-w-4 sm:text-[10px]">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </button>
              <Link
                to="/account"
                className="hidden h-10 w-10 items-center justify-center text-brand-text transition-colors duration-300 hover:text-brand-gold md:inline-flex"
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.75} />
              </Link>
              <button
                type="button"
                onClick={openCart}
                className="relative inline-flex h-9 w-9 items-center justify-center text-brand-text transition-colors duration-300 hover:text-brand-gold sm:h-10 sm:w-10"
                aria-label={`Shopping bag${cartItemCount > 0 ? `, ${cartItemCount} items` : ''}`}
              >
                <ShoppingBag size={18} strokeWidth={1.75} className="sm:hidden" />
                <ShoppingBag size={20} strokeWidth={1.75} className="hidden sm:block" />
                {cartItemCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold-gradient px-1 text-[9px] font-semibold leading-none text-brand-bg sm:right-1 sm:top-1 sm:h-4 sm:min-w-4 sm:text-[10px]">
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
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(100%,20rem)] flex-col overflow-hidden border-r border-brand-border bg-brand-bg shadow-2xl transition-transform duration-300 md:rounded-r-3xl lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-hidden={!mobileOpen}
        >
          <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
            <span className="font-serif text-sm tracking-[0.2em] text-brand-gold">MENU</span>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center text-brand-text"
                aria-label="Close menu"
                onClick={closeMobile}
              >
                <X size={22} strokeWidth={1.75} />
              </button>
            </div>
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
              <li className="border-t border-brand-border pt-2">
                <Link
                  to="/account"
                  onClick={closeMobile}
                  className="block px-2 py-3 text-sm tracking-wide text-brand-text"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
