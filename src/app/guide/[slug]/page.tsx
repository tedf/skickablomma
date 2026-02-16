import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Clock, ExternalLink } from 'lucide-react'
import { getGuideBySlug, getAllGuides, markdownToHtml } from '@/lib/guides'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ProductCard } from '@/components/products/ProductCard'
import { searchProducts } from '@/lib/products'

interface GuidePageProps {
  params: {
    slug: string
  }
}

// Map guide slugs to Interflora product filters
const guideProductFilters: Record<string, { subCategories?: string[]; mainCategory?: string; query?: string }> = {
  'rosors-betydelse': { subCategories: ['rosor'] },
  'begravningsblommor-guide': { mainCategory: 'begravning' },
  'skicka-blommor-samma-dag': { subCategories: ['rosor'] },
  'mors-dag-blommor': { subCategories: ['tackblommor'] },
  'alla-hjartans-dag-blommor': { subCategories: ['karlek-romantik'] },
  'julblommor-guide': { subCategories: ['vita-blommor'] },
  'student-blommor': { subCategories: ['fodelsedags-blommor'] },
}

// Relevant category links per guide for internal linking sidebar
const guideCategoryLinks: Record<string, { label: string; href: string }[]> = {
  'rosors-betydelse': [
    { label: 'Rosor', href: '/buketter/rosor' },
    { label: 'Röda blommor', href: '/buketter/roda-blommor' },
    { label: 'Rosa blommor', href: '/buketter/rosa-blommor' },
    { label: 'Vita blommor', href: '/buketter/vita-blommor' },
    { label: 'Kärlek & Romantik', href: '/karlek-romantik' },
  ],
  'begravningsblommor-guide': [
    { label: 'Begravningsblommor', href: '/begravning' },
    { label: 'Begravningskransar', href: '/begravning/begravningskransar' },
    { label: 'Begravningsbuketter', href: '/begravning/begravningsbuketter' },
    { label: 'Vita blommor', href: '/buketter/vita-blommor' },
  ],
  'skicka-blommor-samma-dag': [
    { label: 'Leverans samma dag', href: '/samma-dag-leverans' },
    { label: 'Buketter', href: '/buketter' },
    { label: 'Rosor', href: '/buketter/rosor' },
  ],
  'mors-dag-blommor': [
    { label: 'Tackblommor', href: '/tackblommor' },
    { label: 'Rosa blommor', href: '/buketter/rosa-blommor' },
    { label: 'Tulpaner', href: '/buketter/tulpaner' },
    { label: 'Rosor', href: '/buketter/rosor' },
  ],
  'alla-hjartans-dag-blommor': [
    { label: 'Kärlek & Romantik', href: '/karlek-romantik' },
    { label: 'Röda blommor', href: '/buketter/roda-blommor' },
    { label: 'Rosor', href: '/buketter/rosor' },
  ],
  'julblommor-guide': [
    { label: 'Buketter', href: '/buketter' },
    { label: 'Vita blommor', href: '/buketter/vita-blommor' },
    { label: 'Konstgjorda blommor', href: '/konstgjorda-blommor' },
  ],
  'student-blommor': [
    { label: 'Födelsedagsblommor', href: '/fodelsedags-blommor' },
    { label: 'Gratulationer', href: '/gratulationer' },
    { label: 'Tulpaner', href: '/buketter/tulpaner' },
    { label: 'Rosor', href: '/buketter/rosor' },
  ],
}

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
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
    return { title: 'Guide inte hittad' }
  }

  return {
    title: guide.title,
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

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = getGuideBySlug(params.slug)

  if (!guide) {
    notFound()
  }

  // Strip first h1 from content since we show it as page title
  const contentWithoutTitle = guide.content.replace(/^#\s+.+\n\n?/, '')
  const htmlContent = markdownToHtml(contentWithoutTitle)
  const readingTime = estimateReadingTime(guide.content)

  // Fetch relevant Interflora products
  const productFilter = guideProductFilters[params.slug] || {}
  const productResult = await searchProducts(
    { ...productFilter as any, partners: ['interflora'] },
    1,
    4
  )
  const relatedProducts = productResult.products

  const categoryLinks = guideCategoryLinks[params.slug] || []
  const otherGuides = getAllGuides().filter((g) => g.slug !== params.slug).slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: 'Hem', href: '/' },
              { label: 'Guider', href: '/guider' },
              { label: guide.title, href: `/guide/${params.slug}` },
            ]}
          />

          <div className="mt-6 max-w-3xl">
            <h1 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
              {guide.title}
            </h1>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min läsning
              </span>
              <span>·</span>
              <span>Guider om blommor</span>
            </div>
            {guide.excerpt && (
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                {guide.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-12 lg:flex-row flex-col">

          {/* Main content */}
          <article className="min-w-0 flex-1">
            <div
              className="prose prose-lg prose-gray max-w-none
                prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5
                prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-5 prose-ul:space-y-2 prose-li:text-gray-700
                prose-ol:my-5 prose-ol:space-y-2"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* CTA banner */}
            <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/10 p-6">
              <p className="font-semibold text-gray-900">Redo att beställa blommor?</p>
              <p className="mt-1 text-sm text-gray-600">
                Jämför priser från Interflora och fler – hitta rätt bukett för ditt tillfälle.
              </p>
              <Link
                href="/buketter"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Utforska buketter
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-64 lg:flex-shrink-0 space-y-6">
            {/* Category links */}
            {categoryLinks.length > 0 && (
              <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Utforska
                </h3>
                <ul className="space-y-2">
                  {categoryLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                      >
                        {link.label}
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Other guides */}
            {otherGuides.length > 0 && (
              <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Fler guider
                </h3>
                <ul className="space-y-2">
                  {otherGuides.map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={`/guide/${g.slug}`}
                        className="flex items-start gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                      >
                        <span className="mt-0.5 text-base">📖</span>
                        <span>{g.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Interflora product recommendations */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  Rekommenderade blommor
                </h2>
                <p className="mt-1 text-sm text-gray-500">Utvalda hos Interflora</p>
              </div>
              <Link
                href="/buketter"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Visa fler
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  listType="related"
                  position={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
