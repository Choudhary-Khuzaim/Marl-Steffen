import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import products from '../data/products.json'
import ImageGallery from '../components/shop/ImageGallery'
import VariantSelector, {
  findVariant,
  isBook,
} from '../components/shop/VariantSelector'
import ProductCard from '../components/shop/ProductCard'
import BundleUpsellCard from '../components/shop/BundleUpsellCard'
import { useCart } from '../context/CartContext'

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

const ACCORDIONS = [
  {
    id: 'description',
    title: 'Description & Details',
    body: (product) => (
      <div className="space-y-4 text-sm leading-relaxed text-brand-muted">
        <p>{product.description}</p>
        {product.collection && (
          <p>
            <span className="font-medium text-brand-text">Collection:</span>{' '}
            {product.collection}
          </p>
        )}
        {product.artist && (
          <p>
            <span className="font-medium text-brand-text">Artist:</span>{' '}
            {product.artist}
          </p>
        )}
      </div>
    ),
  },
  {
    id: 'shipping',
    title: 'Shipping & Fulfillment',
    body: () => (
      <div className="space-y-3 text-sm leading-relaxed text-brand-muted">
        <p>Complimentary domestic shipping on orders over $75. Most in-stock items ship within 24–48 hours.</p>
        <p>Signed and collector editions may require 3–5 business days of additional handling.</p>
      </div>
    ),
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    body: () => (
      <div className="space-y-3 text-sm leading-relaxed text-brand-muted">
        <p>Unworn apparel and unused merchandise may be returned within 30 days of delivery.</p>
        <p>Opened books and personalized / signed editions are final sale unless damaged in transit.</p>
      </div>
    ),
  },
]

