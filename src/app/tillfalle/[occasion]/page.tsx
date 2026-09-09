import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getOccasion,
  getRenderableCities,
  getRenderableOccasions,
  getService,
} from '@/lib/comparison'
import { validateOccasion } from '@/lib/publishing'
import { markdownToHtml } from '@/lib/guides'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { FAQSection } from '@/components/content/FAQSection'
import { ComparisonTable, type ComparisonRow } from '@/components/comparison/ComparisonTable'
import { MicroAnswer } from '@/components/comparison/MicroAnswer'
import { DraftNotice } from '@/components/comparison/DraftNotice'

interface OccasionPageProps {
  params: { occasion: string }
}

export async function generateStaticParams() {
  return getRenderableOccasions().map((occasion) => ({ occasion: occasion.slug }))
}

export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const occasion = getOccasion(params.occasion)
  if (!occasion) return {}

  return {
    title: occasion.page.title,
    description: occasion.page.metaDescription,
    alternates: { canonical: `https://skickablomma.se/tillfalle/${occasion.slug}` },
    robots:
      occasion.page.status === 'published' ? undefined : { index: false, follow: false },
  }
}

export default function OccasionPage({ params }: OccasionPageProps) {
  const occasion = getOccasion(params.occasion)
  if (!occasion) notFound()

  const isDraft = occasion.page.status !== 'published'
  if (isDraft && process.env.NODE_ENV === 'production') notFound()

  const rows: ComparisonRow[] = occasion.serviceIds
    .map((serviceId): ComparisonRow | null => {
      const service = getService(serviceId)
      return service ? { service } : null
    })
    .filter((row): row is ComparisonRow => row !== null)

  // De största städerna som faktiskt har en renderbar sida (siteplanen §3).
  const cityLinks = [...getRenderableCities()]
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, 5)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: occasion.page.h1,
    description: occasion.page.metaDescription,
    author: { '@type': 'Organization', name: 'Skicka Blomma' },
    publisher: { '@type': 'Organization', name: 'Skicka Blomma' },
    ...(occasion.page.updatedAt ? { dateModified: occasion.page.updatedAt } : {}),
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Start', href: '/' },
          { label: 'Tillfällen', href: '/tillfalle' },
          { label: occasion.name, href: `/tillfalle/${occasion.slug}` },
        ]}
      />

      {isDraft && (
        <div className="mt-6">
          <DraftNotice issues={validateOccasion(occasion)} />
        </div>
      )}

      <header className="mt-6 space-y-4">
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
          {occasion.page.h1}
        </h1>
        <MicroAnswer>{occasion.page.microAnswer}</MicroAnswer>
      </header>

      {rows.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-display text-2xl font-semibold text-gray-900">
            Var du beställer
          </h2>
          <ComparisonTable
            rows={rows}
            pricesVerifiedAt={occasion.page.pricesVerifiedAt}
            trackingContext={`tillfalle:${occasion.slug}`}
          />
        </div>
      )}

      <article
        className="prose prose-gray mt-12 max-w-none"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(occasion.etiquetteMd) }}
      />

      {(occasion.flowersRecommended.length > 0 || occasion.flowersAvoid.length > 0) && (
        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          {occasion.flowersRecommended.length > 0 && (
            <div className="rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900">Blommor som passar</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                {occasion.flowersRecommended.map((flower) => (
                  <li key={flower}>{flower}</li>
                ))}
              </ul>
            </div>
          )}
          {occasion.flowersAvoid.length > 0 && (
            <div className="rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900">Tänk efter en gång till</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                {occasion.flowersAvoid.map((flower) => (
                  <li key={flower}>{flower}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {occasion.cardTexts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl font-semibold text-gray-900">
            Texter till kortet
          </h2>
          <ul className="space-y-2">
            {occasion.cardTexts.map((text) => (
              <li
                key={text}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800"
              >
                {text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {occasion.page.faq.length > 0 && (
        <FAQSection
          title={`Vanliga frågor om blommor till ${occasion.name.toLowerCase()}`}
          faqs={occasion.page.faq.map((item, index) => ({
            id: `${occasion.slug}-faq-${index}`,
            question: item.question,
            answer: item.answer,
            sortOrder: index,
          }))}
        />
      )}

      <nav className="mt-12 border-t border-gray-200 pt-8" aria-label="Relaterade sidor">
        <h2 className="mb-4 font-display text-xl font-semibold text-gray-900">Läs vidare</h2>
        <ul className="flex flex-wrap gap-3 text-sm">
          {cityLinks.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/blombud/${city.slug}`}
                className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Blombud {city.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/jamfor"
              className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Jämför blombud
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
