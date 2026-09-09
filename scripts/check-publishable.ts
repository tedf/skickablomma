/**
 * Publiceringskontroll
 * ====================
 * Kör: npm run check:content
 *
 * Två saker kontrolleras:
 *
 * 1. Ingen sida som är märkt `published` får ha kvarvarande hinder —
 *    saknat mikrosvar, overifierade platshållare, för få verifierade
 *    florister. Sådant fäller kommandot.
 *
 * 2. Inget spärrat varumärkesord får finnas i genererad produktdata.
 *    Feeden städas vid inläsning, men kontrollen finns här för att fånga
 *    om normaliseringen kringgås.
 *
 * Utkast rapporteras som information, inte som fel. De publiceras ändå inte.
 */

import { buildPublishReport } from '../src/lib/comparison'
import { hasRestrictedTerms } from '../src/lib/restricted-terms'
import productsData from '../data/products.json'

interface ProductLike {
  sku?: string
  name?: string
  description?: string
  shortDescription?: string
}

function checkPages(): number {
  const report = buildPublishReport()
  const published = report.filter((entry) => entry.status === 'published')
  const drafts = report.filter((entry) => entry.status === 'draft')
  const blocked = published.filter((entry) => entry.issues.length > 0)

  console.log(`\nSidor: ${report.length} totalt, ${published.length} publicerade, ${drafts.length} utkast.`)

  if (drafts.length > 0) {
    console.log('\nUtkast (genereras inte i produktion):')
    for (const draft of drafts) {
      const summary =
        draft.issues.length === 0
          ? 'inga hinder kvar — kan sättas till published'
          : `${draft.issues.length} hinder`
      console.log(`  ${draft.slug} — ${summary}`)
      for (const issue of draft.issues) {
        console.log(`      ${issue.field}: ${issue.message}`)
      }
    }
  }

  if (blocked.length === 0) {
    console.log('\nAlla publicerade sidor klarar kontrollen.')
    return 0
  }

  console.error('\nFEL: sidor märkta published men med kvarvarande hinder:')
  for (const entry of blocked) {
    console.error(`  ${entry.slug}`)
    for (const issue of entry.issues) {
      console.error(`      ${issue.field}: ${issue.message}`)
    }
  }
  return blocked.length
}

function checkRestrictedTerms(): number {
  const products = (productsData as { products: ProductLike[] }).products ?? []
  const hits = products.filter((product) =>
    [product.name, product.description, product.shortDescription].some(
      (field) => typeof field === 'string' && hasRestrictedTerms(field)
    )
  )

  if (hits.length === 0) {
    console.log('Inga spärrade varumärkesord i produktdatan.')
    return 0
  }

  console.error(`\nFEL: ${hits.length} produkter innehåller spärrade varumärkesord.`)
  console.error('Kör om feednormaliseringen: npm run feed:process')
  for (const product of hits.slice(0, 10)) {
    console.error(`  ${product.sku ?? '(utan sku)'}: ${product.name ?? ''}`)
  }
  return hits.length
}

const failures = checkPages() + checkRestrictedTerms()

if (failures > 0) {
  process.exit(1)
}
