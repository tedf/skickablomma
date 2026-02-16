/**
 * Feed Ingestion Service
 * ======================
 * Pipeline för att hämta, validera och normalisera produktfeeder från Adtraction.
 *
 * Pipeline: Fetch → Parse XML → Validate → Normalize → Upsert → Re-index → Sitemaps → Cache invalidate
 */

import { XMLParser } from 'fast-xml-parser'
import {
  Partner,
  FeedProduct,
  FeedStatus,
  FeedIngestionResult,
  FeedError,
  Product,
  MainCategory,
  SubCategory,
  FeedProductSchema,
} from '@/types'
import { PARTNERS } from '@/data/partners'
import { normalizeProduct } from './product-normalizer'
import { resolveProductImage } from './image-resolver'

// =============================================================================
// KONFIGURATION
// =============================================================================

const XML_PARSER_OPTIONS = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: true,
  trimValues: true,
}

const FEED_CONFIG = {
  fetchTimeout: 30000, // 30 sekunder
  retryAttempts: 3,
  retryDelay: 2000,
  batchSize: 100,
  validationStrictness: 'warning', // 'error' | 'warning' | 'skip'
}

// =============================================================================
// FEED FETCH
// =============================================================================

/**
 * Hämtar XML-feed från URL med retry-logik
 */
async function fetchFeed(url: string, retries = FEED_CONFIG.retryAttempts): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), FEED_CONFIG.fetchTimeout)

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/xml, text/xml',
          'User-Agent': 'SkickaBlomma-FeedBot/1.0',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.text()
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`Failed to fetch feed after ${retries} attempts: ${error}`)
      }
      // Exponentiell backoff
      await new Promise((resolve) =>
        setTimeout(resolve, FEED_CONFIG.retryDelay * Math.pow(2, attempt - 1))
      )
    }
  }
  throw new Error('Unexpected error in fetchFeed')
}

// =============================================================================
// XML PARSING
// =============================================================================

/**
 * Parsar XML-feed till array av produkter
 */
function parseProductFeed(xml: string): FeedProduct[] {
  const parser = new XMLParser(XML_PARSER_OPTIONS)
  const parsed = parser.parse(xml)

  // Hantera olika feed-strukturer
  const products =
    parsed?.products?.product ||
    parsed?.feed?.products?.product ||
    parsed?.rss?.channel?.item ||
    []

  // Normalisera till array
  return Array.isArray(products) ? products : [products]
}

/**
 * Parsar status-feed till array av statusar
 */
function parseStatusFeed(xml: string): FeedStatus[] {
  const parser = new XMLParser(XML_PARSER_OPTIONS)
  const parsed = parser.parse(xml)

  const statuses =
    parsed?.statuses?.status ||
    parsed?.feed?.statuses?.status ||
    []

  return Array.isArray(statuses) ? statuses : [statuses]
}

// =============================================================================
// VALIDERING
// =============================================================================

interface ValidationResult {
  valid: FeedProduct[]
  errors: FeedError[]
}

/**
 * Validerar produkter mot schema och affärsregler
 */
function validateProducts(products: FeedProduct[], partnerId: Partner): ValidationResult {
  const valid: FeedProduct[] = []
  const errors: FeedError[] = []

  for (const product of products) {
    const validationErrors: string[] = []

    // Obligatoriska fält
    if (!product.SKU) {
      validationErrors.push('SKU saknas')
    }
    if (!product.Name) {
      validationErrors.push('Name saknas')
    }
    if (!product.TrackingUrl) {
      validationErrors.push('TrackingUrl saknas')
    }
    if (!product.Price) {
      validationErrors.push('Price saknas')
    }

    // Prisvalidering
    const price = parseFloat(product.Price)
    if (isNaN(price) || price < 0) {
      validationErrors.push(`Ogiltigt pris: ${product.Price}`)
    }
    if (price > 50000) {
      validationErrors.push(`Suspekt högt pris: ${price} SEK`)
    }

    // URL-validering
    try {
      if (product.ProductUrl) new URL(product.ProductUrl)
      if (product.TrackingUrl) new URL(product.TrackingUrl)
      if (product.ImageUrl) new URL(product.ImageUrl)
    } catch {
      validationErrors.push('Ogiltigt URL-format')
    }

    // Valuta
    if (product.Currency && product.Currency !== 'SEK') {
      validationErrors.push(`Felaktig valuta: ${product.Currency}`)
    }

    if (validationErrors.length > 0) {
      errors.push({
        sku: product.SKU,
        message: validationErrors.join('; '),
        severity: FEED_CONFIG.validationStrictness === 'error' ? 'error' : 'warning',
      })

      if (FEED_CONFIG.validationStrictness !== 'skip') {
        continue
      }
    }

    valid.push(product)
  }

  return { valid, errors }
}

