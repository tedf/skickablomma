'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const searchParams = useSearchParams()

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sida', String(page))
    return `${basePath}?${params.toString()}`
  }

  // Beräkna vilka sidnummer som ska visas
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const delta = 2 // Antal sidor att visa på varje sida av nuvarande sida

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis')
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Paginering"
    >
      {/* Föregående */}
      <Link
        href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
          currentPage > 1
            ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
        )}
        aria-disabled={currentPage <= 1}
        aria-label="Föregående sida"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      {/* Sidnummer */}
      {pageNumbers.map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-10 w-10 items-center justify-center text-gray-500"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
              page === currentPage
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            )}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* Nästa */}
      <Link
        href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
          currentPage < totalPages
            ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
        )}
        aria-disabled={currentPage >= totalPages}
        aria-label="Nästa sida"
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  )
}
