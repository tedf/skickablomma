/**
 * Jämförelsedata
 * ==============
 * Läser och validerar städer, länder, tillfällen och tjänster ur /data/.
 * Zod-valideringen körs vid modulinladdning, alltså vid bygget: felaktig data
 * fäller bygget i stället för att rendera fel på sajten.
 */

import {
  citiesFileSchema,
  countriesFileSchema,
  occasionsFileSchema,
  servicesFileSchema,
  staticPagesFileSchema,
  type City,
  type Country,
  type Occasion,
  type Service,
  type StaticPage,
} from '@/types/comparison'
import {
  shouldRender,
  validateCity,
  validateCountry,
  validateOccasion,
  validateStaticPage,
  verifiedFlorists,
} from '@/lib/publishing'

import citiesData from '../../data/cities.json'
import countriesData from '../../data/countries.json'
import occasionsData from '../../data/occasions.json'
import servicesData from '../../data/services.json'
import staticPagesData from '../../data/static-pages.json'

const SERVICES: Service[] = servicesFileSchema.parse(servicesData).services
const CITIES: City[] = citiesFileSchema.parse(citiesData).cities
const COUNTRIES: Country[] = countriesFileSchema.parse(countriesData).countries
const OCCASIONS: Occasion[] = occasionsFileSchema.parse(occasionsData).occasions
const STATIC_PAGES: StaticPage[] = staticPagesFileSchema.parse(staticPagesData).pages

// -----------------------------------------------------------------------------
// TJÄNSTER
// -----------------------------------------------------------------------------

export function getAllServices(): Service[] {
  return SERVICES
}

export function getService(id: string): Service | null {
  return SERVICES.find((service) => service.id === id) ?? null
}

/** Tjänster vi faktiskt kan länka till, dvs. med godkänd affiliate-länk. */
export function getLinkableServices(): Service[] {
  return SERVICES.filter((service) => service.affiliateUrl !== null)
}

/**
 * Totalpris = från-pris + budavgift. Null när någon del är overifierad, så att
 * sortering aldrig bygger på en gissning.
 */
export function totalPriceSek(service: Service): number | null {
  if (service.priceFromSek === null || service.deliveryFeeSek === null) return null
  return service.priceFromSek + service.deliveryFeeSek
}

/** Sorterar på totalpris. Tjänster utan verifierat pris hamnar sist. */
export function sortByTotalPrice(services: Service[]): Service[] {
  return [...services].sort((a, b) => {
    const priceA = totalPriceSek(a)
    const priceB = totalPriceSek(b)
    if (priceA === null && priceB === null) return a.name.localeCompare(b.name, 'sv')
    if (priceA === null) return 1
    if (priceB === null) return -1
    return priceA - priceB
  })
}

// -----------------------------------------------------------------------------
// STÄDER
// -----------------------------------------------------------------------------

export function getAllCities(): City[] {
  return CITIES
}

/** Städer som får renderas i aktuellt läge (draft syns bara i dev). */
export function getRenderableCities(): City[] {
  return CITIES.filter((city) => shouldRender(city.page.status))
}

export function getCity(slug: string): City | null {
  return CITIES.find((city) => city.slug === slug) ?? null
}

export function getCityNeighbours(city: City): City[] {
  return city.neighbours
    .map((slug) => getCity(slug))
    .filter((neighbour): neighbour is City => neighbour !== null)
}

export { verifiedFlorists }

// -----------------------------------------------------------------------------
// LÄNDER
// -----------------------------------------------------------------------------

export function getAllCountries(): Country[] {
  return COUNTRIES
}

export function getRenderableCountries(): Country[] {
  return COUNTRIES.filter((country) => shouldRender(country.page.status))
}

export function getCountry(slug: string): Country | null {
  return COUNTRIES.find((country) => country.slug === slug) ?? null
}

export function getCountryNeighbours(country: Country): Country[] {
  return country.neighbours
    .map((slug) => getCountry(slug))
    .filter((neighbour): neighbour is Country => neighbour !== null)
}

// -----------------------------------------------------------------------------
// TILLFÄLLEN
// -----------------------------------------------------------------------------

export function getAllOccasions(): Occasion[] {
  return OCCASIONS
}

export function getRenderableOccasions(): Occasion[] {
  return OCCASIONS.filter((occasion) => shouldRender(occasion.page.status))
}

export function getOccasion(slug: string): Occasion | null {
  return OCCASIONS.find((occasion) => occasion.slug === slug) ?? null
}

// -----------------------------------------------------------------------------
// FRISTÅENDE SIDOR
// -----------------------------------------------------------------------------

export function getStaticPage(slug: string): StaticPage | null {
  return STATIC_PAGES.find((page) => page.slug === slug) ?? null
}

export function getAllStaticPages(): StaticPage[] {
  return STATIC_PAGES
}

// -----------------------------------------------------------------------------
// PUBLICERINGSSTATUS (används av scripts/check-publishable.ts)
// -----------------------------------------------------------------------------

export interface PublishReport {
  type: 'city' | 'country' | 'occasion' | 'page'
  slug: string
  status: 'draft' | 'published'
  issues: { field: string; message: string }[]
}

export function buildPublishReport(): PublishReport[] {
  return [
    ...CITIES.map((city) => ({
      type: 'city' as const,
      slug: `/blombud/${city.slug}`,
      status: city.page.status,
      issues: validateCity(city),
    })),
    ...COUNTRIES.map((country) => ({
      type: 'country' as const,
      slug: `/utomlands/${country.slug}`,
      status: country.page.status,
      issues: validateCountry(country),
    })),
    ...OCCASIONS.map((occasion) => ({
      type: 'occasion' as const,
      slug: `/tillfalle/${occasion.slug}`,
      status: occasion.page.status,
      issues: validateOccasion(occasion),
    })),
    ...STATIC_PAGES.map((page) => ({
      type: 'page' as const,
      slug: page.slug,
      status: page.page.status,
      issues: validateStaticPage(page),
    })),
  ]
}
