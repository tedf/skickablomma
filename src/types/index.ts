// =============================================================================
// DATAMODELL FÖR SKICKABLOMMA.SE
// =============================================================================
// Komplett typdefinition för affiliate-webbplats med bildpipeline
// =============================================================================

import { z } from 'zod'

// -----------------------------------------------------------------------------
// PARTNERS
// -----------------------------------------------------------------------------

export type Partner = 'cramers' | 'interflora' | 'fakeflowers' | 'myperfectday'

export interface PartnerConfig {
  id: Partner
  name: string
  displayName: string
  logoUrl: string
  websiteUrl: string
  productFeedUrl: string
  statusFeedUrl: string
  deliveryInfo: {
    sameDayAvailable: boolean
    sameDayCutoff: string // HH:MM format
    standardDays: number
    expressAvailable: boolean
  }
  trackingParams: {
    epi?: string
    subid?: string
  }
}

// -----------------------------------------------------------------------------
// BILDHANTERING (Image Resolver)
// -----------------------------------------------------------------------------

export type ImageSourceType = 'partner' | 'royalty_free' | 'generated' | 'placeholder'

export type ImageLicense =
  | 'partner_provided'
  | 'cc0'
  | 'cc_by'
  | 'cc_by_sa'
  | 'commercial'
  | 'editorial_only'
  | 'ai_generated'

export interface ImageAsset {
  id: string
  url: string
  localPath?: string
  sourceType: ImageSourceType
  license: ImageLicense
  attribution?: {
    text: string
    url?: string
    author?: string
  }
  prompt?: string // Endast för AI-genererade bilder
  hash?: string // För deduplicering
  dimensions: {
    width: number
    height: number
  }
  format: 'webp' | 'avif' | 'jpg' | 'png'
  fileSize: number
  altText: string
  altTextSv: string
  createdAt: Date
  validatedAt?: Date
  validationStatus: 'pending' | 'valid' | 'invalid' | 'expired'
}

// -----------------------------------------------------------------------------
// KATEGORIER
// -----------------------------------------------------------------------------

export type MainCategory =
  | 'buketter'
  | 'begravning'
  | 'brollop'
  | 'foretag'
  | 'presenter'
  | 'konstgjorda-blommor'
  | 'samma-dag-leverans'
  | 'budget'

export type SubCategory =
  // Färger
  | 'roda-blommor'
  | 'rosa-blommor'
  | 'vita-blommor'
  | 'gula-blommor'
  | 'lila-blommor'
  | 'orange-blommor'
  | 'blandade-farger'
  // Blomtyper
  | 'rosor'
  | 'tulpaner'
  | 'liljor'
  | 'solrosor'
  | 'orkideer'
  | 'pioner'
  | 'hortensia'
  // Tillfällen
  | 'fodelsedags-blommor'
  | 'tackblommor'
  | 'gratulationer'
  | 'karlek-romantik'
  | 'ursakt-blommor'
  | 'kramblommor'
  // Säsong
  | 'var-blommor'
  | 'sommar-blommor'
  | 'host-blommor'
  | 'jul-blommor'
  // Högtider
  | 'mors-dag'
  | 'fars-dag'
  | 'alla-hjartans-dag'
  | 'pask'
  | 'student'
  | 'midsommar'
  // Prisklass
  | 'under-300-kr'
  | 'under-500-kr'
  | 'under-700-kr'
  | 'premium'
  // Begravning
  | 'begravningskransar'
  | 'begravningsbuketter'
  | 'kondoleanser'
  | 'minnesbuketter'
  // Bröllop
  | 'brudbuketter'
  | 'brollopsbuketter'
  | 'bordsdekoration'
  | 'kyrko-dekoration'
  // Företag
  | 'kontorsblommor'
  | 'representationsblommor'
  | 'event-blommor'

export interface Category {
  id: string
  slug: string
  name: string
  namePlural: string
  description: string
  metaTitle: string
  metaDescription: string
  parentCategory?: MainCategory
  imageAsset?: ImageAsset
  productCount: number
  isActive: boolean
  sortOrder: number
  seoContent?: {
    intro: string
    faq: FAQ[]
  }
}

// -----------------------------------------------------------------------------
// PRODUKTER
// -----------------------------------------------------------------------------

export interface Product {
  id: string
  sku: string
  partnerId: Partner

  // Grundinfo
  name: string
  description: string
  shortDescription?: string

  // Kategorisering (normaliserad)
  mainCategory: MainCategory
  subCategories: SubCategory[]
  tags: string[]

  // Priser
  price: number
  originalPrice?: number
  currency: 'SEK'
  discountPercent?: number

