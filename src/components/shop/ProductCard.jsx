import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Check, Eye, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { ArchiveMonogram } from '../common/LuxuryImage'
import { TiltCard3D } from '../common/MotionPrimitives'

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function ProductCard({ product, onAddToBag }) {
  const {
    openQuickView,
    openBookPreview,
    isInWishlist,
    toggleWishlistItem,
    addToCart,
  } = useCart()

  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const [primaryFailed, setPrimaryFailed] = useState(false)
  const [secondaryFailed, setSecondaryFailed] = useState(false)
  const [selectedColorId, setSelectedColorId] = useState(
    product.options?.colors?.[0]?.id ?? null,
  )

  const colors = product.options?.colors ?? []
  const isBook = product.type === 'book' || product.category === 'books'
  const isOnSale =
    product.badges?.includes('sale') ||
    (product.compareAtPrice != null && product.compareAtPrice > product.price)
  const isCollector = product.badges?.includes('collector')
  const wished = isInWishlist(product.id)

  const selectedColor = useMemo(
    () => colors.find((color) => color.id === selectedColorId) ?? colors[0],
    [colors, selectedColorId],
  )

  const primaryImage =
    selectedColor?.image || product.primaryImage || product.images?.[0]?.src || ''
  const secondaryImage =
    product.secondaryImage || product.images?.[1]?.src || primaryImage

  useEffect(() => {
    setPrimaryFailed(false)
    setSecondaryFailed(false)
  }, [primaryImage, secondaryImage])

  useEffect(() => {
    if (!added) return undefined
    const timer = window.setTimeout(() => setAdded(false), 1200)
    return () => window.clearTimeout(timer)
  }, [added])

  function handleAddToBag(event) {
    event.preventDefault()
    event.stopPropagation()
    if (onAddToBag) {
      onAddToBag(product, selectedColor)
    } else {
      const defaultSize = product.options?.sizes?.includes('M')
        ? 'M'
        : product.options?.sizes?.[0] || null
      addToCart(
        product,
        {
          colorId: selectedColor?.id || null,
          colorLabel: selectedColor?.label || null,
          image: selectedColor?.image || product.primaryImage,
          size: defaultSize,
          price: product.price,
        },
        1,
      )
    }
    setAdded(true)
  }

  const showSecondary =
    hovered &&
    secondaryImage &&
    secondaryImage !== primaryImage &&
    !secondaryFailed

  return (
    <TiltCard3D className="h-full">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className={[
          'group relative flex h-full flex-col border border-brand-border bg-brand-card transition-colors duration-300 hover:border-brand-gold/40 hover:bg-brand-cardHover hover:shadow-gold-glow',
          isCollector ? 'ring-1 ring-brand-gold/40' : '',
        ].join(' ')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative">
          <Link
            to={`/product/${product.slug}`}
            className="relative block aspect-[4/5] overflow-hidden bg-[#EFECE6] ring-1 ring-inset ring-black/5 dark:bg-[#111318] dark:ring-white/10"
          >
            <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
              {product.badges?.includes('new') && (
                <span className="border border-black/10 bg-[#141311] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#FAF7F2] shadow-md dark:border-white/20 dark:bg-white dark:text-[#08090C]">
                  New Arrival
                </span>
              )}
              {isOnSale && (
                <span className="bg-[#DC2626] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-md">
                  Sale
                </span>
              )}
            </div>

            {(isCollector || product.badges?.includes('signed')) && (
              <span className="absolute right-3 top-3 z-10 border border-[#D4AF37] bg-[#141311]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#D4AF37] shadow-md backdrop-blur-md">
                {product.badges?.includes('signed') && !isCollector ? 'Signed' : 'Collector'}
              </span>
            )}

            {primaryFailed || !primaryImage ? (
              <ArchiveMonogram title={product.name} className="absolute inset-0" />
            ) : (
              <>
                <img
                  src={primaryImage}
                  alt={product.images?.[0]?.alt || product.name}
                  onError={() => setPrimaryFailed(true)}
                  className={[
                    'absolute inset-0 h-full w-full object-cover text-transparent transition-opacity duration-500',
                    showSecondary ? 'opacity-0' : 'opacity-100',
                  ].join(' ')}
                  loading="lazy"
                />
                {secondaryImage !== primaryImage && (
                  <img
                    src={secondaryImage}
                    alt=""
                    aria-hidden="true"
                    onError={() => setSecondaryFailed(true)}
                    className={[
                      'absolute inset-0 h-full w-full object-cover text-transparent transition-opacity duration-500',
                      showSecondary ? 'opacity-100' : 'opacity-0',
                    ].join(' ')}
                    loading="lazy"
                  />
                )}
              </>
            )}
          </Link>

          <div className="absolute right-3 top-12 z-30 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleWishlistItem(product)}
              className={[
                'inline-flex h-9 w-9 items-center justify-center border shadow-md backdrop-blur-md transition-all duration-300',
                wished
                  ? 'border-[#D4AF37] bg-[#141311]/90 text-[#D4AF37]'
                  : 'border-black/10 bg-white/90 text-[#141311] hover:bg-[#9A7B2C] hover:text-white dark:border-white/15 dark:bg-[#08090C]/85 dark:text-white dark:hover:bg-[#D4AF37] dark:hover:text-[#08090C]',
              ].join(' ')}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={15} className={wished ? 'fill-[#D4AF37]' : ''} />
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => openQuickView(product)}
              className="inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white/90 text-[#141311] shadow-md backdrop-blur-md transition-all duration-300 hover:bg-[#9A7B2C] hover:text-white dark:border-white/15 dark:bg-[#08090C]/85 dark:text-white dark:hover:bg-[#D4AF37] dark:hover:text-[#08090C]"
              aria-label="Quick view"
            >
              <Eye size={15} />
            </motion.button>
          </div>

          {isBook && (
            <button
              type="button"
              onClick={() => openBookPreview(product)}
              className="absolute bottom-14 left-3 z-30 inline-flex items-center gap-1.5 border border-[#D4AF37] bg-[#141311]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#D4AF37] opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover:opacity-100"
            >
              <BookOpen size={12} />
              Preview
            </button>
          )}

          <div className="absolute inset-x-0 bottom-0 z-30 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={handleAddToBag}
              className="btn-gold-shimmer flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              {added ? (
                <>
                  <Check size={14} strokeWidth={2} />
                  Added to Archive
                </>
              ) : (
                <>
                  <ShoppingBag size={14} strokeWidth={1.75} />
                  Add to Bag
                </>
              )}
            </motion.button>
          </div>
        </div>

        <Link to={`/product/${product.slug}`} className="flex flex-1 flex-col gap-2 px-3 py-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-brand-muted">
            {product.category}
            {product.subcategory ? ` · ${product.subcategory.replace(/-/g, ' ')}` : ''}
          </p>

          {isBook && product.specs?.format && (
            <span className="w-fit border border-brand-border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-brand-muted">
              {product.specs.format}
            </span>
          )}

          <h3 className="font-serif text-base tracking-wide text-brand-text transition-colors duration-300 group-hover:text-brand-gold">
            {product.name}
          </h3>
          {(product.collection || product.subtitle) && (
            <p className="text-xs text-brand-muted">
              {product.collection || product.subtitle}
            </p>
          )}

          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="text-sm font-medium text-brand-gold">
              {formatPrice(product.price)}
            </span>
            {isOnSale && product.compareAtPrice != null && (
              <span className="text-sm text-brand-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {!isBook && colors.length > 0 && (
            <div
              className="flex flex-wrap gap-2 pt-1"
              onClick={(event) => event.preventDefault()}
            >
              {colors.map((color) => {
                const selected = selectedColor?.id === color.id
                return (
                  <button
                    key={color.id}
                    type="button"
                    title={color.label}
                    aria-label={`Select ${color.label}`}
                    aria-pressed={selected}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setSelectedColorId(color.id)
                    }}
                    className={[
                      'h-5 w-5 rounded-full border transition-transform duration-300',
                      selected
                        ? 'scale-110 border-brand-gold ring-1 ring-brand-gold ring-offset-1 ring-offset-brand-card'
                        : 'border-brand-border hover:scale-105',
                    ].join(' ')}
                    style={{ backgroundColor: color.swatch || color.hex }}
                  />
                )
              })}
            </div>
          )}
        </Link>
      </motion.article>
    </TiltCard3D>
  )
}
