import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'mark_steffen_cart'
const WISHLIST_KEY = 'mark_steffen_wishlist'
const CartContext = createContext(null)

export const VIP_TIERS = [
  { id: 'collector', label: 'Collector', threshold: 75 },
  { id: 'inner-circle', label: 'Inner Circle', threshold: 200 },
]

function buildCartItemId(productId, selectedVariant = {}) {
  const color = selectedVariant.colorId || selectedVariant.color || 'nocolor'
  const size = selectedVariant.size || 'nosize'
  const format = selectedVariant.formatId || selectedVariant.format || 'noformat'
  return `${productId}__${color}__${size}__${format}`
}

function matchesVariant(item, productId, selectedVariant = {}) {
  return (
    item.productId === productId &&
    (item.colorId || null) === (selectedVariant.colorId || selectedVariant.color || null) &&
    (item.size || null) === (selectedVariant.size || null) &&
    (item.formatId || null) === (selectedVariant.formatId || selectedVariant.format || null)
  )
}

function readJson(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function getVipProgress(total) {
  const collector = VIP_TIERS[0]
  const inner = VIP_TIERS[1]

  if (total >= inner.threshold) {
    return {
      currentTier: inner,
      nextTier: null,
      remaining: 0,
      progress: 100,
      unlocked: [collector.id, inner.id],
    }
  }

  if (total >= collector.threshold) {
    const remaining = inner.threshold - total
    const span = inner.threshold - collector.threshold
    const progress =
      50 + ((total - collector.threshold) / span) * 50
    return {
      currentTier: collector,
      nextTier: inner,
      remaining,
      progress,
      unlocked: [collector.id],
    }
  }

  return {
    currentTier: null,
    nextTier: collector,
    remaining: collector.threshold - total,
    progress: (total / collector.threshold) * 50,
    unlocked: [],
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readJson(STORAGE_KEY, []))
  const [wishlist, setWishlist] = useState(() => readJson(WISHLIST_KEY, []))
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [bookPreviewProduct, setBookPreviewProduct] = useState(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch {
      /* ignore */
    }
  }, [cartItems])

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
    } catch {
      /* ignore */
    }
  }, [wishlist])

  useEffect(() => {
    const locked =
      isCartOpen ||
      isWishlistOpen ||
      Boolean(quickViewProduct) ||
      Boolean(bookPreviewProduct)
    if (!locked) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isCartOpen, isWishlistOpen, quickViewProduct, bookPreviewProduct])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen((open) => !open), [])

  const openWishlist = useCallback(() => setIsWishlistOpen(true), [])
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), [])
  const toggleWishlist = useCallback(
    () => setIsWishlistOpen((open) => !open),
    [],
  )

  const openQuickView = useCallback((product) => setQuickViewProduct(product), [])
  const closeQuickView = useCallback(() => setQuickViewProduct(null), [])

  const openBookPreview = useCallback((product) => setBookPreviewProduct(product), [])
  const closeBookPreview = useCallback(() => setBookPreviewProduct(null), [])

  const addToCart = useCallback((product, selectedVariant = {}, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1)
    const unitPrice = selectedVariant.price ?? product.price ?? 0

    setCartItems((current) => {
      const existing = current.find((item) =>
        matchesVariant(item, product.id, selectedVariant),
      )

      if (existing) {
        return current.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        )
      }

      const nextItem = {
        id: buildCartItemId(product.id, selectedVariant),
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image:
          selectedVariant.image ||
          product.primaryImage ||
          product.images?.[0]?.src ||
          '',
        price: unitPrice,
        quantity: qty,
        colorId: selectedVariant.colorId || selectedVariant.color || null,
        colorLabel:
          selectedVariant.colorLabel ||
          selectedVariant.colorName ||
          selectedVariant.label ||
          null,
        size: selectedVariant.size || null,
        formatId: selectedVariant.formatId || selectedVariant.format || null,
        formatLabel: selectedVariant.formatLabel || null,
      }

      return [...current, nextItem]
    })

    setQuickViewProduct(null)
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((cartItemId) => {
    setCartItems((current) => current.filter((item) => item.id !== cartItemId))
  }, [])

  const updateQuantity = useCallback((cartItemId, newQuantity) => {
    const qty = Math.max(1, Number(newQuantity) || 1)
    setCartItems((current) =>
      current.map((item) =>
        item.id === cartItemId ? { ...item, quantity: qty } : item,
      ),
    )
  }, [])

  const isInWishlist = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist],
  )

  const toggleWishlistItem = useCallback((product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id)
      if (exists) return current.filter((item) => item.id !== product.id)
      return [
        ...current,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          primaryImage: product.primaryImage,
          category: product.category,
          subcategory: product.subcategory,
        },
      ]
    })
  }, [])

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((current) => current.filter((item) => item.id !== productId))
  }, [])

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  const cartItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const vipProgress = useMemo(() => getVipProgress(cartTotal), [cartTotal])

  const value = useMemo(
    () => ({
      cartItems,
      wishlist,
      isCartOpen,
      isWishlistOpen,
      quickViewProduct,
      bookPreviewProduct,
      cartTotal,
      cartItemCount,
      wishlistCount: wishlist.length,
      vipProgress,
      addToCart,
      removeFromCart,
      updateQuantity,
      openCart,
      closeCart,
      toggleCart,
      openWishlist,
      closeWishlist,
      toggleWishlist,
      isInWishlist,
      toggleWishlistItem,
      removeFromWishlist,
      openQuickView,
      closeQuickView,
      openBookPreview,
      closeBookPreview,
    }),
    [
      cartItems,
      wishlist,
      isCartOpen,
      isWishlistOpen,
      quickViewProduct,
      bookPreviewProduct,
      cartTotal,
      cartItemCount,
      vipProgress,
      addToCart,
      removeFromCart,
      updateQuantity,
      openCart,
      closeCart,
      toggleCart,
      openWishlist,
      closeWishlist,
      toggleWishlist,
      isInWishlist,
      toggleWishlistItem,
      removeFromWishlist,
      openQuickView,
      closeQuickView,
      openBookPreview,
      closeBookPreview,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
