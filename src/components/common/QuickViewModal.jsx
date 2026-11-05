import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import LuxuryImage from './LuxuryImage'
import { motionEase } from './MotionPrimitives'

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function QuickViewModal() {
  const {
    quickViewProduct: product,
    closeQuickView,
    addToCart,
    isInWishlist,
    toggleWishlistItem,
  } = useCart()

  const colors = product?.options?.colors || []
  const sizes = product?.options?.sizes || []
  const formats = product?.options?.formats || []

  const [colorId, setColorId] = useState(null)
  const [size, setSize] = useState(null)
  const [formatId, setFormatId] = useState(null)

  useEffect(() => {
    if (!product) return
    setColorId(colors[0]?.id ?? null)
    setSize(sizes.includes('M') ? 'M' : sizes[0] ?? null)
    setFormatId(formats[0]?.id ?? null)
  }, [product])

  useEffect(() => {
    if (!product) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') closeQuickView()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [product, closeQuickView])

  const selectedColor = useMemo(
    () => colors.find((color) => color.id === colorId) || colors[0],
    [colors, colorId],
  )
  const selectedFormat = useMemo(
    () => formats.find((format) => format.id === formatId) || formats[0],
    [formats, formatId],
  )

  const price = selectedFormat?.price ?? product?.price
  const wished = product ? isInWishlist(product.id) : false
  const image = selectedColor?.image || product?.primaryImage

  function handleAdd() {
    if (!product) return
    addToCart(
      product,
      {
        colorId,
        colorLabel: selectedColor?.label || null,
        image,
        size,
        formatId,
        formatLabel: selectedFormat?.label || null,
        price,
      },
      1,
    )
  }

  return (
    <AnimatePresence>
      {product && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.button
        type="button"
        className="modal-backdrop absolute inset-0 backdrop-blur-sm"
        aria-label="Close quick view"
        onClick={closeQuickView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view ${product.name}`}
        className="glass-panel relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl md:grid-cols-2"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.32, ease: motionEase }}
      >
        <div className="relative aspect-[4/5] bg-brand-card md:aspect-auto md:min-h-[28rem]">
          <LuxuryImage
            src={image}
            alt={product.name}
            title={product.name}
            showVignette
          />
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold">
                {product.category} · {product.subcategory?.replace(/-/g, ' ')}
              </p>
              <h2 className="mt-2 font-serif text-2xl tracking-wide text-brand-text">
                {product.name}
              </h2>
              <p className="mt-2 text-lg text-brand-gold">{formatPrice(price)}</p>
            </div>
            <button
              type="button"
              onClick={closeQuickView}
              className="inline-flex h-9 w-9 items-center justify-center text-brand-muted hover:text-brand-text"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-brand-muted">
            {product.description}
          </p>

          {formats.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-brand-gold">Format</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    type="button"
                    onClick={() => setFormatId(format.id)}
                    className={[
                      'rounded-xl border px-3 py-1.5 text-xs transition-all duration-300',
                      formatId === format.id
                        ? 'border-brand-gold text-brand-gold'
                        : 'border-brand-border text-brand-muted hover:border-brand-gold/40',
                    ].join(' ')}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-brand-gold">Color</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    title={color.label}
                    aria-label={color.label}
                    onClick={() => setColorId(color.id)}
                    className={[
                      'h-7 w-7 rounded-full border-2',
                      colorId === color.id ? 'border-brand-gold' : 'border-brand-border',
                    ].join(' ')}
                    style={{ backgroundColor: color.swatch || color.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-brand-gold">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSize(value)}
                    className={[
                      'min-w-10 rounded-xl border px-2.5 py-1.5 text-xs',
                      size === value
                        ? 'border-brand-gold text-brand-gold'
                        : 'border-brand-border text-brand-muted',
                    ].join(' ')}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
            <button
              type="button"
              onClick={handleAdd}
              className="btn-gold-shimmer inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              <ShoppingBag size={15} />
              Add to Bag
            </button>
            <button
              type="button"
              onClick={() => toggleWishlistItem(product)}
              className={[
                'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.14em] transition-all duration-300 hover:-translate-y-0.5',
                wished
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-brand-border text-brand-muted hover:border-brand-gold/40',
              ].join(' ')}
            >
              <Heart size={15} className={wished ? 'fill-brand-gold' : ''} />
              {wished ? 'Saved' : 'Save'}
            </button>
          </div>

          <Link
            to={`/product/${product.slug}`}
            onClick={closeQuickView}
            className="mt-4 text-center text-[11px] uppercase tracking-[0.16em] text-brand-gold hover:text-brand-goldLight"
          >
            View Full Details
          </Link>
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  )
}
