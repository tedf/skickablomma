#!/usr/bin/env tsx
/**
 * Feed Fetcher Script
 * ===================
 * Hämtar produktfeeds från alla partners och sparar lokalt.
 *
 * Användning:
 *   npm run feed:fetch
 *   npx tsx scripts/fetch-feeds.ts
 *   npx tsx scripts/fetch-feeds.ts --partner=interflora
 */

import * as fs from 'fs'
import * as path from 'path'

// Partner-konfiguration
const PARTNERS = {
  cramers: {
    name: 'Cramers Blommor',
    productFeed: process.env.ADTRACTION_CRAMERS_PRODUCT_FEED || 'https://adtraction.com/feeds/products/cramers.xml',
    statusFeed: process.env.ADTRACTION_CRAMERS_STATUS_FEED || 'https://adtraction.com/feeds/status/cramers.xml',
  },
  interflora: {
    name: 'Interflora',
    productFeed: process.env.ADTRACTION_INTERFLORA_PRODUCT_FEED || 'https://adtraction.com/feeds/products/interflora.xml',
    statusFeed: process.env.ADTRACTION_INTERFLORA_STATUS_FEED || 'https://adtraction.com/feeds/status/interflora.xml',
  },
  fakeflowers: {
    name: 'Fakeflowers',
    productFeed: process.env.ADTRACTION_FAKEFLOWERS_PRODUCT_FEED || 'https://adtraction.com/feeds/products/fakeflowers.xml',
    statusFeed: process.env.ADTRACTION_FAKEFLOWERS_STATUS_FEED || 'https://adtraction.com/feeds/status/fakeflowers.xml',
  },
  myperfectday: {
    name: 'My Perfect Day',
    productFeed: process.env.ADTRACTION_MYPERFECTDAY_PRODUCT_FEED || 'https://adtraction.com/feeds/products/myperfectday.xml',
    statusFeed: process.env.ADTRACTION_MYPERFECTDAY_STATUS_FEED || 'https://adtraction.com/feeds/status/myperfectday.xml',
  },
}

const FEEDS_DIR = path.join(process.cwd(), 'feeds')
const MAX_RETRIES = 4
const RETRY_DELAYS = [2000, 4000, 8000, 16000] // Exponential backoff

interface FetchResult {
  partner: string
  feedType: 'product' | 'status'
  success: boolean
  filePath?: string
  error?: string
  duration: number
  size?: number
}

/**
 * Hämtar en feed med retry-logik
 */
async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<string> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`  Attempt ${attempt + 1}/${retries + 1}: ${url}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'SkickaBlomma/1.0 Feed Fetcher',
          'Accept': 'application/xml, text/xml, */*',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const text = await response.text()

      // Validera att det är XML
      if (!text.trim().startsWith('<?xml') && !text.trim().startsWith('<')) {
        throw new Error('Response is not valid XML')
      }

      return text
    } catch (error) {
      lastError = error as Error
      console.log(`  ❌ Attempt ${attempt + 1} failed: ${lastError.message}`)

      if (attempt < retries) {
        const delay = RETRY_DELAYS[attempt]
        console.log(`  ⏳ Waiting ${delay / 1000}s before retry...`)
        await sleep(delay)
      }
    }
  }

  throw lastError || new Error('Unknown error')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Hämtar och sparar en feed
 */
async function fetchAndSaveFeed(
  partnerId: string,
  feedType: 'product' | 'status',
  url: string
): Promise<FetchResult> {
  const startTime = Date.now()
  const fileName = `${partnerId}-${feedType}-${new Date().toISOString().split('T')[0]}.xml`
  const filePath = path.join(FEEDS_DIR, fileName)

  try {
    console.log(`\n📥 Fetching ${feedType} feed for ${partnerId}...`)

    const content = await fetchWithRetry(url)

    // Spara till fil
    fs.writeFileSync(filePath, content, 'utf-8')

    const duration = Date.now() - startTime
    const size = Buffer.byteLength(content, 'utf-8')

    console.log(`  ✅ Success! Saved ${(size / 1024).toFixed(1)} KB to ${fileName}`)

    return {
      partner: partnerId,
      feedType,
      success: true,
      filePath,
      duration,
      size,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    console.log(`  ❌ Failed: ${errorMessage}`)

    return {
      partner: partnerId,
      feedType,
      success: false,
      error: errorMessage,
      duration,
    }
  }
}

/**
 * Huvudfunktion
 */
async function main() {
  console.log('🌸 Skicka Blomma - Feed Fetcher')
  console.log('================================\n')

  // Skapa feeds-mapp om den inte finns
  if (!fs.existsSync(FEEDS_DIR)) {
    fs.mkdirSync(FEEDS_DIR, { recursive: true })
    console.log(`📁 Created feeds directory: ${FEEDS_DIR}`)
  }

  // Parsa argument
  const args = process.argv.slice(2)
  const partnerArg = args.find(a => a.startsWith('--partner='))
  const selectedPartner = partnerArg?.split('=')[1]

  // Filtrera partners
  const partnersToFetch = selectedPartner
    ? { [selectedPartner]: PARTNERS[selectedPartner as keyof typeof PARTNERS] }
    : PARTNERS

  if (selectedPartner && !PARTNERS[selectedPartner as keyof typeof PARTNERS]) {
    console.error(`❌ Unknown partner: ${selectedPartner}`)
    console.log(`Available partners: ${Object.keys(PARTNERS).join(', ')}`)
    process.exit(1)
  }

  const results: FetchResult[] = []
  const startTime = Date.now()

  // Hämta feeds
  for (const [partnerId, config] of Object.entries(partnersToFetch)) {
    if (!config) continue

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`🏪 ${config.name}`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

    // Hämta produktfeed
    const productResult = await fetchAndSaveFeed(partnerId, 'product', config.productFeed)
    results.push(productResult)

    // Hämta statusfeed
    const statusResult = await fetchAndSaveFeed(partnerId, 'status', config.statusFeed)
    results.push(statusResult)
  }

  // Sammanfattning
  const totalDuration = Date.now() - startTime
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  const totalSize = successful.reduce((sum, r) => sum + (r.size || 0), 0)

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 SUMMARY')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Successful: ${successful.length}`)
  console.log(`❌ Failed: ${failed.length}`)
  console.log(`📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`⏱️  Duration: ${(totalDuration / 1000).toFixed(1)}s`)

  if (failed.length > 0) {
    console.log('\n⚠️  Failed feeds:')
    failed.forEach(r => {
      console.log(`   - ${r.partner} (${r.feedType}): ${r.error}`)
    })
  }

  // Spara resultatlogg
  const logPath = path.join(FEEDS_DIR, 'fetch-log.json')
  const logEntry = {
    timestamp: new Date().toISOString(),
    duration: totalDuration,
    results: results.map(r => ({
      partner: r.partner,
      feedType: r.feedType,
      success: r.success,
      size: r.size,
      error: r.error,
    })),
  }

  // Läs befintlig logg och lägg till
  let logs: any[] = []
  if (fs.existsSync(logPath)) {
    try {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf-8'))
    } catch {
      logs = []
    }
  }
  logs.push(logEntry)
  // Behåll endast senaste 100 körningar
  logs = logs.slice(-100)
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2))

  console.log(`\n📝 Log saved to: ${logPath}`)
  console.log('\n🎉 Done!')

  // Exit med felkod om något misslyckades
  process.exit(failed.length > 0 ? 1 : 0)
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
