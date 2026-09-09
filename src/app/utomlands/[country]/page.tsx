import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getCountry,
  getCountryNeighbours,
  getRenderableCountries,
  getService,
} from '@/lib/comparison'
import { validateCountry } from '@/lib/publishing'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { FAQSection } from '@/components/content/FAQSection'
import { ComparisonTable, type ComparisonRow } from '@/components/comparison/ComparisonTable'
import { MicroAnswer } from '@/components/comparison/MicroAnswer'
import { DraftNotice } from '@/components/comparison/DraftNotice'

interface CountryPageProps {
  params: { country: string }
}

export async function generateStaticParams() {
  return getRenderableCountries().map((country) => ({ country: country.slug }))
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const country = getCountry(params.country)
  if (!country) return {}

  return {
    title: country.page.title,
    description: country.page.metaDescription,
    alternates: { canonical: `https://skickablomma.se/utomlands/${country.slug}` },
    robots:
      country.page.status === 'published' ? undefined : { index: false, follow: false },
  }
}

function formatLeadDays(leadDays: [number, number] | null): string | null {
  if (!leadDays) return null
  const [min, max] = leadDays
  return min === max ? `${min} vardagar` : `${min}–${max} vardagar`
}

export default function CountryPage({ params }: CountryPageProps) {
  const country = getCountry(params.country)
  if (!country) notFound()

  const isDraft = country.page.status !== 'published'
  if (isDraft && process.env.NODE_ENV === 'production') notFound()

  const rows: ComparisonRow[] = country.services
    .map((countryService): ComparisonRow | null => {
      const service = getService(countryService.serviceId)
      if (!service) return null
      return {
        service,
        priceOverride: countryService.priceFromSek,
        // Budet ingår i landspriset, så ingen separat avgift läggs på.
        feeOverride: countryService.priceFromSek !== null ? 0 : null,
      }
    })
    .filter((row): row is ComparisonRow => row !== null)

  const neighbours = getCountryNeighbours(country)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Start', href: '/' },
          { label: 'Utomlands', href: '/utomlands' },
          { label: country.name, href: `/utomlands/${country.slug}` },
        ]}
      />

      {isDraft && (
        <div className="mt-6">
          <DraftNotice issues={validateCountry(country)} />
        </div>
      )}

      <header className="mt-6 space-y-4">
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
          {country.page.h1}
        </h1>
        <MicroAnswer>{country.page.microAnswer}</MicroAnswer>
      </header>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-2xl font-semibold text-gray-900">
          Priser och leveranstider till {country.name}
        </h2>
        <ComparisonTable
          rows={rows}
          pricesVerifiedAt={country.page.pricesVerifiedAt}
          trackingContext={`land:${country.slug}`}
        />

        <ul className="mt-4 space-y-1 text-sm text-gray-600">
          {country.services.map((countryService) => {
            const service = getService(countryService.serviceId)
            const lead = formatLeadDays(countryService.leadDays)
            if (!service || !lead) return null
            return (
              <li key={countryService.serviceId}>
                {service.name}: leverans inom {lead}.
              </li>
            )
          })}
        </ul>
      </div>

      <section className="mt-12 space-y-6">
        <h2 className="font-display text-2xl font-semibold text-gray-900">
          Att tänka på vid leverans till {country.name}
        </h2>

        {country.customsNote && (
          <div>
            <h3 className="font-semibold text-gray-900">Tull och moms</h3>
            <p className="mt-1 text-gray-700">{country.customsNote}</p>
          </div>
        )}

        {country.timezoneOffset !== null && country.timezoneOffset !== 0 && (
          <div>
            <h3 className="font-semibold text-gray-900">Tidsskillnad</h3>
            <p className="mt-1 text-gray-700">
              {country.name} ligger {Math.abs(country.timezoneOffset)} timme
              {Math.abs(country.timezoneOffset) === 1 ? '' : 'r'}{' '}
              {country.timezoneOffset > 0 ? 'före' : 'efter'} Sverige. Det kan avgöra om
              beställningen hinner med dagens utkörning.
            </p>
          </div>
        )}

        {country.holidays.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900">Helgdagar som flyttar leveransen</h3>
            <ul className="mt-1 list-disc pl-5 text-gray-700">
              {country.holidays.map((holiday) => (
                <li key={holiday}>{holiday}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {country.page.faq.length > 0 && (
        <FAQSection
          title={`Vanliga frågor om blommor till ${country.name}`}
          faqs={country.page.faq.map((item, index) => ({
            id: `${country.slug}-faq-${index}`,
            question: item.question,
            answer: item.answer,
            sortOrder: index,
          }))}
        />
      )}

      <nav className="mt-12 border-t border-gray-200 pt-8" aria-label="Relaterade sidor">
        <h2 className="mb-4 font-display text-xl font-semibold text-gray-900">Läs vidare</h2>
        <ul className="flex flex-wrap gap-3 text-sm">
          <li>
            <Link
              href="/utomlands"
              className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Alla länder
            </Link>
          </li>
          {neighbours.map((neighbour) => (
            <li key={neighbour.slug}>
              <Link
                href={`/utomlands/${neighbour.slug}`}
                className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Blommor till {neighbour.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/guider/vad-kostar-det"
              className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Vad kostar det att skicka blommor?
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
