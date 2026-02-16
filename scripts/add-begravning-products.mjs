/**
 * Lägg till riktiga Interflora-begravningsprodukter
 * Kör: node scripts/add-begravning-products.mjs
 */

import { put } from '@vercel/blob'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PRODUCTS_JSON = join(ROOT, 'data', 'products.json')

function loadEnv() {
  try {
    const envFile = readFileSync(join(ROOT, '.env.local'), 'utf8')
    for (const line of envFile.split('\n')) {
      const [key, ...vals] = line.split('=')
      if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
    }
  } catch {}
}

async function downloadAndUpload(imageUrl, productId, token) {
  const resp = await fetch(imageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Skickablomma/1.0)' },
    redirect: 'follow',
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const buffer = await resp.arrayBuffer()
  const contentType = resp.headers.get('content-type') || 'image/jpeg'
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
  const blob = await put(`products/${productId}.${ext}`, buffer, {
    access: 'public',
    contentType,
    allowOverwrite: true,
    token,
  })
  return blob.url
}

// Alla begravningsprodukter från Interflora-feeden
const BEGRAVNING_PRODUCTS = [
  {
    sku: '1220025',
    name: 'Floristens liggande bukett',
    description: 'Floristens val innebär att våra kunniga florister får fria händer att skapa en vacker, handbunden sorgbukett med säsongens blommor och färger. Levereras liggande vid kistan eller urnan.',
    price: 499,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744193561-1220025.jpg',
    productUrl: 'https://www.interflora.se/p/399-floristens-liggande-bukett/2',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1220025&url=https://www.interflora.se/p/399-floristens-liggande-bukett/2',
    subCategories: ['begravningsbuketter'],
  },
  {
    sku: '1220026',
    name: 'Begravningsbukett, Omtanke',
    description: 'En vacker begravningsbukett i creme och aprikos med nejlikor, rosor, alstroemeria och grönt. Placeras liggande på golvet eller på stativ runt kista eller urna.',
    price: 599,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744193535-1220026.jpg',
    productUrl: 'https://www.interflora.se/p/220-begravningsbukett-omtanke/1',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1220026&url=https://www.interflora.se/p/220-begravningsbukett-omtanke/1',
    subCategories: ['begravningsbuketter'],
  },
  {
    sku: '1220037',
    name: 'Rosa Himmel, liggande bukett',
    description: 'Liggande bukett med sommarens blommor i ljusa pastell-färger. Ros, prärieklocka, alstroemeria och limonium på en grön bädd.',
    price: 699,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744204436-1220037.jpg',
    productUrl: 'https://www.interflora.se/p/22692-rosa-himmel-liggande-bukett/1',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1220037&url=https://www.interflora.se/p/22692-rosa-himmel-liggande-bukett/1',
    subCategories: ['begravningsbuketter', 'rosa-blommor'],
  },
  {
    sku: '1220051',
    name: 'Saknad, liggande bukett',
    description: 'En ljuvlig liggande begravningsbukett med vita rosor och vit alstroemeria i perfekt harmoni med brudslöja på en botten av eukalyptus.',
    price: 799,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744193416-1220051.jpg',
    productUrl: 'https://www.interflora.se/p/22963-saknad-liggande-bukett/1',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1220051&url=https://www.interflora.se/p/22963-saknad-liggande-bukett/1',
    subCategories: ['begravningsbuketter', 'vita-blommor'],
  },
  {
    sku: '1220047',
    name: 'Kärlek, liggande bukett',
    description: 'I denna vackra liggande bukett får röd ros och kvistros sällskap av röda bär, pistage och läderblad. En uttrycksfull hyllning.',
    price: 1099,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744193699-1220047.jpg',
    productUrl: 'https://www.interflora.se/p/24303-karlek-liggande-bukett/1',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1220047&url=https://www.interflora.se/p/24303-karlek-liggande-bukett/1',
    subCategories: ['begravningsbuketter', 'roda-blommor'],
  },
  {
    sku: '1220056',
    name: 'Farväl, liggande bukett',
    description: 'En ljuvlig liggande begravningsbukett i vitt, aprikos och creme som vackert ramas in av grönt. Ett fint avsked.',
    price: 499,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744194303-1220056.jpg',
    productUrl: 'https://www.interflora.se/p/43422-farval-liggande-bukett/1',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1220056&url=https://www.interflora.se/p/43422-farval-liggande-bukett/1',
    subCategories: ['begravningsbuketter', 'vita-blommor'],
  },
  {
    sku: '1222037',
    name: 'Floristens begravningskrans',
    description: 'Kransen är ca 55 cm i diameter och skapas av blommor och grönt arrangerat i stickmassa. Placeras på golv runt kista eller urna vid begravningen.',
    price: 1599,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744193507-1222037.jpg',
    productUrl: 'https://www.interflora.se/p/395-floristens-begravningskrans/2',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1222037&url=https://www.interflora.se/p/395-floristens-begravningskrans/2',
    subCategories: ['begravningskransar'],
  },
  {
    sku: '1222070',
    name: 'Saknad, krans',
    description: 'Omfångsrik krans med mjukt rundade former. Klassisk röd ros tillsammans med kvistros, krysantemum och alstroemeria i rosa och vinröda nyanser.',
    price: 2599,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744193544-1222070.jpg',
    productUrl: 'https://www.interflora.se/p/22957-saknad-krans/1',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1222070&url=https://www.interflora.se/p/22957-saknad-krans/1',
    subCategories: ['begravningskransar'],
  },
  {
    sku: '1222064',
    name: 'Älskad, krans',
    description: 'Vita rosor och vit alstroemeria i perfekt harmoni med brudslöja på en botten av eukalyptus och pistage. En elegant och fridfullt krans.',
    price: 3299,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744194356-1222064.jpg',
    productUrl: 'https://www.interflora.se/p/22843-alskad-krans/1',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1222064&url=https://www.interflora.se/p/22843-alskad-krans/1',
    subCategories: ['begravningskransar', 'vita-blommor'],
  },
  {
    sku: '1222068-Karlek-krans',
    name: 'Kärlek, krans',
    description: 'En vacker begravningskrans som uttrycker kärlek och saknad. Arrangerad av säsongens blommor i stickmassa.',
    price: 2799,
    imageUrl: 'https://www.interflora.se/fstrz/r/s/www.datocms-assets.com/157122/1744204535-1222068-Karlek-krans.jpg',
    productUrl: 'https://www.interflora.se/p/24313-karlek-krans/1',
    trackingUrl: 'https://go.adt246.net/t/t?a=1487385313&as=1771789045&t=2&tk=1&cupa_sku=1222068&url=https://www.interflora.se/p/24313-karlek-krans/1',
    subCategories: ['begravningskransar'],
  },
]

