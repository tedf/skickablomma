/**
 * Image Resolver Service
 * ======================
 * Deterministic fallback-kedja för att säkerställa att alla produkter har bilder.
 *
 * Fallback-ordning:
 * A. Partnerbild (primär) - Om ImageUrl finns och valideras
 * B. Royalty-free (sekundär) - Matcha mot intern bildbank
 * C. AI-genererad (tertiär) - Generera baserat på produktattribut
 * D. Placeholder (sista utväg) - Generisk bild med kategoriikon
 */

import {
  Product,
  ImageAsset,
  ImageSourceType,
  ImageLicense,
  MainCategory,
  SubCategory,
} from '@/types'
import crypto from 'crypto'

// =============================================================================
// KONFIGURATION
// =============================================================================

const IMAGE_CONFIG = {
  // Bildvalidering
  minWidth: 200,
  minHeight: 200,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  validationTimeout: 5000, // 5 sekunder

  // Royalty-free bildbank
  royaltyFreeBasePath: '/images/royalty-free',

  // AI-generering
  enableAiGeneration: process.env.OPENAI_API_KEY ? true : false,
  aiGeneratedBasePath: '/images/generated',

  // Placeholder
  placeholderBasePath: '/images/placeholders',

  // Cache
  cacheDir: './public/images/cache',
  cacheDuration: 24 * 60 * 60 * 1000, // 24 timmar

  // [FILL: Policy för märkning av AI-genererade bilder]
  markAiGeneratedImages: true, // Om true, lägg till "Illustrationsbild" på genererade bilder
}

// =============================================================================
// ROYALTY-FREE BILDBANK
// =============================================================================

/**
 * Intern bildbank med royalty-free bilder per kategori
 * Dessa bilder måste finnas i /public/images/royalty-free/
 */
