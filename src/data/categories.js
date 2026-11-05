export const categories = [
  {
    id: 'books',
    label: 'Books',
    slug: 'books',
    tagline: 'Literary Works',
    description:
      'Signed novels, special editions, and curated anthologies from the Mark Steffen library.',
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    subcategories: [
      {
        id: 'novels',
        label: 'Novels',
        slug: 'novels',
        description: 'Full-length literary fiction & thrillers',
      },
      {
        id: 'signed-editions',
        label: 'Signed Editions',
        slug: 'signed-editions',
        description: 'Hand-signed first printings',
      },
      {
        id: 'special-editions',
        label: 'Special Editions',
        slug: 'special-editions',
        description: 'Foil, clothbound & collector bindings',
      },
      {
        id: 'anthologies',
        label: 'Anthologies',
        slug: 'anthologies',
        description: 'Short fiction collections & essays',
      },
    ],
  },
  {
    id: 'merchandise',
    label: 'Merchandise',
    slug: 'merchandise',
    tagline: 'Bespoke Merch',
    description:
      'Apparel and fandom essentials designed for readers who wear the story.',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&q=80',
    subcategories: [
      {
        id: 'apparel',
        label: 'Apparel',
        slug: 'apparel',
        description: 'Premium tees, hoodies & outer layers',
      },
      {
        id: 'drinkware',
        label: 'Drinkware',
        slug: 'drinkware',
        description: 'Enamel mugs & insulated tumblers',
      },
      {
        id: 'accessories',
        label: 'Accessories',
        slug: 'accessories',
        description: 'Hats, totes & wearable details',
      },
      {
        id: 'stickers',
        label: 'Stickers & Prints',
        slug: 'stickers',
        description: 'Vinyl packs & art prints',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    slug: 'products',
    tagline: 'Executive Lifestyle',
    description:
      'Stationery, desk tools, and bespoke gear for the modern literary executive.',
    image:
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&q=80',
    subcategories: [
      {
        id: 'stationery',
        label: 'Stationery',
        slug: 'stationery',
        description: 'Journals, pens & correspondence sets',
      },
      {
        id: 'desk',
        label: 'Desk Essentials',
        slug: 'desk',
        description: 'Blotters, trays & reading lamps',
      },
      {
        id: 'leather-goods',
        label: 'Leather Goods',
        slug: 'leather-goods',
        description: 'Wallets, folios & travel cases',
      },
      {
        id: 'fragrance',
        label: 'Fragrance & Ritual',
        slug: 'fragrance',
        description: 'Candles, cologne & reading rituals',
      },
    ],
  },
]

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug) || null
}

export function getSubcategory(categorySlug, subcategorySlug) {
  const category = getCategoryBySlug(categorySlug)
  if (!category) return null
  return (
    category.subcategories.find((sub) => sub.slug === subcategorySlug) || null
  )
}

export function flattenSubcategories() {
  return categories.flatMap((category) =>
    category.subcategories.map((sub) => ({
      ...sub,
      categoryId: category.id,
      categorySlug: category.slug,
      categoryLabel: category.label,
    })),
  )
}
