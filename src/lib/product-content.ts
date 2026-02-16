/**
 * Produktinnehåll – SEO-textgenerering
 * =====================================
 * Genererar kontextuell, unik text för produktsidor baserat på produktattribut.
 * All text är faktabaserad och relevant till den specifika produkten.
 */

import { Product } from '@/types'

// =============================================================================
// BLOMFAKTA (statiska, faktabaserade)
// =============================================================================

const flowerFacts: Record<string, string> = {
  rosor: 'Rosor är en av världens mest älskade blommor och odlas i Sverige sedan medeltiden. En ros håller sig fräsch i vasen 7–14 dagar om du byter vatten varannan dag och klipper stjälkarna snett.',
  tulpaner: 'Tulpaner blommar på våren och är ursprungligen från Centralasien. De fortsätter växa i vasen och kan hålla sig upp till en vecka. Klipp 2–3 cm av stjälken och ställ i svalt vatten.',
  liljor: 'Liljor är kända för sin starka doft och eleganta utseende. En lilja kan hålla sig fräsch i 10–14 dagar. Ta bort ståndarna för att undvika fläckar och förhindra att blommorna vissnar snabbare.',
  solrosor: 'Solrosor är kraftfulla och glädjefyllda blommor som symboliserar glädje och lojalitet. De klarar sig bra i rumstemperatur och håller 7–10 dagar i vasen med rent vatten.',
  orkideer: 'Orkidéer är bland de längst blomsterklädda växter du kan ge som gåva. En orkidé kan blomma i 6–12 veckor med rätt skötsel. Vattna sparsamt och låt rötterna torka ut mellan vattningarna.',
  pioner: 'Pioner är lyxiga och doftande blommor som blommar kort tid på sommaren, från maj till juni. En pivonia håller 5–7 dagar i vasen och doftar underbart under hela sin livstid.',
  hortensia: 'Hortensia är en populär prydnadsbuske med stora, rundade blomhuvuden. Klippta hortensiablomstern håller 5–7 dagar i vasen om du sprayar dem med vatten varje dag.',
  nejlikor: 'Nejlikor är symbolen för kärlek och hängivenhet i många kulturer. De är en av de längst hållbara snittblommorna och kan hålla sig fräscha i 2–3 veckor med byte av vatten.',
  freesia: 'Freesia är kända för sin söta, karakteristiska doft. De håller sig 7–10 dagar i vasen och är populära i bröllopsarrangemang tack vare sin eleganta form.',
  alstroemeria: 'Alstroemeria, eller peruansk lilja, är extremt hållbara blommor som håller upp till 3 veckor i vasen. De är populära i blandade buketter tack vare sitt rika blomflor.',
  krysantemum: 'Krysantemum är mångsidiga blommor som finns i mängder av former och färger. De håller sig 2–3 veckor i vasen och är ett utmärkt val för höstsäsongen.',
}

const colorMeanings: Record<string, string> = {
  röd: 'Röda blommor symboliserar kärlek, passion och beundran. En röd bukett är det klassiska kärleksuttrycket och passar perfekt till romantiska tillfällen.',
  rosa: 'Rosa blommor förmedlar tacksamhet, uppskattning och varm omsorg. Ljusrosa signalerar oskyldighet medan mörkrosa uttrycker tacksamhet.',
  vit: 'Vita blommor symboliserar renhet, ärlighet och nya början. De är tidlöst eleganta och passar allt från bröllop till kondoleanser.',
  gul: 'Gula blommor symboliserar vänskap, glädje och optimism. En gul bukett sprider solskensstämning och passar perfekt som välkomstgåva.',
  lila: 'Lila blommor förknippas med elegans, respekt och beundran. De är ett ovanligt och minnesvärt val som sticker ut.',
  orange: 'Orange blommor utstrålar entusiasm och energi. De är en varm och livfull gåva som passar vid festliga tillfällen.',
  blandad: 'En blandad bukett med flera färger förmedlar glädje och kreativitet. Den visar att du tänkt på mottagarens personlighet snarare än att följa konventioner.',
}

// =============================================================================
// TILLFÄLLESTEXT
// =============================================================================

