'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SortOption } from '@/types'

interface SearchSortProps {
  currentSort: SortOption
}

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularitet' },
  { value: 'price_asc', label: 'Pris (lägst först)' },
  { value: 'price_desc', label: 'Pris (högst först)' },
  { value: 'newest', label: 'Nyast' },
  { value: 'discount', label: 'Rabatt' },
]

export function SearchSort({ currentSort }: SearchSortProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortera', value)
    params.delete('sida') // Reset page on sort change
    router.push(`/sok?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-500">
        Sortera:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
