#!/usr/bin/env tsx

/**
 * Upload Images to Vercel Blob Storage
 * =====================================
 * Engångsmigration: Laddar upp lokalt nedladdade produktbilder till Vercel Blob
 * och uppdaterar data/products.json med blob-URLs.
 *
 * Kräver: BLOB_READ_WRITE_TOKEN i miljövariablar
 * Usage: npm run images:upload
 */

import { put, list } from '@vercel/blob'
import * as fs from 'fs'
import * as path from 'path'

const BASE_DIR = process.cwd()
const IMAGES_DIR = path.join(BASE_DIR, 'public', 'images', 'products')
const DATA_FILE = path.join(BASE_DIR, 'data', 'products.json')
const BLOB_BASE_URL = 'https://unfvnlzo1alycrmp.public.blob.vercel-storage.com'

async function main() {
  console.log('🌸 Laddar upp produktbilder till Vercel Blob...\n')

  // Kontrollera att BLOB_READ_WRITE_TOKEN finns
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN saknas i miljövariablar.')
    console.error('   Sätt: export BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...')
    process.exit(1)
  }

  // Läs products.json
  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ data/products.json saknas.')
    process.exit(1)
  }
  const productsData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  const products = productsData.products as any[]

  // Hämta lista av befintliga blobs för att hoppa över redan uppladdade
  console.log('📋 Hämtar befintliga blobs...')
  let existingBlobs = new Set<string>()
  try {
    let cursor: string | undefined
    do {
      const result = await list({ cursor, prefix: 'products/', limit: 1000 })
      for (const blob of result.blobs) {
        existingBlobs.add(blob.pathname)
      }
      cursor = result.cursor
    } while (cursor)
    console.log(`   Hittade ${existingBlobs.size} befintliga blobs.\n`)
  } catch (err) {
    console.warn('⚠️  Kunde inte hämta befintliga blobs, fortsätter ändå.\n')
  }

  // Ladda upp bilder
  let uploaded = 0
  let skipped = 0
  let failed = 0

  // Skapa en karta från sku/id → blob URL
  const blobUrlMap = new Map<string, string>()

  // Hämta alla JPG-filer från IMAGES_DIR
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Bildmapp saknas: ${IMAGES_DIR}`)
    process.exit(1)
  }

  const imageFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  console.log(`📁 Hittade ${imageFiles.length} lokala bildfiler.\n`)

  for (const filename of imageFiles) {
    const localPath = path.join(IMAGES_DIR, filename)
    const blobKey = `products/${filename}`
    const expectedBlobUrl = `${BLOB_BASE_URL}/${blobKey}`

    // Hoppa över om redan uppladdat
    if (existingBlobs.has(blobKey)) {
      blobUrlMap.set(filename, expectedBlobUrl)
      skipped++
      if (skipped % 50 === 0) {
        console.log(`  ⏭️  Hoppade över ${skipped} redan uppladdade bilder...`)
      }
      continue
    }

    try {
      const fileBuffer = fs.readFileSync(localPath)
      const contentType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg'

      const blob = await put(blobKey, fileBuffer, {
        access: 'public',
        contentType,
        addRandomSuffix: false,
      })

      blobUrlMap.set(filename, blob.url)
      uploaded++

      if (uploaded % 10 === 0) {
        console.log(`  ✅ Laddat upp ${uploaded}/${imageFiles.length - skipped} bilder...`)
      }
    } catch (err) {
      console.error(`  ❌ Misslyckades med ${filename}: ${err}`)
      failed++
    }
  }

  console.log(`\n📊 Upload-resultat:`)
  console.log(`   ✅ Uppladdade: ${uploaded}`)
  console.log(`   ⏭️  Hoppade över: ${skipped}`)
  console.log(`   ❌ Misslyckades: ${failed}`)

  // Uppdatera products.json med blob-URLs
  console.log('\n📝 Uppdaterar products.json med blob-URLs...')
  let updated = 0

  for (const product of products) {
    if (!product.primaryImage) continue

    // Bygg förväntat filnamn baserat på partnerId och sku
    const expectedFilename = `${product.partnerId}-${product.sku}.jpg`
    const blobUrl = blobUrlMap.get(expectedFilename)

    if (blobUrl) {
      product.primaryImage.url = blobUrl
      product.primaryImage.localPath = `/images/products/${expectedFilename}`
      product.primaryImage.validationStatus = 'valid'
      updated++
    } else {
      // Försök med PNG
      const expectedFilenamePng = `${product.partnerId}-${product.sku}.png`
      const blobUrlPng = blobUrlMap.get(expectedFilenamePng)
      if (blobUrlPng) {
        product.primaryImage.url = blobUrlPng
        product.primaryImage.localPath = `/images/products/${expectedFilenamePng}`
        product.primaryImage.validationStatus = 'valid'
        updated++
      }
    }
  }

  // Spara uppdaterad products.json
  productsData.blobMigratedAt = new Date().toISOString()
  fs.writeFileSync(DATA_FILE, JSON.stringify(productsData, null, 2))

  console.log(`   ✅ Uppdaterade ${updated}/${products.length} produkter med blob-URLs`)
  console.log('\n🎉 Klar! Produktbilder finns nu på Vercel Blob.')
  console.log(`   Blob-URL: ${BLOB_BASE_URL}/products/`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