function buildInitialSelection(product) {
  const colors = product.options?.colors || []
  const sizes = product.options?.sizes || []
  const formats = product.options?.formats || []
  const colorId = colors[0]?.id ?? null
  let size = sizes.includes('M') ? 'M' : sizes[0] ?? null

  if (colorId && size) {
    const preferred = findVariant(product, colorId, size)
    if (preferred && preferred.inStock === false) {
      const firstAvailable = (product.variants || []).find(
        (variant) => variant.color === colorId && variant.inStock !== false,
      )
      size = firstAvailable?.size ?? size
    }
  }

  return {
    colorId,
    size,
    formatId: formats[0]?.id ?? null,
  }
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const {
    addToCart,
    openBookPreview,
    isInWishlist,
    toggleWishlistItem,
  } = useCart()
  const product = useMemo(
    () => products.find((item) => item.slug === slug),
    [slug],
  )

  const [selection, setSelection] = useState({
    colorId: null,
    size: null,
    formatId: null,
  })
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState('description')

  useEffect(() => {
    if (!product) return
    setSelection(buildInitialSelection(product))
    setQuantity(1)
    setOpenAccordion('description')
  }, [product])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.category === product.category ||
            item.collection === product.collection),
      )
      .slice(0, 4)
  }, [product])

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <h1 className="font-serif text-3xl tracking-wide text-brand-text">
          Product not found
        </h1>
        <Link to="/shop" className="mt-6 inline-block text-sm text-brand-gold">
          Back to Shop
        </Link>
      </section>
    )
  }

  const selectedColor = (product.options?.colors || []).find(
    (color) => color.id === selection.colorId,
  )
  const selectedFormat = (product.options?.formats || []).find(
    (format) => format.id === selection.formatId,
  )
  const selectedVariant = findVariant(product, selection.colorId, selection.size)
  const unitPrice = selectedFormat?.price ?? selectedVariant?.price ?? product.price
  const compareAt = selectedFormat?.compareAtPrice ?? product.compareAtPrice
  const needsSize = Boolean(product.options?.sizes?.length)

  const stockOk = (() => {
    if (isBook(product)) {
      return selectedFormat?.inStock !== false && product.inStock !== false
    }
    if (needsSize) {
      if (!selection.size) return false
      if (selectedVariant) {
        return (
          selectedVariant.inStock !== false &&
          (selectedVariant.inventory == null || selectedVariant.inventory > 0)
        )
      }
      return product.inStock !== false
    }
    return product.inStock !== false
  })()

  function handleAddToBag() {
    if (!stockOk) return
    addToCart(
      product,
      {
        colorId: selection.colorId,
        colorLabel: selectedColor?.label || null,
        image: selectedColor?.image || product.primaryImage,
        size: selection.size,
        formatId: selection.formatId,
        formatLabel: selectedFormat?.label || null,
        price: unitPrice,
      },
      quantity,
    )
  }

  function handleRelatedAdd(relatedProduct, color) {
    const defaultSize = relatedProduct.options?.sizes?.includes('M')
      ? 'M'
      : relatedProduct.options?.sizes?.[0] || null
    addToCart(
      relatedProduct,
      {
        colorId: color?.id || null,
        colorLabel: color?.label || null,
        image: color?.image || relatedProduct.primaryImage,
        size: defaultSize,
        price: relatedProduct.price,
      },
      1,
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
      <nav className="mb-6 text-xs tracking-wide text-brand-muted">
        <Link to="/shop" className="hover:text-brand-gold">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={`/shop?category=${product.category}`}
          className="capitalize hover:text-brand-gold"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-text">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ImageGallery product={product} activeColorImage={selectedColor?.image} />

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-gold">
            {product.collection || product.category}
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-[0.04em] text-brand-text sm:text-4xl">
            {product.name}
          </h1>
          {product.subtitle && (
            <p className="mt-2 text-sm text-brand-muted">{product.subtitle}</p>
          )}

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-xl font-medium text-brand-gold">
              {formatPrice(unitPrice)}
            </span>
            {compareAt != null && compareAt > unitPrice && (
              <span className="text-base text-brand-muted line-through">
                {formatPrice(compareAt)}
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {isBook(product) && (
              <button
                type="button"
                onClick={() => openBookPreview(product)}
                className="inline-flex items-center gap-2 border border-brand-gold/40 bg-brand-gold/5 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-brand-gold transition-all duration-300 hover:bg-brand-gold/10"
              >
                <BookOpen size={14} />
                Read / Listen Preview
              </button>
            )}
            <button
              type="button"
              onClick={() => toggleWishlistItem(product)}
              className={[
                'inline-flex items-center gap-2 border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-all duration-300',
                isInWishlist(product.id)
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-brand-border text-brand-muted hover:border-brand-gold/40',
              ].join(' ')}
            >
              <Heart
                size={14}
                className={isInWishlist(product.id) ? 'fill-brand-gold' : ''}
              />
              {isInWishlist(product.id) ? 'Saved' : 'Add to Wishlist'}
            </button>
          </div>

          <div className="mt-8">
            <VariantSelector
              product={product}
              selection={selection}
              onChange={setSelection}
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center border border-brand-border">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center text-brand-text disabled:opacity-40"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus size={16} strokeWidth={1.75} />
              </button>
              <span className="min-w-10 text-center text-sm tabular-nums text-brand-text">
                {quantity}
              </span>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center text-brand-text"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => value + 1)}
              >
                <Plus size={16} strokeWidth={1.75} />
              </button>
            </div>

            <button
              type="button"
              disabled={!stockOk}
              onClick={handleAddToBag}
              className="btn-gold-shimmer inline-flex flex-1 items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag size={16} strokeWidth={1.75} />
              {stockOk ? 'Add to Bag' : 'Sold Out'}
            </button>
          </div>

          {needsSize && !selection.size && (
            <p className="mt-3 text-xs text-brand-muted">Select a size to continue.</p>
          )}

          <div className="mt-10">
            <BundleUpsellCard />
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-brand-border">
        {ACCORDIONS.map((item) => {
          const open = openAccordion === item.id
          return (
            <div key={item.id} className="border-b border-brand-border">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={open}
                onClick={() => setOpenAccordion(open ? null : item.id)}
              >
                <span className="font-serif text-lg tracking-wide text-brand-text">
                  {item.title}
                </span>
                <span className="text-xl leading-none text-brand-gold" aria-hidden="true">
                  {open ? '−' : '+'}
                </span>
              </button>
              {open && <div className="pb-6">{item.body(product)}</div>}
            </div>
          )
        })}
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-2xl tracking-wide text-brand-text">
            You May Also Like
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onAddToBag={handleRelatedAdd}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
