/**
 * Stadssidornas status
 * ====================
 * Kör: npm run city:status
 *
 * Stadssidan svarar på en lokal fråga och slussar vidare till den tjänst som
 * kan leverera. Det som skiljer en riktig stadssida från en mallad är att den
 * namnger platser som faktiskt finns på orten. Skriptet visar vad varje stad
 * har, och listar de floristkandidater som väntar på att kontrolleras.
 */

import { getAllCities, verifiedFlorists } from '../src/lib/comparison'
import { MIN_DELIVERY_AREAS_PER_CITY, validateCity } from '../src/lib/publishing'

const cities = getAllCities()
let klara = 0

console.log(`\nStadssidor: ${cities.length} stycken\n${'='.repeat(60)}`)

for (const city of cities) {
  const verifierade = verifiedFlorists(city)
  const kandidater = city.florists.filter((f) => f.verifiedAt === null)
  const hinder = validateCity(city)

  const status = hinder.length === 0 ? 'KLAR ATT PUBLICERA' : `${hinder.length} hinder`
  console.log(`\n${city.name}  (${city.page.status})  ${status}`)
  console.log(
    `  Leveransområden: ${city.deliveryAreas.length} av ${MIN_DELIVERY_AREAS_PER_CITY}` +
      `  (${city.deliveryAreas.join(', ')})`
  )
  console.log(`  Sjukhus: ${city.hospitals.map((h) => h.name).join(', ') || '–'}`)
  console.log(`  Verifierade florister: ${verifierade.length}  (frivilligt)`)

  if (kandidater.length > 0) {
    console.log(`  Kandidater, ej kontrollerade (${kandidater.length}):`)
    for (const k of kandidater) {
      console.log(`     ${k.name}${k.url ? `  ${k.url}` : ''}`)
    }
    console.log(
      '     De renderas inte. Sätt verifiedAt när uppgifterna kontrollerats\n' +
        '     mot butiken, så börjar de synas.'
    )
  }

  if (hinder.length > 0) {
    console.log('  Hinder:')
    for (const h of hinder) console.log(`     ${h.field}: ${h.message}`)
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
