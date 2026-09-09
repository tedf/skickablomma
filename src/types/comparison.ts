// =============================================================================
// DATAMODELL FÖR JÄMFÖRELSEDELEN
// =============================================================================
// Städer, länder, tillfällen och tjänster enligt siteplanen §4.
//
// Grundprincip: allt som är ett faktapåstående om pris, tid eller en namngiven
// verksamhet är nullable och bär ett verifieringsdatum. Data som inte är
// verifierad får inte publiceras — se `src/lib/publishing.ts`.
// =============================================================================

import { z } from 'zod'

// -----------------------------------------------------------------------------
// GEMENSAMT
// -----------------------------------------------------------------------------

/** ISO-datum (YYYY-MM-DD) för när uppgiften senast kontrollerades mot källan. */
export const verifiedAtSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable()

/** Klockslag HH:MM. Null = ej verifierat. */
export const cutoffSchema = z.string().regex(/^\d{2}:\d{2}$/).nullable()

/** Pris i hela kronor. Null = ej verifierat, aldrig 0 som "vet ej". */
export const sekSchema = z.number().int().nonnegative().nullable()

/**
 * En sida är `draft` tills dess underlag är verifierat. Endast `published`
 * genereras i produktionsbygget.
 */
export const publishStatusSchema = z.enum(['draft', 'published'])
export type PublishStatus = z.infer<typeof publishStatusSchema>

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
})
export type FaqItem = z.infer<typeof faqItemSchema>

/**
 * Fält som varje jämförelsesida delar. `microAnswer` är sidans första stycke,
 * 40–80 ord, och ska stå på egna ben utan kontext (siteplanen §6).
 */
export const pageMetaSchema = z.object({
  status: publishStatusSchema,
  title: z.string().min(1),
  h1: z.string().min(1),
  metaDescription: z.string().min(1),
  microAnswer: z.string().min(1),
  faq: z.array(faqItemSchema).default([]),
  /** Datum då priserna i tabellen senast kontrollerades. Visas synligt. */
  pricesVerifiedAt: verifiedAtSchema,
  updatedAt: verifiedAtSchema,
})
export type PageMeta = z.infer<typeof pageMetaSchema>

// -----------------------------------------------------------------------------
// TJÄNSTER (services)
// -----------------------------------------------------------------------------

export const affiliateNetworkSchema = z.enum([
  'adtraction',
  'tradedoubler',
  'direkt',
  'ingen',
])
export type AffiliateNetwork = z.infer<typeof affiliateNetworkSchema>

export const serviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  websiteUrl: z.string().url(),
  /** Affiliate-länk. Null tills programmet är godkänt — då länkas det inte. */
  affiliateUrl: z.string().url().nullable(),
  network: affiliateNetworkSchema,
  commissionNote: z.string().nullable(),

  /**
   * Null = vi har inte kontrollerat. Fältet var tidigare en ren boolean,
   * vilket gjorde att "nej" och "ej kontrollerat" renderades som samma
   * tankstreck — precis den sammanblandning sajten finns för att undvika.
   */
  sameDay: z.boolean().nullable(),
  cutoffWeekday: cutoffSchema,
  cutoffSaturday: cutoffSchema,

  priceFromSek: sekSchema,
  deliveryFeeSek: sekSchema,
  countriesCount: z.number().int().positive().nullable(),

  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),

  verifiedAt: verifiedAtSchema,
})
export type Service = z.infer<typeof serviceSchema>

/** Tjänstens villkor i en specifik stad, om de avviker från riksnivån. */
export const cityServiceSchema = z.object({
  serviceId: z.string().min(1),
  sameDayHere: z.boolean().nullable(),
  cutoffHere: cutoffSchema,
  feeHereSek: sekSchema,
  verifiedAt: verifiedAtSchema,
})
export type CityService = z.infer<typeof cityServiceSchema>

// -----------------------------------------------------------------------------
// STÄDER (cities)
// -----------------------------------------------------------------------------

/**
 * En namngiven, verklig florist. Fylls bara i från kontrollerad källa —
 * aldrig genererad. Stadssidor med färre än tre av dessa publiceras inte.
 */
export const floristSchema = z.object({
  name: z.string().min(1),
  area: z.string().nullable(),
  phone: z.string().nullable(),
  url: z.string().url().nullable(),
  hours: z.string().nullable(),
  /**
   * Var uppgiften kommer ifrån. En post utan källa är en gissning, och
   * gissningar får inte publiceras. Fältet finns för att skilja
   * "hittad i en sökning" från "kontrollerad mot butiken".
   */
  source: z.string().nullable().default(null),
  verifiedAt: verifiedAtSchema,
})
export type Florist = z.infer<typeof floristSchema>

export const hospitalSchema = z.object({
  name: z.string().min(1),
  deliveryOk: z.boolean().nullable(),
  note: z.string().nullable(),
  verifiedAt: verifiedAtSchema,
})
export type Hospital = z.infer<typeof hospitalSchema>

