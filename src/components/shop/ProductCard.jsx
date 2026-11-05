import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Check, Eye, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { ArchiveMonogram } from '../common/LuxuryImage'
import { TiltCard3D, motionEase } from '../common/MotionPrimitives'

const HOVER_CYCLE_MS = 1200

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function resolveGallery(product, selectedColor) {
  const fromImages = (product.images || [])
    .map((image) => (typeof image === 'string' ? image : image?.src))
    .filter(Boolean)

  const candidates = [
    selectedColor?.image,
    product.primaryImage,
    product.secondaryImage,
    ...fromImages,
  ].filter(Boolean)

  const unique = []
  const seen = new Set()
  for (const src of candidates) {
    if (seen.has(src)) continue
    seen.add(src)
    unique.push(src)
  }
  return unique
}

function abbreviateFormat(product) {
  const format = product.specs?.format
  const material = product.specs?.material
  const gsm = product.specs?.gsm || product.specs?.weight

  if (gsm) return String(gsm).toUpperCase().includes('GSM') ? String(gsm).toUpperCase() : `${gsm} GSM`

  if (format) {
    const lower = format.toLowerCase()
    if (lower.includes('signed') && lower.includes('hardcover')) return 'SIGNED HC'
    if (lower.includes('clothbound') || lower.includes('special')) return 'DELUXE HC'
    if (lower.includes('slipcase')) return 'SLIPCASE'
    if (lower.includes('trade hardcover') || lower === 'hardcover') return 'DELUXE HC'
    if (lower.includes('paperback')) return 'TRADE PB'
    if (lower.includes('digital') || lower.includes('ebook')) return 'DIGITAL'
    return format
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 8)
  }

  if (material) {
    const lower = material.toLowerCase()
    if (lower.includes('fleece')) return '450 GSM'
    if (lower.includes('cotton') && lower.includes('combed')) return '220 GSM'
    if (lower.includes('wool')) return 'WOOL'
    if (lower.includes('leather')) return 'LEATHER'
    if (lower.includes('enamel')) return 'ENAMEL'
    return material.split(/[\/,\s]+/).slice(0, 2).join(' ').toUpperCase().slice(0, 12)
  }

  if (product.category === 'merchandise' && product.subcategory === 'apparel') return 'PREMIUM'
  if (product.category === 'products') return 'BESPOKE'
  return null
}

