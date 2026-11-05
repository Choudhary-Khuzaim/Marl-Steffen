import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import products from '../../data/products.json'
import LuxuryImage from './LuxuryImage'

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlist,
    addToCart,
    openQuickView,
  } = useCart()

  useEffect(() => {
    if (!isWishlistOpen) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') closeWishlist()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isWishlistOpen, closeWishlist])

  function moveToBag(item) {
    const full = products.find((product) => product.id === item.id)
    if (!full) return
    addToCart(full, { price: full.price, image: full.primaryImage }, 1)
    removeFromWishlist(item.id)
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity ${
          isWishlistOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isWishlistOpen}
        onClick={closeWishlist}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-brand-border bg-brand-bg/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        aria-hidden={!isWishlistOpen}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg tracking-wide text-brand-text">Wishlist</h2>
            {wishlist.length > 0 && (
              <span className="bg-gold-gradient px-2 py-0.5 text-[10px] font-semibold text-brand-bg">
                {wishlist.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeWishlist}
            className="inline-flex h-10 w-10 items-center justify-center text-brand-muted hover:text-brand-text"
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {wishlist.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <Heart size={28} className="text-brand-gold" />
              <h3 className="mt-4 font-serif text-xl text-brand-text">No saved pieces</h3>
              <p className="mt-2 max-w-xs text-sm text-brand-muted">
                Heart items across books, merchandise, and products to build your private shortlist.
              </p>
              <Link
                to="/shop"
                onClick={closeWishlist}
                className="btn-gold-shimmer mt-6 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <ul>
              {wishlist.map((item) => {
                const full = products.find((product) => product.id === item.id)
                return (
                  <li
                    key={item.id}
                    className="flex gap-4 border-b border-brand-border py-5"
                  >
                    <button
                      type="button"
                      className="h-24 w-20 shrink-0 overflow-hidden border border-brand-border"
                      onClick={() => {
                        if (full) {
                          closeWishlist()
                          openQuickView(full)
                        }
                      }}
                    >
                      <LuxuryImage
                        src={item.primaryImage}
                        alt=""
                        title={item.name}
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeWishlist}
                        className="font-serif text-sm tracking-wide text-brand-text hover:text-brand-gold"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-brand-muted">
                        {item.category}
                      </p>
                      <p className="mt-2 text-sm text-brand-gold">
                        {formatPrice(item.price)}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => moveToBag(item)}
                          className="inline-flex items-center gap-1.5 border border-brand-gold/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-brand-gold hover:bg-brand-gold/10"
                        >
                          <ShoppingBag size={12} />
                          Move to Bag
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          className="px-2 text-[11px] uppercase tracking-[0.12em] text-brand-muted hover:text-brand-danger"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}
