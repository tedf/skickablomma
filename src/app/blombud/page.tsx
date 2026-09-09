import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllServices, getRenderableCities, getStaticPage } from '@/lib/comparison'
import { ComparisonPageShell } from '@/components/comparison/ComparisonPageShell'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'

const SLUG = '/blombud'

export async function generateMetadata(): Promise<Metadata> {
  const page = getStaticPage(SLUG)
  if (!page) return {}

  return {
    title: page.page.title,
    description: page.page.metaDescription,
    alternates: { canonical: 'https://skickablomma.se/blombud' },
    robots: page.page.status === 'published' ? undefined : { index: false, follow: false },
  }
}

export default function BlombudHubPage() {
  const page = getStaticPage(SLUG)
  if (!page) notFound()

  const cities = [...getRenderableCities()].sort((a, b) =>
    a.name.localeCompare(b.name, 'sv')
  )

  const rows = getAllServices().map((service) => ({ service }))

  return (
    <ComparisonPageShell
      page={page}
      breadcrumbs={[
        { label: 'Start', href: '/' },
        { label: 'Blombud', href: '/blombud' },
      ]}
      lead={
        <ComparisonTable
          rows={rows}
          pricesVerifiedAt={page.page.pricesVerifiedAt}
          trackingContext="hub:blombud"
        />
      }
    >
      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-gray-900">
          Blombud stad för stad
        </h2>
        {cities.length === 0 ? (
          <p className="text-gray-600">
            Inga stadssidor är publicerade ännu. En stad läggs till när minst tre florister
            är kontrollerade på plats.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/blombud/${city.slug}`}
                  className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-400"
                >
                  <span className="font-medium text-gray-900">{city.name}</span>
                  <span className="mt-1 block text-sm text-gray-500">{city.county}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </ComparisonPageShell>
  )
}
