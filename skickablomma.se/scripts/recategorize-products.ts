#!/usr/bin/env tsx

/**
 * Re-categorize Products Script
 * ==============================
 * Re-categorizes existing products based on improved categorization logic.
 *
 * Usage: npx tsx scripts/recategorize-products.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json')

/**
 * Categorize product based on category, name, and description
 */
function categorizeProduct(
  tags: string[],
  name: string,
  description: string,
  price: number
): { mainCategory: string; subCategories: string[] } {
  const lowerTags = tags.join(' ').toLowerCase()
  const lowerName = name.toLowerCase()
  const lowerDesc = description.toLowerCase()
  const combined = `${lowerTags} ${lowerName} ${lowerDesc}`

  let mainCategory = 'buketter'
  const subCategories: string[] = []

  // Main category detection - order matters (more specific first)
  if (combined.includes('begravning') || combined.includes('kondoleans') ||
      combined.includes('sorgbukett') || combined.includes('funeral') ||
      combined.includes('sympathy') || combined.includes('minnesgåva') ||
      (combined.includes('krans') && !combined.includes('kransbindning'))) {
    mainCategory = 'begravning'
    // Subcategories for begravning
    if (combined.includes('krans')) {
      subCategories.push('begravningskransar')
    } else if (combined.includes('hjärta') || combined.includes('heart')) {
      subCategories.push('begravningsbuketter')
    } else if (combined.includes('kondoleans')) {
      subCategories.push('kondoleanser')
    } else {
      subCategories.push('begravningsbuketter')
    }
  } else if (combined.includes('bröllop') || combined.includes('brud') ||
             combined.includes('wedding') || combined.includes('bridal')) {
    mainCategory = 'brollop'
    if (combined.includes('brudbukett') || combined.includes('bridal bouquet')) {
      subCategories.push('brudbuketter')
    } else if (combined.includes('bord') || combined.includes('table')) {
      subCategories.push('bordsdekoration')
    } else {
      subCategories.push('brollopsbuketter')
    }
  } else if (combined.includes('konstgjord') || combined.includes('sidenblomma') ||
             combined.includes('artificial') || combined.includes('plastblomma')) {
    mainCategory = 'konstgjorda-blommor'
  } else if (combined.includes('företag') || combined.includes('kontor') ||
             combined.includes('corporate') || combined.includes('office')) {
    mainCategory = 'foretag'
  } else if (combined.includes('presentkort') || combined.includes('gift card')) {
    mainCategory = 'presenter'
  } else {
    mainCategory = 'buketter'
  }

  // Budget subcategories (only for buketter)
  if (mainCategory === 'buketter') {
    if (price > 0 && price < 300) {
      subCategories.push('under-300-kr')
    }
    if (price > 0 && price < 500) {
      subCategories.push('under-500-kr')
    }
  }

  // Flower types
  if (/\bros\b|rosor|rose/.test(combined) && !combined.includes('frost')) subCategories.push('rosor')
  if (combined.includes('tulpan') || combined.includes('tulip')) subCategories.push('tulpaner')
  if (/\blilja\b|\blilj|\blily/.test(combined)) subCategories.push('liljor')
  if (combined.includes('solros') || combined.includes('sunflower')) subCategories.push('solrosor')
  if (combined.includes('orkidé') || combined.includes('orkide') || combined.includes('orchid')) subCategories.push('orkideer')
  if (combined.includes('pion') || combined.includes('peony')) subCategories.push('pioner')
  if (combined.includes('hortensia') || combined.includes('hydrangea')) subCategories.push('hortensia')
  if (combined.includes('amaryllis')) subCategories.push('amaryllis')
  if (combined.includes('krysantemum') || combined.includes('chrysanthemum')) subCategories.push('krysantemum')

  // Colors
  if (/\bröd\b|\brött\b|\bred\b/.test(combined)) subCategories.push('roda-blommor')
  if (/\brosa\b|\bpink\b/.test(combined)) subCategories.push('rosa-blommor')
  if (/\bvit\b|\bvita\b|\bvitt\b|\bwhite\b/.test(combined)) subCategories.push('vita-blommor')
  if (/\bgul\b|\bgula\b|\byellow\b/.test(combined)) subCategories.push('gula-blommor')
  if (/\blila\b|\bpurple\b|\bviolett\b/.test(combined)) subCategories.push('lila-blommor')
  if (/\borange\b/.test(combined)) subCategories.push('orange-blommor')
  if (combined.includes('blandad') || combined.includes('mix')) subCategories.push('blandade-farger')

  // Occasions
  if (combined.includes('födelsedag') || combined.includes('birthday')) subCategories.push('fodelsedags-blommor')
  if (combined.includes('tack') || combined.includes('thank')) subCategories.push('tackblommor')
  if (combined.includes('kärlek') || combined.includes('romantik') || combined.includes('romantic') || combined.includes('love')) subCategories.push('karlek-romantik')
  if (combined.includes('mors dag') || combined.includes("mother's day")) subCategories.push('mors-dag')
  if (combined.includes('alla hjärtans') || combined.includes('valentine')) subCategories.push('alla-hjartans-dag')
  if (combined.includes('student')) subCategories.push('student')
  if (combined.includes('påsk') || combined.includes('easter')) subCategories.push('pask')
  if (combined.includes('jul') || combined.includes('christmas')) subCategories.push('jul-blommor')
  if (combined.includes('gratulation') || combined.includes('grattis')) subCategories.push('gratulationer')

  // Cross-category tagging - products that could work for multiple purposes
  // White lilies are traditional for both sympathy AND elegant occasions
  if (subCategories.includes('liljor') && subCategories.includes('vita-blommor')) {
    if (!subCategories.includes('begravningsbuketter')) subCategories.push('begravningsbuketter')
    if (!subCategories.includes('tackblommor')) subCategories.push('tackblommor')
  }

  // Red roses are romantic - perfect for Valentine's and love occasions
  if (subCategories.includes('rosor') && subCategories.includes('roda-blommor')) {
    if (!subCategories.includes('karlek-romantik')) subCategories.push('karlek-romantik')
    if (!subCategories.includes('alla-hjartans-dag')) subCategories.push('alla-hjartans-dag')
  }

  // White roses work for weddings
  if (subCategories.includes('rosor') && subCategories.includes('vita-blommor')) {
    if (!subCategories.includes('brudbuketter')) subCategories.push('brudbuketter')
  }

  // Colorful/mixed flowers work for birthdays
  if (subCategories.includes('blandade-farger') ||
      (subCategories.includes('rosa-blommor') && subCategories.includes('gula-blommor'))) {
    if (!subCategories.includes('fodelsedags-blommor')) subCategories.push('fodelsedags-blommor')
  }

  // Remove duplicates
  return { mainCategory, subCategories: [...new Set(subCategories)] }
}

