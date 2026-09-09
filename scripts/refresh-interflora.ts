/**
 * Uppdaterar Interflora-produkterna mot en färsk Adtraction-feed.
 * Kör: npx tsx scripts/refresh-interflora.ts <feed.csv>
 *
 * Feeden vi låg på var hämtad i februari. Priserna hade hunnit ändras kraftigt
 * — 12 röda rosor stod som 1 449 kr men kostar 779 — och en prisjämförelse som
 * visar dubbla priset är värre än ingen prisjämförelse alls.
 *
 * Skriptet gör tre saker och inget mer:
 *
 *   1. Skriver om pris, frakt och lagerstatus för produkter som finns i båda.
 *   2. Tar bort produkter som inte längre finns i feeden. En produkt som inte
 *      går att beställa ska inte ligga kvar med ett pris.
 *   3. Lägger nya produkter i data/staged-products.json i stället för att
 *      publicera dem. Deras bilder ligger hos partnern och är inte hämtade,
 *      och regeln är att en produkt utan fungerande bild inte visas.
 */

import fs from 'fs'
import path from 'path'

interface FeedRow {
  [key: string]: string
}

function parseCsv(text: string): FeedRow[] {
  const lines = text.split('\n').filter((line) => line.trim())
  const head = lines[0].split('\t').map((h) => h.trim().replace(/^'|'$/g, ''))
  return lines.slice(1).map((line) => {
    const cells = line.split('\t')
    const row: FeedRow = {}
    head.forEach((key, i) => {
      row[key] = (cells[i] ?? '').trim().replace(/^'|'$/g, '')
    })
    return row
  })
}

/** "779 SEK" och "SE:::99 SEK" ger båda ett heltal kronor. */
function kronor(text: string): number | null {
  const match = text.replace(/\s/g, '').match(/([\d.,]+)SEK/i)
  if (!match) return null
  const value = Number(match[1].replace(',', '.'))
  return Number.isFinite(value) ? Math.round(value) : null
}

const feedPath = process.argv[2]
if (!feedPath) {
  console.error('Ange sökväg till feed-CSV:n.')
  process.exit(1)
}

const rows = parseCsv(fs.readFileSync(feedPath, 'utf8'))
const feed = new Map(rows.map((row) => [row.id, row]))

const productsPath = path.join(process.cwd(), 'data/products.json')
const raw = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
const products: any[] = Array.isArray(raw) ? raw : raw.products

const idag = new Date().toISOString().slice(0, 10)
let uppdaterade = 0
let prisandringar = 0
const borttagna: string[] = []

const kvar = products.filter((product) => {
  if (product.partnerId !== 'interflora') return true

  const row = feed.get(product.sku)
  if (!row) {
    borttagna.push(`${product.sku} ${product.name}`)
    return false
  }

  const pris = kronor(row.sale_price) ?? kronor(row.price)
  const frakt = kronor(row.shipping)

  if (pris !== null && pris !== product.price) prisandringar += 1
  if (pris !== null) {
    product.price = pris
    product.originalPrice = kronor(row.price) ?? pris
    product.discountPercent =
      product.originalPrice > pris
        ? Math.round((1 - pris / product.originalPrice) * 100)
        : 0
  }
  if (frakt !== null) product.shipping = frakt
  product.inStock = row.availability === 'in_stock'
  product.feedUpdatedAt = idag
  product.updatedAt = idag
  uppdaterade += 1
  return true
})

const befintliga = new Set(products.filter((p) => p.partnerId === 'interflora').map((p) => p.sku))
const nya = rows.filter((row) => !befintliga.has(row.id))

if (Array.isArray(raw)) {
  fs.writeFileSync(productsPath, JSON.stringify(kvar, null, 2) + '\n')
} else {
  raw.products = kvar
  raw.updatedAt = idag
  fs.writeFileSync(productsPath, JSON.stringify(raw, null, 2) + '\n')
}

fs.writeFileSync(
  path.join(process.cwd(), 'data/staged-products.json'),
  JSON.stringify(
    {
      _kommentar:
        'Nya produkter ur partnerfeeden som ännu inte publiceras. Bilderna ligger hos ' +
        'partnern och är inte hämtade till public/images/products/. En produkt utan ' +
        'fungerande bild visas inte, så de väntar här tills bilderna finns.',
      hamtad: idag,
      partner: 'interflora',
      produkter: nya.map((row) => ({
        sku: row.id,
        name: row.title,
        price: kronor(row.sale_price) ?? kronor(row.price),
        shipping: kronor(row.shipping),
        productType: row.product_type,
        imageUrl: row.image_link,
        trackingUrl: row.link,
      })),
    },
    null,
    2
  ) + '\n'
)

console.log(`\nInterflora, feed hämtad ${idag}`)
console.log(`  uppdaterade produkter: ${uppdaterade}`)
console.log(`  varav ändrat pris:     ${prisandringar}`)
console.log(`  borttagna (ur feeden): ${borttagna.length}`)
borttagna.slice(0, 8).forEach((namn) => console.log(`     ${namn}`))
if (borttagna.length > 8) console.log(`     … och ${borttagna.length - 8} till`)
console.log(`  nya, väntar på bild:   ${nya.length}  (data/staged-products.json)\n`)
