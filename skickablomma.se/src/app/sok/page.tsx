import { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchHeader } from '@/components/search/SearchHeader'

interface SearchPageProps {
  searchParams: {
    q?: string
    kategori?: string
    pris_min?: string
    pris_max?: string
    farg?: string
    partner?: string
    samma_dag?: string
    sortera?: string
    sida?: string
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q

  if (query) {
    return {
      title: `Sökresultat för "${query}" | Skicka Blomma`,
      description: `Hitta blommor som matchar "${query}". Jämför priser från flera butiker och hitta den perfekta buketten.`,
      robots: {
        index: false, // Indexera inte söksidor
      },
    }
  }

  return {
    title: 'Sök blommor | Skicka Blomma',
    description: 'Sök bland hundratals buketter och blommor. Filtrera på pris, färg, tillfälle och mer.',
    robots: {
      index: false,
    },
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const filters = {
    query: searchParams.q,
    mainCategory: searchParams.kategori as any,
    priceMin: searchParams.pris_min ? parseInt(searchParams.pris_min) : undefined,
    priceMax: searchParams.pris_max ? parseInt(searchParams.pris_max) : undefined,
    colors: searchParams.farg?.split(','),
    partners: searchParams.partner?.split(',') as any,
    sameDayOnly: searchParams.samma_dag === 'true',
  }

  const sortBy = searchParams.sortera || 'popularity'
  const page = searchParams.sida ? parseInt(searchParams.sida) : 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header med sökfält */}
      <SearchHeader initialQuery={searchParams.q} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar med filter */}
          <aside className="w-full lg:w-64 lg:flex-shrink-0">
            <SearchFilters initialFilters={filters} />
          </aside>

          {/* Resultat */}
          <main className="flex-1">
            <Suspense fallback={<SearchResultsSkeleton />}>
              <SearchResults
                filters={filters}
                sortBy={sortBy as any}
                page={page}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
            <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
