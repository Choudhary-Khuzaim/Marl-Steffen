import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../../data/categories'
import { FadeInUpView } from '../common/MotionPrimitives'

export default function CategoryHierarchyGrid() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 lg:px-6 lg:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-ambient-spotlight opacity-60" />

      <FadeInUpView className="max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-gold">
          Three Pillars
        </p>
        <h2 className="mt-3 font-serif text-3xl tracking-[0.06em] text-brand-text sm:text-4xl">
          Curated Worlds
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">
          A bento map of the Mark Steffen ecosystem — literature, fandom merchandise, and executive lifestyle products.
        </p>
      </FadeInUpView>

      <div className="mt-12 grid auto-rows-[minmax(11rem,auto)] gap-4 md:grid-cols-6 md:grid-rows-2">
        {categories.map((category, index) => {
          const span =
            index === 0
              ? 'md:col-span-3 md:row-span-2'
              : 'md:col-span-3'

          return (
            <FadeInUpView
              key={category.id}
              delay={index * 0.12}
              className={[
                'group relative overflow-hidden border border-brand-border bg-brand-card transition-all duration-500 hover:border-brand-gold/50 hover:shadow-gold-glow',
                span,
              ].join(' ')}
            >
              <Link to={`/shop?category=${category.slug}`} className="absolute inset-0">
                <img
                  src={category.image}
                  alt=""
                  className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105 dark:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/88 via-[#121316]/35 to-transparent dark:from-brand-bg dark:via-brand-bg/55" />
              </Link>

              <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  {category.tagline}
                </p>
                <h3 className="mt-1 font-serif text-2xl tracking-[0.08em] text-white sm:text-3xl">
                  {category.label}
                </h3>
                <p className="mt-2 max-w-md text-sm text-white/80 line-clamp-2">
                  {category.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {category.subcategories.map((sub) => (
                    <motion.div
                      key={sub.id}
                      whileHover={{ x: 4, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                    >
                      <Link
                        to={`/shop?category=${category.slug}&subcategory=${sub.slug}`}
                        className="inline-block rounded-full border border-[#D4AF37]/45 bg-[#141311]/70 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[#D4AF37] backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_18px_rgba(var(--brand-gold-rgb),0.25)]"
                      >
                        {sub.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInUpView>
          )
        })}
      </div>
    </section>
  )
}
