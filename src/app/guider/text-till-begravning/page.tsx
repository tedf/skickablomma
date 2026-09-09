import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStaticPage } from '@/lib/comparison'
import { BRAND } from '@/data/brand'
import { ComparisonPageShell } from '@/components/comparison/ComparisonPageShell'
import { ProductEvidence } from '@/components/comparison/ProductEvidence'
import { getFeedDate, getProductsByCategory, getProductsBySubCategory } from '@/lib/products'
import type { MainCategory, SubCategory } from '@/types'

const SLUG = '/guider/text-till-begravning'

export async function generateMetadata(): Promise<Metadata> {
  const page = getStaticPage(SLUG)
  if (!page) return {}

  return {
    title: page.page.title,
    description: page.page.metaDescription,
    alternates: { canonical: `${BRAND.url}${SLUG}` },
    robots: page.page.status === 'published' ? undefined : { index: false, follow: false },
  }
}

/**
 * Guiden har ingen jämförelsetabell. Sökintentionen är ren information —
 * någon står med ett kort i handen och vet inte vad de ska skriva. En
 * affiliatelänk högt upp vore både taktlöst och sämre för konverteringen.
 */
export default async function TextTillBegravningPage() {
  const page = getStaticPage(SLUG)
  if (!page) notFound()

  const products = await getProductsByCategory('begravning' as MainCategory, 24)


  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.page.h1,
    description: page.page.metaDescription,
    author: { '@type': 'Organization', name: BRAND.name },
    publisher: { '@type': 'Organization', name: BRAND.name },
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
          { label: 'Text till begravning', href: SLUG },
        ]}
      >
        <ProductEvidence
          products={products}
          feedDate={getFeedDate()}
          noun="begravningsblommor"
        />

        <nav className="mt-12 border-t border-line pt-8" aria-label="Relaterade sidor">
          <h2 className="mb-4 font-display text-xl text-ink">Läs vidare</h2>
          <ul className="flex flex-wrap gap-3 text-sm">
            <li>
              <Link
                href="/tillfalle/begravning"
                className="rounded-full bg-muted px-4 py-2 text-ink-muted hover:bg-line"
              >
                Skicka blommor till en begravning
              </Link>
            </li>
            <li>
              <Link
                href="/jamfor"
                className="rounded-full bg-muted px-4 py-2 text-ink-muted hover:bg-line"
              >
                Jämför blombud
              </Link>
            </li>
          </ul>
        </nav>
      </ComparisonPageShell>
    </>
  )
}
