import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRenderableCountries, getStaticPage } from '@/lib/comparison'
import { ComparisonPageShell } from '@/components/comparison/ComparisonPageShell'

const SLUG = '/utomlands'

export async function generateMetadata(): Promise<Metadata> {
  const page = getStaticPage(SLUG)
  if (!page) return {}

  return {
    title: page.page.title,
    description: page.page.metaDescription,
    alternates: { canonical: 'https://skickablomma.se/utomlands' },
    robots: page.page.status === 'published' ? undefined : { index: false, follow: false },
  }
}

export default function UtomlandsHubPage() {
  const page = getStaticPage(SLUG)
  if (!page) notFound()

  const countries = [...getRenderableCountries()].sort((a, b) =>
    a.name.localeCompare(b.name, 'sv')
  )

  return (
    <ComparisonPageShell
      page={page}
      breadcrumbs={[
        { label: 'Start', href: '/' },
        { label: 'Utomlands', href: '/utomlands' },
      ]}
      lead={
        countries.length === 0 ? null : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => (
              <li key={country.slug}>
                <Link
                  href={`/utomlands/${country.slug}`}
                  className="block rounded-lg border border-line bg-surface p-4 transition-colors hover:border-leaf-300 hover:bg-leaf-50"
                >
                  <span className="font-medium text-ink">{country.name}</span>
                  <span className="mt-1 block text-sm text-ink-faint">
                    {country.eu ? 'EU-land, ingen tull' : 'Utanför EU'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )
      }
    />
  )
}