function slugify(sku) {
  return `interflora-${sku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
}

async function main() {
  loadEnv()
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) { console.error('BLOB_READ_WRITE_TOKEN saknas'); process.exit(1) }

  const data = JSON.parse(readFileSync(PRODUCTS_JSON, 'utf8'))
  const now = new Date().toISOString()

  // Remove old broken begravning products
  const brokenIds = ['interflora-karlek-krans', 'interflora-saknad-krans', 'interflora-floristens-krans', 'interflora-farval-bukett', 'interflora-frid-krans', 'interflora-minne-dekoration']
  data.products = data.products.filter(p => !brokenIds.includes(p.id))
  console.log(`Removed ${brokenIds.length} broken products. Now ${data.products.length} products.`)

  for (const prod of BEGRAVNING_PRODUCTS) {
    const id = slugify(prod.sku)
    // Skip if already exists
    if (data.products.find(p => p.id === id)) {
      console.log(`Skipping existing: ${id}`)
      continue
    }

    console.log(`Processing: ${prod.name} (${id})...`)
    let blobUrl
    try {
      blobUrl = await downloadAndUpload(prod.imageUrl, id, token)
      console.log(`  Image uploaded: ${blobUrl.slice(0, 70)}`)
    } catch (err) {
      console.log(`  Image failed: ${err.message} — using fallback`)
      // Use existing begravning image as fallback
      const existing = data.products.find(p => p.mainCategory === 'begravning' && p.primaryImage?.url?.includes('blob'))
      blobUrl = existing?.primaryImage?.url || prod.imageUrl
    }

    data.products.push({
      id,
      sku: prod.sku,
      partnerId: 'interflora',
      name: prod.name,
      description: prod.description,
      shortDescription: prod.description.slice(0, 100) + '...',
      mainCategory: 'begravning',
      subCategories: prod.subCategories,
      tags: ['begravning', 'begravningsblommor', 'interflora', ...prod.subCategories],
      price: prod.price,
      originalPrice: prod.price,
      currency: 'SEK',
      discountPercent: 0,
      shipping: 99,
      inStock: true,
      sameDayDelivery: false,
      deliveryDays: 2,
      attributes: {
        flowerTypes: [],
        colors: [],
        primaryColor: '',
        suitableFor: ['begravning'],
        occasions: ['begravning'],
      },
      primaryImage: {
        url: blobUrl,
        altTextSv: prod.name,
        sourceType: 'partner',
        createdAt: now,
      },
      additionalImages: [],
      productUrl: prod.productUrl,
      trackingUrl: prod.trackingUrl,
      brand: 'Interflora',
      popularityScore: 70,
      clickCount: 0,
      createdAt: now,
      updatedAt: now,
      feedUpdatedAt: now,
      isActive: true,
      isPromoted: false,
    })
    console.log(`  Added: ${prod.name}`)
  }

  writeFileSync(PRODUCTS_JSON, JSON.stringify(data, null, 2))
  console.log(`\nDone! Total products: ${data.products.length}`)
}

main().catch(err => { console.error(err); process.exit(1) })