  // Leverans
  shipping: number
  inStock: boolean
  sameDayDelivery: boolean
  deliveryDays?: number

  // Attribut
  attributes: ProductAttributes

  // Bilder (via Image Resolver)
  primaryImage: ImageAsset
  additionalImages: ImageAsset[]

  // Affiliate-länkar
  productUrl: string
  trackingUrl: string

  // Metadata
  brand?: string
  ean?: string
  manufacturerArticleNumber?: string
  extras?: Record<string, string>

  // Ranking & popularitet
  popularityScore: number
  clickCount: number
  conversionRate?: number

  // Tidsstämplar
  createdAt: Date
  updatedAt: Date
  feedUpdatedAt: Date

  // Status
  isActive: boolean
  isPromoted: boolean
  promotionEndDate?: Date
}

export interface ProductAttributes {
  // Blomtyper
  flowerTypes?: string[]

  // Färger
  colors?: string[]
  primaryColor?: string

  // Storlek
  size?: 'liten' | 'mellan' | 'stor' | 'extra-stor'
  height?: number // cm
  width?: number // cm

  // Stil
  style?: 'klassisk' | 'modern' | 'romantisk' | 'rustikal' | 'minimalistisk'

  // Mottagare
  suitableFor?: ('kvinna' | 'man' | 'alla' | 'foretag')[]

  // Tillfälle
  occasions?: string[]

  // Känsla
  mood?: 'glad' | 'romantisk' | 'elegant' | 'sorgsam' | 'tacksamhet'

  // Extra info
  vasIncluded?: boolean
  chocolateIncluded?: boolean
  cardIncluded?: boolean

  // Hållbarhet
  longevityDays?: number
  careInstructions?: string
}

// -----------------------------------------------------------------------------
// ERBJUDANDEN (Offer - koppling produkt + partner)
// -----------------------------------------------------------------------------

export interface Offer {
  id: string
  productId: string
  partnerId: Partner

  // Prissättning
  price: number
  originalPrice?: number
  currency: 'SEK'
  shipping: number

  // Tillgänglighet
  inStock: boolean
  stockLevel?: number

  // Leverans
  sameDayDelivery: boolean
  deliveryCutoff?: string
  estimatedDelivery?: {
    minDays: number
    maxDays: number
  }

  // Affiliate
  trackingUrl: string
  deepLink?: string

  // Validity
  validFrom: Date
  validTo?: Date

  // Status
  isActive: boolean
  lastChecked: Date
}

// -----------------------------------------------------------------------------
// INVENTERING/STATUS
// -----------------------------------------------------------------------------

export interface InventoryStatus {
  sku: string
  partnerId: Partner
  inStock: boolean
  stockLevel?: number
  price: number
  lastUpdated: Date
  nextCheck: Date
}

// -----------------------------------------------------------------------------
// FAQ & INNEHÅLL
// -----------------------------------------------------------------------------

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  sortOrder: number
}

export interface Guide {
  id: string
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  excerpt: string
  content: string
  publishedAt: Date
  updatedAt: Date
  author?: string
  categories: string[]
  tags: string[]
  featuredImage?: ImageAsset
  relatedProducts?: string[]
  isPublished: boolean
}

// -----------------------------------------------------------------------------
// WIZARDS
// -----------------------------------------------------------------------------

export type WizardType =
  | 'hitta-ratt-blommor'
  | 'begravningsblommor'
  | 'brollopsblommor'
  | 'foretags-blommor'
  | 'presenter-till-henne'

export interface WizardStep {
  id: string
  title: string
  description?: string
  type: 'single_choice' | 'multiple_choice' | 'slider' | 'text_input'
  options?: WizardOption[]
  validation?: {
    required: boolean
    minSelections?: number
    maxSelections?: number
  }
}

export interface WizardOption {
  id: string
  label: string
  value: string
  icon?: string
  image?: ImageAsset
  description?: string
  filterCriteria?: Partial<ProductFilters>
}

export interface WizardConfig {
  id: WizardType
  slug: string
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  steps: WizardStep[]
  resultCount: number // Antal produkter att visa (6-12)
  ctaText: string
  ctaDescription?: string
}

// -----------------------------------------------------------------------------
// SÖK & FILTRERING
// -----------------------------------------------------------------------------

export interface ProductFilters {
  // Kategorier
  mainCategory?: MainCategory
  subCategories?: SubCategory[]

  // Pris
  priceMin?: number
  priceMax?: number

  // Partner
  partners?: Partner[]

  // Leverans
  sameDayOnly?: boolean
  inStockOnly?: boolean

  // Färger
  colors?: string[]

  // Tillfällen
  occasions?: string[]

  // Storlek
  sizes?: string[]