const ROYALTY_FREE_LIBRARY: Record<string, ImageAsset[]> = {
  // Färger
  'roda-blommor': [
    {
      id: 'rf-red-roses-01',
      url: '/images/royalty-free/red-roses-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      attribution: { text: 'Unsplash', url: 'https://unsplash.com' },
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 45000,
      altText: 'Beautiful red roses bouquet',
      altTextSv: 'Vacker bukett med röda rosor',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
    {
      id: 'rf-red-roses-02',
      url: '/images/royalty-free/red-roses-02.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      attribution: { text: 'Pexels', url: 'https://pexels.com' },
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 52000,
      altText: 'Red roses arrangement',
      altTextSv: 'Arrangemang med röda rosor',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],
  'rosa-blommor': [
    {
      id: 'rf-pink-flowers-01',
      url: '/images/royalty-free/pink-flowers-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 48000,
      altText: 'Pink flower bouquet',
      altTextSv: 'Bukett med rosa blommor',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],
  'vita-blommor': [
    {
      id: 'rf-white-flowers-01',
      url: '/images/royalty-free/white-flowers-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 42000,
      altText: 'Elegant white flower arrangement',
      altTextSv: 'Elegant arrangemang med vita blommor',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],

  // Blomtyper
  rosor: [
    {
      id: 'rf-roses-mixed-01',
      url: '/images/royalty-free/roses-mixed-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 55000,
      altText: 'Mixed roses bouquet',
      altTextSv: 'Bukett med blandade rosor',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],
  tulpaner: [
    {
      id: 'rf-tulips-01',
      url: '/images/royalty-free/tulips-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 38000,
      altText: 'Colorful tulips',
      altTextSv: 'Färgglada tulpaner',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],

  // Kategorier
  buketter: [
    {
      id: 'rf-bouquet-general-01',
      url: '/images/royalty-free/bouquet-general-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 50000,
      altText: 'Beautiful flower bouquet',
      altTextSv: 'Vacker blombukett',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
    {
      id: 'rf-bouquet-general-02',
      url: '/images/royalty-free/bouquet-general-02.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 48000,
      altText: 'Colorful flower arrangement',
      altTextSv: 'Färgglatt blomsterarrangemang',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],
  begravning: [
    {
      id: 'rf-funeral-01',
      url: '/images/royalty-free/funeral-flowers-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 45000,
      altText: 'Dignified funeral flowers',
      altTextSv: 'Värdiga begravningsblommor',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],
  brollop: [
    {
      id: 'rf-wedding-01',
      url: '/images/royalty-free/wedding-flowers-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 52000,
      altText: 'Wedding flower arrangement',
      altTextSv: 'Bröllopsblommor',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],
  presenter: [
    {
      id: 'rf-gift-01',
      url: '/images/royalty-free/gift-flowers-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 48000,
      altText: 'Gift with flowers',
      altTextSv: 'Present med blommor',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],
  'konstgjorda-blommor': [
    {
      id: 'rf-artificial-01',
      url: '/images/royalty-free/artificial-flowers-01.webp',
      sourceType: 'royalty_free',
      license: 'cc0',
      dimensions: { width: 800, height: 600 },
      format: 'webp',
      fileSize: 42000,
      altText: 'Artificial silk flowers',
      altTextSv: 'Konstgjorda sidenblommor',
      createdAt: new Date('2024-01-01'),
      validationStatus: 'valid',
    },
  ],
}

// =============================================================================
// AI-GENERERING - PROMPT TEMPLATES
// =============================================================================

const AI_PROMPT_TEMPLATES: Record<MainCategory, string> = {
  buketter: `A beautiful Swedish-style flower bouquet with {flowers}, in {colors} colors.
Professional florist arrangement, clean white background, soft natural lighting,
high-quality product photography style. No text, no watermarks.`,

  begravning: `A dignified funeral flower arrangement in traditional Swedish style.
Respectful white and green tones with subtle {colors} accents.
Professional florist quality, soft lighting, white background.
Elegant and somber mood. No text, no watermarks.`,

  brollop: `An elegant Swedish wedding flower arrangement.
Romantic {flowers} in {colors} colors. Soft, dreamy lighting.
Professional bridal florist quality, clean background.
Sophisticated and romantic mood. No text, no watermarks.`,

  foretag: `A professional corporate flower arrangement for Swedish office setting.
Modern, clean design with {flowers} in {colors} colors.
Sleek and professional, suitable for business environment.
High-quality product photography, white background. No text, no watermarks.`,

  presenter: `A beautiful gift arrangement combining flowers with {extras}.
Swedish gift style, {flowers} in {colors} colors with elegant presentation.
Professional product photography, white background, soft lighting.
Cheerful and gift-worthy appearance. No text, no watermarks.`,

  'konstgjorda-blommor': `High-quality artificial silk flowers, {flowers} in {colors} colors.
Realistic appearance, Swedish interior design aesthetic.
Professional product photography showing craftsmanship and detail.
Clean white background, soft lighting. No text, no watermarks.`,

  'samma-dag-leverans': `Fresh flower bouquet ready for same-day delivery in Sweden.
{flowers} in {colors} colors, beautifully wrapped.
Express delivery presentation, professional florist quality.
Clean background, bright cheerful mood. No text, no watermarks.`,

  budget: `An affordable yet beautiful flower bouquet, Swedish style.
Simple but elegant {flowers} in {colors} colors.
Value-focused but still lovely presentation.
Clean product photography, white background. No text, no watermarks.`,
}

// =============================================================================
// PLACEHOLDER BILDER
// =============================================================================

const PLACEHOLDER_IMAGES: Record<MainCategory, ImageAsset> = {
  buketter: {
    id: 'placeholder-buketter',
    url: '/images/placeholders/bouquet-placeholder.svg',
    sourceType: 'placeholder',
    license: 'partner_provided',
    dimensions: { width: 400, height: 400 },
    format: 'png',
    fileSize: 5000,
    altText: 'Flower bouquet placeholder',
    altTextSv: 'Bukett - bild saknas',
    createdAt: new Date(),
    validationStatus: 'valid',
  },
  begravning: {
    id: 'placeholder-begravning',
    url: '/images/placeholders/funeral-placeholder.svg',
    sourceType: 'placeholder',
    license: 'partner_provided',
    dimensions: { width: 400, height: 400 },
    format: 'png',
    fileSize: 5000,
    altText: 'Funeral flowers placeholder',
    altTextSv: 'Begravningsblommor - bild saknas',
    createdAt: new Date(),
    validationStatus: 'valid',
  },
  brollop: {
    id: 'placeholder-brollop',
    url: '/images/placeholders/wedding-placeholder.svg',
    sourceType: 'placeholder',
    license: 'partner_provided',
    dimensions: { width: 400, height: 400 },
    format: 'png',
    fileSize: 5000,
    altText: 'Wedding flowers placeholder',
    altTextSv: 'Bröllopsblommor - bild saknas',
    createdAt: new Date(),
    validationStatus: 'valid',
  },
  foretag: {
    id: 'placeholder-foretag',
    url: '/images/placeholders/corporate-placeholder.svg',
    sourceType: 'placeholder',
    license: 'partner_provided',
    dimensions: { width: 400, height: 400 },
    format: 'png',
    fileSize: 5000,
    altText: 'Corporate flowers placeholder',
    altTextSv: 'Företagsblommor - bild saknas',
    createdAt: new Date(),
    validationStatus: 'valid',
  },
  presenter: {
    id: 'placeholder-presenter',
    url: '/images/placeholders/gift-placeholder.svg',
    sourceType: 'placeholder',
    license: 'partner_provided',
    dimensions: { width: 400, height: 400 },
    format: 'png',
    fileSize: 5000,
    altText: 'Gift placeholder',
    altTextSv: 'Present - bild saknas',
    createdAt: new Date(),
    validationStatus: 'valid',
  },
  'konstgjorda-blommor': {
    id: 'placeholder-konstgjorda',
    url: '/images/placeholders/artificial-placeholder.svg',
    sourceType: 'placeholder',
    license: 'partner_provided',
    dimensions: { width: 400, height: 400 },
    format: 'png',
    fileSize: 5000,
    altText: 'Artificial flowers placeholder',
    altTextSv: 'Konstgjorda blommor - bild saknas',
    createdAt: new Date(),
    validationStatus: 'valid',
  },
  'samma-dag-leverans': {
    id: 'placeholder-samma-dag',
    url: '/images/placeholders/express-placeholder.svg',
    sourceType: 'placeholder',
    license: 'partner_provided',
    dimensions: { width: 400, height: 400 },
    format: 'png',
    fileSize: 5000,
    altText: 'Same day delivery placeholder',
    altTextSv: 'Samma dag leverans - bild saknas',
    createdAt: new Date(),
    validationStatus: 'valid',
  },
  budget: {
    id: 'placeholder-budget',
    url: '/images/placeholders/budget-placeholder.svg',
    sourceType: 'placeholder',
    license: 'partner_provided',
    dimensions: { width: 400, height: 400 },
    format: 'png',
    fileSize: 5000,
    altText: 'Budget flowers placeholder',
    altTextSv: 'Budgetblommor - bild saknas',
    createdAt: new Date(),
    validationStatus: 'valid',
  },
}

// =============================================================================
// STEG A: VALIDERA PARTNERBILD
// =============================================================================

interface ImageValidationResult {
  isValid: boolean
  error?: string
  dimensions?: { width: number; height: number }
  mimeType?: string
  fileSize?: number
}

/**
 * Validerar en bild-URL genom att göra HEAD-request
 */
async function validatePartnerImage(imageUrl: string): Promise<ImageValidationResult> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), IMAGE_CONFIG.validationTimeout)

    const response = await fetch(imageUrl, {
      method: 'HEAD',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return { isValid: false, error: `HTTP ${response.status}` }
    }

    const contentType = response.headers.get('content-type')
    const contentLength = response.headers.get('content-length')

    // Kontrollera MIME-typ
    if (contentType && !IMAGE_CONFIG.allowedMimeTypes.some((t) => contentType.includes(t))) {
      return { isValid: false, error: `Invalid content type: ${contentType}` }
    }

    // Kontrollera filstorlek
    const fileSize = contentLength ? parseInt(contentLength) : 0
    if (fileSize > IMAGE_CONFIG.maxFileSize) {
      return { isValid: false, error: `File too large: ${fileSize} bytes` }
    }

    return {
      isValid: true,
      mimeType: contentType || undefined,
      fileSize,
    }
  } catch (error) {
    return { isValid: false, error: `Validation failed: ${error}` }
  }
}

/**
 * Skapar ImageAsset från validerad partner-URL
 */
function createPartnerImageAsset(
  product: Product,
  imageUrl: string,
  validation: ImageValidationResult
): ImageAsset {
  const hash = crypto.createHash('md5').update(imageUrl).digest('hex')

  return {
    id: `partner-${product.id}-${hash.substring(0, 8)}`,
    url: imageUrl,
    sourceType: 'partner',
    license: 'partner_provided',
    dimensions: validation.dimensions || { width: 600, height: 600 },
    format: getFormatFromMimeType(validation.mimeType),
    fileSize: validation.fileSize || 0,
    altText: product.name,
    altTextSv: product.name,
    createdAt: new Date(),
    validatedAt: new Date(),
    validationStatus: 'valid',
    hash,
  }
}

function getFormatFromMimeType(mimeType?: string): 'webp' | 'avif' | 'jpg' | 'png' {
  if (!mimeType) return 'jpg'
  if (mimeType.includes('webp')) return 'webp'
  if (mimeType.includes('avif')) return 'avif'
  if (mimeType.includes('png')) return 'png'
  return 'jpg'
}

// =============================================================================
// STEG B: HITTA ROYALTY-FREE BILD
// =============================================================================

/**
 * Hittar bästa matchande royalty-free bild baserat på produktattribut
 */
function findRoyaltyFreeImage(product: Product): ImageAsset | null {
  const searchKeys: string[] = []

  // Prioritera underkategorier
  for (const subCat of product.subCategories) {
    searchKeys.push(subCat)
  }

  // Sedan huvudkategori
  searchKeys.push(product.mainCategory)

  // Sedan färger
  if (product.attributes.primaryColor) {
    searchKeys.push(`${product.attributes.primaryColor}-blommor`)
  }

  // Sedan blomtyper
  if (product.attributes.flowerTypes) {
    searchKeys.push(...product.attributes.flowerTypes)
  }

  // Sök igenom bildbanken
  for (const key of searchKeys) {
    const images = ROYALTY_FREE_LIBRARY[key]
    if (images && images.length > 0) {
      // Välj deterministiskt baserat på produkt-ID för konsistens
      const index = hashToIndex(product.id, images.length)
      const selectedImage = images[index]

      // Klona och uppdatera alt-text
      return {
        ...selectedImage,
        id: `${selectedImage.id}-${product.id}`,
        altText: product.name,
        altTextSv: product.name,
      }
    }
  }

  return null
}

/**
 * Konverterar sträng-hash till index för deterministiskt urval
 */
function hashToIndex(str: string, max: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash) % max
}

// =============================================================================
// STEG C: AI-GENERERING
// =============================================================================

/**
 * Genererar prompt för AI-bildgenerering
 */
function generateAiPrompt(product: Product): string {
  const template = AI_PROMPT_TEMPLATES[product.mainCategory]

  // Extrahera värden för prompt
  const flowers = product.attributes.flowerTypes?.join(', ') || 'mixed seasonal flowers'
  const colors = product.attributes.colors?.join(' and ') || 'colorful'
  const extras = product.attributes.chocolateIncluded
    ? 'chocolate'
    : product.attributes.vasIncluded
      ? 'vase'
      : 'elegant wrapping'

  return template
    .replace('{flowers}', flowers)
    .replace('{colors}', colors)
    .replace('{extras}', extras)
}

/**
 * Genererar AI-bild (placeholder-implementation)
 * TODO: Implementera med DALL-E eller annan bildgenerator
 */
async function generateAiImage(product: Product): Promise<ImageAsset | null> {
  if (!IMAGE_CONFIG.enableAiGeneration) {
    return null
  }

  const prompt = generateAiPrompt(product)
  const promptHash = crypto.createHash('md5').update(prompt).digest('hex')

  // TODO: Anropa DALL-E API här
  // const response = await openai.images.generate({
  //   model: "dall-e-3",
  //   prompt: prompt,
  //   n: 1,
  //   size: "1024x1024",
  //   quality: "standard",
  // });

  // Placeholder för nu - returnerar null så fallback används
  console.log(`[ImageResolver] AI generation not yet implemented for: ${product.id}`)
  console.log(`[ImageResolver] Would use prompt: ${prompt}`)

  // Om implementerat, skapa ImageAsset:
  // return {
  //   id: `ai-${product.id}-${promptHash.substring(0, 8)}`,
  //   url: response.data[0].url,
  //   localPath: `${IMAGE_CONFIG.aiGeneratedBasePath}/${product.id}.webp`,
  //   sourceType: 'generated',
  //   license: 'ai_generated',
  //   prompt: prompt,
  //   dimensions: { width: 1024, height: 1024 },
  //   format: 'webp',
  //   fileSize: 0,
  //   altText: IMAGE_CONFIG.markAiGeneratedImages
  //     ? `${product.name} (illustrationsbild)`
  //     : product.name,
  //   altTextSv: IMAGE_CONFIG.markAiGeneratedImages
  //     ? `${product.name} (illustrationsbild)`
  //     : product.name,
  //   createdAt: new Date(),
  //   validationStatus: 'valid',
  //   hash: promptHash,
  // }

  return null
}

// =============================================================================
// STEG D: PLACEHOLDER
// =============================================================================

/**
 * Returnerar placeholder-bild baserat på kategori
 */
function getPlaceholderImage(product: Product): ImageAsset {
  const placeholder = PLACEHOLDER_IMAGES[product.mainCategory] || PLACEHOLDER_IMAGES.buketter

  return {
    ...placeholder,
    id: `${placeholder.id}-${product.id}`,
    altText: `${product.name} - bild kommer snart`,
    altTextSv: `${product.name} - bild saknas`,
  }
}

// =============================================================================
// HUVUDFUNKTION: IMAGE RESOLVER
// =============================================================================

/**
 * Resolve produktbild genom fallback-kedjan:
 * Partner → Royalty-free → AI-genererad → Placeholder
 */
export async function resolveProductImage(
  product: Product,
  partnerImageUrl?: string
): Promise<ImageAsset> {
  console.log(`[ImageResolver] Resolving image for: ${product.id}`)

  // STEG A: Försök med partnerbild
  if (partnerImageUrl) {
    console.log(`[ImageResolver] Trying partner image: ${partnerImageUrl}`)
    const validation = await validatePartnerImage(partnerImageUrl)

    if (validation.isValid) {
      console.log(`[ImageResolver] Partner image valid!`)
      return createPartnerImageAsset(product, partnerImageUrl, validation)
    } else {
      console.log(`[ImageResolver] Partner image invalid: ${validation.error}`)
    }
  }

  // STEG B: Försök med royalty-free bild
  console.log(`[ImageResolver] Trying royalty-free image...`)
  const royaltyFreeImage = findRoyaltyFreeImage(product)

  if (royaltyFreeImage) {
    console.log(`[ImageResolver] Found royalty-free image: ${royaltyFreeImage.id}`)
    return royaltyFreeImage
  }

  // STEG C: Försök med AI-genererad bild
  if (IMAGE_CONFIG.enableAiGeneration) {
    console.log(`[ImageResolver] Trying AI generation...`)
    const aiImage = await generateAiImage(product)

    if (aiImage) {
      console.log(`[ImageResolver] AI image generated: ${aiImage.id}`)
      return aiImage
    }
  }

  // STEG D: Fallback till placeholder
  console.log(`[ImageResolver] Using placeholder image`)
  return getPlaceholderImage(product)
}

/**
 * Batch-resolve bilder för flera produkter
 */
export async function resolveProductImages(
  products: Array<{ product: Product; imageUrl?: string }>
): Promise<Map<string, ImageAsset>> {
  const results = new Map<string, ImageAsset>()

  // Kör i parallell med begränsning
  const batchSize = 10
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(({ product, imageUrl }) => resolveProductImage(product, imageUrl))
    )

    batch.forEach(({ product }, index) => {
      results.set(product.id, batchResults[index])
    })
  }

  return results
}

// =============================================================================
// BILDSTATISTIK
// =============================================================================

export interface ImageSourceStats {
  partner: number
  royaltyFree: number
  generated: number
  placeholder: number
  total: number
}

/**
 * Räknar bildkällor för statistik
 */
export function getImageSourceStats(products: Product[]): ImageSourceStats {
  const stats: ImageSourceStats = {
    partner: 0,
    royaltyFree: 0,
    generated: 0,
    placeholder: 0,
    total: products.length,
  }

  for (const product of products) {
    switch (product.primaryImage.sourceType) {
      case 'partner':
        stats.partner++
        break
      case 'royalty_free':
        stats.royaltyFree++
        break
      case 'generated':
        stats.generated++
        break
      case 'placeholder':
        stats.placeholder++
        break
    }
  }

  return stats
}
