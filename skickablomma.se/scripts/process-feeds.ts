#!/usr/bin/env tsx

/**
 * Feed Processing Script
 * ======================
 * Processes XML product feeds from multiple partners:
 * - Parses XML feeds efficiently (handles large 48MB+ files)
 * - Downloads product images with retry logic
 * - Generates affiliate tracking URLs
 * - Saves processed products to JSON
 *
 * Usage: npm run feed:process
 */

import { XMLParser } from 'fast-xml-parser'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'

// =============================================================================
// TYPES
// =============================================================================

interface FeedProduct {
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
  TrackingUrl?: string
  Brand?: string
  OriginalPrice?: string
  Ean?: string
  ManufacturerArticleNumber?: string
  Extras?: any
}

interface ProcessedProduct {
  id: string
  sku: string
  partnerId: string
  name: string
  description: string
  shortDescription?: string
  mainCategory: string
  subCategories: string[]
  tags: string[]
  price: number
  originalPrice?: number
  currency: string
  discountPercent?: number
  shipping: number
  inStock: boolean
  sameDayDelivery: boolean
  deliveryDays?: number
  attributes: {
    flowerTypes?: string[]
    colors?: string[]
    primaryColor?: string
    size?: string
    style?: string
    suitableFor?: string[]
    occasions?: string[]
    mood?: string
  }
  primaryImage: {
    id: string
    url: string
    localPath?: string
    sourceType: string
    license: string
    dimensions: { width: number; height: number }
    format: string
    fileSize: number
    altText: string
    altTextSv: string
    createdAt: string
    validationStatus: string
  }
  additionalImages: any[]
  productUrl: string
  trackingUrl: string
  brand?: string
  popularityScore: number
  clickCount: number
  createdAt: string
  updatedAt: string
  feedUpdatedAt: string
  isActive: boolean
  isPromoted: boolean
}

