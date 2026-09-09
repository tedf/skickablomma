import type { MetadataRoute } from 'next'
import {
  getRenderableCities,
  getRenderableCountries,
  getRenderableOccasions,
  getAllStaticPages,
} from '@/lib/comparison'
import { shouldRender } from '@/lib/publishing'
import { getAllGuides } from '@/lib/guides'

const BAS = 'https://skickablomma.se'

/**
 * Sitemap.
 *
 * robots.txt pekade ut https://skickablomma.se/sitemap.xml, men filen fanns
 * inte: adressen svarade 404. En sitemap som saknas är värre än ingen alls,
 * eftersom raden i robots.txt lovar något som inte går att hämta.
 *
 * Bara sidor som faktiskt genereras kommer med. Utkast filtreras bort av
 * getRenderable*, och de gamla guider som pekas om i next.config.mjs listas
 * inte: en sitemap ska inte innehålla adresser som svarar med en omdirigering.
 */
const OMDIRIGERADE_GUIDER = new Set([
  'julblommor-guide',
  'begravningsblommor-guide',
  'alla-hjartans-dag-blommor',
  'mors-dag-blommor',
  'student-blommor',
])

export default function sitemap(): MetadataRoute.Sitemap {
  const poster: MetadataRoute.Sitemap = []

  for (const sida of getAllStaticPages().filter((s) => shouldRender(s.page.status))) {
    poster.push({
      url: BAS + (sida.slug === '/' ? '' : sida.slug),
      lastModified: sida.page.updatedAt ?? undefined,
      priority: sida.slug === '/' ? 1 : 0.8,
    })
  }

  for (const stad of getRenderableCities()) {
    poster.push({
      url: `${BAS}/blombud/${stad.slug}`,
      lastModified: stad.page.updatedAt ?? undefined,
      priority: 0.7,
    })
  }

  for (const land of getRenderableCountries()) {
    poster.push({
      url: `${BAS}/utomlands/${land.slug}`,
      lastModified: land.page.updatedAt ?? undefined,
      priority: 0.6,
    })
  }

  for (const tillfalle of getRenderableOccasions()) {
    poster.push({
      url: `${BAS}/tillfalle/${tillfalle.slug}`,
      lastModified: tillfalle.page.updatedAt ?? undefined,
      priority: 0.7,
    })
  }

  for (const guide of getAllGuides()) {
    if (OMDIRIGERADE_GUIDER.has(guide.slug)) continue
    poster.push({ url: `${BAS}/guide/${guide.slug}`, priority: 0.5 })
  }

  for (const nav of ['/tillfalle', '/guider', '/om/sa-tjanar-vi-pengar', '/buketter']) {
    poster.push({ url: BAS + nav, priority: 0.5 })
  }

  return poster
}
