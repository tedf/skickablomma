import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllServices, getStaticPage, sortByTotalPrice, totalPriceSek } from '@/lib/comparison'
import { ComparisonPageShell } from '@/components/comparison/ComparisonPageShell'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'

const SLUG = '/jamfor'

export async function generateMetadata(): Promise<Metadata> {
  const page = getStaticPage(SLUG)
  if (!page) return {}

  return {
    title: page.page.title,
    description: page.page.metaDescription,
    alternates: { canonical: 'https://skickablomma.se/jamfor' },
    robots: page.page.status === 'published' ? undefined : { index: false, follow: false },
  }
}

export default function JamforPage() {
  const page = getStaticPage(SLUG)
  if (!page) notFound()

  const services = getAllServices()

  // Vårt val sätts av data, inte av provisionen. Det kräver att minst två
  // tjänster har kontrollerat totalpris — annars vore "billigast" ett påstående
  // om ett fält med en enda deltagare.
  const priced = sortByTotalPrice(services).filter(
    (service) => totalPriceSek(service) !== null
  )
  const pick =
    priced.length >= 2
      ? {
          serviceId: priced[0].id,
          reason: `Lägsta totalpris av de ${priced.length} tjänster vi kontrollerat: ${totalPriceSek(priced[0])} kr för bukett plus bud.`,
        }
      : null

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Blombud i Sverige',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: service.name,
        url: service.websiteUrl,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ComparisonPageShell
        page={page}
        breadcrumbs={[
          { label: 'Start', href: '/' },
          { label: 'Jämför', href: '/jamfor' },
        ]}
        lead={
          <ComparisonTable
            rows={services.map((service) => ({ service }))}
            pricesVerifiedAt={page.page.pricesVerifiedAt}
            pick={pick}
            trackingContext="jamfor"
          />
        }
      />
    </>
  )
}