// =============================================================================
// NORMALISERING
// =============================================================================

/**
 * Konverterar feed-produkt till intern datamodell
 */
async function normalizeAndEnrichProduct(
  feedProduct: FeedProduct,
  partnerId: Partner
): Promise<Product> {
  // Steg 1: Grundnormalisering
  const normalized = normalizeProduct(feedProduct, partnerId)

  // Steg 2: Resolve bilder (Image Resolver)
  const primaryImage = await resolveProductImage(normalized, feedProduct.ImageUrl)
  normalized.primaryImage = primaryImage

  return normalized
}

// =============================================================================
// KATEGORI-MAPPNING
// =============================================================================

interface CategoryMapping {
  main: MainCategory
  sub: SubCategory[]
}

/**
 * Mappar partner-kategori till intern kategorisering
 */
export function mapCategory(
  partnerCategory: string | undefined,
  productName: string,
  partnerId: Partner
): CategoryMapping {
  const name = (productName || '').toLowerCase()
  const category = (partnerCategory || '').toLowerCase()

  // Begravning
  if (
    category.includes('begravning') ||
    category.includes('sorg') ||
    name.includes('begravning') ||
    name.includes('kondolean') ||
    name.includes('krans')
  ) {
    const subs: SubCategory[] = []
    if (name.includes('krans')) subs.push('begravningskransar')
    else if (name.includes('kondolean')) subs.push('kondoleanser')
    else subs.push('begravningsbuketter')
    return { main: 'begravning', sub: subs }
  }

  // Bröllop
  if (
    category.includes('bröllop') ||
    category.includes('brud') ||
    name.includes('bröllop') ||
    name.includes('brudbukett')
  ) {
    const subs: SubCategory[] = []
    if (name.includes('brudbukett')) subs.push('brudbuketter')
    else subs.push('brollopsbuketter')
    return { main: 'brollop', sub: subs }
  }

  // Företag
  if (
    category.includes('företag') ||
    category.includes('kontor') ||
    name.includes('företag')
  ) {
    return { main: 'foretag', sub: ['kontorsblommor'] }
  }

  // Konstgjorda blommor
  if (
    category.includes('konstgjord') ||
    category.includes('siden') ||
    category.includes('fake') ||
    partnerId === 'fakeflowers'
  ) {
    return { main: 'konstgjorda-blommor', sub: [] }
  }

  // Presenter
  if (
    category.includes('present') ||
    category.includes('choklad') ||
    category.includes('vin')
  ) {
    return { main: 'presenter', sub: [] }
  }

  // Färger
  const colorSubs: SubCategory[] = []
  if (name.includes('röd') || name.includes('red')) colorSubs.push('roda-blommor')
  if (name.includes('rosa') || name.includes('pink')) colorSubs.push('rosa-blommor')
  if (name.includes('vit') || name.includes('white')) colorSubs.push('vita-blommor')
  if (name.includes('gul') || name.includes('yellow')) colorSubs.push('gula-blommor')
  if (name.includes('lila') || name.includes('purple')) colorSubs.push('lila-blommor')
  if (name.includes('orange')) colorSubs.push('orange-blommor')

  // Blomtyper
  if (name.includes('ros') && !name.includes('rosa')) colorSubs.push('rosor')
  if (name.includes('tulpan')) colorSubs.push('tulpaner')
  if (name.includes('lilja')) colorSubs.push('liljor')
  if (name.includes('solros')) colorSubs.push('solrosor')
  if (name.includes('orkidé')) colorSubs.push('orkideer')
  if (name.includes('pion')) colorSubs.push('pioner')

  // Tillfällen
  if (name.includes('födelsedag')) colorSubs.push('fodelsedags-blommor')
  if (name.includes('tack')) colorSubs.push('tackblommor')
  if (name.includes('kärlek') || name.includes('romantic')) colorSubs.push('karlek-romantik')

  // Högtider
  if (name.includes('mors dag') || name.includes('mamma')) colorSubs.push('mors-dag')
  if (name.includes('alla hjärtans')) colorSubs.push('alla-hjartans-dag')
  if (name.includes('jul')) colorSubs.push('jul-blommor')
  if (name.includes('påsk')) colorSubs.push('pask')
  if (name.includes('student')) colorSubs.push('student')

  // Default till buketter
  return { main: 'buketter', sub: colorSubs }
}

