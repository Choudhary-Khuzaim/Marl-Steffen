const DEFAULT_ITEMS = [
  'MARK STEFFEN',
  'Official Literary Works',
  'Bespoke Merchandise',
  'Executive Lifestyle',
  'Signed Editions',
  'Complimentary Shipping Over $75',
  'Inner Circle Access',
]

export default function LuxuryMarquee({ items = DEFAULT_ITEMS }) {
  const ribbon = [...items, ...items]

  return (
    <div className="relative overflow-hidden border-y border-brand-border bg-brand-surface">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-surface to-transparent" />

      <div className="flex w-max animate-marquee whitespace-nowrap py-3">
        {ribbon.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="mx-6 inline-flex items-center gap-6 text-[11px] font-medium uppercase tracking-[0.28em] text-brand-goldLight/90"
          >
            <span className="text-gold-gradient">{item}</span>
            <span className="h-1 w-1 rounded-full bg-brand-gold/70" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  )
}
