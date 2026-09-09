// =============================================================================
// PUBLICERINGSREGLER
// =============================================================================
// Siteplanen §4 "Renderingsregler": sidor utan mikrosvar bygger inte, och
// stadssidor med färre än tre verifierade florister bygger inte.
//
// Här ligger också spärren mot platshållare. Sidcopyn i /data/ är skriven med
// tokens av formen [149–399] där en siffra ska verifieras mot källan innan
// publicering. En sida med kvarvarande tokens kan inte sättas till published.
// =============================================================================

import type { City, Country, Occasion, PageMeta, StaticPage } from '@/types/comparison'

/**
 * Minsta antal namngivna leveransområden för att en stadssida ska få publiceras.
 *
 * Regeln hette tidigare MIN_FLORISTS_PER_CITY och krävde tre florister
 * kontrollerade per telefon. Den byggde på antagandet att sidans värde låg i
 * en lokal floristkatalog. Det antagandet stämmer inte: de rikstäckande
 * buden har anslutna florister i varje stad, och sidans jobb är att svara på
 * frågan och slussa vidare till den som kan leverera.
 *
 * Det som skiljer en riktig stadssida från en mallad är i stället att den
 * namnger platser som faktiskt finns på orten. Ryd, Lambohov och Tannefors
 * går inte att generera fram, och en sida utan dem är just den mall
 * siteplanen §0 säger nej till.
 */
export const MIN_DELIVERY_AREAS_PER_CITY = 4

/** Mikrosvarets tillåtna längd i ord (siteplanen §6). */
export const MICRO_ANSWER_MIN_WORDS = 40
export const MICRO_ANSWER_MAX_WORDS = 80

/**
 * Matchar platshållare: [149–399], [kl. X], [datum], [X].
 * Avsiktligt snäv — vanliga hakparenteser i löptext är sällsynta och ska
 * hellre ge ett falskt larm än släppa igenom en overifierad siffra.
 *
 * Undantaget är markdown-länkar. En hakparentes som följs av en parentes är
 * `[text](/url)`, alltså en internlänk och inte en osäker uppgift. Utan
 * undantaget kan brödtexten inte länka någonstans, och internlänkarna är
 * det som håller ihop sidklustren.
 */
const PLACEHOLDER_PATTERN = /\[[^\]\n]{1,40}\](?!\()/g

export interface PublishIssue {
  field: string
  message: string
}

export function findPlaceholders(text: string): string[] {
  return text.match(PLACEHOLDER_PATTERN) ?? []
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Kontrollerar de fält varje sidtyp delar. Returnerar en tom lista när sidan
 * får publiceras.
 */
export function validatePageMeta(page: PageMeta): PublishIssue[] {
  const issues: PublishIssue[] = []

  if (!page.microAnswer.trim()) {
    issues.push({ field: 'microAnswer', message: 'Mikrosvar saknas.' })
  } else {
    const words = countWords(page.microAnswer)
    if (words < MICRO_ANSWER_MIN_WORDS || words > MICRO_ANSWER_MAX_WORDS) {
      issues.push({
        field: 'microAnswer',
        message: `Mikrosvaret är ${words} ord, ska vara ${MICRO_ANSWER_MIN_WORDS}–${MICRO_ANSWER_MAX_WORDS}.`,
      })
    }
  }

  for (const [field, value] of Object.entries({
    title: page.title,
    h1: page.h1,
    metaDescription: page.metaDescription,
    microAnswer: page.microAnswer,
  })) {
    const found = findPlaceholders(value)
    if (found.length > 0) {
      issues.push({
        field,
        message: `Overifierade platshållare: ${found.join(', ')}`,
      })
    }
  }

  page.faq.forEach((item, index) => {
    const found = [...findPlaceholders(item.question), ...findPlaceholders(item.answer)]
    if (found.length > 0) {
      issues.push({
        field: `faq[${index}]`,
        message: `Overifierade platshållare: ${found.join(', ')}`,
      })
    }
  })

  return issues
}

/** Florister räknas bara om de har ett verifieringsdatum. */
export function verifiedFlorists(city: City): City['florists'] {
  return city.florists.filter((florist) => florist.verifiedAt !== null)
}

export function validateCity(city: City): PublishIssue[] {
  const issues = validatePageMeta(city.page)

  if (city.deliveryAreas.length < MIN_DELIVERY_AREAS_PER_CITY) {
    issues.push({
      field: 'deliveryAreas',
      message: `${city.deliveryAreas.length} namngivna områden, minst ${MIN_DELIVERY_AREAS_PER_CITY} krävs.`,
    })
  }

  /*
    Floristerna är inte längre ett krav, men kravet på dem som faktiskt står
    på sidan är oförändrat. En florist utan kontrolldatum är en gissning, och
    gissningar publiceras inte. Skillnaden mot förr är att sidan får finnas
    utan floristlista, inte att listan får innehålla vad som helst.
  */
  if (city.page.pricesVerifiedAt === null) {
    issues.push({
      field: 'pricesVerifiedAt',
      message: 'Prisdatum saknas — jämförelsetabellen får inte visas odaterad.',
    })
  }

  return issues
}

/** True när minst en tjänst har ett kontrollerat pris för landet. */
export function hasVerifiedCountryPrices(country: Country): boolean {
  return country.services.some((service) => service.priceFromSek !== null)
}

export function validateCountry(country: Country): PublishIssue[] {
  const issues = validatePageMeta(country.page)

  /*
    Tidigare krävdes prisdata för att en landsida skulle få publiceras. Det
    var rätt när sidan leddes av pris, men landsidornas värde ligger i det
    praktiska: tull, tidsskillnad, helgdagar och vad florister i landet gör.
    En sida som inte påstår något om pris behöver inget prisunderlag.

    Priset måste däremot vara dokumenterat om det påstås, och det fångas av
    platshållarkontrollen i validatePageMeta.
  */
  if (hasVerifiedCountryPrices(country) && country.page.pricesVerifiedAt === null) {
    issues.push({
      field: 'pricesVerifiedAt',
      message: 'Landet har prisdata men tabellen saknar kontrolldatum.',
    })
  }

  return issues
}

export function validateOccasion(occasion: Occasion): PublishIssue[] {
  const issues = validatePageMeta(occasion.page)

  const found = findPlaceholders(occasion.etiquetteMd)
  if (found.length > 0) {
    issues.push({
      field: 'etiquetteMd',
      message: `Overifierade platshållare: ${found.join(', ')}`,
    })
  }

  return issues
}

export function validateStaticPage(page: StaticPage): PublishIssue[] {
  const issues = validatePageMeta(page.page)

  const found = findPlaceholders(page.bodyMd)
  if (found.length > 0) {
    issues.push({
      field: 'bodyMd',
      message: `Overifierade platshållare: ${found.join(', ')}`,
    })
  }

  return issues
}

/**
 * Draft-sidor renderas i utvecklingsläge så att copyn går att läsa och
 * granska, men genereras aldrig i produktionsbygget.
 */
export function shouldRender(status: 'draft' | 'published'): boolean {
  if (status === 'published') return true
  return process.env.NODE_ENV !== 'production'
}