/**
 * Check if product is suitable for begravning based on characteristics
 * Strict filter - only products explicitly for sympathy/condolences
 */
function isSuitableForBegravning(name: string, description: string, colors: string[]): boolean {
  const lowerName = name.toLowerCase()
  const lowerDesc = description.toLowerCase()

  // Products explicitly suitable for sympathy/condolences (by name)
  const sympathyNames = ['omtanke', 'längtan', 'frid', 'tröst', 'saknad', 'minne']
  for (const term of sympathyNames) {
    if (lowerName.includes(term)) {
      // Exclude variants with chocolate/teddy
      if (lowerName.includes('choklad') || lowerName.includes('nalle') ||
          lowerName.includes('hjärta') || lowerName.includes('ljuv')) {
        return false
      }
      return true
    }
  }

  // White lilies only (specific product names)
  if (lowerName.includes('vita liljor') || lowerName.includes('white lily') ||
      lowerName.includes('vit lilja')) {
    return true
  }

  // Check description for explicit funeral mentions (word boundaries)
  // Note: 'omsorgsfullt' contains 'sorg' but is not about grief
  const funeralRegex = /\b(begravning|kondoleans|sympati|sorge?n?\b)/
  if (funeralRegex.test(lowerDesc) && !lowerDesc.includes('omsorgsfullt')) {
    return true
  }

  return false
}

async function main() {
  console.log('🌸 Re-categorizing products...\n')

  // Read existing products
  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'))
  const products = data.products

  // Track changes
  const categoryChanges: Record<string, number> = {}
  const categoryCounts: Record<string, number> = {}

  // Products suitable for begravning (from buketter)
  const begravningSuitable: any[] = []

  // Re-categorize each product
  for (const product of products) {
    const { mainCategory, subCategories } = categorizeProduct(
      product.tags || [],
      product.name,
      product.description || '',
      product.price || 0
    )

    // Check if buketter product is suitable for begravning
    const colors = product.attributes?.colors || []
    if (mainCategory === 'buketter' &&
        isSuitableForBegravning(product.name, product.description || '', colors)) {
      begravningSuitable.push(product)
    }

    // Track category changes
    if (product.mainCategory !== mainCategory) {
      const key = `${product.mainCategory} -> ${mainCategory}`
      categoryChanges[key] = (categoryChanges[key] || 0) + 1
    }

    // Update product - RESET subCategories to only new ones (don't merge with old)
    product.mainCategory = mainCategory
    product.subCategories = subCategories

    // Update tags - keep original feed tags, add new subcategories
    const originalTags = (product.tags || []).filter((t: string) =>
      !t.includes('-blommor') && !t.includes('-kr') && !t.includes('rosor') &&
      !t.includes('tulpaner') && !t.includes('liljor') && !t.includes('begravnings') &&
      !t.includes('kondoleans') && !t.includes('brollops') && !t.includes('brud')
    )
    product.tags = [...new Set([...originalTags, ...subCategories])]

    // Count categories
    categoryCounts[mainCategory] = (categoryCounts[mainCategory] || 0) + 1
  }

  // Move some suitable products to begravning category
  // (products that are explicitly for sympathy/condolences)
  for (const product of begravningSuitable.slice(0, 15)) {
    product.mainCategory = 'begravning'
    if (!product.subCategories.includes('begravningsbuketter')) {
      product.subCategories.push('begravningsbuketter')
    }
    if (!product.subCategories.includes('kondoleanser')) {
      product.subCategories.push('kondoleanser')
    }
    categoryCounts['buketter']--
    categoryCounts['begravning'] = (categoryCounts['begravning'] || 0) + 1
    categoryChanges['buketter -> begravning'] = (categoryChanges['buketter -> begravning'] || 0) + 1
  }

  // Save updated products
  data.generatedAt = new Date().toISOString()
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))

  // Print summary
  console.log('Category changes:')
  for (const [change, items] of Object.entries(categoryChanges)) {
    console.log(`  ${change}: ${items.length} products`)
  }

  console.log('\nFinal category counts:')
  for (const [category, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${category}: ${count}`)
  }

  console.log(`\n✅ Re-categorized ${products.length} products`)
}

main().catch(console.error)
