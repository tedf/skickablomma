'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Category } from '@/types'

interface CategoryFiltersProps {
  category: Category
}

const PRICE_RANGES = [
  { id: 'all', label: 'Alla priser', min: undefined, max: undefined },
  { id: 'under-300', label: 'Under 300 kr', min: 0, max: 299 },
  { id: '300-500', label: '300-500 kr', min: 300, max: 500 },
  { id: '500-700', label: '500-700 kr', min: 500, max: 700 },
  { id: 'over-700', label: 'Över 700 kr', min: 700, max: undefined },
]

const COLORS = [
  { id: 'röd', label: 'Röd', color: '#dc2626' },
  { id: 'rosa', label: 'Rosa', color: '#ec4899' },
  { id: 'vit', label: 'Vit', color: '#ffffff', border: true },
  { id: 'gul', label: 'Gul', color: '#eab308' },
  { id: 'lila', label: 'Lila', color: '#9333ea' },
  { id: 'orange', label: 'Orange', color: '#f97316' },
]

export function CategoryFilters({ category }: CategoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceExpanded, setPriceExpanded] = useState(true)
  const [colorExpanded, setColorExpanded] = useState(true)

  const currentPriceMin = searchParams.get('pris_min')
  const currentPriceMax = searchParams.get('pris_max')
  const currentColors = searchParams.get('farg')?.split(',') || []

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/${category.slug}?${params.toString()}`)
  }

  const handlePriceChange = (min?: number, max?: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min !== undefined) {
      params.set('pris_min', String(min))
    } else {
      params.delete('pris_min')
    }
    if (max !== undefined) {
      params.set('pris_max', String(max))
    } else {
      params.delete('pris_max')
    }
    router.push(`/${category.slug}?${params.toString()}`)
  }

  const handleColorToggle = (colorId: string) => {
    const newColors = currentColors.includes(colorId)
      ? currentColors.filter((c) => c !== colorId)
      : [...currentColors, colorId]

    if (newColors.length > 0) {
      updateFilters('farg', newColors.join(','))
    } else {
      updateFilters('farg', null)
    }
  }

  const getPriceRangeId = () => {
    if (!currentPriceMin && !currentPriceMax) return 'all'
    const min = currentPriceMin ? parseInt(currentPriceMin) : undefined
    const max = currentPriceMax ? parseInt(currentPriceMax) : undefined

    const match = PRICE_RANGES.find(
      (r) => r.min === min && r.max === max
    )
    return match?.id || 'all'
  }

  return (
    <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Filter</h2>

      {/* Pris */}
      <div className="border-b pb-4">
        <button
          onClick={() => setPriceExpanded(!priceExpanded)}
          className="flex w-full items-center justify-between py-2"
        >
          <span className="text-sm font-medium text-gray-900">Pris</span>
          {priceExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {priceExpanded && (
          <div className="mt-3 space-y-2">
            {PRICE_RANGES.map((range) => (
              <label key={range.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="pris"
                  checked={getPriceRangeId() === range.id}
                  onChange={() => handlePriceChange(range.min, range.max)}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Färg */}
      <div className="mt-4 border-b pb-4">
        <button
          onClick={() => setColorExpanded(!colorExpanded)}
          className="flex w-full items-center justify-between py-2"
        >
          <span className="text-sm font-medium text-gray-900">Färg</span>
          {colorExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {colorExpanded && (
          <div className="mt-3 flex flex-wrap gap-2">
            {COLORS.map((color) => {
              const isSelected = currentColors.includes(color.id)
              return (
                <button
                  key={color.id}
                  onClick={() => handleColorToggle(color.id)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110',
                    isSelected && 'ring-2 ring-primary ring-offset-2',
                    color.border && 'border border-gray-300'
                  )}
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                >
                  {isSelected && (
                    <svg
                      className={cn(
                        'h-4 w-4',
                        color.id === 'vit' ? 'text-gray-800' : 'text-white'
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Rensa filter */}
      {(currentPriceMin || currentPriceMax || currentColors.length > 0) && (
        <button
          onClick={() => router.push(`/${category.slug}`)}
          className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Rensa filter
        </button>
      )}
    </div>
  )
}
