import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getRenderableOccasions } from '@/lib/comparison'
import { getProductsByCategory, getProductsBySubCategory, pickDeliverableBouquets } from '@/lib/products'
import type { MainCategory, SubCategory } from '@/types'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Blommor för olika tillfällen',
  description:
    'Vad passar till begravning, födelsedag eller en nyfödd? Etikett, blomval och korttexter för varje tillfälle, plus vad tjänsterna tar för att leverera dem.',
  alternates: { canonical: 'https://skickablomma.se/tillfalle' },
}

/**
 * Hubben listar bara de tillfällen som faktiskt har en publicerad sida.
 * Resterande sex ligger i fas 3 enligt roadmapen och läggs till i
 * data/occasions.json allteftersom.
 */
export default async function TillfalleHubPage() {
  const occasions = getRenderableOccasions()

  /*
    Ett kort med bara rubrik och metabeskrivning är svårt att skilja från
    nästa. En bild ur tjänsternas flöde gör hubben läsbar på en sekund och
    säger vad varje tillfälle faktiskt innebär.

    Bara bilder som finns lokalt används. En platshållare hade sagt mindre
    än ingen bild alls.
  */
  const bilder = await Promise.all(
    occasions.map(async (occasion) => {
      const q = occasion.productQuery
      let kandidater = q?.mainCategory
        ? await getProductsByCategory(q.mainCategory as MainCategory, 24)
        : (
            await Promise.all(
              (q?.subCategories ?? []).map((sub) =>
                getProductsBySubCategory(sub as SubCategory, 12)
              )
            )
          ).flat()
      const [bild] = pickDeliverableBouquets(kandidater, 1, q?.excludeSubCategories ?? [])
      return [occasion.slug, bild?.primaryImage?.url ?? null] as const
    })
  )
  const bildPerTillfalle = new Map(bilder)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Start', href: '/' },
          { label: 'Tillfällen', href: '/tillfalle' },
        ]}
      />

      <header className="mt-6 space-y-4">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Blommor för olika tillfällen
        </h1>
        <p className="text-lg leading-relaxed text-ink">
          Vilka blommor som passar beror mindre på smak än på sammanhang. Här går vi igenom
          vad som är brukligt vid varje tillfälle, vad du skriver på kortet och när
          beställningen behöver ligga inne.
        </p>
      </header>

      <section className="mt-8">
        {occasions.length === 0 ? (
          <p className="text-ink-muted">Inga tillfällen är publicerade ännu.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {occasions.map((occasion) => (
              <li key={occasion.slug}>
                <Link
                  href={`/tillfalle/${occasion.slug}`}
                  className="group flex h-full gap-4 overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-leaf-300"
                >
                  {bildPerTillfalle.get(occasion.slug) ? (
                    <div className="relative w-28 shrink-0 bg-leaf-50">
                      <Image
                        src={bildPerTillfalle.get(occasion.slug) as string}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-28 shrink-0 bg-leaf-50" />
                  )}
                  <div className="min-w-0 py-4 pr-4">
                    <span className="font-medium text-ink">{occasion.name}</span>
                    <span className="mt-1 block text-sm text-ink-faint">
                      {occasion.page.metaDescription}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
