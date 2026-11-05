import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import products from '../../data/products.json'
import { useCart } from '../../context/CartContext'
import LuxuryImage from '../common/LuxuryImage'
import { FadeInUpView, motionEase } from '../common/MotionPrimitives'

const HOTSPOTS = [
  {
    id: 'journal',
    top: '28%',
    left: '62%',
    slug: 'obsidian-leather-journal',
    label: 'Obsidian Journal',
  },
  {
    id: 'pen',
    top: '48%',
    left: '44%',
    slug: 'gilt-nib-fountain-pen',
    label: 'Gilt Nib Pen',
  },
  {
    id: 'book',
    top: '58%',
    left: '72%',
    slug: 'the-gilded-archives',
    label: 'Gilded Archives',
  },
  {
    id: 'candle',
    top: '36%',
    left: '28%',
    slug: 'library-smoke-candle',
    label: 'Library Smoke',
  },
]

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function LookbookHotspots() {
  const [activeId, setActiveId] = useState(HOTSPOTS[0].id)
  const { openQuickView } = useCart()

  const activeHotspot = HOTSPOTS.find((spot) => spot.id === activeId) || HOTSPOTS[0]
  const activeProduct = products.find((product) => product.slug === activeHotspot.slug)

  return (
    <section className="border-y border-brand-border bg-brand-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6 lg:py-28">
        <FadeInUpView className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-gold">
              Interactive Lookbook
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-[0.06em] text-brand-text sm:text-4xl">
              Shop The Executive Study
            </h2>
            <p className="mt-3 max-w-xl text-sm text-brand-muted">
              Hover the gold pins to reveal curated Books, Merchandise accents, and Lifestyle Products styled as one editorial desk.
            </p>
          </div>
          <Link
            to="/shop?category=products"
            className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-gold hover:text-brand-goldLight"
          >
            View Lifestyle →
          </Link>
        </FadeInUpView>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <FadeInUpView
            delay={0.1}
            className="relative aspect-[16/11] overflow-hidden border border-brand-border bg-brand-card"
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
              alt="Executive study lookbook"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/50 via-transparent to-transparent" />

            {HOTSPOTS.map((spot) => {
              const product = products.find((item) => item.slug === spot.slug)
              return (
                <button
                  key={spot.id}
                  type="button"
                  style={{ top: spot.top, left: spot.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  aria-label={spot.label}
                  onMouseEnter={() => setActiveId(spot.id)}
                  onFocus={() => setActiveId(spot.id)}
                  onClick={() => product && openQuickView(product)}
                >
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-brand-gold/50"
                      animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full bg-brand-gold/35"
                      animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 0.35,
                      }}
                    />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-brand-gold shadow-gold-glow" />
                  </span>
                </button>
              )
            })}
          </FadeInUpView>

          <div className="glass-panel relative flex min-h-[28rem] flex-col overflow-hidden p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold">Pinned Piece</p>
            <AnimatePresence mode="wait">
              {activeProduct ? (
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: motionEase }}
                  className="flex flex-1 flex-col"
                >
                  <div className="mt-4 aspect-[4/5] w-full overflow-hidden">
                    <LuxuryImage
                      src={activeProduct.primaryImage}
                      alt=""
                      title={activeProduct.name}
                      showVignette
                    />
                  </div>
                  <h3 className="mt-4 font-serif text-xl tracking-wide text-brand-text">
                    {activeProduct.name}
                  </h3>
                  <p className="mt-1 text-sm text-brand-muted capitalize">
                    {activeProduct.category} · {activeProduct.subcategory?.replace(/-/g, ' ')}
                  </p>
                  <p className="mt-3 text-brand-gold">{formatPrice(activeProduct.price)}</p>
                  <div className="mt-auto flex gap-2 pt-6">
                    <button
                      type="button"
                      onClick={() => openQuickView(activeProduct)}
                      className="btn-gold-shimmer flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]"
                    >
                      Quick View
                    </button>
                    <Link
                      to={`/product/${activeProduct.slug}`}
                      className="border border-brand-border px-4 py-3 text-xs uppercase tracking-[0.14em] text-brand-text hover:border-brand-gold/40"
                    >
                      Details
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-sm text-brand-muted"
                >
                  Select a pin to preview.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
