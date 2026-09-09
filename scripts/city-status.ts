/**
 * Stadssidornas status
 * ====================
 * Kör: npm run city:status
 *
 * En stadssida är den dyra delen av sajten. Den publiceras inte förrän tre
 * florister är kontrollerade mot butiken, och det kräver att någon ringer.
 * Det här skriptet talar om exakt vad som saknas per stad och skriver ut den
 * post som ska klistras in när samtalet är gjort, så att steget blir
 * mekaniskt i stället för att kräva att man minns schemat.
 */

import { getAllCities, verifiedFlorists } from '../src/lib/comparison'
import { MIN_FLORISTS_PER_CITY, validateCity } from '../src/lib/publishing'

const IDAG = new Date().toISOString().slice(0, 10)

function mall(namn: string): string {
  return JSON.stringify(
    {
      name: namn,
      area: 'Stadsdel eller gata',
      phone: '013-12 34 56',
      url: 'https://example.se/',
      hours: 'Mån–fre 10–18, lör 10–15',
      source: `Telefon ${IDAG}`,
      verifiedAt: IDAG,
    },
    null,
    2
  )
    .split('\n')
    .map((rad) => '      ' + rad)
    .join('\n')
}

const cities = getAllCities()
let klara = 0

console.log(`\nStadssidor: ${cities.length} stycken\n${'='.repeat(60)}`)

for (const city of cities) {
  const verifierade = verifiedFlorists(city)
  const kandidater = city.florists.filter((f) => f.verifiedAt === null)
  const hinder = validateCity(city)
  const kvar = Math.max(0, MIN_FLORISTS_PER_CITY - verifierade.length)

  const status = hinder.length === 0 ? 'KLAR ATT PUBLICERA' : `${hinder.length} hinder`
  console.log(`\n${city.name}  (${city.page.status})  ${status}`)
  console.log(`  Verifierade florister: ${verifierade.length} av ${MIN_FLORISTS_PER_CITY}`)

  if (kandidater.length > 0) {
    console.log(`  Kandidater att ringa (${kandidater.length}):`)
    for (const k of kandidater) {
      console.log(`     ${k.name}${k.url ? `  ${k.url}` : ''}`)
    }
  }

  if (hinder.length > 0) {
    console.log('  Hinder:')
    for (const h of hinder) console.log(`     ${h.field}: ${h.message}`)
  }

  if (kvar > 0) {
    console.log(`\n  Ring ${kvar} till och lägg in så här i data/cities.json,`)
    console.log(`  under "${city.slug}" -> florists:\n`)
    console.log(mall(kandidater[0]?.name ?? 'Butikens namn'))
    console.log(
      `\n  Fyll bara i det butiken faktiskt sagt. Vet du inte öppettiderna,\n` +
        `  låt hours vara null. En halv uppgift är sämre än ingen.`
    )
  }

  if (hinder.length === 0) klara += 1
}

console.log(`\n${'='.repeat(60)}`)
console.log(`${klara} av ${cities.length} städer kan publiceras.`)
if (klara < cities.length) {
  console.log('Sätt status till "published" i data/cities.json när en stad är klar.\n')
} else {
  console.log('')
}
