/**
 * Varumärkeskonstanter
 * ====================
 * Enda källan för namn, löfte och de värden som återanvänds i copy, metadata
 * och strukturerad data. Färger och typografi bor i tailwind.config.ts och
 * globals.css — här ligger bara det språkliga.
 *
 * Strategin står i skickablomma-brand.html. Kortversion: sajten säljer inte
 * blommor, den säljer ett kontrollerat påstående med ett datum på. Allt i
 * identiteten ska säga referensverk, inte blomsterbutik.
 */

export const BRAND = {
  /** Ett ord, gemener i löptext. Följer domänen. */
  name: 'Skickablomma',
  domain: 'skickablomma.se',
  url: 'https://skickablomma.se',

  /** Kategorin vi vill äga, inte den vi råkar hamna i. */
  category: 'Jämförelsesajten för blombud',

  tagline: 'Jämför blombud i Sverige',

  /** Löftet, en mening. Används i om-texter och strukturerad data. */
  promise:
    'Rätt blombud, rätt pris, rätt stad — utan att vi säljer något själva.',

  /**
   * Positionen. Skrivs ut på transparenssidan och i schema.org description.
   * Formuleringen är avsiktligt negativ först: det är vad vi INTE är som
   * skiljer oss från alla andra i SERP:en.
   */
  positioning:
    'Skickablomma är ingen blomsterbutik. Vi jämför blombuden i Sverige och utomlands på pris, leveranstid och täckning, och skriver ut när uppgiften senast kontrollerades.',

  /** Grundaren. E-E-A-T-bärare enligt siteplanen §2. */
  founder: {
    name: 'Ted Forssblad',
    credential: '15 år i e-handel, byggde Knivshop.se',
  },

  /**
   * Tankstrecket är varumärkets bevisfigur: tecknet vi sätter i stället för
   * en siffra vi inte kontrollerat. Det är också logotypens märke.
   * Ingen konkurrent skriver ut sin okunskap — därför är det vårt.
   */
  unknownMark: '–',
  unknownLabel: 'Ej kontrollerat',
} as const

/**
 * Tonalitetsregler som gäller all text under vårt namn. Kontrolleras
 * maskinellt av scripts/check-voice.ts.
 */
export const VOICE_RULES = {
  /** Aldrig utropstecken. Vi övertygar med siffror, inte med tonläge. */
  noExclamations: true,
  /** Sentence case i rubriker, aldrig Title Case. */
  sentenceCase: true,
  /** Du, aldrig ni. Aldrig "man" när "du" går. */
  secondPerson: 'du',
  /** Butiksröst som avslöjar att vi låtsas vara säljare. */
  bannedPhrases: [
    'hos oss',
    'våra partners',
    'vårt utbud',
    'vårt sortiment',
    'vi erbjuder',
    'vi hjälper dig hitta',
    'perfekt för dig',
    'vackra blommor till bra pris',
  ],
  /** Blomstermetaforer. Vi är ett referensverk, inte en poet. */
  bannedMetaphors: [
    'blommig kram',
    'pricken över i:et',
    'en doft av',
    'blomstrande',
    'låt kärleken blomma',
  ],
} as const
