import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { categories } from '../../data/categories'

export const PRICE_TIERS = [
  { id: 'under-25', label: 'Under $25', min: 0, max: 24.99 },
  { id: '25-50', label: '$25 to $50', min: 25, max: 50 },
  { id: '50-100', label: '$50 to $100', min: 50, max: 100 },
  { id: '100-plus', label: '$100+', min: 100, max: Infinity },
]

export const DEFAULT_FILTERS = {
  category: 'all',
  subcategory: null,
  priceTier: null,
  inStockOnly: false,
}

export function getActiveFilterTags(filters) {
  const tags = []

  if (filters.category && filters.category !== 'all') {
    const match = categories.find((item) => item.slug === filters.category)
    tags.push({
      key: `category:${filters.category}`,
      label: match?.label ?? filters.category,
      clear: (current) => ({ ...current, category: 'all', subcategory: null }),
    })
  }

  if (filters.subcategory) {
    const parent = categories.find((item) => item.slug === filters.category)
    const sub = parent?.subcategories.find((item) => item.slug === filters.subcategory)
    tags.push({
      key: `sub:${filters.subcategory}`,
      label: sub?.label ?? filters.subcategory,
      clear: (current) => ({ ...current, subcategory: null }),
    })
  }

  if (filters.priceTier) {
    const match = PRICE_TIERS.find((item) => item.id === filters.priceTier)
    tags.push({
      key: `price:${filters.priceTier}`,
      label: match?.label ?? filters.priceTier,
      clear: (current) => ({ ...current, priceTier: null }),
    })
  }

  if (filters.inStockOnly) {
    tags.push({
      key: 'stock:in',
      label: 'In Stock Only',
      clear: (current) => ({ ...current, inStockOnly: false }),
    })
  }

  return tags
}

function Accordion({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-brand-border py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-brand-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-4 space-y-2.5">{children}</div>}
    </div>
  )
}

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  className = '',
  showHeading = true,
}) {
  const activeTags = getActiveFilterTags(filters)
  const activeCategory = categories.find((item) => item.slug === filters.category)

  return (
    <aside className={className}>
      <div className="mb-4 flex items-center justify-between gap-3">
        {showHeading ? (
          <h2 className="font-serif text-lg tracking-wide text-brand-text">Filters</h2>
        ) : (
          <span className="text-[11px] uppercase tracking-[0.14em] text-brand-muted">
            Refine
          </span>
        )}
        {activeTags.length > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-gold hover:text-brand-goldLight"
          >
            Reset All
          </button>
        )}
      </div>

      {activeTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeTags.map((tag) => (
            <button
              key={tag.key}
              type="button"
              onClick={() => onChange(tag.clear(filters))}
              className="inline-flex items-center gap-1.5 border border-brand-border bg-brand-card px-2.5 py-1 text-xs text-brand-text transition-all duration-300 hover:border-brand-gold/50"
            >
              {tag.label}
              <X size={12} strokeWidth={2} aria-hidden="true" />
              <span className="sr-only">Remove {tag.label}</span>
            </button>
          ))}
        </div>
      )}

      <Accordion title="Category">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-text">
          <input
            type="radio"
            name="category"
            checked={filters.category === 'all'}
            onChange={() => onChange({ ...filters, category: 'all', subcategory: null })}
            className="accent-brand-gold"
          />
          All
        </label>
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-text"
          >
            <input
              type="radio"
              name="category"
              checked={filters.category === category.slug}
              onChange={() =>
                onChange({
                  ...filters,
                  category: category.slug,
                  subcategory: null,
                })
              }
              className="accent-brand-gold"
            />
            {category.label}
          </label>
        ))}
      </Accordion>

      {activeCategory && (
        <Accordion title="Sub-Category">
          {activeCategory.subcategories.map((sub) => (
            <label
              key={sub.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-text"
            >
              <input
                type="radio"
                name="subcategory"
                checked={filters.subcategory === sub.slug}
                onChange={() => onChange({ ...filters, subcategory: sub.slug })}
                className="accent-brand-gold"
              />
              {sub.label}
            </label>
          ))}
        </Accordion>
      )}

      <Accordion title="Price">
        {PRICE_TIERS.map((tier) => (
          <label
            key={tier.id}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-text"
          >
            <input
              type="radio"
              name="priceTier"
              checked={filters.priceTier === tier.id}
              onChange={() => onChange({ ...filters, priceTier: tier.id })}
              className="accent-brand-gold"
            />
            {tier.label}
          </label>
        ))}
      </Accordion>

      <Accordion title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-text">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() =>
              onChange({ ...filters, inStockOnly: !filters.inStockOnly })
            }
            className="accent-brand-gold"
          />
          In Stock Only
        </label>
      </Accordion>
    </aside>
  )
}
