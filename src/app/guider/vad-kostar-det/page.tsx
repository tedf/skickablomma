import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllServices, getStaticPage } from '@/lib/comparison'
import { ComparisonPageShell } from '@/components/comparison/ComparisonPageShell'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'

const SLUG = '/guider/vad-kostar-det'

export async function generateMetadata(): Promise<Metadata> {
  const page = getStaticPage(SLUG)
  if (!page) return {}

  return {
    title: page.page.title,
    description: page.page.metaDescription,
    alternates: { canonical: 'https://skickablomma.se/guider/vad-kostar-det' },
    robots: page.page.status === 'published' ? undefined : { index: false, follow: false },
  }
}

export default function VadKostarDetPage() {
  const page = getStaticPage(SLUG)
  if (!page) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.page.h1,
    description: page.page.metaDescription,
    author: { '@type': 'Organization', name: 'Skicka Blomma' },
    publisher: { '@type': 'Organization', name: 'Skicka Blomma' },
    ...(page.page.updatedAt ? { dateModified: page.page.updatedAt } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ComparisonPageShell
        page={page}
        breadcrumbs={[
          { label: 'Start', href: '/' },
          { label: 'Guider', href: '/guider' },
          { label: 'Vad kostar det?', href: '/guider/vad-kostar-det' },
        ]}
        lead={
          <ComparisonTable
            rows={getAllServices().map((service) => ({ service }))}
            pricesVerifiedAt={page.page.pricesVerifiedAt}
            trackingContext="guide:vad-kostar-det"
          />
        }
      />
    </>
  )
}
