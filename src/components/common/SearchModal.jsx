import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import products from '../../data/products.json'
import { categories } from '../../data/categories'
import LuxuryImage from './LuxuryImage'

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    setQuery('')
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products
      .filter((product) => {
        const haystack = [
          product.name,
          product.subtitle,
          product.category,
          product.subcategory,
          product.collection,
          ...(product.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, 8)
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        className="modal-backdrop absolute inset-0 backdrop-blur-sm"
        aria-label="Close search"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the Mark Steffen shop"
        className="relative z-10 w-full max-w-2xl overflow-hidden border border-brand-border bg-brand-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-brand-border px-4 py-3">
          <Search size={18} className="text-brand-gold" strokeWidth={1.75} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search books, merchandise & products…"
            className="w-full bg-transparent text-sm text-brand-text placeholder:text-brand-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center text-brand-muted hover:text-brand-text"
            aria-label="Close search"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-3">
          {!query.trim() && (
            <div className="px-2 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-muted">
                Browse Pillars
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/shop?category=${category.slug}`}
                    onClick={onClose}
                    className="border border-brand-border px-3 py-2 text-xs uppercase tracking-[0.14em] text-brand-muted transition-all duration-300 hover:border-brand-gold/50 hover:text-brand-gold"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-brand-muted">
              No matches for “{query.trim()}”.
            </p>
          )}

          {results.length > 0 && (
            <ul className="space-y-1">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-sm px-2 py-2 transition-colors duration-300 hover:bg-brand-card"
                  >
                    <div className="h-14 w-12 shrink-0 overflow-hidden">
                      <LuxuryImage
                        src={product.primaryImage}
                        alt=""
                        title={product.name}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-sm tracking-wide text-brand-text">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-brand-muted">
                        {product.category} · {product.subcategory}
                      </p>
                    </div>
                    <span className="text-sm text-brand-gold">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
