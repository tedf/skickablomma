#!/usr/bin/env tsx

/**
 * Test Feed Processing Script
 * ===========================
 * Quick test to verify feed processing works correctly.
 * Processes just 5 products from Fakeflowers (smallest feed).
 *
 * Usage: npx tsx scripts/test-feed-processing.ts
 */

import { XMLParser } from 'fast-xml-parser'
import * as fs from 'fs'
import * as path from 'path'

const BASE_DIR = process.cwd()
const FEEDS_DIR = path.join(BASE_DIR, 'feeds')
const TEST_FEED = path.join(FEEDS_DIR, 'fakeflowers.xml')

console.log('🧪 Testing Feed Processing')
console.log('='.repeat(80))
console.log(`Working directory: ${BASE_DIR}`)
console.log(`Test feed: ${TEST_FEED}`)
console.log('')

// Check if feed exists
if (!fs.existsSync(TEST_FEED)) {
  console.error(`❌ Feed file not found: ${TEST_FEED}`)
  process.exit(1)
}

// Get feed size
const stats = fs.statSync(TEST_FEED)
console.log(`📊 Feed size: ${(stats.size / 1024).toFixed(2)} KB`)

// Parse XML
console.log('📄 Parsing XML...')
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: false,
  parseTagValue: false,
  trimValues: true
})

const xmlContent = fs.readFileSync(TEST_FEED, 'utf-8')
const result = parser.parse(xmlContent)

let products: any[] = []
if (result.productFeed && result.productFeed.product) {
  const productData = result.productFeed.product
  products = Array.isArray(productData) ? productData : [productData]
}

console.log(`✅ Found ${products.length} products in feed`)
console.log('')

// Show first 5 products
console.log('📦 First 5 products:')
console.log('='.repeat(80))

products.slice(0, 5).forEach((product, i) => {
  console.log(`\n${i + 1}. ${product.Name}`)
  console.log(`   SKU: ${product.SKU}`)
  console.log(`   Price: ${product.Price} ${product.Currency}`)
  console.log(`   Category: ${product.Category || 'N/A'}`)
  console.log(`   In Stock: ${product.Instock || 'N/A'}`)
  console.log(`   Image: ${product.ImageUrl ? '✓' : '✗'}`)
  console.log(`   Product URL: ${product.ProductUrl}`)

  // Test tracking URL generation
  const trackingUrl = `https://go.fakeflowers.se/t/t?a=1998457785&as=1771789045&t=2&tk=1&url=${encodeURIComponent(product.ProductUrl)}`
  console.log(`   Tracking URL: ${trackingUrl.substring(0, 80)}...`)
})

console.log('\n' + '='.repeat(80))
console.log('✅ Test completed successfully!')
console.log('\nNext step: Run full processing with:')
console.log('  npm run feed:process')
