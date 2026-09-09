/**
 * Städar spärrade varumärkesord ur genererad produktdata.
 * Kör: npx tsx scripts/sanitize-products.ts
 *
 * Normaliseringen städar redan vid feedhämtning. Det här skriptet finns för
 * data som genererats innan spärren fanns, och som engångsåtgärd om
 * check:content larmar.
 */
import fs from 'fs'
import path from 'path'
import { sanitizeRestrictedTerms } from '../src/lib/restricted-terms'

const file = path.join(process.cwd(), 'data/products.json')
const data = JSON.parse(fs.readFileSync(file, 'utf8'))

let changed = 0
for (const product of data.products) {
  for (const field of ['name', 'description', 'shortDescription']) {
    if (typeof product[field] === 'string') {
      const next = sanitizeRestrictedTerms(product[field])
      if (next !== product[field]) {
        product[field] = next
        changed++
      }
    }
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
console.log(`Fält städade: ${changed}`)
