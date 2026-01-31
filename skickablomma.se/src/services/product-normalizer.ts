/**
 * Product Normalizer
 * ==================
 * Konverterar feed-produkter till intern datamodell med standardiserade värden.
 */

import {
  Partner,
  FeedProduct,
  Product,
  ProductAttributes,
  ImageAsset,
} from '@/types'
import { mapCategory } from './feed-ingestion'
import { PARTNERS } from '@/data/partners'

// =============================================================================
// PARSNING
// =============================================================================

/**
 * Parsar pris från sträng till number
 */
function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0
  // Ta bort valutasymboler, mellanslag och ersätt komma med punkt
  const cleaned = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

/**
 * Parsar lagerstatus från sträng
 */
function parseInStock(inStockStr: string | undefined): boolean {
  if (!inStockStr) return true // Anta i lager om ej specificerat
  const lower = inStockStr.toLowerCase()
  return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'in stock'
}

/**
 * Parsar Extras-fält (key=value; format)
 */
function parseExtras(extrasStr: string | undefined): Record<string, string> {
  if (!extrasStr) return {}
  const extras: Record<string, string> = {}

  extrasStr.split(';').forEach((pair) => {
    const [key, value] = pair.split('=').map((s) => s?.trim())
    if (key && value) {
      extras[key] = value
    }
  })

  return extras
}

// =============================================================================
// ATTRIBUTEXTRAKTION
// =============================================================================

/**
 * Extraherar produktattribut från namn, beskrivning och extras
 */
function extractAttributes(
  feedProduct: FeedProduct,
  extras: Record<string, string>
): ProductAttributes {
  const name = (feedProduct.Name || '').toLowerCase()
  const desc = (feedProduct.Description || '').toLowerCase()
  const combined = `${name} ${desc}`

  const attributes: ProductAttributes = {}

  // Färger
  const colors: string[] = []
  if (combined.includes('röd') || combined.includes('red')) colors.push('röd')
  if (combined.includes('rosa') || combined.includes('pink')) colors.push('rosa')
  if (combined.includes('vit') || combined.includes('white')) colors.push('vit')
  if (combined.includes('gul') || combined.includes('yellow')) colors.push('gul')
  if (combined.includes('lila') || combined.includes('purple')) colors.push('lila')
  if (combined.includes('orange')) colors.push('orange')
  if (combined.includes('blå') || combined.includes('blue')) colors.push('blå')
  if (combined.includes('grön') || combined.includes('green')) colors.push('grön')
  if (colors.length > 0) {
    attributes.colors = colors
    attributes.primaryColor = colors[0]
  }

  // Blomtyper
  const flowerTypes: string[] = []
  if (combined.includes('ros') && !combined.includes('rosa')) flowerTypes.push('rosor')
  if (combined.includes('tulpan')) flowerTypes.push('tulpaner')
  if (combined.includes('lilja')) flowerTypes.push('liljor')
  if (combined.includes('solros')) flowerTypes.push('solrosor')
  if (combined.includes('orkidé')) flowerTypes.push('orkidéer')
  if (combined.includes('pion')) flowerTypes.push('pioner')
  if (combined.includes('hortensia')) flowerTypes.push('hortensior')
  if (combined.includes('gerbera')) flowerTypes.push('gerbera')
  if (combined.includes('krysantemum')) flowerTypes.push('krysantemum')
  if (combined.includes('amaryllis')) flowerTypes.push('amaryllis')
  if (flowerTypes.length > 0) {
    attributes.flowerTypes = flowerTypes
  }

  // Storlek
  if (combined.includes('liten') || combined.includes('mini')) {
    attributes.size = 'liten'
  } else if (combined.includes('stor') || combined.includes('large')) {
    attributes.size = 'stor'
  } else if (combined.includes('extra stor') || combined.includes('xl')) {
    attributes.size = 'extra-stor'
  } else {
    attributes.size = 'mellan'
  }

  // Stil
  if (combined.includes('klassisk') || combined.includes('classic')) {
    attributes.style = 'klassisk'
  } else if (combined.includes('modern')) {
    attributes.style = 'modern'
  } else if (combined.includes('romantisk') || combined.includes('romantic')) {
    attributes.style = 'romantisk'
  } else if (combined.includes('rustikal') || combined.includes('rustic')) {
    attributes.style = 'rustikal'
  } else if (combined.includes('minimalistisk') || combined.includes('minimal')) {
    attributes.style = 'minimalistisk'
  }

  // Mottagare
  const suitableFor: ('kvinna' | 'man' | 'alla' | 'foretag')[] = []
  if (combined.includes('henne') || combined.includes('kvinna') || combined.includes('mamma')) {
    suitableFor.push('kvinna')
  }
  if (combined.includes('honom') || combined.includes('man') || combined.includes('pappa')) {
    suitableFor.push('man')
  }
  if (combined.includes('företag') || combined.includes('kontor')) {
    suitableFor.push('foretag')
  }
  if (suitableFor.length === 0 || combined.includes('alla')) {
    suitableFor.push('alla')
  }
  attributes.suitableFor = suitableFor

  // Tillfällen
  const occasions: string[] = []
  if (combined.includes('födelsedag')) occasions.push('födelsedag')
  if (combined.includes('bröllop')) occasions.push('bröllop')
  if (combined.includes('begravning')) occasions.push('begravning')
  if (combined.includes('tack')) occasions.push('tack')
  if (combined.includes('kärlek') || combined.includes('romantic')) occasions.push('kärlek')
  if (combined.includes('gratulation')) occasions.push('gratulation')
  if (combined.includes('jul')) occasions.push('jul')
  if (combined.includes('påsk')) occasions.push('påsk')
  if (combined.includes('mors dag')) occasions.push('mors dag')
  if (combined.includes('alla hjärtans')) occasions.push('alla hjärtans dag')
  if (occasions.length > 0) {
    attributes.occasions = occasions
  }

  // Känsla/Mood
  if (combined.includes('glad') || combined.includes('happy')) {
    attributes.mood = 'glad'
  } else if (combined.includes('romantisk') || combined.includes('romantic')) {
    attributes.mood = 'romantisk'
  } else if (combined.includes('elegant')) {
    attributes.mood = 'elegant'
  } else if (combined.includes('sorg') || combined.includes('kondoleans')) {
    attributes.mood = 'sorgsam'
  } else if (combined.includes('tack')) {
    attributes.mood = 'tacksamhet'
  }

  // Extra info
  if (combined.includes('vas')) {
    attributes.vasIncluded = true
  }
  if (combined.includes('choklad')) {
    attributes.chocolateIncluded = true
  }
  if (combined.includes('kort')) {
    attributes.cardIncluded = true
  }

  // Från extras-fält
  if (extras.height) {
    attributes.height = parseInt(extras.height)
  }
  if (extras.width) {
    attributes.width = parseInt(extras.width)
  }
  if (extras.longevity) {
    attributes.longevityDays = parseInt(extras.longevity)
  }

  return attributes
}

