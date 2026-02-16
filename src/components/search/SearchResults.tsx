import { ProductFilters, SortOption } from '@/types'
import { searchProducts } from '@/lib/products'
import { ProductCard } from '@/components/products/ProductCard'
import { SearchSort } from './SearchSort'
import { Pagination } from '@/components/ui/Pagination'

interface SearchResultsProps {
  filters: Partial<ProductFilters>
  sortBy: SortOption
  page: number
}

export async function SearchResults({ filters, sortBy, page }: SearchResultsProps) {
  const results = await searchProducts(filters as ProductFilters, page, 12)

  if (results.totalCount === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Inga resultat hittades
        </h3>
        <p className="text-gray-600">
          {filters.query
            ? `Vi kunde inte hitta några blommor som matchar "${filters.query}".`
            : 'Försök ändra dina filter för att se fler resultat.'}
        </p>
        <div className="mt-6">
          <a
            href="/buketter"
            className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Utforska alla buketter
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {filters.query ? (
              <>Sökresultat för "{filters.query}"</>
            ) : (
              <>Alla blommor</>
            )}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {results.totalCount} produkter hittades
          </p>
        </div>
        <SearchSort currentSort={sortBy} />
      </div>

      {/* Produkter */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {results.products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            listType="search"
            position={index + (page - 1) * 12}
          />
        ))}
      </div>

      {/* Paginering */}
      {results.pagination.totalPages > 1 && (
        <Pagination
          currentPage={results.pagination.page}
          totalPages={results.pagination.totalPages}
          basePath="/sok"
        />
      )}
    </div>
  )
}
