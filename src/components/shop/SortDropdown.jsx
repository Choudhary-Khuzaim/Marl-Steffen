export const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Rating' },
  { id: 'newest', label: 'Newest Arrivals' },
]

export default function SortDropdown({ value, onChange, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-2 text-sm text-brand-muted ${className}`}>
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-[11.5rem] rounded-xl border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text transition-all duration-300 focus:border-brand-gold/50 focus:outline-none"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id} className="bg-brand-card">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
