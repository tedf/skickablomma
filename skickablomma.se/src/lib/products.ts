/**
 * Produkthantering
 * ================
 * Funktioner för att hämta och filtrera produkter.
 * Laddar produkter från genererad JSON-fil (data/products.json).
 */

import { Product, ProductFilters, SearchResult, MainCategory, Partner } from '@/types'
import * as fs from 'fs'
import * as path from 'path'

// =============================================================================
// LOAD PRODUCTS FROM JSON
// =============================================================================

let PRODUCTS: Product[] = []

try {
  const productsPath = path.join(process.cwd(), 'data', 'products.json')
  if (fs.existsSync(productsPath)) {
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))
    PRODUCTS = productsData.products.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      feedUpdatedAt: new Date(p.feedUpdatedAt),
      primaryImage: {
        ...p.primaryImage,
        createdAt: new Date(p.primaryImage.createdAt),
      },
    }))
    console.log(`Loaded ${PRODUCTS.length} products from JSON`)
  } else {
    console.warn('Products file not found, using fallback mock data')
    // Fallback to minimal mock data
    PRODUCTS = MOCK_PRODUCTS
  }
} catch (error) {
  console.error('Error loading products:', error)
  PRODUCTS = MOCK_PRODUCTS
}

// =============================================================================
// FALLBACK MOCK DATA (används endast om JSON inte finns)
// =============================================================================

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'interflora-001',
    sku: 'INT001',
    partnerId: 'interflora',
    name: 'Romantisk Rosbukett',
    description: 'En vacker bukett med röda rosor som symboliserar kärlek och passion. Perfekt för romantiska tillfällen.',
    shortDescription: 'Vacker bukett med röda rosor - perfekt för romantiska tillfällen.',
    mainCategory: 'buketter',
    subCategories: ['rosor', 'roda-blommor', 'karlek-romantik'],
    tags: ['rosor', 'röda', 'romantik', 'kärlek', 'alla hjärtans dag'],
    price: 549,
    originalPrice: 649,
    currency: 'SEK',
    discountPercent: 15,
    shipping: 99,
    inStock: true,
    sameDayDelivery: true,
    deliveryDays: 1,
    attributes: {
      flowerTypes: ['rosor'],
      colors: ['röd'],
      primaryColor: 'röd',
      size: 'mellan',
      style: 'romantisk',
      suitableFor: ['kvinna', 'alla'],
      occasions: ['alla hjärtans dag', 'kärlek', 'födelsedag'],
      mood: 'romantisk',
      cardIncluded: true,
    },
    primaryImage: {
      id: 'img-int001',
      url: '/images/products/romantic-roses.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      fileSize: 120000,
      altText: 'Romantic red roses bouquet',
      altTextSv: 'Romantisk bukett med röda rosor',
      createdAt: new Date(),
      validationStatus: 'valid',
    },
    additionalImages: [],
    productUrl: 'https://www.interflora.se/produkter/romantisk-rosbukett',
    trackingUrl: 'https://track.adtraction.com/t/t?a=123&as=456&t=2&tk=1&url=https://www.interflora.se/produkter/romantisk-rosbukett',
    brand: 'Interflora',
    popularityScore: 95,
    clickCount: 1250,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    feedUpdatedAt: new Date(),
    isActive: true,
    isPromoted: true,
  },
  {
    id: 'cramers-001',
    sku: 'CRM001',
    partnerId: 'cramers',
    name: 'Vårens Tulpanbukett',
    description: 'Fräscha tulpaner i glada färger som sprider vårkänsla. En favorit som passar alla tillfällen.',
    shortDescription: 'Fräscha tulpaner i glada färger - sprider vårkänsla.',
    mainCategory: 'buketter',
    subCategories: ['tulpaner', 'blandade-farger', 'fodelsedags-blommor'],
    tags: ['tulpaner', 'vår', 'färgglad', 'födelsedag'],
    price: 349,
    currency: 'SEK',
    shipping: 79,
    inStock: true,
    sameDayDelivery: true,
    deliveryDays: 1,
    attributes: {
      flowerTypes: ['tulpaner'],
      colors: ['rosa', 'gul', 'röd', 'vit'],
      primaryColor: 'rosa',
      size: 'mellan',
      style: 'modern',
      suitableFor: ['kvinna', 'alla'],
      occasions: ['födelsedag', 'tack', 'vår'],
      mood: 'glad',
    },
    primaryImage: {
      id: 'img-crm001',
      url: '/images/products/spring-tulips.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      fileSize: 95000,
      altText: 'Colorful spring tulips bouquet',
      altTextSv: 'Färgglad vårbukett med tulpaner',
      createdAt: new Date(),
      validationStatus: 'valid',
    },
    additionalImages: [],
    productUrl: 'https://www.cramers.se/produkter/varens-tulpanbukett',
    trackingUrl: 'https://track.adtraction.com/t/t?a=123&as=789&t=2&tk=1&url=https://www.cramers.se/produkter/varens-tulpanbukett',
    brand: 'Cramers',
    popularityScore: 88,
    clickCount: 890,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    feedUpdatedAt: new Date(),
    isActive: true,
    isPromoted: false,
  },
  {
    id: 'interflora-002',
    sku: 'INT002',
    partnerId: 'interflora',
    name: 'Elegant Vit Lilja',
    description: 'Eleganta vita liljor med fantastisk doft. Perfekt för att visa uppskattning eller som kondoleans.',
    shortDescription: 'Eleganta vita liljor med fantastisk doft.',
    mainCategory: 'buketter',
    subCategories: ['liljor', 'vita-blommor', 'tackblommor'],
    tags: ['liljor', 'vita', 'elegant', 'doftande'],
    price: 499,
    currency: 'SEK',
    shipping: 99,
    inStock: true,
    sameDayDelivery: true,
    deliveryDays: 1,
    attributes: {
      flowerTypes: ['liljor'],
      colors: ['vit'],
      primaryColor: 'vit',
      size: 'stor',
      style: 'klassisk',
      suitableFor: ['kvinna', 'alla'],
      occasions: ['tack', 'kondoleans', 'begravning'],
      mood: 'elegant',
    },
    primaryImage: {
      id: 'img-int002',
      url: '/images/products/white-lilies.jpg',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      fileSize: 110000,
      altText: 'Elegant white lilies bouquet',
      altTextSv: 'Elegant bukett med vita liljor',
      createdAt: new Date(),
      validationStatus: 'valid',
    },
    additionalImages: [],
    productUrl: 'https://www.interflora.se/produkter/elegant-vit-lilja',
    trackingUrl: 'https://track.adtraction.com/t/t?a=123&as=456&t=2&tk=1&url=https://www.interflora.se/produkter/elegant-vit-lilja',
    brand: 'Interflora',
    popularityScore: 82,
    clickCount: 720,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
    feedUpdatedAt: new Date(),
    isActive: true,
    isPromoted: false,
  },
  {
    id: 'fakeflowers-001',
    sku: 'FF001',
    partnerId: 'fakeflowers',
    name: 'Konstgjord Orkidé',
    description: 'Vacker konstgjord orkidé som ser ut som äkta. Kräver ingen skötsel och blommar för evigt.',
    shortDescription: 'Konstgjord orkidé - kräver ingen skötsel.',
    mainCategory: 'konstgjorda-blommor',
    subCategories: ['orkideer'],
    tags: ['orkidé', 'konstgjord', 'sidenblomma', 'underhållsfri'],
    price: 399,
    currency: 'SEK',
    shipping: 59,
    inStock: true,
    sameDayDelivery: false,
    deliveryDays: 2,
    attributes: {
      flowerTypes: ['orkidéer'],
      colors: ['vit'],
      primaryColor: 'vit',
      size: 'mellan',
      style: 'modern',
      suitableFor: ['kvinna', 'alla', 'foretag'],
    },
    primaryImage: {
      id: 'img-ff001',
      url: '/images/products/artificial-orchid.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      fileSize: 85000,
      altText: 'Artificial white orchid',
      altTextSv: 'Konstgjord vit orkidé',
      createdAt: new Date(),
      validationStatus: 'valid',
    },
    additionalImages: [],
    productUrl: 'https://www.fakeflowers.se/produkter/konstgjord-orkide',
    trackingUrl: 'https://track.adtraction.com/t/t?a=123&as=111&t=2&tk=1&url=https://www.fakeflowers.se/produkter/konstgjord-orkide',
    brand: 'Fakeflowers',
    popularityScore: 75,
    clickCount: 450,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date(),
    feedUpdatedAt: new Date(),
    isActive: true,
    isPromoted: false,
  },
  {
    id: 'cramers-002',
    sku: 'CRM002',
    partnerId: 'cramers',
    name: 'Solrosbukett Sol & Glädje',
    description: 'Glada solrosor som sprider solsken och lycka. Perfekt present för att lysa upp någons dag.',
    shortDescription: 'Glada solrosor - sprider solsken och lycka.',
    mainCategory: 'buketter',
    subCategories: ['solrosor', 'gula-blommor', 'fodelsedags-blommor'],
    tags: ['solrosor', 'gul', 'glad', 'sommar'],
    price: 299,
    currency: 'SEK',
    shipping: 79,
    inStock: true,
    sameDayDelivery: true,
    deliveryDays: 1,
    attributes: {
      flowerTypes: ['solrosor'],
      colors: ['gul'],
      primaryColor: 'gul',
      size: 'mellan',
      style: 'rustikal',
      suitableFor: ['kvinna', 'man', 'alla'],
      occasions: ['födelsedag', 'tack', 'sommar'],
      mood: 'glad',
    },
    primaryImage: {
      id: 'img-crm002',
      url: '/images/products/sunflowers.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      fileSize: 105000,
      altText: 'Bright sunflower bouquet',
      altTextSv: 'Ljus solrosbukett',
      createdAt: new Date(),
      validationStatus: 'valid',
    },
    additionalImages: [],
    productUrl: 'https://www.cramers.se/produkter/solrosbukett',
    trackingUrl: 'https://track.adtraction.com/t/t?a=123&as=789&t=2&tk=1&url=https://www.cramers.se/produkter/solrosbukett',
    brand: 'Cramers',
    popularityScore: 85,
    clickCount: 680,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(),
    feedUpdatedAt: new Date(),
    isActive: true,
    isPromoted: false,
  },
  {
    id: 'interflora-003',
    sku: 'INT003',
    partnerId: 'interflora',
    name: 'Begravningskrans Vit Fred',
    description: 'Värdig begravningskrans med vita blommor. Uttrycker frid och respekt.',
    shortDescription: 'Värdig begravningskrans - uttrycker frid och respekt.',
    mainCategory: 'begravning',
    subCategories: ['begravningskransar', 'vita-blommor'],
    tags: ['begravning', 'krans', 'vit', 'kondoleans'],
    price: 1299,
    currency: 'SEK',
    shipping: 0,
    inStock: true,
    sameDayDelivery: true,
    deliveryDays: 1,
    attributes: {
      flowerTypes: ['liljor', 'rosor'],
      colors: ['vit', 'grön'],
      primaryColor: 'vit',
      size: 'stor',
      style: 'klassisk',
      suitableFor: ['alla'],
      occasions: ['begravning', 'kondoleans'],
      mood: 'sorgsam',
    },
    primaryImage: {
      id: 'img-int003',
      url: '/images/products/funeral-wreath.jpg',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      fileSize: 130000,
      altText: 'White funeral wreath',
      altTextSv: 'Vit begravningskrans',
      createdAt: new Date(),
      validationStatus: 'valid',
    },
    additionalImages: [],
    productUrl: 'https://www.interflora.se/produkter/begravningskrans-vit-fred',
    trackingUrl: 'https://track.adtraction.com/t/t?a=123&as=456&t=2&tk=1&url=https://www.interflora.se/produkter/begravningskrans-vit-fred',
    brand: 'Interflora',
    popularityScore: 70,
    clickCount: 320,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date(),
    feedUpdatedAt: new Date(),
    isActive: true,
    isPromoted: false,
  },
  {
    id: 'myperfectday-001',
    sku: 'MPD001',
    partnerId: 'myperfectday',
    name: 'Brudbukett Klassisk',
    description: 'Klassisk brudbukett med vita rosor och grönska. Tidlös elegans för den stora dagen.',
    shortDescription: 'Klassisk brudbukett - tidlös elegans.',
    mainCategory: 'brollop',
    subCategories: ['brudbuketter', 'rosor', 'vita-blommor'],
    tags: ['bröllop', 'brudbukett', 'vita rosor', 'klassisk'],
    price: 899,
    currency: 'SEK',
    shipping: 0,
    inStock: true,
    sameDayDelivery: false,
    deliveryDays: 3,
    attributes: {
      flowerTypes: ['rosor'],
      colors: ['vit'],
      primaryColor: 'vit',
      size: 'mellan',
      style: 'klassisk',
      suitableFor: ['kvinna'],
      occasions: ['bröllop'],
      mood: 'romantisk',
    },
    primaryImage: {
      id: 'img-mpd001',
      url: '/images/products/bridal-bouquet.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      fileSize: 115000,
      altText: 'Classic white bridal bouquet',
      altTextSv: 'Klassisk vit brudbukett',
      createdAt: new Date(),
      validationStatus: 'valid',
    },
    additionalImages: [],
    productUrl: 'https://www.myperfectday.se/produkter/brudbukett-klassisk',
    trackingUrl: 'https://track.adtraction.com/t/t?a=123&as=222&t=2&tk=1&url=https://www.myperfectday.se/produkter/brudbukett-klassisk',
    brand: 'My Perfect Day',
    popularityScore: 78,
    clickCount: 290,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date(),
    feedUpdatedAt: new Date(),
    isActive: true,
    isPromoted: false,
  },
  {
    id: 'cramers-003',
    sku: 'CRM003',
    partnerId: 'cramers',
    name: 'Budgetbukett Färgmix',
    description: 'Vacker bukett med blandade säsongsblommor. Stort värde för pengarna!',
    shortDescription: 'Blandade säsongsblommor - stort värde!',
    mainCategory: 'budget',
    subCategories: ['under-300-kr', 'blandade-farger'],
    tags: ['budget', 'billigt', 'säsong', 'blandad'],
    price: 249,
    currency: 'SEK',
    shipping: 79,
    inStock: true,
    sameDayDelivery: true,
    deliveryDays: 1,
    attributes: {
      colors: ['rosa', 'gul', 'vit'],
      primaryColor: 'rosa',
      size: 'mellan',
      style: 'modern',
      suitableFor: ['kvinna', 'alla'],
      occasions: ['födelsedag', 'tack'],
      mood: 'glad',
    },
    primaryImage: {
      id: 'img-crm003',
      url: '/images/products/budget-mix.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      fileSize: 90000,
      altText: 'Colorful budget bouquet',
      altTextSv: 'Färgglad budgetbukett',
      createdAt: new Date(),
      validationStatus: 'valid',
    },
    additionalImages: [],
    productUrl: 'https://www.cramers.se/produkter/budgetbukett-fargmix',
    trackingUrl: 'https://track.adtraction.com/t/t?a=123&as=789&t=2&tk=1&url=https://www.cramers.se/produkter/budgetbukett-fargmix',
    brand: 'Cramers',
    popularityScore: 90,
    clickCount: 1100,
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date(),
    feedUpdatedAt: new Date(),
    isActive: true,
    isPromoted: true,
  },
]

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

