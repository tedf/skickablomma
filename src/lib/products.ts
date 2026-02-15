/**
 * Produkthantering
 * ================
 * Funktioner för att hämta och filtrera produkter.
 * Laddar produkter från genererad JSON-fil (data/products.json).
 */

import { Product, ProductFilters, SearchResult, MainCategory, Partner } from '@/types'
import productsJson from '../../data/products.json'

// =============================================================================
// LOAD PRODUCTS FROM JSON
// =============================================================================

const PRODUCTS: Product[] = (productsJson as any).products.map((p: any) => ({
  ...p,
  createdAt: new Date(p.createdAt),
  updatedAt: new Date(p.updatedAt),
  feedUpdatedAt: new Date(p.feedUpdatedAt),
  primaryImage: {
    ...p.primaryImage,
    createdAt: new Date(p.primaryImage.createdAt),
  },
}))


// =============================================================================
// PRODUKTFUNKTIONER
// =============================================================================

/**
 * Hämtar populära produkter
 */
export async function getPopularProducts(limit: number = 8): Promise<Product[]> {
  // I produktion: SELECT * FROM products ORDER BY popularity_score DESC LIMIT ?
  return PRODUCTS
    .filter((p) => p.isActive)
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

/**
 * Hämtar produkter med samma-dag-leverans
 */
export async function getSameDayProducts(limit: number = 4): Promise<Product[]> {
  return PRODUCTS
    .filter((p) => p.isActive && p.sameDayDelivery)
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

/**
 * Hämtar produkter per kategori
 */
export async function getProductsByCategory(
  category: MainCategory,
  limit: number = 20
): Promise<Product[]> {
  return PRODUCTS
    .filter((p) => p.isActive && p.mainCategory === category)
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

/**
 * Hämtar produkter per partner
 */
export async function getProductsByPartner(
  partner: Partner,
  limit: number = 20
): Promise<Product[]> {
  return PRODUCTS
    .filter((p) => p.isActive && p.partnerId === partner)
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

/**
 * Hämtar en specifik produkt
 */
export async function getProductBySku(sku: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.sku === sku) || null
}

/**
 * Hämtar en specifik produkt via ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.id === id) || null
}

/**
 * Hämtar produkter per underkategori
 */
export async function getProductsBySubCategory(
  subCategory: string,
  limit: number = 20
): Promise<Product[]> {
  return PRODUCTS
    .filter((p) => p.isActive && p.subCategories.includes(subCategory as any))
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

/**
 * Söker produkter
 */
export async function searchProducts(
  filters: ProductFilters,
  page: number = 1,
  pageSize: number = 20
): Promise<SearchResult> {
  let results = [...PRODUCTS].filter((p) => p.isActive)

  // Filtrera på huvudkategori
  if (filters.mainCategory) {
    results = results.filter((p) => p.mainCategory === filters.mainCategory)
  }

  // Filtrera på underkategorier
  if (filters.subCategories && filters.subCategories.length > 0) {
    results = results.filter((p) =>
      filters.subCategories!.some((sub) => p.subCategories.includes(sub as any))
    )
  }

  // Filtrera på pris
  if (filters.priceMin !== undefined) {
    results = results.filter((p) => p.price >= filters.priceMin!)
  }
  if (filters.priceMax !== undefined) {
    results = results.filter((p) => p.price <= filters.priceMax!)
  }

  // Filtrera på partners
  if (filters.partners && filters.partners.length > 0) {
    results = results.filter((p) => filters.partners!.includes(p.partnerId as any))
  }

  // Filtrera på samma dag
  if (filters.sameDayOnly) {
    results = results.filter((p) => p.sameDayDelivery)
  }

  // Filtrera på i lager
  if (filters.inStockOnly) {
    results = results.filter((p) => p.inStock)
  }

  // Filtrera på färger
  if (filters.colors && filters.colors.length > 0) {
    results = results.filter((p) =>
      p.attributes.colors?.some((c) => filters.colors!.includes(c))
    )
  }

  // Filtrera på rea
  if (filters.hasDiscount) {
    results = results.filter((p) => p.discountPercent && p.discountPercent > 0)
  }

  // Textsökning
  if (filters.query) {
    const query = filters.query.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    )
  }

  // Sortera
  results.sort((a, b) => b.popularityScore - a.popularityScore)

  // Paginering
  const totalCount = results.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const start = (page - 1) * pageSize
  const paginatedResults = results.slice(start, start + pageSize)

  // Beräkna facetter
  const facets = calculateFacets(PRODUCTS.filter((p) => p.isActive), filters)

  return {
    products: paginatedResults,
    totalCount,
    facets,
    pagination: {
      page,
      pageSize,
      totalPages,
    },
    appliedFilters: filters,
    sortBy: 'popularity',
  }
}

/**
 * Beräknar facetter för filtrering
 */
function calculateFacets(products: Product[], currentFilters: ProductFilters) {
  // Kategorier
  const categoryCounts = new Map<string, number>()
  products.forEach((p) => {
    const current = categoryCounts.get(p.mainCategory) || 0
    categoryCounts.set(p.mainCategory, current + 1)
  })

  // Partners
  const partnerCounts = new Map<string, number>()
  products.forEach((p) => {
    const current = partnerCounts.get(p.partnerId) || 0
    partnerCounts.set(p.partnerId, current + 1)
  })

  // Färger
  const colorCounts = new Map<string, number>()
  products.forEach((p) => {
    p.attributes.colors?.forEach((color) => {
      const current = colorCounts.get(color) || 0
      colorCounts.set(color, current + 1)
    })
  })

  // Prisintervall
  const priceRanges = [
    { key: 'under-300', label: 'Under 300 kr', min: 0, max: 299 },
    { key: '300-500', label: '300-500 kr', min: 300, max: 500 },
    { key: '500-700', label: '500-700 kr', min: 500, max: 700 },
    { key: 'over-700', label: 'Över 700 kr', min: 700, max: Infinity },
  ]

  const priceRangeCounts = priceRanges.map((range) => ({
    key: range.key,
    label: range.label,
    count: products.filter((p) => p.price >= range.min && p.price <= range.max).length,
    isSelected: false,
  }))

  return {
    categories: Array.from(categoryCounts.entries()).map(([key, count]) => ({
      key,
      label: key.replace(/-/g, ' '),
      count,
      isSelected: currentFilters.mainCategory === key,
    })),
    colors: Array.from(colorCounts.entries()).map(([key, count]) => ({
      key,
      label: key,
      count,
      isSelected: currentFilters.colors?.includes(key) || false,
    })),
    partners: Array.from(partnerCounts.entries()).map(([key, count]) => ({
      key,
      label: key,
      count,
      isSelected: currentFilters.partners?.includes(key as Partner) || false,
    })),
    priceRanges: priceRangeCounts,
    occasions: [],
    deliveryOptions: [
      {
        key: 'same-day',
        label: 'Samma dag',
        count: products.filter((p) => p.sameDayDelivery).length,
        isSelected: currentFilters.sameDayOnly || false,
      },
    ],
  }
}

/**
 * Hämtar relaterade produkter
 */
export async function getRelatedProducts(
  product: Product,
  limit: number = 4
): Promise<Product[]> {
  return PRODUCTS
    .filter(
      (p) =>
        p.isActive &&
        p.id !== product.id &&
        (p.mainCategory === product.mainCategory ||
          p.subCategories.some((sub) => product.subCategories.includes(sub)))
    )
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}
