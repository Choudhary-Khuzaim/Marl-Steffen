import { useEffect, useId, useMemo, useState } from 'react'
import { X } from 'lucide-react'

const DEFAULT_APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL']

const SIZE_GUIDE_ROWS = [
  { size: 'XS', chest: '32–34"', length: '26"' },
  { size: 'S', chest: '35–37"', length: '27"' },
  { size: 'M', chest: '38–40"', length: '28"' },
  { size: 'L', chest: '41–43"', length: '29"' },
  { size: 'XL', chest: '44–46"', length: '30"' },
  { size: '2XL', chest: '47–49"', length: '31"' },
]

export function isBook(product) {
  return product.type === 'book' || product.category === 'books'
}

export function isProduct(product) {
  return product.type === 'product' || product.category === 'products'
}

export function findVariant(product, colorId, size) {
  return (product.variants || []).find((variant) => {
    const colorMatch = colorId ? variant.color === colorId : true
    const sizeMatch = size ? variant.size === size : true
    return colorMatch && sizeMatch
  })
}

function sizeAvailable(product, colorId, size) {
  const variants = product.variants || []
  if (!variants.length) return product.inStock !== false
  const exact = findVariant(product, colorId, size)
  if (exact) return exact.inStock !== false && (exact.inventory == null || exact.inventory > 0)
  const colorVariants = variants.filter((variant) => variant.color === colorId)
  if (colorId && colorVariants.length > 0) return false
  return product.inStock !== false
}

