/**
 * Spärrade varumärkesord
 * ======================
 * Interfloras affiliate-villkor förbjuder "Blommogram", "Chokladogram" och
 * varianter på sajter som förmedlar trafik till konkurrenter (siteplanen §1).
 * Vi länkar till flera tjänster, alltså gäller förbudet oss.
 *
 * Orden kommer in via produktfeeden, inte via vår egen copy. Därför städas de
 * vid inläsning av feeddata i stället för att redigeras bort ur data-filen —
 * nästa feedhämtning skulle annars återinföra dem.
 *
 * Genusfällan: "blommogram" är ett ett-ord, ersättningen "blomsterhälsning" är
 * ett en-ord. En rak ordbyte ger "ditt Blomsterhälsning". Därför byts även
 * determineraren framför ordet när den finns.
 */

interface TermRule {
  /** Ordstammen inklusive böjning, utan ordgränser. */
  stem: string
  /** Ersättning i obestämd form singular. */
  indefinite: string
  /** Ersättning i bestämd form singular. */
  definite: string
}

const RULES: TermRule[] = [
  {
    // blommogram, blomogram, blommogrammet, blommogrammen …
    stem: 'blomm?ogram(?:met|men|mets|ets|et|s)?',
    indefinite: 'blomsterhälsning',
    definite: 'blomsterhälsningen',
  },
  {
    stem: 'chokladogram(?:met|men|mets|ets|et|s)?',
    indefinite: 'chokladhälsning',
    definite: 'chokladhälsningen',
  },
]

/** Ett-ordets determinerare och motsvarigheten i en-genus. */
const DETERMINER_MAP: Record<string, string> = {
  ett: 'en',
  ditt: 'din',
  mitt: 'min',
  sitt: 'sin',
  vårt: 'vår',
  ert: 'er',
  detta: 'denna',
  'det här': 'den här',
  'det där': 'den där',
  det: 'den',
  inget: 'ingen',
  vilket: 'vilken',
  varje: 'varje',
}

const DETERMINERS = Object.keys(DETERMINER_MAP)
  // Längst först, så att "det här" matchas före "det".
  .sort((a, b) => b.length - a.length)
  .map((word) => word.replace(/\s/g, '\\s+'))
  .join('|')

/** Böjningssuffix som markerar bestämd form. */
const DEFINITE_SUFFIXES = ['met', 'mets', 'men', 'ets', 'et']

function matchCase(replacement: string, original: string): string {
  if (original === original.toUpperCase() && original.length > 1) {
    return replacement.toUpperCase()
  }
  if (original[0] === original[0]?.toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }
  return replacement
}

/**
 * De spärrade orden är varumärken och står ofta versalt mitt i en mening.
 * Ersättningarna är vanliga substantiv och ska då vara gemena. Versal behålls
 * bara när ordet faktiskt inleder en mening.
 */
function startsSentence(text: string, index: number): boolean {
  const before = text.slice(0, index).trimEnd()
  if (before.length === 0) return true
  return /[.!?:]$/.test(before)
}

function nounCase(replacement: string, original: string, text: string, index: number): string {
  if (original === original.toUpperCase() && original.length > 1) {
    return replacement.toUpperCase()
  }
  if (startsSentence(text, index)) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }
  return replacement
}

function isDefiniteForm(word: string): boolean {
  const lower = word.toLowerCase()
  return DEFINITE_SUFFIXES.some((suffix) => lower.endsWith(suffix))
}

function replaceDeterminer(determiner: string): string {
  const normalised = determiner.toLowerCase().replace(/\s+/g, ' ')
  const replacement = DETERMINER_MAP[normalised]
  if (!replacement) return determiner
  return matchCase(replacement, determiner)
}

/**
 * Verbformen "blommografera" har ingen genusproblematik och hanteras separat.
 */
const VERB_PATTERN = /\bblommografera(r|de|t|s)?\b/gi

