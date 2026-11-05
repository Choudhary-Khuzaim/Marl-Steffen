import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import LuxuryImage from '../common/LuxuryImage'

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const lineTotal = item.price * item.quantity

  const details = [
    item.colorLabel ? `Color: ${item.colorLabel}` : null,
    item.size ? `Size: ${item.size}` : null,
    item.formatLabel ? `Format: ${item.formatLabel}` : null,
  ].filter(Boolean)

  return (
    <article className="flex gap-4 border-b border-brand-border py-5 last:border-b-0">
      <Link
        to={`/product/${item.slug}`}
        className="h-24 w-20 shrink-0 overflow-hidden border border-brand-border bg-brand-surface"
      >
        <LuxuryImage src={item.image} alt="" title={item.name} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/product/${item.slug}`}
              className="font-serif text-sm tracking-wide text-brand-text hover:text-brand-gold"
            >
              {item.name}
            </Link>
            {details.length > 0 && (
              <ul className="mt-1 space-y-0.5 text-xs text-brand-muted">
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-brand-muted transition-colors duration-300 hover:text-brand-danger"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="inline-flex items-center border border-brand-border">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center text-brand-text disabled:opacity-40"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus size={14} strokeWidth={1.75} />
            </button>
            <span className="min-w-8 text-center text-xs tabular-nums text-brand-text">
              {item.quantity}
            </span>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center text-brand-text"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus size={14} strokeWidth={1.75} />
            </button>
          </div>

          <p className="text-sm font-medium tabular-nums text-brand-gold">
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    </article>
  )
}
