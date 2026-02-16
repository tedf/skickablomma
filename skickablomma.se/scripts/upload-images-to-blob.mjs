/**
 * Laddar upp alla produktbilder till Vercel Blob
 * Kör med: node scripts/upload-images-to-blob.mjs
 * Kräver: BLOB_READ_WRITE_TOKEN i .env.local
 */

import { put, list } from '@vercel/blob'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PRODUCTS_JSON = join(ROOT, 'data', 'products.json')

// Läs BLOB_READ_WRITE_TOKEN från .env.local
function loadEnv() {
  try {
    const envFile = readFileSync(join(ROOT, '.env.local'), 'utf8')
    for (const line of envFile.split('\n')) {
      const [key, ...vals] = line.split('=')
      if (key && vals.length) {
        process.env[key.trim()] = vals.join('=').trim()
      }
    }
  } catch (e) {
    console.log('No .env.local found, using existing env vars')
  }
}

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Skickablomma-bot/1.0)',
    },
    redirect: 'follow',
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const buffer = await response.arrayBuffer()
  return { buffer, contentType }
}

function getExtension(url, contentType) {
  const urlExt = url.split('?')[0].split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(urlExt)) {
    return urlExt === 'jpeg' ? 'jpg' : urlExt
  }
  if (contentType?.includes('jpeg')) return 'jpg'
  if (contentType?.includes('png')) return 'png'
  if (contentType?.includes('webp')) return 'webp'
  return 'jpg'
}

async function listAllBlobs() {
  const blobMap = {}
  let cursor = undefined
  do {
    const result = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      prefix: 'products/',
      cursor,
      limit: 1000,
    })
    for (const blob of result.blobs) {
      // pathname: "products/cramers-01510.jpg" → key: "cramers-01510"
      const name = blob.pathname.replace(/^products\//, '').replace(/\.[^.]+$/, '')
      blobMap[name] = blob.url
    }
    cursor = result.cursor
  } while (cursor)
  return blobMap
}

async function main() {
  loadEnv()

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN saknas!')
    process.exit(1)
  }

  console.log('Läser products.json...')
  const data = JSON.parse(readFileSync(PRODUCTS_JSON, 'utf8'))
  const products = data.products
  console.log(`Hittade ${products.length} produkter`)

  console.log('Hämtar befintliga blobs...')
  const existingBlobs = await listAllBlobs()
  console.log(`Hittade ${Object.keys(existingBlobs).length} befintliga blobs`)

  const blobDomain = 'public.blob.vercel-storage.com'
  let uploaded = 0
  let reused = 0
  let failed = 0

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const imageUrl = product.primaryImage?.url

    if (!imageUrl) {
      failed++
      continue
    }

    // Redan på blob – bara uppdatera URL:en
    if (imageUrl.includes(blobDomain)) {
      reused++
      continue
    }

    // Finns redan uppladdad från tidigare session
    if (existingBlobs[product.id]) {
      product.primaryImage.url = existingBlobs[product.id]
      product.primaryImage.sourceType = 'partner'
      reused++
      process.stdout.write(`[${i + 1}/${products.length}] ${product.id}: återanvänder blob\n`)
      continue
    }

    try {
      process.stdout.write(`[${i + 1}/${products.length}] ${product.id}: Laddar ned...`)

      const { buffer, contentType } = await downloadImage(imageUrl)
      const ext = getExtension(imageUrl, contentType)
      const pathname = `products/${product.id}.${ext}`

      const blob = await put(pathname, buffer, {
        access: 'public',
        contentType,
        allowOverwrite: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })

      product.primaryImage.url = blob.url
      product.primaryImage.sourceType = 'partner'
      uploaded++
      console.log(` OK -> ${blob.url.slice(0, 60)}...`)
    } catch (err) {
      failed++
      console.log(` FEL: ${err.message}`)
    }

    // Kort paus
    if (i % 10 === 9) {
      await new Promise(r => setTimeout(r, 300))
    }
  }

  console.log(`\nKlar! Nya: ${uploaded}, Återanvända: ${reused}, Misslyckades: ${failed}`)

  console.log('Sparar uppdaterat products.json...')
  writeFileSync(PRODUCTS_JSON, JSON.stringify(data, null, 2))
  console.log('products.json sparad!')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
