import { Link } from 'react-router-dom'

export default function BrandStoryBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6 lg:py-28">
      <div className="grid overflow-hidden border border-brand-border lg:grid-cols-2">
        <div className="relative min-h-[22rem] bg-brand-card">
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/75 via-[#121316]/25 to-transparent dark:from-brand-bg dark:via-transparent" />
        </div>

        <div className="flex flex-col justify-center bg-brand-surface px-8 py-12 lg:px-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-gold">
            The Signature
          </p>
          <blockquote className="mt-5 font-serif text-2xl leading-snug tracking-[0.04em] text-brand-text sm:text-3xl">
            “Precision on the page. Presence in the world.”
          </blockquote>
          <p className="mt-6 text-sm leading-relaxed text-brand-muted">
            Mark Steffen is a hybrid house of literature and lifestyle — where signed editions,
            bespoke merchandise, and executive tools share one editorial standard.
          </p>
          <Link
            to="/shop?category=products"
            className="mt-8 inline-flex w-fit bg-gold-gradient px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-bg transition-opacity duration-300 hover:opacity-90"
          >
            Discover Lifestyle
          </Link>
        </div>
      </div>
    </section>
  )
}
