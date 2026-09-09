import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import type { StaticPage } from '@/types/comparison'
import { validateStaticPage } from '@/lib/publishing'
import { markdownToHtml } from '@/lib/guides'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { FAQSection } from '@/components/content/FAQSection'
import { MicroAnswer } from './MicroAnswer'
import { DraftNotice } from './DraftNotice'

interface ComparisonPageShellProps {
  page: StaticPage
  breadcrumbs: { label: string; href: string }[]
  /** Tabell eller lista som placeras direkt efter mikrosvaret. */
  lead?: ReactNode
  /** Innehåll efter brödtexten, till exempel en sidlista. */
  children?: ReactNode
}

/**
 * Gemensamt skal för hubbar, jämförelsesidor och guider. Ordningen är
 * medvetet densamma överallt: mikrosvar, tabell, brödtext, FAQ (siteplanen §7,
 * tabellen ska ligga ovanför fold på mobil).
 */
export function ComparisonPageShell({
  page,
  breadcrumbs,
  lead,
  children,
}: ComparisonPageShellProps) {
  const isDraft = page.page.status !== 'published'
  if (isDraft && process.env.NODE_ENV === 'production') notFound()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />

      {isDraft && (
        <div className="mt-6">
          <DraftNotice issues={validateStaticPage(page)} />
        </div>
      )}

      <header className="mt-6 space-y-4">
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
          {page.page.h1}
        </h1>
        <MicroAnswer>{page.page.microAnswer}</MicroAnswer>
      </header>

      {lead && <div className="mt-8">{lead}</div>}

      {page.bodyMd && (
        <article
          className="prose prose-gray mt-12 max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(page.bodyMd) }}
        />
      )}

      {children}

      {page.page.faq.length > 0 && (
        <FAQSection
          faqs={page.page.faq.map((item, index) => ({
            id: `${page.slug}-faq-${index}`,
            question: item.question,
            answer: item.answer,
            sortOrder: index,
          }))}
        />
      )}
    </div>
  )
}