/**
 * Predikativa adjektiv efter substantivet böjs också efter genus:
 * "ditt blommogram blir uppskattat" -> "din blomsterhälsning blir uppskattad".
 *
 * Listan är avsiktligt sluten. En generell regel på -at skulle förstöra
 * substantiv som "resultat" och "citat".
 */
const PREDICATIVE_ADJECTIVES: Record<string, string> = {
  uppskattat: 'uppskattad',
  efterlängtat: 'efterlängtad',
  uppmärksammat: 'uppmärksammad',
  välkomnat: 'välkomnad',
  önskat: 'önskad',
  älskat: 'älskad',
  garanterat: 'garanterad',
  personligt: 'personlig',
  perfekt: 'perfekt',
}

const REPLACED_NOUNS = 'blomsterhälsning(?:en)?|chokladhälsning(?:en)?'

/** Rättar adjektiv som står inom några ord efter det utbytta substantivet. */
function fixAdjectiveAgreement(text: string): string {
  const adjectives = Object.keys(PREDICATIVE_ADJECTIVES).join('|')
  const pattern = new RegExp(
    `\\b(${REPLACED_NOUNS})((?:\\s+\\S+){0,3}?\\s+)(${adjectives})\\b`,
    'gi'
  )
  return text.replace(pattern, (_match, noun: string, gap: string, adjective: string) => {
    const corrected = PREDICATIVE_ADJECTIVES[adjective.toLowerCase()] ?? adjective
    return `${noun}${gap}${matchCase(corrected, adjective)}`
  })
}

export function sanitizeRestrictedTerms(text: string): string {
  if (!text) return text

  let result = text

  for (const rule of RULES) {
    // Först: determinerare + ord, så att genus följer med.
    const withDeterminer = new RegExp(
      `\\b(${DETERMINERS})(\\s+)(${rule.stem})\\b`,
      'gi'
    )
    result = result.replace(
      withDeterminer,
      (match: string, det: string, space: string, word: string, offset: number, whole: string) => {
        const replacement = isDefiniteForm(word) ? rule.definite : rule.indefinite
        // Substantivet står aldrig först här — determineraren gör det.
        const noun = nounCase(replacement, word, whole, offset + det.length + space.length)
        return `${replaceDeterminer(det)}${space}${noun}`
      }
    )

    // Därefter: fristående förekomster.
    const bare = new RegExp(`\\b(${rule.stem})\\b`, 'gi')
    result = result.replace(bare, (word: string, _group: string, offset: number, whole: string) => {
      const replacement = isDefiniteForm(word) ? rule.definite : rule.indefinite
      return nounCase(replacement, word, whole, offset)
    })
  }

  result = result.replace(VERB_PATTERN, (word) => matchCase('skicka blommor', word))

  if (result !== text) {
    result = fixAdjectiveAgreement(result)
  }

  return result
}

/** True om texten innehåller ett spärrat ord. Används av CI-kontrollen. */
export function hasRestrictedTerms(text: string): boolean {
  if (!text) return false
  const patterns = [
    ...RULES.map((rule) => new RegExp(`\\b${rule.stem}\\b`, 'i')),
    /\bblommografera(r|de|t|s)?\b/i,
  ]
  return patterns.some((pattern) => pattern.test(text))
}

/** Städar de fält i en produkt som kan innehålla feedtext. */
export function sanitizeProductText<T extends Record<string, unknown>>(product: T): T {
  const textFields = ['name', 'description', 'shortDescription'] as const

  const cleaned: Record<string, unknown> = { ...product }

  for (const field of textFields) {
    const value = cleaned[field]
    if (typeof value === 'string') {
      cleaned[field] = sanitizeRestrictedTerms(value)
    }
  }

  if (Array.isArray(cleaned.tags)) {
    cleaned.tags = (cleaned.tags as unknown[]).map((tag) =>
      typeof tag === 'string' ? sanitizeRestrictedTerms(tag) : tag
    )
  }

  return cleaned as T
}
