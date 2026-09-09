import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllServices, getStaticPage, sortByTotalPrice, totalPriceSek } from '@/lib/comparison'
import { ComparisonPageShell } from '@/components/comparison/ComparisonPageShell'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'

const SLUG = '/jamfor/billigt'

export async function generateMetadata(): Promise<Metadata> {
  const page = getStaticPage(SLUG)
  if (!page) return {}

  return {
    title: page.page.title,
    description: page.page.metaDescription,
    alternates: { canonical: 'https://skickablomma.se/jamfor/billigt' },
    robots: page.page.status === 'published' ? undefined : { index: false, follow: false },
  }
}

export default function BilligtPage() {
  const page = getStaticPage(SLUG)
  if (!page) notFound()

  const services = sortByTotalPrice(getAllServices())
  const priced = services.filter((service) => totalPriceSek(service) !== null)

  // Samma regel som på /jamfor: ingen "billigast"-markering förrän minst två
  // tjänster faktiskt är prissatta av oss.
  const pick =
    priced.length >= 2
      ? {
          serviceId: priced[0].id,
          reason: `Lägsta totalpris av de ${priced.length} tjänster vi kontrollerat: ${totalPriceSek(priced[0])} kr inklusive bud.`,
        }
      : null

  return (
    <ComparisonPageShell
      page={page}
      breadcrumbs={[
        { label: 'Start', href: '/' },
        { label: 'Jämför', href: '/jamfor' },
        { label: 'Billigt', href: '/jamfor/billigt' },
      ]}
      lead={
        <ComparisonTable
          rows={services.map((service) => ({ service }))}
          pricesVerifiedAt={page.page.pricesVerifiedAt}
          pick={pick}
          trackingContext="jamfor:billigt"
        />
      }
    />
  )
}
