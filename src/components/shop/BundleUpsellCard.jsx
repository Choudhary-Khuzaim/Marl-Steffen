import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import products from '../../data/products.json'
import { useCart } from '../../context/CartContext'
import LuxuryImage from '../common/LuxuryImage'

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

const DEFAULT_SLUGS = [
  'the-obsidian-ledger',
  'ms-crest-tee',
  'obsidian-leather-journal',
]

export default function BundleUpsellCard({
  title = 'Complete the Collector Set',
  subtitle = 'Book + Merch + Product — curated as one editorial ritual.',
  slugs = DEFAULT_SLUGS,
  discount = 0.15,
}) {
  const { addToCart } = useCart()

  const bundleItems = slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean)

  if (bundleItems.length < 2) return null

  const subtotal = bundleItems.reduce((sum, item) => sum + item.price, 0)
  const bundlePrice = subtotal * (1 - discount)
  const savings = subtotal - bundlePrice

  function addBundle() {
    bundleItems.forEach((product) => {
      const defaultSize = product.options?.sizes?.includes('M')
        ? 'M'
        : product.options?.sizes?.[0] || null
      const color = product.options?.colors?.[0]
      const format = product.options?.formats?.[0]

      addToCart(
        product,
        {
          colorId: color?.id || null,
          colorLabel: color?.label || null,
          image: color?.image || product.primaryImage,
          size: defaultSize,
          formatId: format?.id || null,
          formatLabel: format?.label || null,
          price: product.price * (1 - discount),
        },
        1,
      )
    })
  }

  return (
    <aside className="glass-panel overflow-hidden">
      <div className="border-b border-brand-border bg-gradient-to-r from-brand-gold/10 via-transparent to-brand-gold/5 px-5 py-4">
        <div className="flex items-center gap-2 text-brand-gold">
          <Package size={16} />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
            Collector Bundle · 15% Off
          </p>
        </div>
        <h3 className="mt-2 font-serif text-xl tracking-wide text-brand-text">{title}</h3>
        <p className="mt-1 text-sm text-brand-muted">{subtitle}</p>
      </div>

      <ul className="divide-y divide-brand-border/80">
        {bundleItems.map((item) => (
          <li key={item.id} className="flex items-center gap-3 px-5 py-3">
            <div className="h-14 w-12 shrink-0 overflow-hidden">
              <LuxuryImage src={item.primaryImage} alt="" title={item.name} />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                to={`/product/${item.slug}`}
                className="truncate font-serif text-sm text-brand-text hover:text-brand-gold"
              >
                {item.name}
              </Link>
              <p className="text-[10px] uppercase tracking-[0.12em] text-brand-muted capitalize">
                {item.category}
              </p>
            </div>
            <span className="text-sm text-brand-muted line-through">
              {formatPrice(item.price)}
            </span>
          </li>
        ))}
      </ul>

      <div className="px-5 py-5">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="text-sm text-brand-muted">
              Bundle total{' '}
              <span className="line-through">{formatPrice(subtotal)}</span>
            </p>
            <p className="text-xl font-medium text-brand-gold">
              {formatPrice(bundlePrice)}
            </p>
          </div>
          <p className="text-xs text-brand-success">Save {formatPrice(savings)}</p>
        </div>
        <button
          type="button"
          onClick={addBundle}
          className="btn-gold-shimmer mt-4 w-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
        >
          Add Collector Set
        </button>
      </div>
    </aside>
  )
}
