import { Metadata } from 'next'
import Link from 'next/link'
import { getAllGuides } from '@/lib/guides'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Guider om blommor och leverans | Skicka Blomma',
  description: 'Läs våra guider om att skicka blommor, välja rätt bukett och förstå blommornas betydelse.',
  alternates: {
    canonical: 'https://skickablomma.se/guider',
  },
}

export default function GuidesPage() {
  const guides = getAllGuides()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: 'Hem', href: '/' },
              { label: 'Guider', href: '/guider' },
            ]}
          />

          <h1 className="mt-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Guider om blommor
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Lär dig mer om att välja och skicka blommor med våra omfattande guider.
          </p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>

              <h2 className="mb-3 font-display text-xl font-bold text-gray-900 group-hover:text-primary">
                {guide.title}
              </h2>

              {guide.excerpt && (
                <p className="mb-4 text-gray-600 line-clamp-3">
                  {guide.excerpt}
                </p>
              )}

              <div className="flex items-center text-sm font-medium text-primary">
                Läs guiden
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO Content */}
        <section className="mt-16 border-t bg-white py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-display text-2xl font-bold text-gray-900">
              Varför läsa våra blomsteguider?
            </h2>
            <div className="prose prose-gray max-w-none">
              <p>
                Att välja rätt blommor kan vara svårt - det finns så många alternativ och
                traditioner att ta hänsyn till. Våra guider hjälper dig navigera genom
                valen och hitta perfekta blommorna för varje tillfälle.
              </p>
              <p>
                Oavsett om du ska skicka blommor i sista minuten, behöver hjälp med att
                välja begravningsblommor eller vill förstå rosors betydelse, så finns
                svaren här.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