// =============================================================================
// NORMALISERING
// =============================================================================

/**
 * Skapar en slug från produktnamn
 */
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Skapar kort beskrivning från lång beskrivning
 */
function createShortDescription(description: string, maxLength = 160): string {
  if (!description) return ''
  if (description.length <= maxLength) return description

  // Klipp vid mening eller ord
  const truncated = description.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
}

/**
 * Huvudfunktion: Normaliserar feed-produkt till intern modell
 */
export function normalizeProduct(
  feedProduct: FeedProduct,
  partnerId: Partner
): Product {
  const extras = parseExtras(feedProduct.Extras)
  const price = parsePrice(feedProduct.Price)
  const originalPrice = parsePrice(feedProduct.OriginalPrice)
  const shipping = parsePrice(feedProduct.Shipping)
  const inStock = parseInStock(feedProduct.Instock)

  // Kategorimappning
  const categoryMapping = mapCategory(feedProduct.Category, feedProduct.Name, partnerId)

  // Partner-config för leveransinfo
  const partnerConfig = PARTNERS[partnerId]

  // Beräkna rabatt
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined

  // Attributextraktion
  const attributes = extractAttributes(feedProduct, extras)

  // Skapa produkt-ID
  const productId = `${partnerId}-${feedProduct.SKU}`

  const now = new Date()

  // Placeholder för bild (fylls i av Image Resolver)
  const placeholderImage: ImageAsset = {
    id: `${productId}-placeholder`,
    url: '/images/placeholders/flower-placeholder.svg',
    sourceType: 'placeholder',
    license: 'partner_provided',
    dimensions: { width: 400, height: 400 },
    format: 'png',
    fileSize: 0,
    altText: feedProduct.Name,
    altTextSv: feedProduct.Name,
    createdAt: now,
    validationStatus: 'pending',
  }

  return {
    id: productId,
    sku: feedProduct.SKU,
    partnerId,

    // Grundinfo
    name: feedProduct.Name,
    description: feedProduct.Description || '',
    shortDescription: createShortDescription(feedProduct.Description || ''),

    // Kategorisering
    mainCategory: categoryMapping.main,
    subCategories: categoryMapping.sub,
    tags: [
      ...categoryMapping.sub,
      ...(attributes.flowerTypes || []),
      ...(attributes.colors || []),
      ...(attributes.occasions || []),
    ],

    // Priser
    price,
    originalPrice: originalPrice > price ? originalPrice : undefined,
    currency: 'SEK',
    discountPercent,

    // Leverans
    shipping,
    inStock,
    sameDayDelivery: inStock && partnerConfig.deliveryInfo.sameDayAvailable,
    deliveryDays: partnerConfig.deliveryInfo.standardDays,

    // Attribut
    attributes,

    // Bilder (placeholder tills Image Resolver kör)
    primaryImage: placeholderImage,
    additionalImages: [],

    // Affiliate-länkar
    productUrl: feedProduct.ProductUrl,
    trackingUrl: feedProduct.TrackingUrl,

    // Metadata
    brand: feedProduct.Brand || partnerConfig.displayName,
    ean: feedProduct.Ean,
    manufacturerArticleNumber: feedProduct.ManufacturerArticleNumber,
    extras,

    // Ranking
    popularityScore: 0,
    clickCount: 0,

    // Tidsstämplar
    createdAt: now,
    updatedAt: now,
    feedUpdatedAt: now,

    // Status
    isActive: inStock,
    isPromoted: false,
  }
}

/**
 * Genererar SEO-vänlig URL för produkt
 */
export function generateProductUrl(product: Product): string {
  const slug = createSlug(product.name)
  return `/produkt/${product.mainCategory}/${slug}-${product.sku}`
}

/**
 * Genererar alt-text för produktbild
 */
export function generateAltText(product: Product): string {
  const parts: string[] = [product.name]

  if (product.attributes.primaryColor) {
    parts.push(`i ${product.attributes.primaryColor}`)
  }

  if (product.attributes.flowerTypes?.length) {
    parts.push(`med ${product.attributes.flowerTypes.slice(0, 2).join(' och ')}`)
  }

  parts.push(`- ${product.price} SEK`)

  return parts.join(' ')
}
