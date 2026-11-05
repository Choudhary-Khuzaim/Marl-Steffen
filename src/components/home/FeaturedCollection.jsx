import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import products from '../../data/products.json'
import ProductCard from '../shop/ProductCard'
import { useCart } from '../../context/CartContext'
import { FadeInUpView, motionEase } from '../common/MotionPrimitives'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'books', label: 'Books' },
  { id: 'merchandise', label: 'Merchandise' },
  { id: 'products', label: 'Products' },
]

export default function FeaturedCollection() {
  const [tab, setTab] = useState('all')
  const { addToCart } = useCart()

  const featured = useMemo(() => {
    return products
      .filter((product) => product.featured)
      .filter((product) => (tab === 'all' ? true : product.category === tab))
      .slice(0, 4)
  }, [tab])

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

  return (
    <section
      id="signature-selection"
      className="scroll-mt-28 border-y border-brand-border bg-brand-surface"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-24 lg:px-6">
        <FadeInUpView className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-gold">
              Featured
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-[0.06em] text-brand-text sm:text-4xl">
              Signature Selection
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((item) => {
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={[
                    'relative border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300',
                    active
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-brand-border text-brand-muted hover:border-brand-gold/40 hover:text-brand-text',
                  ].join(' ')}
                >
                  {active && (
                    <motion.span
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 -z-10 bg-brand-gold/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  {item.label}
                </button>
              )
            })}
          </div>
        </FadeInUpView>

        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {featured.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ duration: 0.35, ease: motionEase }}
              >
                <ProductCard product={product} onAddToBag={handleAddToBag} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-block border border-brand-border px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-text transition-all duration-300 hover:border-brand-gold/50"
          >
            View Full Catalog
          </Link>
        </div>
      </div>
    </section>
  )
}
