const utilityLinks = [
  { label: 'Concierge', href: '/contact' },
  { label: 'Shipping', href: '/shipping' },
]

export default function AnnouncementBar() {
  return (
    <div className="border-b border-brand-border bg-brand-surface text-xs text-brand-muted">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 lg:px-6">
        <p className="flex-1 text-center tracking-[0.08em] text-brand-text/90 sm:text-left">
          <span className="text-brand-gold">Complimentary Domestic Shipping</span>
          <span className="mx-2 text-brand-border">|</span>
          Orders Over $75
        </p>

        <div className="hidden items-center gap-4 sm:flex">
          {utilityLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-300 hover:text-brand-gold"
            >
              {link.label}
            </a>
          ))}
          <label className="inline-flex items-center gap-1.5">
            <span className="sr-only">Currency</span>
            <select
              defaultValue="USD"
              aria-label="Select currency"
              className="cursor-pointer border-0 bg-transparent text-xs text-brand-gold focus:outline-none"
            >
              <option value="USD" className="bg-brand-surface text-brand-text">
                USD $
              </option>
              <option value="EUR" className="bg-brand-surface text-brand-text">
                EUR €
              </option>
              <option value="GBP" className="bg-brand-surface text-brand-text">
                GBP £
              </option>
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}