/**
 * Hämtar tillgängliga färger för en kategori
 */
export async function getAvailableColors(category?: MainCategory): Promise<string[]> {
  const products = category
    ? PRODUCTS.filter((p) => p.isActive && p.mainCategory === category)
    : PRODUCTS.filter((p) => p.isActive)

  const colorSet = new Set<string>()
  products.forEach((p) => {
    p.attributes.colors?.forEach((color) => colorSet.add(color))
  })

  return Array.from(colorSet).sort()
}

/**
 * Hämtar produkter per underkategori
 */
export async function getProductsBySubCategory(
  subCategory: string,
  limit: number = 24
): Promise<Product[]> {
  return PRODUCTS
    .filter((p) => p.isActive && (
      p.subCategories.includes(subCategory as any) ||
      matchesSubCategoryByAttributes(p, subCategory)
    ))
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

/**
 * Matchar produkt mot underkategori baserat på attribut
 * Används som fallback när subCategories-fältet är tomt
 */
function matchesSubCategoryByAttributes(product: Product, subCategory: string): boolean {
  const name = product.name.toLowerCase()
  const desc = product.description?.toLowerCase() || ''
  const colors = product.attributes.colors || []
  const flowerTypes = product.attributes.flowerTypes || []

  // Färgmatchning
  const colorMappings: Record<string, string[]> = {
    'roda-blommor': ['röd', 'red'],
    'rosa-blommor': ['rosa', 'pink'],
    'vita-blommor': ['vit', 'white', 'vitt'],
    'gula-blommor': ['gul', 'yellow'],
    'lila-blommor': ['lila', 'purple', 'violett'],
    'orange-blommor': ['orange'],
  }

  if (colorMappings[subCategory]) {
    const matchColors = colorMappings[subCategory]
    if (colors.some((c) => matchColors.includes(c.toLowerCase()))) {
      return true
    }
  }

  // Blomtyp-matchning
  const flowerMappings: Record<string, string[]> = {
    'rosor': ['ros', 'rose', 'rosor'],
    'tulpaner': ['tulpan', 'tulip'],
    'liljor': ['lilja', 'lily', 'liljor'],
    'solrosor': ['solros', 'sunflower'],
    'orkideer': ['orkidé', 'orchid'],
    'pioner': ['pion', 'peony'],
    'hortensia': ['hortensia', 'hydrangea'],
  }

  if (flowerMappings[subCategory]) {
    const matchFlowers = flowerMappings[subCategory]
    if (flowerTypes.some((f) => matchFlowers.some((m) => f.toLowerCase().includes(m)))) {
      return true
    }
    // Kolla också i namn och beskrivning
    if (matchFlowers.some((m) => name.includes(m) || desc.includes(m))) {
      return true
    }
  }

  // Tillfälle-matchning
  const occasionMappings: Record<string, string[]> = {
    'fodelsedags-blommor': ['födelsedag', 'birthday'],
    'tackblommor': ['tack', 'thank'],
    'karlek-romantik': ['kärlek', 'romantik', 'romantic', 'love'],
    'mors-dag': ['mors dag', "mother's day", 'mamma'],
  }

  if (occasionMappings[subCategory]) {
    const matchOccasions = occasionMappings[subCategory]
    if (matchOccasions.some((m) => name.includes(m) || desc.includes(m))) {
      return true
    }
    if (product.attributes.occasions?.some((o) =>
      matchOccasions.some((m) => o.toLowerCase().includes(m))
    )) {
      return true
    }
  }

  // Begravning-matchning
  const funeralMappings: Record<string, string[]> = {
    'begravningskransar': ['krans', 'wreath'],
    'begravningsbuketter': ['begravning', 'funeral'],
    'kondoleanser': ['kondoleans', 'sympati', 'sympathy'],
  }

  if (funeralMappings[subCategory]) {
    const matchFuneral = funeralMappings[subCategory]
    if (matchFuneral.some((m) => name.includes(m) || desc.includes(m))) {
      return true
    }
  }

  // Bröllop-matchning
  const weddingMappings: Record<string, string[]> = {
    'brudbuketter': ['brud', 'bridal'],
    'brollopsbuketter': ['bröllop', 'wedding'],
  }

  if (weddingMappings[subCategory]) {
    const matchWedding = weddingMappings[subCategory]
    if (matchWedding.some((m) => name.includes(m) || desc.includes(m))) {
      return true
    }
  }

  return false
}

/**
 * Räknar produkter per underkategori
 */
export async function getSubCategoryCounts(
  mainCategory: MainCategory
): Promise<Record<string, number>> {
  const products = PRODUCTS.filter((p) => p.isActive && p.mainCategory === mainCategory)
  const counts: Record<string, number> = {}

  // Lista alla underkategorier för denna huvudkategori
  const subCategories = [
    'rosor', 'tulpaner', 'liljor', 'solrosor', 'orkideer', 'pioner', 'hortensia',
    'roda-blommor', 'rosa-blommor', 'vita-blommor', 'gula-blommor', 'lila-blommor', 'orange-blommor',
    'fodelsedags-blommor', 'tackblommor', 'karlek-romantik',
    'begravningskransar', 'begravningsbuketter', 'kondoleanser',
    'brudbuketter', 'brollopsbuketter',
  ]

  for (const subCat of subCategories) {
    const count = products.filter((p) =>
      p.subCategories.includes(subCat as any) ||
      matchesSubCategoryByAttributes(p, subCat)
    ).length
    if (count > 0) {
      counts[subCat] = count
    }
  }

  return counts
}