export default function VariantSelector({ product, selection, onChange }) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const sizeGuideTitleId = useId()

  const colors = product.options?.colors || []
  const sizes = product.options?.sizes?.length
    ? product.options.sizes
    : product.type === 'apparel'
      ? DEFAULT_APPAREL_SIZES
      : []

  const formats = useMemo(() => {
    if (product.options?.formats?.length) return product.options.formats
    if (!isBook(product)) return []
    if (product.specs?.format) {
      return [
        {
          id: 'default-format',
          label: product.specs.format,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          inStock: product.inStock,
        },
      ]
    }
    return []
  }, [product])

  const selectedColor = colors.find((color) => color.id === selection.colorId) || colors[0]
  const selectedFormat = formats.find((format) => format.id === selection.formatId) || formats[0]

  useEffect(() => {
    if (!sizeGuideOpen) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') setSizeGuideOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [sizeGuideOpen])

  const stockState = useMemo(() => {
    if (isBook(product)) {
      const available = selectedFormat?.inStock !== false && product.inStock !== false
      return {
        available,
        message: available
          ? 'In Stock — Ships in 24–48 Hours'
          : 'Sold Out / Backorder',
      }
    }

    if (sizes.length && selection.size) {
      const available = sizeAvailable(product, selection.colorId, selection.size)
      const variant = findVariant(product, selection.colorId, selection.size)
      const lowStock =
        available && variant?.inventory != null && variant.inventory > 0 && variant.inventory <= 8
      return {
        available,
        message: !available
          ? 'Sold Out / Backorder'
          : lowStock
            ? `Only ${variant.inventory} left — Ships in 24–48 Hours`
            : 'In Stock — Ships in 24–48 Hours',
      }
    }

    if (product.inStock === false) {
      return { available: false, message: 'Sold Out / Backorder' }
    }
    return { available: true, message: 'In Stock — Ships in 24–48 Hours' }
  }, [product, selection.colorId, selection.size, selectedFormat, sizes.length])

  const stockClass = stockState.available ? 'text-brand-success' : 'text-brand-danger'

  return (
    <div className="space-y-6">
      {isBook(product) && formats.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
            Format
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {formats.map((format) => {
              const selected = selectedFormat?.id === format.id
              const disabled = format.inStock === false
              return (
                <button
                  key={format.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...selection, formatId: format.id })}
                  className={[
                    'border px-3 py-2 text-sm transition-all duration-300',
                    disabled
                      ? 'cursor-not-allowed border-brand-border text-brand-muted line-through opacity-45'
                      : selected
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                        : 'border-brand-border text-brand-text hover:border-brand-gold/50',
                  ].join(' ')}
                >
                  {format.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {isBook(product) && product.specs && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
            Publishing Specs
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border border-brand-border bg-brand-card p-4 text-sm">
            {product.specs.isbn && (
              <>
                <dt className="text-brand-muted">ISBN</dt>
                <dd className="text-brand-text">{product.specs.isbn}</dd>
              </>
            )}
            {product.specs.pages != null && (
              <>
                <dt className="text-brand-muted">Pages</dt>
                <dd className="text-brand-text">{product.specs.pages}</dd>
              </>
            )}
            {product.specs.publisher && (
              <>
                <dt className="text-brand-muted">Publisher</dt>
                <dd className="text-brand-text">{product.specs.publisher}</dd>
              </>
            )}
            {product.specs.language && (
              <>
                <dt className="text-brand-muted">Language</dt>
                <dd className="text-brand-text">{product.specs.language}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      {isProduct(product) && product.specs && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
            Product Specs
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border border-brand-border bg-brand-card p-4 text-sm">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="capitalize text-brand-muted">
                  {key.replace(/([A-Z])/g, ' $1')}
                </dt>
                <dd className="text-brand-text">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {!isBook(product) && colors.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
              Color
            </p>
            <span className="text-sm text-brand-muted">
              {selectedColor?.label || 'Select a color'}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {colors.map((color) => {
              const selected = selectedColor?.id === color.id
              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.label}
                  aria-label={color.label}
                  aria-pressed={selected}
                  onClick={() => onChange({ ...selection, colorId: color.id })}
                  className={[
                    'h-9 w-9 rounded-full border-2 transition-transform duration-300',
                    selected
                      ? 'scale-110 border-brand-gold ring-1 ring-brand-gold ring-offset-2 ring-offset-brand-bg'
                      : 'border-brand-border hover:scale-105',
                  ].join(' ')}
                  style={{ backgroundColor: color.swatch || color.hex }}
                />
              )
            })}
          </div>
        </div>
      )}

      {!isBook(product) && sizes.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
              Size
            </p>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-gold hover:text-brand-goldLight"
            >
              Size Guide
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = sizeAvailable(product, selection.colorId, size)
              const selected = selection.size === size
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!available}
                  onClick={() => onChange({ ...selection, size })}
                  className={[
                    'min-w-12 border px-3 py-2 text-sm transition-all duration-300',
                    !available
                      ? 'cursor-not-allowed border-brand-border text-brand-muted line-through opacity-45'
                      : selected
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                        : 'border-brand-border text-brand-text hover:border-brand-gold/50',
                  ].join(' ')}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <p className={`text-sm font-medium ${stockClass}`} role="status">
        {stockState.message}
      </p>

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close size guide"
            onClick={() => setSizeGuideOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={sizeGuideTitleId}
            className="relative z-10 w-full max-w-md border border-brand-border bg-brand-surface p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id={sizeGuideTitleId} className="font-serif text-xl tracking-wide text-brand-text">
                Size Guide
              </h2>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center text-brand-muted hover:text-brand-text"
                aria-label="Close size guide"
                onClick={() => setSizeGuideOpen(false)}
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <p className="mt-2 text-sm text-brand-muted">
              Approximate body measurements for a relaxed unisex fit.
            </p>
            <table className="mt-5 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border text-[11px] uppercase tracking-[0.12em] text-brand-muted">
                  <th className="py-2 font-medium">Size</th>
                  <th className="py-2 font-medium">Chest</th>
                  <th className="py-2 font-medium">Length</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE_ROWS.map((row) => (
                  <tr key={row.size} className="border-b border-brand-border/70">
                    <td className="py-2.5 font-medium text-brand-text">{row.size}</td>
                    <td className="py-2.5 text-brand-muted">{row.chest}</td>
                    <td className="py-2.5 text-brand-muted">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
