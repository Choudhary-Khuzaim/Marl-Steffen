import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import products from '../data/products.json'
import { categories, getCategoryBySlug } from '../data/categories'
import ProductCard from '../components/shop/ProductCard'
import FilterSidebar, {
  DEFAULT_FILTERS,
  PRICE_TIERS,
  getActiveFilterTags,
} from '../components/shop/FilterSidebar'
import SortDropdown from '../components/shop/SortDropdown'
import { useCart } from '../context/CartContext'
import { motionEase } from '../components/common/MotionPrimitives'

function matchesPriceTier(product, tierId) {
  if (!tierId) return true
  const tier = PRICE_TIERS.find((item) => item.id === tierId)
  if (!tier) return true
  return product.price >= tier.min && product.price <= tier.max
}

function sortProducts(list, sortId) {
  const next = [...list]
  switch (sortId) {
    case 'price-asc':
      return next.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return next.sort((a, b) => b.price - a.price)
    case 'rating':
      return next.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    case 'newest':
      return next.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      )
    case 'featured':
    default:
      return next.sort((a, b) => Number(b.featured) - Number(a.featured))
  }
}

function filtersFromParams(params) {
  const category = params.get('category') || 'all'
  const subcategory = params.get('subcategory') || null
  const priceTier = params.get('price') || null
  const inStockOnly = params.get('stock') === 'in'
  return {
    category: category === 'all' ? 'all' : category,
    subcategory,
    priceTier,
    inStockOnly,
  }
}

function writeParams(filters, setSearchParams) {
  const next = new URLSearchParams()
  if (filters.category && filters.category !== 'all') {
    next.set('category', filters.category)
  }
  if (filters.subcategory) next.set('subcategory', filters.subcategory)
  if (filters.priceTier) next.set('price', filters.priceTier)
  if (filters.inStockOnly) next.set('stock', 'in')
  setSearchParams(next, { replace: true })
}

export default function ShopPage() {
  const { addToCart } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams))
  const [sort, setSort] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    setFilters(filtersFromParams(searchParams))
  }, [searchParams])

  function handleFilterChange(nextFilters) {
    setFilters(nextFilters)
    writeParams(nextFilters, setSearchParams)
  }

  function resetFilters() {
    const reset = { ...DEFAULT_FILTERS }
    setFilters(reset)
    setSearchQuery('')
    setSearchParams({}, { replace: true })
  }

  const activeTags = getActiveFilterTags(filters)
  const activeCategory = getCategoryBySlug(
    filters.category === 'all' ? null : filters.category,
  )

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const matched = products.filter((product) => {
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false
      }
      if (filters.subcategory && product.subcategory !== filters.subcategory) {
        return false
      }
      if (!matchesPriceTier(product, filters.priceTier)) return false
      if (filters.inStockOnly && !product.inStock) return false

      if (query) {
        const haystack = [
          product.name,
          product.subtitle,
          product.collection,
          product.category,
          product.subcategory,
          ...(product.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }

      return true
    })

    return sortProducts(matched, sort)
  }, [filters, searchQuery, sort])

  function handleAddToBag(product, color) {
    const defaultSize = product.options?.sizes?.includes('M')
      ? 'M'
      : product.options?.sizes?.[0] || null

    addToCart(
      product,
      {
        colorId: color?.id || null,
        colorLabel: color?.label || null,
        image: color?.image || product.primaryImage,
        size: defaultSize,
        price: product.price,
      },
      1,
    )
  }

  const title = activeCategory?.label || 'Shop All'
  const subtitle =
    filters.subcategory &&
    activeCategory?.subcategories.find((sub) => sub.slug === filters.subcategory)
      ?.label

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
      <div className="mb-8 flex flex-col gap-4 border-b border-brand-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-gold">
            Official Catalog
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-[0.06em] text-brand-text sm:text-4xl">
            {title}
            {subtitle ? ` · ${subtitle}` : ''}
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'item' : 'items'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleFilterChange({
                  ...filters,
                  category: 'all',
                  subcategory: null,
                })
              }
              className={[
                'relative border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
                filters.category === 'all'
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-brand-border text-brand-muted hover:border-brand-gold/50 hover:text-brand-gold',
              ].join(' ')}
            >
              {filters.category === 'all' && (
                <motion.span
                  layoutId="activeSubPill"
                  className="absolute inset-0 -z-10 bg-brand-gold/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              All
            </button>
            {categories.map((category) => {
              const active = filters.category === category.slug && !filters.subcategory
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    handleFilterChange({
                      ...filters,
                      category: category.slug,
                      subcategory: null,
                    })
                  }
                  className={[
                    'relative border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
                    active
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-brand-border text-brand-muted hover:border-brand-gold/50 hover:text-brand-gold',
                  ].join(' ')}
                >
                  {active && (
                    <motion.span
                      layoutId="activeSubPill"
                      className="absolute inset-0 -z-10 bg-brand-gold/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  {category.label}
                </button>
              )
            })}
            {activeCategory?.subcategories.map((sub) => {
              const active = filters.subcategory === sub.slug
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() =>
                    handleFilterChange({
                      ...filters,
                      subcategory: sub.slug,
                    })
                  }
                  className={[
                    'relative border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
                    active
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-brand-border text-brand-muted hover:border-brand-gold/50 hover:text-brand-gold',
                  ].join(' ')}
                >
                  {active && (
                    <motion.span
                      layoutId="activeSubPill"
                      className="absolute inset-0 -z-10 bg-brand-gold/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  {sub.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:w-56">
            <span className="sr-only">Search products</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search the shop"
              className="w-full border border-brand-border bg-brand-card py-2 pr-3 pl-9 text-sm text-brand-text placeholder:text-brand-muted focus:border-brand-gold/50 focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-brand-border px-3 py-2 text-sm text-brand-text lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} strokeWidth={1.75} />
              Filters
              {activeTags.length > 0 && (
                <span className="bg-brand-gold px-1.5 py-0.5 text-[10px] font-semibold text-brand-bg">
                  {activeTags.length}
                </span>
              )}
            </button>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)]">
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onReset={resetFilters}
          className="hidden lg:block"
        />

        <div>
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ duration: 0.35, ease: motionEase }}
                  >
                    <ProductCard
                      product={product}
                      onAddToBag={handleAddToBag}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-start border border-brand-border bg-brand-card px-6 py-16 sm:items-center sm:text-center">
              <h2 className="font-serif text-2xl tracking-wide text-brand-text">
                No items match
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-muted">
                Clear a filter or try another keyword across books, merchandise, and products.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 bg-gold-gradient px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-bg"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity lg:hidden ${
          mobileFiltersOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileFiltersOpen(false)}
        aria-hidden={!mobileFiltersOpen}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(100%,20rem)] flex-col border-r border-brand-border bg-brand-bg shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileFiltersOpen}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
          <span className="font-serif text-sm tracking-wide text-brand-gold">Filters</span>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-brand-text"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={resetFilters}
            showHeading={false}
          />
        </div>
        <div className="border-t border-brand-border p-4">
          <button
            type="button"
            className="w-full bg-gold-gradient px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-bg"
            onClick={() => setMobileFiltersOpen(false)}
          >
            Show {filteredProducts.length} Items
          </button>
        </div>
      </aside>
    </section>
  )
}
