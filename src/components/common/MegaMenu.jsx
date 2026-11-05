import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { categories } from '../../data/categories'
import products from '../../data/products.json'
import { motionEase } from './MotionPrimitives'

function countFor(categorySlug, subcategorySlug) {
  return products.filter(
    (product) =>
      product.category === categorySlug &&
      product.subcategory === subcategorySlug,
  ).length
}

export default function MegaMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute left-0 right-0 top-full z-50 hidden overflow-hidden border-b border-brand-border bg-brand-bg/95 shadow-2xl backdrop-blur-xl lg:block"
          role="region"
          aria-label="Shop categories"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: motionEase }}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-3 gap-8 px-6 py-10">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="border-l border-brand-border pl-6 first:border-l-0 first:pl-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.06, duration: 0.35, ease: motionEase }}
              >
                <Link
                  to={`/shop?category=${category.slug}`}
                  onClick={onClose}
                  className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold transition-colors duration-300 hover:text-brand-goldLight"
                >
                  {category.label}
                </Link>
                <p className="mt-2 text-xs leading-relaxed text-brand-muted">
                  {category.tagline}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {category.subcategories.map((sub) => {
                    const count = countFor(category.slug, sub.slug)
                    return (
                      <li key={sub.id}>
                        <Link
                          to={`/shop?category=${category.slug}&subcategory=${sub.slug}`}
                          onClick={onClose}
                          className="group flex items-center justify-between gap-3 text-sm text-brand-muted transition-colors duration-300 hover:text-brand-text"
                        >
                          <span>{sub.label}</span>
                          <span className="rounded-sm border border-brand-border px-1.5 py-0.5 text-[10px] tabular-nums text-brand-muted group-hover:border-brand-gold/40 group-hover:text-brand-gold">
                            {count}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <Link
                  to={`/shop?category=${category.slug}`}
                  onClick={onClose}
                  className="mt-5 inline-block text-[11px] font-medium uppercase tracking-[0.16em] text-brand-gold transition-colors duration-300 hover:text-brand-goldLight"
                >
                  Shop All {category.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
