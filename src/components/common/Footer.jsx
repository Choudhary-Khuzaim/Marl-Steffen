import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/categories'

const serviceLinks = [
  { label: 'Concierge', href: '/contact' },
  { label: 'Shipping & Returns', href: '/shipping' },
  { label: 'Order Tracking', href: '/orders/track' },
  { label: 'Size Guide', href: '/size-guide' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
]

const paymentBadges = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay']

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <footer className="mt-auto border-t border-brand-border bg-brand-surface">
      <div className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
          <div className="grid gap-8 overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:p-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-gold">
              VIP Correspondence
            </p>
            <h2 className="mt-3 font-serif text-2xl tracking-[0.08em] text-brand-text sm:text-3xl">
              Join the Inner Circle
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-muted">
              Early access to signed editions, capsule drops, and executive product releases —
              plus a complimentary digital novella for new subscribers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <label htmlFor="vip-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="vip-email"
                type="email"
                required
                value={email}
                onChange={(event) => {
                  setSubmitted(false)
                  setEmail(event.target.value)
                }}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted transition-all duration-300 focus:border-brand-gold/50 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gold-gradient px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-bg transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
              >
                Subscribe
              </button>
            </div>
            {submitted && (
              <p className="mt-2 text-xs text-brand-success" role="status">
                Welcome — check your inbox for your novella download.
              </p>
            )}
          </form>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <p className="font-serif text-sm tracking-[0.22em] text-brand-text">MARK STEFFEN</p>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted">
            Official literary works, bespoke merchandise, and executive lifestyle products —
            curated for collectors who expect precision.
          </p>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Collections
          </h3>
          <ul className="mt-4 space-y-2.5">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/shop?category=${category.slug}`}
                  className="text-sm text-brand-muted transition-colors duration-300 hover:text-brand-text"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Client Care
          </h3>
          <ul className="mt-4 space-y-2.5">
            {[...serviceLinks, ...legalLinks].map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-sm text-brand-muted transition-colors duration-300 hover:text-brand-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold">
            We Accept
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paymentBadges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-brand-border bg-brand-card px-3 py-1.5 text-[11px] tracking-wide text-brand-muted"
              >
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <p>© {new Date().getFullYear()} Mark Steffen. All rights reserved.</p>
          <p className="tracking-[0.08em]">Literary Works · Merchandise · Lifestyle</p>
        </div>
      </div>
    </footer>
  )
}
