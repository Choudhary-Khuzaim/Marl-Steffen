import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, X } from 'lucide-react'
import { useCart, VIP_TIERS } from '../../context/CartContext'
import CartItem from './CartItem'

export const FREE_SHIPPING_THRESHOLD = VIP_TIERS[0].threshold

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  show: (index) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 + index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    cartTotal,
    cartItemCount,
    closeCart,
    vipProgress,
  } = useCart()

  useEffect(() => {
    if (!isCartOpen) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isCartOpen, closeCart])

  const freeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="modal-backdrop fixed inset-0 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-hidden border-l border-brand-border bg-brand-bg/95 shadow-2xl backdrop-blur-xl md:rounded-l-3xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg tracking-wide text-brand-text">Your Bag</h2>
                {cartItemCount > 0 && (
                  <span className="rounded-full bg-gold-gradient px-2.5 py-0.5 text-[10px] font-semibold tabular-nums text-brand-bg">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex h-10 w-10 items-center justify-center text-brand-muted hover:text-brand-text"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>

            {cartItems.length > 0 && (
              <div className="space-y-4 border-b border-brand-border px-5 py-4">
                <div>
                  <p className="text-sm text-brand-text">
                    {freeShipping
                      ? 'You’ve unlocked complimentary domestic shipping.'
                      : `Add ${formatPrice(Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal))} more for Free Shipping.`}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-border">
                    <motion.div
                      className="h-full rounded-full bg-gold-gradient"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                      }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                <div className="glass-panel rounded-2xl px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
                      VIP Reward Path
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-brand-muted">
                      {vipProgress.currentTier?.label || 'Guest'}
                      {vipProgress.nextTier ? ` → ${vipProgress.nextTier.label}` : ' · Complete'}
                    </p>
                  </div>
                  <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-brand-border">
                    <motion.div
                      className="h-full rounded-full bg-gold-gradient"
                      initial={{ width: 0 }}
                      animate={{ width: `${vipProgress.progress}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <span className="absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-bg bg-brand-gold" />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-brand-muted">
                    <span>Collector ${VIP_TIERS[0].threshold}</span>
                    <span>Inner Circle ${VIP_TIERS[1].threshold}</span>
                  </div>
                  {vipProgress.nextTier && (
                    <p className="mt-2 text-xs text-brand-muted">
                      Add {formatPrice(vipProgress.remaining)} to unlock{' '}
                      <span className="text-brand-gold">{vipProgress.nextTier.label}</span>.
                    </p>
                  )}
                  {!vipProgress.nextTier && (
                    <p className="mt-2 text-xs text-brand-success">
                      Inner Circle unlocked — priority drops &amp; signed access active.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5">
              {cartItems.length > 0 ? (
                <ul>
                  {cartItems.map((item, index) => (
                    <motion.li
                      key={item.id}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                    >
                      <CartItem item={item} />
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-4 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-border bg-brand-card text-brand-gold">
                    <ShoppingBag size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl tracking-wide text-brand-text">
                    Your bag is empty
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-brand-muted">
                    Explore signed editions, merchandise, and executive lifestyle products.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="btn-gold-shimmer mt-6 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-brand-border px-5 py-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-brand-muted">Subtotal</span>
                  <span className="text-lg font-medium tabular-nums text-brand-gold">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-brand-muted">
                  Shipping & taxes calculated at checkout. Free domestic shipping over{' '}
                  {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                </p>
                <button
                  type="button"
                  className="btn-gold-shimmer mt-4 w-full px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
