#!/usr/bin/env tsx

/**
 * Add Begravning Products from Interflora
 * =======================================
 * Adds funeral wreaths (kransar) and other begravning products from Interflora
 * that are not in the feed but available on their website.
 *
 * Usage: npx tsx scripts/add-begravning-products.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json')

// Adtraction affiliate tracking base
const TRACKING_BASE = 'https://go.adt246.net/t/t?a=767510657&as=1771789045&t=2&tk=1&url='

function createTrackingUrl(productUrl: string): string {
  return TRACKING_BASE + encodeURIComponent(productUrl)
}

// New products to add from Interflora begravning category
const newProducts = [
  {
    id: 'interflora-karlek-krans',
    sku: 'karlek-krans',
    partnerId: 'interflora',
    name: 'Kärlek, krans',
    description: `En vacker och kärleksfull begravningskrans som uttrycker djup kärlek och saknad. Kransen är bunden med röda rosor och kvistrosor tillsammans med vinröda nejlikor och vackert grönt. De röda färgerna symboliserar kärlek och passion, ett vackert sätt att hedra någon som betytt mycket.

Kransen har en diameter på ca 55 cm och binds av kunniga florister med stor omsorg. Perfekt för att visa din djupaste kärlek vid livets slut.

Kan levereras direkt till kyrka, kapell eller begravningsplats. Möjlighet att lägga till textat band med personlig hälsning.`,
    shortDescription: 'Ljuvlig begravningskrans med röda rosor, kvistrosor och vinröda nejlikor. Ett kärleksfullt sätt att hedra minnet.',
    mainCategory: 'begravning',
    subCategories: ['begravningskransar', 'begravningsbuketter', 'kondoleanser', 'rosor', 'roda-blommor'],
    tags: ['begravning', 'krans', 'rosor', 'röd'],
    price: 2499,
    originalPrice: 2499,
    currency: 'SEK',
    shipping: 0,
    inStock: true,
    sameDayDelivery: true,
    attributes: {
      colors: ['röd', 'grön'],
      primaryColor: 'röd',
      size: 'stor',
      suitableFor: ['begravning', 'kondoleans'],
      diameter: '55 cm'
    },
    primaryImage: {
      id: 'img-interflora-karlek-krans',
      url: 'https://www.interflora.se/images/products/karlek-krans.jpg',
      localPath: '/images/products/interflora-karlek-krans.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      altText: 'Kärlek begravningskrans med röda rosor',
      altTextSv: 'Begravningskrans Kärlek med röda rosor och nejlikor',
      createdAt: new Date().toISOString(),
      validationStatus: 'valid'
    },
    additionalImages: [],
    productUrl: 'https://www.interflora.se/interflora/tillfallen/begravningsblommor/karlek-krans/',
    trackingUrl: createTrackingUrl('https://www.interflora.se/interflora/tillfallen/begravningsblommor/karlek-krans/'),
    brand: 'Interflora',
    popularityScore: 80,
    clickCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedUpdatedAt: new Date().toISOString(),
    isActive: true,
    isPromoted: true
  },
  {
    id: 'interflora-saknad-krans',
    sku: 'saknad-krans',
    partnerId: 'interflora',
    name: 'Saknad, krans',
    description: `En vacker och värdig begravningskrans som uttrycker saknad och kärlek. Kransen är skapad i mjuka, dova färger med vita och rosa blommor som symboliserar frid och ömhet.

Floristerna binder denna krans med stor omsorg och använder säsongens finaste blommor för att skapa ett harmoniskt arrangemang. Kransen har en diameter på ca 50 cm.

Perfekt för att visa din saknad och hedra minnet av någon nära. Kan levereras direkt till ceremoniplatsen med personligt textat band.`,
    shortDescription: 'Värdig begravningskrans i mjuka färger som uttrycker saknad och ömhet.',
    mainCategory: 'begravning',
    subCategories: ['begravningskransar', 'begravningsbuketter', 'kondoleanser', 'vita-blommor', 'rosa-blommor'],
    tags: ['begravning', 'krans', 'saknad'],
    price: 1899,
    originalPrice: 1899,
    currency: 'SEK',
    shipping: 0,
    inStock: true,
    sameDayDelivery: true,
    attributes: {
      colors: ['vit', 'rosa'],
      primaryColor: 'vit',
      size: 'stor',
      suitableFor: ['begravning', 'kondoleans'],
      diameter: '50 cm'
    },
    primaryImage: {
      id: 'img-interflora-saknad-krans',
      url: 'https://www.interflora.se/images/products/saknad-krans.jpg',
      localPath: '/images/products/interflora-saknad-krans.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      altText: 'Saknad begravningskrans i vita och rosa toner',
      altTextSv: 'Begravningskrans Saknad med vita och rosa blommor',
      createdAt: new Date().toISOString(),
      validationStatus: 'valid'
    },
    additionalImages: [],
    productUrl: 'https://www.interflora.se/interflora/tillfallen/begravningsblommor/saknad-krans/',
    trackingUrl: createTrackingUrl('https://www.interflora.se/interflora/tillfallen/begravningsblommor/saknad-krans/'),
    brand: 'Interflora',
    popularityScore: 75,
    clickCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedUpdatedAt: new Date().toISOString(),
    isActive: true,
    isPromoted: false
  },
  {
    id: 'interflora-floristens-krans',
    sku: 'floristens-krans',
    partnerId: 'interflora',
    name: 'Floristens begravningskrans',
    description: `Låt vår erfarna florist skapa en unik och vacker begravningskrans med säsongens finaste blommor. Floristens val innebär att du får en personligt skapad krans där floristen använder sin kreativitet och expertis för att skapa något alldeles speciellt.

Kransen har en diameter på ca 55 cm och skapas med noggrant utvalda blommor i harmoniska färger. Ett perfekt val om du vill ha något unikt som hedrar minnet på ett personligt sätt.

Inkluderar leverans till kyrka, kapell eller begravningsplats. Möjlighet att lägga till textat band.`,
    shortDescription: 'Unik begravningskrans skapad av erfaren florist med säsongens blommor.',
    mainCategory: 'begravning',
    subCategories: ['begravningskransar', 'begravningsbuketter', 'kondoleanser', 'blandade-farger'],
    tags: ['begravning', 'krans', 'floristens val'],
    price: 1599,
    originalPrice: 1599,
    currency: 'SEK',
    shipping: 0,
    inStock: true,
    sameDayDelivery: true,
    attributes: {
      colors: ['blandad'],
      primaryColor: 'blandad',
      size: 'stor',
      suitableFor: ['begravning', 'kondoleans'],
      diameter: '55 cm'
    },
    primaryImage: {
      id: 'img-interflora-floristens-krans',
      url: 'https://www.interflora.se/images/products/floristens-krans.jpg',
      localPath: '/images/products/interflora-floristens-krans.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      altText: 'Floristens val - begravningskrans med säsongens blommor',
      altTextSv: 'Floristens begravningskrans med säsongens finaste blommor',
      createdAt: new Date().toISOString(),
      validationStatus: 'valid'
    },
    additionalImages: [],
    productUrl: 'https://www.interflora.se/interflora/tillfallen/begravningsblommor/floristens-val-krans/',
    trackingUrl: createTrackingUrl('https://www.interflora.se/interflora/tillfallen/begravningsblommor/floristens-val-krans/'),
    brand: 'Interflora',
    popularityScore: 70,
    clickCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedUpdatedAt: new Date().toISOString(),
    isActive: true,
    isPromoted: false
  },
  {
    id: 'interflora-farval-bukett',
    sku: 'farval-bukett',
    partnerId: 'interflora',
    name: 'Farväl, liggande bukett',
    description: `En vacker liggande begravningsbukett som uttrycker ett värdigt farväl. Buketten är skapad med vita liljor, rosor och elegant grönt - en klassisk och tidlös kombination som symboliserar frid och renhet.

Den liggande formen gör buketten perfekt för placering på kista eller vid graven. Buketten är ca 60 cm lång och binds med stor omsorg av våra skickliga florister.

Vita blommor har en lång tradition vid begravningar och symboliserar renhet, frid och hopp. Ett vackert sätt att visa respekt och hedra minnet av den avlidne.`,
    shortDescription: 'Elegant liggande begravningsbukett med vita liljor och rosor för ett värdigt farväl.',
    mainCategory: 'begravning',
    subCategories: ['begravningsbuketter', 'kondoleanser', 'liljor', 'rosor', 'vita-blommor'],
    tags: ['begravning', 'bukett', 'liggande', 'vita blommor'],
    price: 1299,
    originalPrice: 1299,
    currency: 'SEK',
    shipping: 0,
    inStock: true,
    sameDayDelivery: true,
    attributes: {
      colors: ['vit'],
      primaryColor: 'vit',
      size: 'stor',
      suitableFor: ['begravning', 'kondoleans'],
      length: '60 cm'
    },
    primaryImage: {
      id: 'img-interflora-farval-bukett',
      url: 'https://www.interflora.se/images/products/farval-bukett.jpg',
      localPath: '/images/products/interflora-farval-bukett.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      altText: 'Farväl liggande begravningsbukett med vita blommor',
      altTextSv: 'Liggande begravningsbukett Farväl med vita liljor och rosor',
      createdAt: new Date().toISOString(),
      validationStatus: 'valid'
    },
    additionalImages: [],
    productUrl: 'https://www.interflora.se/interflora/tillfallen/begravningsblommor/farval-liggande-bukett/',
    trackingUrl: createTrackingUrl('https://www.interflora.se/interflora/tillfallen/begravningsblommor/farval-liggande-bukett/'),
    brand: 'Interflora',
    popularityScore: 72,
    clickCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedUpdatedAt: new Date().toISOString(),
    isActive: true,
    isPromoted: false
  },
  {
    id: 'interflora-frid-krans',
    sku: 'frid-krans',
    partnerId: 'interflora',
    name: 'Frid, krans',
    description: `En stillsam och vacker begravningskrans i vita och gröna toner som uttrycker frid och ro. Kransen är skapad med vita blommor som liljor, rosor och krysantemum tillsammans med frodigt grönt.

Den vita färgen symboliserar renhet och frid, medan det gröna ger liv och hopp. Kransen har en diameter på ca 50 cm och binds med stor omsorg.

En klassisk och tidlös hyllning som passar för alla typer av ceremonier. Kan levereras med personligt textat band till kyrka eller kapell.`,
    shortDescription: 'Stillsam begravningskrans i vita och gröna toner som uttrycker frid och ro.',
    mainCategory: 'begravning',
    subCategories: ['begravningskransar', 'begravningsbuketter', 'kondoleanser', 'vita-blommor', 'liljor'],
    tags: ['begravning', 'krans', 'vit', 'frid'],
    price: 1799,
    originalPrice: 1799,
    currency: 'SEK',
    shipping: 0,
    inStock: true,
    sameDayDelivery: true,
    attributes: {
      colors: ['vit', 'grön'],
      primaryColor: 'vit',
      size: 'stor',
      suitableFor: ['begravning', 'kondoleans'],
      diameter: '50 cm'
    },
    primaryImage: {
      id: 'img-interflora-frid-krans',
      url: 'https://www.interflora.se/images/products/frid-krans.jpg',
      localPath: '/images/products/interflora-frid-krans.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      altText: 'Frid begravningskrans i vita och gröna toner',
      altTextSv: 'Begravningskrans Frid med vita blommor och grönt',
      createdAt: new Date().toISOString(),
      validationStatus: 'valid'
    },
    additionalImages: [],
    productUrl: 'https://www.interflora.se/interflora/tillfallen/begravningsblommor/frid-krans/',
    trackingUrl: createTrackingUrl('https://www.interflora.se/interflora/tillfallen/begravningsblommor/frid-krans/'),
    brand: 'Interflora',
    popularityScore: 74,
    clickCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedUpdatedAt: new Date().toISOString(),
    isActive: true,
    isPromoted: false
  },
  {
    id: 'interflora-minne-dekoration',
    sku: 'minne-dekoration',
    partnerId: 'interflora',
    name: 'Minne, dekoration',
    description: `En vacker och känslosam begravningsdekoration som hedrar minnet av någon kär. Dekorationen är skapad med omsorgsfullt utvalda blommor i mjuka, harmoniska färger.

Perfekt som kistdekoration eller som ett vackert arrangemang vid graven. Floristerna skapar varje dekoration med kärlek och respekt för den avlidne.

Dekorationen kan anpassas efter önskemål och finns i flera storlekar. Leverans direkt till kyrka, kapell eller begravningsplats.`,
    shortDescription: 'Vacker begravningsdekoration som hedrar minnet med omsorgsfullt utvalda blommor.',
    mainCategory: 'begravning',
    subCategories: ['begravningsbuketter', 'kondoleanser', 'blandade-farger'],
    tags: ['begravning', 'dekoration', 'minne'],
    price: 999,
    originalPrice: 999,
    currency: 'SEK',
    shipping: 0,
    inStock: true,
    sameDayDelivery: true,
    attributes: {
      colors: ['blandad'],
      primaryColor: 'blandad',
      size: 'mellan',
      suitableFor: ['begravning', 'kondoleans']
    },
    primaryImage: {
      id: 'img-interflora-minne-dekoration',
      url: 'https://www.interflora.se/images/products/minne-dekoration.jpg',
      localPath: '/images/products/interflora-minne-dekoration.jpg',
      sourceType: 'partner',
      license: 'partner_provided',
      dimensions: { width: 800, height: 800 },
      format: 'jpg',
      altText: 'Minne begravningsdekoration',
      altTextSv: 'Begravningsdekoration Minne med vackra blommor',
      createdAt: new Date().toISOString(),
      validationStatus: 'valid'
    },
    additionalImages: [],
    productUrl: 'https://www.interflora.se/interflora/tillfallen/begravningsblommor/minne-dekoration/',
    trackingUrl: createTrackingUrl('https://www.interflora.se/interflora/tillfallen/begravningsblommor/minne-dekoration/'),
    brand: 'Interflora',
    popularityScore: 65,
    clickCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedUpdatedAt: new Date().toISOString(),
    isActive: true,
    isPromoted: false
  }
]

async function main() {
  console.log('Adding begravning products from Interflora...\n')

  // Read existing products
  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'))
  const existingIds = new Set(data.products.map((p: any) => p.id))

  let added = 0
  for (const product of newProducts) {
    if (existingIds.has(product.id)) {
      console.log(`⏭️  Skipping ${product.name} (already exists)`)
      continue
    }
    data.products.push(product)
    added++
    console.log(`✅ Added: ${product.name} - ${product.price} kr`)
  }

  // Update timestamp
  data.generatedAt = new Date().toISOString()

  // Save
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))

  // Count begravning products
  const begravningCount = data.products.filter((p: any) => p.mainCategory === 'begravning').length

  console.log(`\n✅ Added ${added} new begravning products`)
  console.log(`📊 Total begravning products: ${begravningCount}`)
}

main().catch(console.error)
