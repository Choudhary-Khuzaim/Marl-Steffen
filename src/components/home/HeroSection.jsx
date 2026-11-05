import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Headphones } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import products from '../../data/products.json'
import {
  StaggerContainer,
  StaggerItem,
  TiltCard3D,
} from '../common/MotionPrimitives'

const floatTransition = (delay = 0) => ({
  duration: 4.5,
  repeat: Infinity,
  ease: 'easeInOut',
  delay,
})

export default function HeroSection() {
  const { openBookPreview } = useCart()
  const featuredBook =
    products.find((product) => product.slug === 'the-obsidian-ledger') ||
    products.find((product) => product.category === 'books')

  return (
    <section className="relative isolate min-h-[90vh] overflow-hidden border-b border-brand-border bg-ambient-spotlight">
      <div className="absolute inset-0 bg-ambient-noise opacity-40" />

      <img
        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&q=80"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-[0.22] dark:opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/88 to-transparent dark:via-brand-bg/90 dark:to-brand-bg/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-brand-bg/40 dark:to-brand-bg/60" />

      {/* Right-column 3D showcase */}
      <div className="absolute right-[6%] top-1/2 hidden w-[22rem] -translate-y-1/2 lg:block xl:right-[10%] xl:w-[26rem]">
        <TiltCard3D className="relative h-[28rem]">
          <motion.div
            className="absolute left-8 top-0 h-72 w-52 overflow-hidden border border-brand-border bg-[#EFECE6] shadow-brand ring-1 ring-black/5 dark:bg-[#111318] dark:ring-white/10"
            style={{ rotate: -8 }}
            animate={{ y: [0, -8, 0] }}
            transition={floatTransition(0)}
          >
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=85"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141311]/80 to-transparent p-3 dark:from-black/75">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37]">Signed Book</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute left-20 top-16 h-80 w-56 overflow-hidden border border-brand-gold/40 bg-[#EFECE6] shadow-gold-glow ring-1 ring-black/5 dark:bg-[#111318] dark:ring-white/10"
            style={{ rotate: 4 }}
            animate={{ y: [0, -8, 0] }}
            transition={floatTransition(0.6)}
          >
            <img
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141311]/80 to-transparent p-3 dark:from-black/75">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37]">450GSM Hoodie</p>
            </div>
          </motion.div>

          <motion.div
            className="glass-panel absolute -left-2 bottom-10 px-4 py-3"
            animate={{ y: [0, -8, 0] }}
            transition={floatTransition(1.1)}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold">Executive Journal</p>
            <p className="mt-1 text-sm text-brand-text">Collector Vault Live</p>
          </motion.div>

          <motion.div
            className="glass-panel absolute right-0 top-8 px-4 py-3"
            animate={{ y: [0, -8, 0] }}
            transition={floatTransition(1.6)}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold">Audio</p>
            <p className="mt-1 text-sm text-brand-text">Prologue Ready</p>
          </motion.div>
        </TiltCard3D>
      </div>

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-32 lg:justify-center lg:pb-28 lg:px-6">
        <StaggerContainer className="max-w-3xl" once={false} initial="hidden" animate="show">
          <StaggerItem>
            <div className="glass-panel mb-6 inline-flex w-fit items-center gap-2 px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse-gold rounded-full bg-brand-gold" />
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand-gold">
                Official Mark Steffen Store
              </span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <h1 className="font-serif text-4xl uppercase leading-[1.08] tracking-[0.08em] text-brand-text sm:text-5xl lg:text-6xl">
              <span className="text-gold-gradient">MARK STEFFEN</span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">
              Official Literary Works, Bespoke Merchandise &amp; Executive Lifestyle Products —
              designed as one editorial house.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { label: 'Books', href: '/shop?category=books' },
                { label: 'Merchandise', href: '/shop?category=merchandise' },
                { label: 'Products', href: '/shop?category=products' },
              ].map((pill) => (
                <Link
                  key={pill.href}
                  to={pill.href}
                  className="rounded-full border border-brand-gold/40 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-brand-gold shadow-sm backdrop-blur-md transition-all duration-300 hover:border-brand-gold hover:text-brand-goldDark dark:bg-brand-bg/40 dark:hover:text-brand-goldLight"
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="btn-gold-shimmer px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em]"
              >
                Explore the Collection
              </Link>
              <Link
                to="/shop?category=books"
                className="border border-brand-border px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-text transition-all duration-300 hover:border-brand-gold/50"
              >
                Shop Books
              </Link>
              {featuredBook && (
                <button
                  type="button"
                  onClick={() => openBookPreview(featuredBook)}
                  className="inline-flex items-center gap-2 border border-brand-gold/40 bg-brand-gold/5 px-5 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-brand-gold transition-all duration-300 hover:bg-brand-gold/10"
                >
                  <Headphones size={15} />
                  Listen to Prologue
                </button>
              )}
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  )
}
