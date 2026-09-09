import { Metadata } from 'next'
import Link from 'next/link'
import { getRenderableOccasions } from '@/lib/comparison'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Blommor för olika tillfällen',
  description:
    'Vad passar till begravning, födelsedag eller en nyfödd? Etikett, blomval och korttexter per tillfälle.',
  alternates: { canonical: 'https://skickablomma.se/tillfalle' },
}

/**
 * Hubben listar bara de tillfällen som faktiskt har en publicerad sida.
 * Resterande sex ligger i fas 3 enligt roadmapen och läggs till i
 * data/occasions.json allteftersom.
 */
export default function TillfalleHubPage() {
  const occasions = getRenderableOccasions()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Start', href: '/' },
          { label: 'Tillfällen', href: '/tillfalle' },
        ]}
      />

      <header className="mt-6 space-y-4">
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
          Blommor för olika tillfällen
        </h1>
        <p className="text-lg leading-relaxed text-gray-800">
          Vilka blommor som passar beror mindre på smak än på sammanhang. Här går vi igenom
          vad som är brukligt vid varje tillfälle, vad du skriver på kortet och när
          beställningen behöver ligga inne.
        </p>
      </header>

      <section className="mt-8">
        {occasions.length === 0 ? (
          <p className="text-gray-600">Inga tillfällen är publicerade ännu.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {occasions.map((occasion) => (
              <li key={occasion.slug}>
                <Link
                  href={`/tillfalle/${occasion.slug}`}
                  className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-400"
                >
                  <span className="font-medium text-gray-900">{occasion.name}</span>
                  <span className="mt-1 block text-sm text-gray-500">
                    {occasion.page.metaDescription}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
