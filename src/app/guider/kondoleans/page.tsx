import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStaticPage } from '@/lib/comparison'
import { BRAND } from '@/data/brand'
import { ComparisonPageShell } from '@/components/comparison/ComparisonPageShell'

const SLUG = '/guider/kondoleans'

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
 * Ingen jämförelsetabell. Sökordet "kondoleans" är enligt Ahrefs helt utan
 * köpintention: någon vill veta vad ordet betyder och vad man skriver. En
 * affiliatelänk högt upp vore både taktlös och sämre för konverteringen.
 * Sidan länkar i stället vidare till tillfällessidan för den som ska beställa.
 */
export default function KondoleansPage() {
  const page = getStaticPage(SLUG)
  if (!page) notFound()

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
          { label: 'Kondoleans', href: SLUG },
        ]}
      >
        <nav className="mt-12 border-t border-line pt-8" aria-label="Relaterade sidor">
          <h2 className="mb-4 font-display text-xl text-ink">Läs vidare</h2>
          <ul className="flex flex-wrap gap-3 text-sm">
            <li>
              <Link
                href="/tillfalle/kondoleans"
                className="rounded-full bg-muted px-4 py-2 text-ink-muted hover:bg-line"
              >
                Skicka kondoleansblommor
              </Link>
            </li>
            <li>
              <Link
                href="/tillfalle/begravning"
                className="rounded-full bg-muted px-4 py-2 text-ink-muted hover:bg-line"
              >
                Blommor till en begravning
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