function labelCategory(value) {
  return String(value || '')
    .replace(/-/g, ' ')
    .toUpperCase()
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
  const [imageIndex, setImageIndex] = useState(0)
  const [failedSrc, setFailedSrc] = useState(() => new Set())
  const failedSrcRef = useRef(failedSrc)
  failedSrcRef.current = failedSrc
  const [selectedColorId, setSelectedColorId] = useState(
    product.options?.colors?.[0]?.id ?? null,
  )

  const colors = product.options?.colors ?? []
  const isBook = product.type === 'book' || product.category === 'books'
  const isOnSale =
    product.badges?.includes('sale') ||
    (product.compareAtPrice != null && product.compareAtPrice > product.price)
  const isCollector = product.badges?.includes('collector')
  const isSigned = product.badges?.includes('signed')
  const isNew = product.badges?.includes('new')
  const wished = isInWishlist(product.id)
  const metaTag = abbreviateFormat(product)
  const rating =
    typeof product.rating === 'number' ? product.rating.toFixed(1) : null

  const leftBadges = [
    isNew ? { id: 'new', label: 'New Arrival', tone: 'new' } : null,
    isOnSale ? { id: 'sale', label: 'Sale', tone: 'sale' } : null,
  ].filter(Boolean)

  const rightBadges = [
    isCollector ? { id: 'collector', label: 'Collector', tone: 'gold' } : null,
    !isCollector && isSigned ? { id: 'signed', label: 'Signed', tone: 'gold' } : null,
  ].filter(Boolean)

  const selectedColor = useMemo(
    () => colors.find((color) => color.id === selectedColorId) ?? colors[0],
    [colors, selectedColorId],
  )

  const gallery = useMemo(
    () => resolveGallery(product, selectedColor),
    [product, selectedColor],
  )

  const activeSrc = gallery[imageIndex] || gallery[0] || ''
  const allFailed = gallery.length === 0 || gallery.every((src) => failedSrc.has(src))

  useEffect(() => {
    setImageIndex(0)
    setFailedSrc(new Set())
  }, [product.id, selectedColorId])

  useEffect(() => {
    if (!hovered || gallery.length < 2) {
      setImageIndex(0)
      return undefined
    }

    const timer = window.setInterval(() => {
      setImageIndex((current) => {
        let next = (current + 1) % gallery.length
        let guard = 0
        while (failedSrcRef.current.has(gallery[next]) && guard < gallery.length) {
          next = (next + 1) % gallery.length
          guard += 1
        }
        return next
      })
    }, HOVER_CYCLE_MS)

    return () => window.clearInterval(timer)
  }, [hovered, gallery])

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

  function markFailed(src) {
    setFailedSrc((current) => {
      if (current.has(src)) return current
      const next = new Set(current)
      next.add(src)
      return next
    })
  }

  function badgeClass(tone) {
    const base =
      'rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl backdrop-blur-md'
    if (tone === 'sale') {
      return `${base} bg-[#DC2626] font-extrabold text-white shadow-lg shadow-red-500/20`
    }
    if (tone === 'gold') {
      return `${base} border border-amber-200/50 bg-gradient-to-r from-[#D4AF37] to-[#AA820A] font-extrabold text-[#08090C] shadow-lg shadow-amber-500/20`
    }
    return `${base} border border-white/15 bg-[#121316] text-[#F5F5F7] dark:border-black/10 dark:bg-white dark:text-[#08090C]`
  }

  return (
    <TiltCard3D className="h-full">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className={[
          'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card transition-all duration-300 hover:border-brand-gold/40 hover:bg-brand-cardHover hover:shadow-gold-glow',
          isCollector ? 'ring-1 ring-brand-gold/40' : '',
        ].join(' ')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false)
          setImageIndex(0)
        }}
      >
        <div className="relative">
          <Link
            to={`/product/${product.slug}`}
            className="relative m-2.5 block aspect-[4/5] overflow-hidden rounded-xl bg-[#EFECE6] ring-1 ring-inset ring-black/5 dark:bg-[#111318] dark:ring-white/10"
          >
            {(leftBadges.length > 0 || rightBadges.length > 0) && (
              <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-2">
                <div className="flex max-w-[68%] flex-wrap gap-2">
                  {leftBadges.map((badge) => (
                    <span key={badge.id} className={badgeClass(badge.tone)}>
                      {badge.label}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {rightBadges.map((badge) => (
                    <span key={badge.id} className={badgeClass(badge.tone)}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {allFailed || !activeSrc ? (
              <ArchiveMonogram title={product.name} className="absolute inset-0" />
            ) : (
              <AnimatePresence mode="sync" initial={false}>
                <motion.img
                  key={activeSrc}
                  src={activeSrc}
                  alt={
                    product.images?.[imageIndex]?.alt ||
                    product.images?.[0]?.alt ||
                    product.name
                  }
                  onError={() => markFailed(activeSrc)}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: motionEase }}
                  className="absolute inset-0 h-full w-full object-cover text-transparent"
                  loading="lazy"
                />
              </AnimatePresence>
            )}

            {gallery.length > 1 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {gallery.map((src, index) => (
                  <span
                    key={src}
                    className={[
                      'h-1.5 w-1.5 rounded-full transition-all duration-300',
                      index === imageIndex
                        ? 'w-4 bg-[#D4AF37]'
                        : 'bg-white/70 dark:bg-white/40',
                    ].join(' ')}
                  />
                ))}
              </div>
            )}
          </Link>

          <div className="absolute right-4 top-16 z-30 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleWishlistItem(product)}
              className={[
                'inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all duration-300',
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#141311] shadow-md backdrop-blur-md transition-all duration-300 hover:bg-[#9A7B2C] hover:text-white dark:border-white/15 dark:bg-[#08090C]/85 dark:text-white dark:hover:bg-[#D4AF37] dark:hover:text-[#08090C]"
              aria-label="Quick view"
            >
              <Eye size={15} />
            </motion.button>
          </div>

          {isBook && (
            <button
              type="button"
              onClick={() => openBookPreview(product)}
              className="absolute bottom-14 left-5 z-30 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37] bg-[#141311]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D4AF37] opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover:opacity-100"
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
              className="btn-gold-shimmer flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
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

        <Link to={`/product/${product.slug}`} className="flex flex-1 flex-col px-3.5 pb-4 pt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex min-w-0 max-w-[70%] items-center gap-1.5 truncate rounded-md border border-black/5 bg-[#EFECE6] px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-[#121316] uppercase dark:border-white/10 dark:bg-white/10 dark:text-zinc-200">
              <span className="truncate">
                {labelCategory(product.category)}
                {product.subcategory ? (
                  <>
                    <span className="mx-1 opacity-50" aria-hidden="true">
                      •
                    </span>
                    {labelCategory(product.subcategory)}
                  </>
                ) : null}
              </span>
            </span>
            {metaTag && (
              <span className="shrink-0 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/15 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-[#9A7B2C] uppercase dark:text-[#D4AF37]">
                {metaTag}
              </span>
            )}
          </div>

          <h3 className="mt-2 font-serif text-base font-bold tracking-tight text-[#121316] transition-colors line-clamp-1 group-hover:text-[#9A7B2C] dark:text-white dark:group-hover:text-[#D4AF37]">
            {product.name}
          </h3>

          <p className="mt-0.5 mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1">
            {product.artist || product.collection || product.subtitle || 'Mark Steffen Studio'}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-baseline">
              <span className="text-base font-extrabold text-[#121316] dark:text-white">
                {formatPrice(product.price)}
              </span>
              {isOnSale && product.compareAtPrice != null && (
                <span className="ml-2 text-xs font-semibold text-zinc-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {!isBook && colors.length > 0 && (
                <div
                  className="flex items-center gap-1.5"
                  onClick={(event) => event.preventDefault()}
                >
                  {colors.slice(0, 4).map((color) => {
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
                          'h-4 w-4 rounded-full border transition-transform duration-300',
                          selected
                            ? 'scale-110 border-[#D4AF37] ring-1 ring-[#D4AF37] ring-offset-1 ring-offset-brand-card'
                            : 'border-black/10 dark:border-white/20 hover:scale-105',
                        ].join(' ')}
                        style={{ backgroundColor: color.swatch || color.hex }}
                      />
                    )
                  })}
                </div>
              )}

              {rating ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#9A7B2C] dark:text-[#D4AF37]">
                  <span aria-hidden="true">★</span>
                  <span>{rating}</span>
                </span>
              ) : null}
            </div>
          </div>
        </Link>
      </motion.article>
    </TiltCard3D>
  )
}
