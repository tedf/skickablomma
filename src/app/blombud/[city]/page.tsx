import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCity, getCityNeighbours, getRenderableCities, getService } from '@/lib/comparison'
import { validateCity, verifiedFlorists } from '@/lib/publishing'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { FAQSection } from '@/components/content/FAQSection'
import { ComparisonTable, type ComparisonRow } from '@/components/comparison/ComparisonTable'
import { MicroAnswer } from '@/components/comparison/MicroAnswer'
import { DraftNotice } from '@/components/comparison/DraftNotice'
import { FloristList } from '@/components/comparison/FloristList'

interface CityPageProps {
  params: { city: string }
}

export async function generateStaticParams() {
  return getRenderableCities().map((city) => ({ city: city.slug }))
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = getCity(params.city)
  if (!city) return {}

  return {
    title: city.page.title,
    description: city.page.metaDescription,
    alternates: { canonical: `https://skickablomma.se/blombud/${city.slug}` },
    // Utkast ska aldrig indexeras, inte ens om de råkar bli åtkomliga.
    robots: city.page.status === 'published' ? undefined : { index: false, follow: false },
  }
}

export default function CityPage({ params }: CityPageProps) {
  const city = getCity(params.city)
  if (!city) notFound()

  const isDraft = city.page.status !== 'published'
  if (isDraft && process.env.NODE_ENV === 'production') notFound()

  const florists = verifiedFlorists(city)

  const rows: ComparisonRow[] = city.services
    .map((cityService): ComparisonRow | null => {
      const service = getService(cityService.serviceId)
      if (!service) return null
      return {
        service,
        cutoffOverride: cityService.cutoffHere,
        feeOverride: cityService.feeHereSek,
      }
    })
    .filter((row): row is ComparisonRow => row !== null)

  const neighbours = getCityNeighbours(city)

  // ItemList över floristerna — bara när det finns verifierade poster att lista.
  const floristSchema =
    florists.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Florister i ${city.name}`,
          itemListElement: florists.map((florist, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Florist',
              name: florist.name,
              ...(florist.url ? { url: florist.url } : {}),
              ...(florist.phone ? { telephone: florist.phone } : {}),
              address: {
                '@type': 'PostalAddress',
                addressLocality: city.name,
                addressRegion: city.county,
                addressCountry: 'SE',
              },
            },
          })),
        }
      : null

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {floristSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(floristSchema) }}
        />
      )}

      <Breadcrumbs
        items={[
          { label: 'Start', href: '/' },
          { label: 'Blombud', href: '/blombud' },
          { label: city.name, href: `/blombud/${city.slug}` },
        ]}
      />

      {isDraft && (
        <div className="mt-6">
          <DraftNotice issues={validateCity(city)} />
        </div>
      )}

      <header className="mt-6 space-y-4">
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
          {city.page.h1}
        </h1>
        <MicroAnswer>{city.page.microAnswer}</MicroAnswer>
      </header>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-2xl font-semibold text-gray-900">
          Jämför blombud i {city.name}
        </h2>
        <ComparisonTable
          rows={rows}
          pricesVerifiedAt={city.page.pricesVerifiedAt}
          trackingContext={`stad:${city.slug}`}
        />
      </div>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-gray-900">
          Florister i {city.name} som levererar
        </h2>
        <FloristList florists={florists} cityName={city.name} />
      </section>

      {city.deliveryAreas.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl font-semibold text-gray-900">
            Leveransområden
          </h2>
          <p className="text-gray-700">
            Blombuden når normalt hela tätorten, däribland{' '}
            {city.deliveryAreas.slice(0, -1).join(', ')} och{' '}
            {city.deliveryAreas[city.deliveryAreas.length - 1]}.
          </p>
          {city.hospitals.length > 0 && (
            <p className="mt-3 text-gray-700">
              Leverans till {city.hospitals.map((hospital) => hospital.name).join(' och ')}{' '}
              går oftast att ordna, men avdelningarna har egna regler. Kontrollera med
              avdelningen innan du beställer.
            </p>
          )}
        </section>
      )}

      {city.page.faq.length > 0 && (
        <FAQSection
          title={`Vanliga frågor om blombud i ${city.name}`}
          faqs={city.page.faq.map((item, index) => ({
            id: `${city.slug}-faq-${index}`,
            question: item.question,
            answer: item.answer,
            sortOrder: index,
          }))}
        />
      )}

      <nav className="mt-12 border-t border-gray-200 pt-8" aria-label="Relaterade sidor">
        <h2 className="mb-4 font-display text-xl font-semibold text-gray-900">
          Läs vidare
        </h2>
        <ul className="flex flex-wrap gap-3 text-sm">
          {neighbours.map((neighbour) => (
            <li key={neighbour.slug}>
              <Link
                href={`/blombud/${neighbour.slug}`}
                className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Blombud {neighbour.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/tillfalle/begravning"
              className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Blommor till begravning
            </Link>
          </li>
          <li>
            <Link
              href="/jamfor"
              className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Jämför alla blombud
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