const occasionText: Record<string, string> = {
  födelsedag: 'Till ett födelsedag är blommor alltid ett uppskattat och omtänksamt val. En vacker bukett visar att du lagt tid och omsorg på gåvan och skapar ett minne som varar länge efter att firas.',
  bröllop: 'Bröllopsblommor sätter stämningen för hela dagen. Välj blommor som kompletterar klädsel och inredning, och tänk på doften – starka dofter kan vara överväldigande inomhus.',
  begravning: 'Blommor vid begravning är ett traditionellt sätt att visa respekt och medkänsla. Vita och lila blommor är vanligast, men fråga gärna om den bortgångnes favoritfärg eller blomma.',
  kondoleans: 'Kondolensblommor skickas som ett tecken på medkänsla och omtanke. De visar att du tänker på de efterlevande under en svår tid.',
  'mors dag': 'På mors dag är blommor ett av de mest populära presenterna. Välj mammans favoritfärg eller blomma om du vet det – det visar extra omtanke.',
  'alla hjärtans dag': 'Röda rosor är det klassiska valet på alla hjärtans dag, men alla blommor som ges med kärlek är rätt val. Det viktiga är omtanken bakom gåvan.',
  student: 'Blommor är en populär studentgåva som symboliserar den nya tidens början. Gärna i glada färger som matchar möss och studentmössa.',
  nyfödd: 'Blommor till ett nytt liv är ett vackert sätt att välkomna familjetillskottet. Välj milda, ljusa färger och undvik starka dofter nära spädbarn.',
  tack: 'Tackblommor är ett genuint sätt att visa uppskattning. De säger mer än ett tackkort och skapar ett intryck som varar.',
}

// =============================================================================
// SKÖTSELINSTRUKTIONER
// =============================================================================

function getCareInstructions(product: Product): string | null {
  const isKonstgjord = product.mainCategory === 'konstgjorda-blommor'

  if (isKonstgjord) {
    return 'Konstgjorda blommor kräver ingen skötsel och håller sin skönhet år efter år. Dammas av med en mjuk borste eller fuktad trasa vid behov. Undvik direkt solljus för att bevara färgerna längre.'
  }

  const subs = product.subCategories || []
  const nameLower = product.name.toLowerCase()
  const hasLiljor = subs.includes('liljor' as any) || nameLower.includes('lilja') || nameLower.includes('liljor')
  const hasOrkide = subs.includes('orkideer' as any) || nameLower.includes('orkidé')
  const hasTulpaner = subs.includes('tulpaner' as any) || nameLower.includes('tulpan')

  if (hasOrkide) {
    return 'Orkidéer trivs bäst i ljust läge utan direkt solljus. Vattna en gång i veckan genom att sätta krukan i vatten i 15 minuter, töm sedan. Undvik kallast och drag.'
  }
  if (hasLiljor) {
    return 'Ta bort ståndarna från liljorna direkt när de öppnar sig för att undvika fläckar och förlänga hållbarheten. Byt vatten varannan dag och klipp stjälkarna snett.'
  }
  if (hasTulpaner) {
    return 'Tulpaner fortsätter växa i vasen – håll dem i svalt vatten och fullt ljus. Pricka ett litet hål under blomhuvudet med en nål för att förhindra att de dropper.'
  }

  return 'Klipp stjälkarna snett under rinnande vatten och ställ buketten i en ren vas med friskt vatten. Byt vatten varannan dag och håll buketten borta från direkt solljus och värme.'
}

// =============================================================================
// LEVERANSINFORMATION
// =============================================================================

function getDeliveryText(product: Product, partnerName: string): string {
  const parts: string[] = []

  if (product.sameDayDelivery) {
    parts.push(`${partnerName} erbjuder leverans samma dag om du beställer i god tid. Kontrollera aktuell beställningsgräns på deras webbplats.`)
  } else if (product.deliveryDays === 1) {
    parts.push(`Buketten levereras nästa arbetsdag via ${partnerName}.`)
  } else if (product.deliveryDays) {
    parts.push(`Leveranstid är normalt ${product.deliveryDays} arbetsdagar via ${partnerName}.`)
  } else {
    parts.push(`Leverans sker via ${partnerName}. Se deras webbplats för aktuella leveranstider.`)
  }

  if (product.shipping === 0) {
    parts.push('Fri frakt ingår i priset.')
  } else if (product.shipping > 0) {
    parts.push(`Fraktkostnad: ${product.shipping} kr. Totalt betalar du ${product.price + product.shipping} kr.`)
  }

  return parts.join(' ')
}

// =============================================================================
// "PASSAR TILL"-SEKTION
// =============================================================================