// =============================================================================
// MAIN INGESTION PIPELINE
// =============================================================================

/**
 * Huvudpipeline för feed-ingestion
 */
export async function ingestPartnerFeed(partnerId: Partner): Promise<FeedIngestionResult> {
  const startTime = Date.now()
  const partner = PARTNERS[partnerId]
  const errors: FeedError[] = []

  let totalProducts = 0
  let newProducts = 0
  let updatedProducts = 0
  let deactivatedProducts = 0

  try {
    // Steg 1: Fetch feeds
    console.log(`[${partnerId}] Fetching product feed...`)
    const productXml = await fetchFeed(partner.productFeedUrl)

    console.log(`[${partnerId}] Fetching status feed...`)
    const statusXml = await fetchFeed(partner.statusFeedUrl)

    // Steg 2: Parse XML
    console.log(`[${partnerId}] Parsing feeds...`)
    const feedProducts = parseProductFeed(productXml)
    const feedStatuses = parseStatusFeed(statusXml)

    totalProducts = feedProducts.length
    console.log(`[${partnerId}] Found ${totalProducts} products`)

    // Steg 3: Merge status data
    const statusMap = new Map(feedStatuses.map((s) => [s.SKU, s]))
    const productsWithStatus = feedProducts.map((p) => {
      const status = statusMap.get(p.SKU)
      if (status) {
        p.Instock = status.Instock
        p.Price = status.Price || p.Price
      }
      return p
    })

    // Steg 4: Validate
    console.log(`[${partnerId}] Validating products...`)
    const { valid, errors: validationErrors } = validateProducts(productsWithStatus, partnerId)
    errors.push(...validationErrors)

    // Steg 5: Normalize & Enrich (med bilder)
    console.log(`[${partnerId}] Normalizing ${valid.length} products...`)
    const normalizedProducts: Product[] = []

    for (let i = 0; i < valid.length; i += FEED_CONFIG.batchSize) {
      const batch = valid.slice(i, i + FEED_CONFIG.batchSize)
      const batchResults = await Promise.all(
        batch.map((p) => normalizeAndEnrichProduct(p, partnerId))
      )
      normalizedProducts.push(...batchResults)

      console.log(
        `[${partnerId}] Processed ${Math.min(i + FEED_CONFIG.batchSize, valid.length)}/${valid.length}`
      )
    }

    // Steg 6: Upsert till databas (placeholder - implementeras med faktisk DB)
    console.log(`[${partnerId}] Upserting to database...`)
    // TODO: Implementera med SQLite/PostgreSQL
    newProducts = normalizedProducts.filter((p) => p.createdAt === p.updatedAt).length
    updatedProducts = normalizedProducts.length - newProducts

    // Steg 7: Deaktivera produkter som saknas i feeden
    // TODO: Markera produkter som inte finns i feeden som inaktiva
    deactivatedProducts = 0

    console.log(`[${partnerId}] Ingestion complete!`)
  } catch (error) {
    errors.push({
      message: `Pipeline error: ${error}`,
      severity: 'error',
    })
  }

  return {
    partner: partnerId,
    success: errors.filter((e) => e.severity === 'error').length === 0,
    totalProducts,
    newProducts,
    updatedProducts,
    deactivatedProducts,
    errors,
    processingTime: Date.now() - startTime,
    timestamp: new Date(),
  }
}

/**
 * Kör ingestion för alla partners
 */
export async function ingestAllFeeds(): Promise<FeedIngestionResult[]> {
  const partners: Partner[] = ['cramers', 'interflora', 'fakeflowers', 'myperfectday']
  const results: FeedIngestionResult[] = []

  for (const partner of partners) {
    const result = await ingestPartnerFeed(partner)
    results.push(result)
  }

  return results
}

// =============================================================================
// SCHEDULED JOBS
// =============================================================================

/**
 * Schemaläggning för feed-uppdateringar
 */
export const FEED_SCHEDULE = {
  // Produktfeed: 4 gånger per dag
  productFeed: '0 */6 * * *', // Varje 6:e timme

  // Statusfeed: Varje timme
  statusFeed: '0 * * * *', // Varje hel timme

  // Full re-index: En gång per dag
  fullReindex: '0 3 * * *', // Kl 03:00

  // Sitemap-generering: Efter varje produktuppdatering
  sitemap: 'after:productFeed',
}