interface PartnerConfig {
  id: string
  feedFile: string
  trackingUrlTemplate: string
  sameDayDelivery: boolean
  displayName: string
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const BASE_DIR = process.cwd()
const FEEDS_DIR = path.join(BASE_DIR, 'feeds')
const IMAGES_DIR = path.join(BASE_DIR, 'public', 'images', 'products')
const DATA_DIR = path.join(BASE_DIR, 'data')
const OUTPUT_FILE = path.join(DATA_DIR, 'products.json')

const MAX_PRODUCTS_PER_PARTNER = 100 // Limit for testing
const IMAGE_DOWNLOAD_RETRY = 3
const IMAGE_TIMEOUT = 10000 // 10 seconds

const PARTNERS: PartnerConfig[] = [
  {
    id: 'cramers',
    feedFile: 'cramersblommor.xml',
    trackingUrlTemplate: 'https://pin.cramersblommor.com/t/t?a=1954033070&as=1771789045&t=2&tk=1&url={ProductUrl}',
    sameDayDelivery: true,
    displayName: 'Cramers Blommor'
  },
  {
    id: 'fakeflowers',
    feedFile: 'fakeflowers.xml',
    trackingUrlTemplate: 'https://go.fakeflowers.se/t/t?a=1998457785&as=1771789045&t=2&tk=1&url={ProductUrl}',
    sameDayDelivery: false,
    displayName: 'Fakeflowers'
  },
  {
    id: 'interflora',
    feedFile: 'interflora.xml',
    trackingUrlTemplate: 'https://go.adt246.net/t/t?a=767510657&as=1771789045&t=2&tk=1&url={ProductUrl}',
    sameDayDelivery: true,
    displayName: 'Interflora'
  },
  {
    id: 'myperfectday',
    feedFile: 'myperfectday.xml',
    trackingUrlTemplate: 'https://in.myperfectday.se/t/t?a=1615913086&as=1771789045&t=2&tk=1&url={ProductUrl}',
    sameDayDelivery: false,
    displayName: 'My Perfect Day'
  }
]

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Categorize product based on category and name
 */
function categorizeProduct(category?: string, name?: string): { mainCategory: string; subCategories: string[] } {
  const lowerCategory = (category || '').toLowerCase()
  const lowerName = (name || '').toLowerCase()
  const combined = `${lowerCategory} ${lowerName}`

  let mainCategory = 'buketter'
  const subCategories: string[] = []

  // Main category detection
  if (combined.includes('begravning') || combined.includes('kondoleans') || combined.includes('krans')) {
    mainCategory = 'begravning'
    subCategories.push('begravningsbuketter')
  } else if (combined.includes('bröllop') || combined.includes('brud')) {
    mainCategory = 'brollop'
    subCategories.push('brudbuketter')
  } else if (combined.includes('konstgjord') || combined.includes('sidenblomma')) {
    mainCategory = 'konstgjorda-blommor'
  } else {
    mainCategory = 'buketter'
  }

  // Flower types
  if (combined.includes('ros')) subCategories.push('rosor')
  if (combined.includes('tulpan')) subCategories.push('tulpaner')
  if (combined.includes('lilja') || combined.includes('lilj')) subCategories.push('liljor')
  if (combined.includes('solros')) subCategories.push('solrosor')
  if (combined.includes('orkidé') || combined.includes('orkide')) subCategories.push('orkideer')

  // Colors
  if (combined.includes('röd') || combined.includes('red')) subCategories.push('roda-blommor')
  if (combined.includes('rosa') || combined.includes('pink')) subCategories.push('rosa-blommor')
  if (combined.includes('vit') || combined.includes('white')) subCategories.push('vita-blommor')
  if (combined.includes('gul') || combined.includes('yellow')) subCategories.push('gula-blommor')

  return { mainCategory, subCategories }
}

/**
 * Extract color from product info
 */
function extractColors(product: FeedProduct): string[] {
  const combined = `${product.Name} ${product.Description || ''} ${product.Category || ''}`.toLowerCase()
  const colors: string[] = []

  if (combined.includes('röd') || combined.includes('red')) colors.push('röd')
  if (combined.includes('rosa') || combined.includes('pink')) colors.push('rosa')
  if (combined.includes('vit') || combined.includes('white')) colors.push('vit')
  if (combined.includes('gul') || combined.includes('yellow')) colors.push('gul')
  if (combined.includes('lila') || combined.includes('purple')) colors.push('lila')
  if (combined.includes('blå') || combined.includes('blue')) colors.push('blå')

  return colors
}

/**
 * Generate tracking URL
 */
function generateTrackingUrl(partner: PartnerConfig, productUrl: string): string {
  return partner.trackingUrlTemplate.replace('{ProductUrl}', encodeURIComponent(productUrl))
}

/**
 * Strip HTML tags from description
 */
function stripHtml(html?: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .trim()
}

/**
 * Download image with retry logic
 */
async function downloadImage(url: string, outputPath: string, retries = IMAGE_DOWNLOAD_RETRY): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await downloadImageOnce(url, outputPath)
      return true
    } catch (error) {
      if (attempt === retries) {
        console.error(`  ❌ Failed to download image after ${retries} attempts: ${url}`)
        return false
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
  return false
}

/**
 * Download image once
 */
function downloadImageOnce(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http

    const request = protocol.get(url, { timeout: IMAGE_TIMEOUT }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        if (response.headers.location) {
          downloadImageOnce(response.headers.location, outputPath).then(resolve).catch(reject)
          return
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`))
        return
      }

      const fileStream = fs.createWriteStream(outputPath)
      response.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        resolve()
      })

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {}) // Clean up partial file
        reject(err)
      })
    })

    request.on('error', reject)
    request.on('timeout', () => {
      request.destroy()
      reject(new Error('Request timeout'))
    })
  })
}

/**
 * Get file extension from URL
 */
function getImageExtension(url?: string): string {
  if (!url) return 'jpg'
  const match = url.match(/\.(jpg|jpeg|png|gif|webp)(?:\?|$)/i)
  if (match) {
    return match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase()
  }
  return 'jpg'
}

/**
 * Sanitize SKU for filename
 */
function sanitizeSku(sku: string): string {
  return sku.replace(/[^a-zA-Z0-9-_]/g, '-')
}

// =============================================================================
// FEED PROCESSING
// =============================================================================

/**
 * Parse XML feed
 */
async function parseFeed(feedPath: string): Promise<FeedProduct[]> {
  console.log(`📄 Parsing feed: ${path.basename(feedPath)}`)

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: false,
    parseTagValue: false,
    trimValues: true
  })

  const xmlContent = fs.readFileSync(feedPath, 'utf-8')
  const result = parser.parse(xmlContent)

  // Extract products array
  let products: FeedProduct[] = []

  if (result.productFeed && result.productFeed.product) {
    const productData = result.productFeed.product
    products = Array.isArray(productData) ? productData : [productData]
  }

  console.log(`   Found ${products.length} products in feed`)
  return products
}

/**
 * Process single partner feed
 */
async function processPartner(partner: PartnerConfig): Promise<ProcessedProduct[]> {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`🏪 Processing ${partner.displayName} (${partner.id})`)
  console.log(`${'='.repeat(80)}`)

  const feedPath = path.join(FEEDS_DIR, partner.feedFile)

  if (!fs.existsSync(feedPath)) {
    console.error(`❌ Feed file not found: ${feedPath}`)
    return []
  }

  // Parse feed
  const feedProducts = await parseFeed(feedPath)

  // Limit products for testing
  const limitedProducts = feedProducts.slice(0, MAX_PRODUCTS_PER_PARTNER)
  console.log(`📊 Processing first ${limitedProducts.length} products (limit: ${MAX_PRODUCTS_PER_PARTNER})`)

  const processed: ProcessedProduct[] = []
  let downloadedImages = 0
  let skippedImages = 0
  let failedImages = 0

  for (let i = 0; i < limitedProducts.length; i++) {
    const feedProduct = limitedProducts[i]
    const progress = `[${i + 1}/${limitedProducts.length}]`

    console.log(`\n${progress} Processing: ${feedProduct.Name}`)
    console.log(`   SKU: ${feedProduct.SKU}`)

    // Categorize
    const { mainCategory, subCategories } = categorizeProduct(feedProduct.Category, feedProduct.Name)

    // Extract colors
    const colors = extractColors(feedProduct)

    // Parse prices
    const price = parseFloat(feedProduct.Price) || 0
    const originalPrice = feedProduct.OriginalPrice ? parseFloat(feedProduct.OriginalPrice) : undefined
    const shipping = feedProduct.Shipping ? parseFloat(feedProduct.Shipping) : 0
    const discountPercent = originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined

    // Handle image download
    let localImagePath: string | undefined
    let imageFormat = 'jpg'
    let imageFileSize = 0

    if (feedProduct.ImageUrl) {
      const imageExt = getImageExtension(feedProduct.ImageUrl)
      const imageName = `${partner.id}-${sanitizeSku(feedProduct.SKU)}.${imageExt}`
      const imagePath = path.join(IMAGES_DIR, imageName)
      localImagePath = `/images/products/${imageName}`
      imageFormat = imageExt

      // Check if image already exists
      if (fs.existsSync(imagePath)) {
        console.log(`   ⏭️  Image already exists, skipping download`)
        skippedImages++
        const stats = fs.statSync(imagePath)
        imageFileSize = stats.size
      } else {
        console.log(`   ⬇️  Downloading image...`)
        const success = await downloadImage(feedProduct.ImageUrl, imagePath)
        if (success) {
          console.log(`   ✅ Image downloaded`)
          downloadedImages++
          const stats = fs.statSync(imagePath)
          imageFileSize = stats.size
        } else {
          console.log(`   ⚠️  Image download failed, using URL only`)
          failedImages++
          localImagePath = undefined
        }
      }
    } else {
      console.log(`   ⚠️  No image URL provided`)
    }

    // Generate tracking URL (use existing or generate)
    // Always generate new tracking URL with our affiliate IDs (don't use feed's TrackingUrl)
    const trackingUrl = generateTrackingUrl(partner, feedProduct.ProductUrl)

    // Create processed product
    const processedProduct: ProcessedProduct = {
      id: `${partner.id}-${feedProduct.SKU}`,
      sku: feedProduct.SKU,
      partnerId: partner.id,
      name: feedProduct.Name,
      description: stripHtml(feedProduct.Description) || feedProduct.Name,
      shortDescription: stripHtml(feedProduct.Description)?.substring(0, 150),
      mainCategory,
      subCategories,
      tags: [...new Set([...subCategories, ...(feedProduct.Category ? [feedProduct.Category.toLowerCase()] : [])])],
      price,
      originalPrice,
      currency: 'SEK',
      discountPercent,
      shipping,
      inStock: feedProduct.Instock?.toLowerCase() === 'yes' || feedProduct.Instock === '1',
      sameDayDelivery: partner.sameDayDelivery,
      attributes: {
        colors: colors.length > 0 ? colors : undefined,
        primaryColor: colors[0],
        size: 'mellan',
        suitableFor: ['alla']
      },
      primaryImage: {
        id: `img-${partner.id}-${feedProduct.SKU}`,
        url: feedProduct.ImageUrl || '/images/placeholder.jpg',
        localPath: localImagePath,
        sourceType: 'partner',
        license: 'partner_provided',
        dimensions: { width: 800, height: 800 },
        format: imageFormat,
        fileSize: imageFileSize,
        altText: feedProduct.Name,
        altTextSv: feedProduct.Name,
        createdAt: new Date().toISOString(),
        validationStatus: 'valid'
      },
      additionalImages: [],
      productUrl: feedProduct.ProductUrl,
      trackingUrl,
      brand: feedProduct.Brand || partner.displayName,
      popularityScore: 50,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      feedUpdatedAt: new Date().toISOString(),
      isActive: true,
      isPromoted: false
    }

    processed.push(processedProduct)
  }

  console.log(`\n📊 ${partner.displayName} Summary:`)
  console.log(`   Products processed: ${processed.length}`)
  console.log(`   Images downloaded: ${downloadedImages}`)
  console.log(`   Images skipped: ${skippedImages}`)
  console.log(`   Images failed: ${failedImages}`)

  return processed
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('🌸 Skickablomma.se Feed Processor')
  console.log('=' .repeat(80))
  console.log(`Base directory: ${BASE_DIR}`)
  console.log(`Feeds directory: ${FEEDS_DIR}`)
  console.log(`Images directory: ${IMAGES_DIR}`)
  console.log(`Output file: ${OUTPUT_FILE}`)
  console.log(`Products per partner: ${MAX_PRODUCTS_PER_PARTNER}`)
  console.log('')

  // Ensure directories exist
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  // Process all partners
  const allProducts: ProcessedProduct[] = []

  for (const partner of PARTNERS) {
    try {
      const products = await processPartner(partner)
      allProducts.push(...products)
    } catch (error) {
      console.error(`\n❌ Error processing ${partner.displayName}:`, error)
    }
  }

  // Save to JSON
  console.log(`\n${'='.repeat(80)}`)
  console.log('💾 Saving products to JSON...')

  const output = {
    generatedAt: new Date().toISOString(),
    totalProducts: allProducts.length,
    partners: PARTNERS.map(p => p.id),
    products: allProducts
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`✅ Saved ${allProducts.length} products to ${OUTPUT_FILE}`)

  // Summary
  console.log(`\n${'='.repeat(80)}`)
  console.log('📈 FINAL SUMMARY')
  console.log(`${'='.repeat(80)}`)
  console.log(`Total products processed: ${allProducts.length}`)

  PARTNERS.forEach(partner => {
    const count = allProducts.filter(p => p.partnerId === partner.id).length
    console.log(`  ${partner.displayName}: ${count} products`)
  })

  // Sample products
  console.log(`\n📦 Sample products:`)
  allProducts.slice(0, 3).forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.name}`)
    console.log(`   Partner: ${p.brand}`)
    console.log(`   SKU: ${p.sku}`)
    console.log(`   Price: ${p.price} SEK (shipping: ${p.shipping} SEK)`)
    console.log(`   Category: ${p.mainCategory}`)
    console.log(`   Image: ${p.primaryImage.localPath || p.primaryImage.url}`)
    console.log(`   URL: ${p.productUrl}`)
  })

  console.log(`\n✅ Done!`)
}

main().catch(console.error)
