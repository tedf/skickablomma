import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGuideBySlug, getAllGuides, markdownToHtml } from '@/lib/guides'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

interface GuidePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const guides = getAllGuides()
  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug)

  if (!guide) {
    return {
      title: 'Guide inte hittad | Skicka Blomma',
    }
  }

  return {
    title: `${guide.title} | Skicka Blomma`,
    description: guide.excerpt || guide.title,
    alternates: {
      canonical: `https://skickablomma.se/guide/${params.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.excerpt || guide.title,
      url: `https://skickablomma.se/guide/${params.slug}`,
      type: 'article',
    },
  }
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuideBySlug(params.slug)

  if (!guide) {
    notFound()
  }

  const htmlContent = markdownToHtml(guide.content)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: 'Hem', href: '/' },
              { label: 'Guider', href: '/guider' },
              { label: guide.title, href: `/guide/${params.slug}` },
            ]}
          />
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div
            className="prose prose-lg prose-gray max-w-none
              prose-headings:font-display prose-headings:font-bold
              prose-h1:text-4xl prose-h1:mb-8
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:space-y-2
              prose-li:text-gray-700
              prose-table:border-collapse prose-table:w-full prose-table:my-8
              prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2
              prose-tr:even:bg-gray-50"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Related content */}
          <div className="mt-16 border-t pt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Andra guider som kan intressera dig
            </h3>
            <div className="flex flex-wrap gap-2">
              {getAllGuides()
                .filter((g) => g.slug !== params.slug)
                .slice(0, 3)
                .map((relatedGuide) => (
                  <a
                    key={relatedGuide.slug}
                    href={`/guide/${relatedGuide.slug}`}
                    className="inline-block rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    {relatedGuide.title}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
