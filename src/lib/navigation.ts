import { MAIN_CATEGORIES } from '@/data/categories'
import {
  getRenderableCities,
  getRenderableCountries,
  getRenderableOccasions,
} from '@/lib/comparison'

/**
 * Navigationen byggs av samma data som sidorna.
 *
 * Menyerna var hårdkodade listor i Header och Footer medan innehållet ligger i
 * data/. Följden var att de halkade isär i tysthet: när tolv städer lades till
 * visade menyn fortfarande två, julsidan saknades helt trots att den är
 * klustrets största, och posterna under rubriken "Tillfällen" pekade på
 * kategorisidor i produktkatalogen i stället för på tillfällessidorna.
 *
 * Inget av det gav ett fel någonstans, vilket är varför det kunde ligga kvar.
 * Nu finns bara en källa, och en ny stad eller ett nytt tillfälle syns i menyn
 * i samma stund som det syns på sajten.
 */

export interface NavLink {
  name: string
  href: string
}

export interface NavGroup extends NavLink {
  children: NavLink[]
}

/** Så många orter och tillfällen får plats i en rullgardin innan den blir en lista att skrolla i. */
const MAX_I_MENY = 8

/**
 * Sorterar på söktrafik, inte på folkmängd eller bokstavsordning. Menyn ska
 * lyfta det folk faktiskt söker på: Örebro har lika stor volym som Malmö.
 */
function efterSokvolym<T extends { searchVolume: number | null }>(poster: T[]): T[] {
  return [...poster].sort((a, b) => (b.searchVolume ?? 0) - (a.searchVolume ?? 0))
}

export function buildNavigation(): NavGroup[] {
  const stader = efterSokvolym(getRenderableCities())
  const tillfallen = efterSokvolym(getRenderableOccasions())
  const lander = getRenderableCountries()

  const kategorier = (['buketter', 'begravning', 'brollop', 'lokar-och-fron', 'dukning-och-fest'] as const)
    .map((id) => MAIN_CATEGORIES[id])
    .filter((kategori) => kategori?.isActive)
    .map((kategori) => ({ name: kategori.namePlural, href: `/${kategori.slug}` }))

  return [
    {
      name: 'Blombud',
      href: '/blombud',
      children: [
        { name: `Alla städer (${stader.length})`, href: '/blombud' },
        ...stader.slice(0, MAX_I_MENY).map((stad) => ({
          name: stad.name,
          href: `/blombud/${stad.slug}`,
        })),
      ],
    },
    {
      name: 'Utomlands',
      href: '/utomlands',
      children: [
        { name: 'Alla länder', href: '/utomlands' },
        ...lander.map((land) => ({ name: land.name, href: `/utomlands/${land.slug}` })),
      ],
    },
    {
      name: 'Tillfällen',
      href: '/tillfalle',
      children: [
        { name: 'Alla tillfällen', href: '/tillfalle' },
        ...tillfallen.slice(0, MAX_I_MENY).map((tillfalle) => ({
          name: tillfalle.name,
          href: `/tillfalle/${tillfalle.slug}`,
        })),
      ],
    },
    {
      name: 'Jämför',
      href: '/jamfor',
      children: [
        { name: 'Alla tjänster', href: '/jamfor' },
        { name: 'Billigast', href: '/jamfor/billigt' },
        { name: 'Vad kostar det?', href: '/guider/vad-kostar-det' },
      ],
    },
    {
      name: 'Guider',
      href: '/guider',
      children: [
        { name: 'Alla guider', href: '/guider' },
        { name: 'Vad kostar det?', href: '/guider/vad-kostar-det' },
        { name: 'Text till begravningsblommor', href: '/guider/text-till-begravning' },
        { name: 'Kondoleans', href: '/guider/kondoleans' },
      ],
    },
    {
      name: 'Buketter',
      href: '/buketter',
      children: [
        { name: 'Alla buketter', href: '/buketter' },
        ...kategorier.filter((k) => k.href !== '/buketter'),
      ],
    },
  ]
}

/** Footern speglar navigationen men platt, utan rullgardiner. */
export function buildFooterLinks() {
  const stader = efterSokvolym(getRenderableCities()).slice(0, 5)
  const tillfallen = efterSokvolym(getRenderableOccasions()).slice(0, 5)

  return {
    kategorier: [
      { name: 'Blombud', href: '/blombud' },
      { name: 'Skicka utomlands', href: '/utomlands' },
      { name: 'Jämför blombud', href: '/jamfor' },
      { name: 'Billigast', href: '/jamfor/billigt' },
      { name: 'Buketter', href: '/buketter' },
      { name: 'Lökar och frön', href: '/lokar-och-fron' },
    ],
    stader: stader.map((stad) => ({ name: stad.name, href: `/blombud/${stad.slug}` })),
    tillfallen: tillfallen.map((tillfalle) => ({
      name: tillfalle.name,
      href: `/tillfalle/${tillfalle.slug}`,
    })),
    information: [
      { name: 'Guider', href: '/guider' },
      { name: 'Vad kostar det?', href: '/guider/vad-kostar-det' },
      { name: 'Sök blommor', href: '/sok' },
      // Länkas från varje jämförelsetabell — se AffiliateDisclosure.
      { name: 'Så tjänar vi pengar', href: '/om/sa-tjanar-vi-pengar' },
    ],
  }
}