export const citySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  county: z.string().min(1),
  population: z.number().int().positive().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),

  services: z.array(cityServiceSchema).default([]),
  florists: z.array(floristSchema).default([]),
  hospitals: z.array(hospitalSchema).default([]),
  /** Slugs till grannstäder för internlänkning (siteplanen §3). */
  neighbours: z.array(z.string()).default([]),
  /** Stadsdelar och orter som täcks av leverans. */
  deliveryAreas: z.array(z.string()).default([]),

  searchVolume: z.number().int().nonnegative().nullable(),
  kd: z.number().int().min(0).max(100).nullable(),
  phase: z.number().int().min(0).max(5),

  page: pageMetaSchema,
})
export type City = z.infer<typeof citySchema>

// -----------------------------------------------------------------------------
// LÄNDER (countries)
// -----------------------------------------------------------------------------

export const countryServiceSchema = z.object({
  serviceId: z.string().min(1),
  leadDays: z.tuple([z.number().int(), z.number().int()]).nullable(),
  priceFromSek: sekSchema,
  verifiedAt: verifiedAtSchema,
})
export type CountryService = z.infer<typeof countryServiceSchema>

export const countrySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  eu: z.boolean(),
  services: z.array(countryServiceSchema).default([]),
  customsNote: z.string().nullable(),
  /** Timmar relativt svensk tid. Negativt = ligger efter Sverige. */
  timezoneOffset: z.number().nullable(),
  holidays: z.array(z.string()).default([]),
  neighbours: z.array(z.string()).default([]),

  searchVolume: z.number().int().nonnegative().nullable(),
  kd: z.number().int().min(0).max(100).nullable(),
  phase: z.number().int().min(0).max(5),

  page: pageMetaSchema,
})
export type Country = z.infer<typeof countrySchema>

// -----------------------------------------------------------------------------
// TILLFÄLLEN (occasions)
// -----------------------------------------------------------------------------

export const occasionSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  /** Brödtext i Markdown: etikett, vad som passar, praktiska råd. */
  etiquetteMd: z.string().min(1),
  flowersRecommended: z.array(z.string()).default([]),
  flowersAvoid: z.array(z.string()).default([]),
  cardTexts: z.array(z.string()).default([]),
  /** Säsongsdatum (YYYY-MM-DD) för rörliga högtider. Null = året runt. */
  seasonDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  /** Sidan ska vara live senast detta datum för att hinna indexeras. */
  publishBefore: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  serviceIds: z.array(z.string()).default([]),

  /**
   * Vilka produkter ur partnerfeeden som hör till tillfället.
   *
   * Att visa produkter gör oss inte till butik. Prisjakt och PriceRunner
   * visar produkter och ingen tar dem för handlare. Det som avgör är vem som
   * äger transaktionen, och det gör vi aldrig. Dessutom är SERP:en för de
   * här sökorden full av shoppingkaruseller: Google säger att den som söker
   * vill se buketter, inte bara läsa om dem.
   */
  /** Substantivet i produktrubriken, t.ex. "begravningsblommor". */
  productNoun: z.string().nullable().default(null),

  productQuery: z
    .object({
      mainCategory: z.string().nullable(),
      subCategories: z.array(z.string()).default([]),
      /**
       * Taggar som diskvalificerar en produkt för det här tillfället.
       * Feedens taggning är grov: begravningsbuketten "Omtanke" är taggad
       * vita-blommor och skulle annars hamna på sjukhussidan.
       */
      excludeSubCategories: z.array(z.string()).default([]),
    })
    .nullable()
    .default(null),

  /**
   * Angränsande sortiment som sidan får visa under buketterna.
   *
   * 'lokar' är Cramers trädgårdslökar, 'dukning' är My Perfect Days
   * festtillbehör. Ingen av dem är blommor, och fältet finns för att valet ska
   * stå i datan i stället för i en mall: på begravning, kondoleans och sjukhus
   * ska det vara null, och det ska synas att det är ett beslut.
   */
  adjacent: z.enum(['lokar', 'dukning']).nullable().default(null),

  searchVolume: z.number().int().nonnegative().nullable(),
  kd: z.number().int().min(0).max(100).nullable(),
  phase: z.number().int().min(0).max(5),

  page: pageMetaSchema,
})
export type Occasion = z.infer<typeof occasionSchema>

// -----------------------------------------------------------------------------
// FRISTÅENDE SIDOR (startsida, hubbar, guider, /jamfor/)
// -----------------------------------------------------------------------------

export const staticPageSchema = z.object({
  slug: z.string(),
  /** Brödtext i Markdown under mikrosvaret och jämförelsetabellen. */
  bodyMd: z.string().default(''),
  page: pageMetaSchema,
})
export type StaticPage = z.infer<typeof staticPageSchema>

// -----------------------------------------------------------------------------
// FILSCHEMAN
// -----------------------------------------------------------------------------

export const servicesFileSchema = z.object({
  updatedAt: z.string(),
  services: z.array(serviceSchema),
})

export const citiesFileSchema = z.object({
  updatedAt: z.string(),
  cities: z.array(citySchema),
})

export const countriesFileSchema = z.object({
  updatedAt: z.string(),
  countries: z.array(countrySchema),
})

export const occasionsFileSchema = z.object({
  updatedAt: z.string(),
  occasions: z.array(occasionSchema),
})

export const staticPagesFileSchema = z.object({
  updatedAt: z.string(),
  pages: z.array(staticPageSchema),
})
