'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchHeaderProps {
  initialQuery?: string
}

export function SearchHeader({ initialQuery }: SearchHeaderProps) {
  const [query, setQuery] = useState(initialQuery || '')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/sok?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const clearSearch = () => {
    setQuery('')
    router.push('/sok')
  }

  return (
    <div className="border-b bg-white py-6">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök efter blommor, buketter, rosor..."
              className="w-full rounded-full border-2 border-gray-200 bg-white py-4 pl-12 pr-24 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Sök blommor"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-20 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Rensa sökning"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Sök
            </button>
          </div>
        </form>

        {/* Populära sökningar */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-gray-500">Populärt:</span>
          {['rosor', 'tulpaner', 'begravning', 'mors dag', 'under 300 kr'].map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term)
                router.push(`/sok?q=${encodeURIComponent(term)}`)
              }}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