function getSuitableForText(product: Product): string[] {
  const subs = product.subCategories || []
  const occasions = product.attributes.occasions || []
  const allItems = [...subs, ...occasions].map(s => s.toLowerCase())

  const suggestions: string[] = []

  if (allItems.some(s => s.includes('romantik') || s.includes('kärlek') || s.includes('alla hjärtans'))) {
    suggestions.push('Romantiska tillfällen & alla hjärtans dag')
  }
  if (allItems.some(s => s.includes('födelsedag') || s.includes('fodelsedags'))) {
    suggestions.push('Födelsedagspresent')
  }
  if (allItems.some(s => s.includes('tack') || s.includes('uppskattning'))) {
    suggestions.push('Tacka någon för en insats')
  }
  if (allItems.some(s => s.includes('bröllop') || s.includes('brud') || s.includes('brollop'))) {
    suggestions.push('Bröllop & festligheter')
  }
  if (allItems.some(s => s.includes('begravning') || s.includes('kondoleans') || s.includes('minnesbukett'))) {
    suggestions.push('Begravning & kondoleans')
  }
  if (allItems.some(s => s.includes('student'))) {
    suggestions.push('Studentfirande')
  }
  if (allItems.some(s => s.includes('grattis') || s.includes('gratulat'))) {
    suggestions.push('Grattis & gratulationer')
  }
  if (allItems.some(s => s.includes('mors dag') || s.includes('mors-dag'))) {
    suggestions.push('Mors dag')
  }

  // Fallback baserat på mainCategory
  if (suggestions.length === 0) {
    if (product.mainCategory === 'buketter') suggestions.push('Att ge bort i present', 'Att skicka med bud', 'Dekorera hemmet')
    if (product.mainCategory === 'begravning') suggestions.push('Begravningsceremonier', 'Att hedra minnet av en nära anhörig')
    if (product.mainCategory === 'brollop') suggestions.push('Bröllopsceremonier', 'Festdekoration')
    if (product.mainCategory === 'konstgjorda-blommor') suggestions.push('Permanent heminredning', 'Allergikers alternativ', 'Kontor & arbetsplatser')
  }

  return suggestions.slice(0, 5)
}

// =============================================================================
// PRISKONTEXT
// =============================================================================

function getPriceContextText(product: Product): string | null {
  const total = product.price + (product.shipping || 0)

  if (product.discountPercent && product.discountPercent >= 20) {
    return `Just nu är priset sänkt med ${product.discountPercent}% – ett bra tillfälle att ge bort en vacker bukett till ett förmånligt pris.`
  }

  if (total < 300) {
    return `Till ett totalpris om ${total} kr (inkl. frakt) är detta ett prisvärt alternativ utan att tumma på kvaliteten.`
  }

  if (total > 800) {
    return `En lyxigare bukett som signalerar extra omtanke. Till ${total} kr totalt är detta ett premiumbukettval för de tillfällen då du verkligen vill imponera.`
  }

  return null
}

// =============================================================================
// HUVUD-EXPORT
// =============================================================================

export interface ProductContentSection {
  heading: string
  body: string | string[] // string = paragraf, string[] = lista
  type: 'paragraph' | 'list'
}

// Detect flower type from subCategories or product name
function detectFlowerKey(product: Product): string | null {
  const knownFlowers = Object.keys(flowerFacts)
  const subs = product.subCategories || []
  for (const sub of subs) {
    if (knownFlowers.includes(sub)) return sub
  }
  // Fallback: check product name
  const nameLower = product.name.toLowerCase()
  for (const key of knownFlowers) {
    if (nameLower.includes(key)) return key
  }
  return null
}

export function generateProductContent(
  product: Product,
  partnerName: string
): ProductContentSection[] {
  const sections: ProductContentSection[] = []

  // 1. Blom-fakta (om vi känner igen blomtypen)
  const flowerKey = detectFlowerKey(product)
  if (flowerKey && flowerFacts[flowerKey]) {
    const displayName = flowerKey.charAt(0).toUpperCase() + flowerKey.slice(1)
    sections.push({
      heading: `Om ${displayName}`,
      body: flowerFacts[flowerKey],
      type: 'paragraph',
    })
  }

  // 2. Färgbetydelse
  const primaryColor = product.attributes.primaryColor?.toLowerCase()
  if (primaryColor && colorMeanings[primaryColor]) {
    sections.push({
      heading: 'Blommornas budskap',
      body: colorMeanings[primaryColor],
      type: 'paragraph',
    })
  }

  // 3. "Passar till"-lista
  const suitableFor = getSuitableForText(product)
  if (suitableFor.length > 0) {
    sections.push({
      heading: 'Passar till',
      body: suitableFor,
      type: 'list',
    })
  }

  // 4. Leveransinformation
  const deliveryText = getDeliveryText(product, partnerName)
  sections.push({
    heading: 'Leverans & frakt',
    body: deliveryText,
    type: 'paragraph',
  })

  // 5. Skötselråd
  const careText = getCareInstructions(product)
  if (careText) {
    sections.push({
      heading: product.mainCategory === 'konstgjorda-blommor' ? 'Skötsel av konstgjorda blommor' : 'Skötselråd',
      body: careText,
      type: 'paragraph',
    })
  }

  // 6. Priskontext (om relevant)
  const priceContext = getPriceContextText(product)
  if (priceContext) {
    sections.push({
      heading: 'Prisvärd kvalitet',
      body: priceContext,
      type: 'paragraph',
    })
  }

  return sections
}