  // Stil
  styles?: string[]

  // Övrigt
  hasDiscount?: boolean
  isPromoted?: boolean

  // Sök
  query?: string
}

export type SortOption =
  | 'popularity'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'discount'
  | 'delivery_time'
  | 'relevance'

export interface SearchResult {
  products: Product[]
  totalCount: number
  facets: SearchFacets
  pagination: {
    page: number
    pageSize: number
    totalPages: number
  }
  appliedFilters: ProductFilters
  sortBy: SortOption
}

export interface SearchFacets {
  categories: FacetBucket[]
  colors: FacetBucket[]
  partners: FacetBucket[]
  priceRanges: FacetBucket[]
  occasions: FacetBucket[]
  deliveryOptions: FacetBucket[]
}

export interface FacetBucket {
  key: string
  label: string
  count: number
  isSelected: boolean
}

// -----------------------------------------------------------------------------
// SEO & SCHEMA.ORG
// -----------------------------------------------------------------------------

export interface SEOData {
  title: string
  description: string
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
  openGraph?: {
    title?: string
    description?: string
    image?: string
    type?: 'website' | 'article' | 'product'
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image'
    title?: string
    description?: string
    image?: string
  }
}

export interface ProductSchema {
  '@context': 'https://schema.org'
  '@type': 'Product'
  name: string
  description: string
  image: string[]
  sku: string
  brand?: {
    '@type': 'Brand'
    name: string
  }
  offers: {
    '@type': 'Offer'
    url: string
    priceCurrency: 'SEK'
    price: number
    availability: string
    seller: {
      '@type': 'Organization'
      name: string
    }
    shippingDetails?: {
      '@type': 'OfferShippingDetails'
      shippingRate: {
        '@type': 'MonetaryAmount'
        value: number
        currency: 'SEK'
      }
      deliveryTime?: {
        '@type': 'ShippingDeliveryTime'
        businessDays: {
          '@type': 'OpeningHoursSpecification'
          dayOfWeek: string[]
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// ANALYTICS & SPÅRNING
// -----------------------------------------------------------------------------

export interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  productId?: string
  partnerId?: Partner
  imageSourceType?: ImageSourceType
}

export interface ClickTrackingData {
  productId: string
  partnerId: Partner
  trackingUrl: string
  position: number
  listType: 'category' | 'search' | 'wizard' | 'related' | 'homepage'
  imageSourceType: ImageSourceType
  timestamp: Date
}

// -----------------------------------------------------------------------------
// FEED INGESTION
// -----------------------------------------------------------------------------

export interface FeedProduct {
  SKU: string
  Name: string
  Description?: string
  Category?: string
  Price: string
  Shipping?: string
  Currency: string
  Instock?: string
  ProductUrl: string
  ImageUrl?: string
  TrackingUrl: string
  Brand?: string
  OriginalPrice?: string
  Ean?: string
  ManufacturerArticleNumber?: string
  Extras?: string
}

export interface FeedStatus {
  SKU: string
  Instock: string
  Price: string
  LastUpdated: string
}

export interface FeedIngestionResult {
  partner: Partner
  success: boolean
  totalProducts: number
  newProducts: number
  updatedProducts: number
  deactivatedProducts: number
  errors: FeedError[]
  processingTime: number
  timestamp: Date
}

export interface FeedError {
  sku?: string
  field?: string
  message: string
  severity: 'warning' | 'error'
}

// -----------------------------------------------------------------------------
// ZOD SCHEMAS FÖR VALIDERING
// -----------------------------------------------------------------------------

export const ProductFiltersSchema = z.object({
  mainCategory: z.string().optional(),
  subCategories: z.array(z.string()).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  partners: z.array(z.string()).optional(),
  sameDayOnly: z.boolean().optional(),
  inStockOnly: z.boolean().optional(),
  colors: z.array(z.string()).optional(),
  occasions: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  styles: z.array(z.string()).optional(),
  hasDiscount: z.boolean().optional(),
  query: z.string().optional(),
})

export const FeedProductSchema = z.object({
  SKU: z.string().min(1),
  Name: z.string().min(1),
  Description: z.string().optional(),
  Category: z.string().optional(),
  Price: z.string().min(1),
  Shipping: z.string().optional(),
  Currency: z.string().default('SEK'),
  Instock: z.string().optional(),
  ProductUrl: z.string().url(),
  ImageUrl: z.string().url().optional(),
  TrackingUrl: z.string().url(),
  Brand: z.string().optional(),
  OriginalPrice: z.string().optional(),
  Ean: z.string().optional(),
  ManufacturerArticleNumber: z.string().optional(),
  Extras: z.string().optional(),
})

