'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Category } from '@/types'

interface CategoryFiltersProps {
  category: Category
  availableColors?: string[]
}

const PRICE_RANGES = [
  { id: 'all', label: 'Alla priser', min: undefined, max: undefined },
  { id: 'under-300', label: 'Under 300 kr', min: 0, max: 299 },
  { id: '300-500', label: '300-500 kr', min: 300, max: 500 },
  { id: '500-700', label: '500-700 kr', min: 500, max: 700 },
  { id: 'over-700', label: 'Över 700 kr', min: 700, max: undefined },
]

// Färgkonfiguration med hex-värden
const COLOR_CONFIG: Record<string, { label: string; color: string; border?: boolean }> = {
  'röd': { label: 'Röd', color: '#dc2626' },
  'rosa': { label: 'Rosa', color: '#ec4899' },
  'vit': { label: 'Vit', color: '#ffffff', border: true },
  'gul': { label: 'Gul', color: '#eab308' },
  'lila': { label: 'Lila', color: '#9333ea' },
  'orange': { label: 'Orange', color: '#f97316' },
  'blå': { label: 'Blå', color: '#2563eb' },
  'grön': { label: 'Grön', color: '#16a34a' },
  'brun': { label: 'Brun', color: '#92400e' },
  'svart': { label: 'Svart', color: '#1f2937' },
  'flerfärgad': { label: 'Flerfärgad', color: 'linear-gradient(135deg, #dc2626, #eab308, #16a34a, #2563eb)' },
}

// Fallback om availableColors inte skickas
const DEFAULT_COLORS = ['röd', 'rosa', 'vit', 'gul', 'lila', 'orange']

export function CategoryFilters({ category, availableColors }: CategoryFiltersProps) {
  // Använd tillgängliga färger eller fallback till default
  const colorsToShow = availableColors && availableColors.length > 0
    ? availableColors.filter((c) => COLOR_CONFIG[c])
    : DEFAULT_COLORS
  const router = useRouter()
  const searchParams = useSearchParams()

  const [mobileOpen, setMobileOpen] = useState(false)
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

  const activeFilterCount = (currentColors.length > 0 ? 1 : 0) + (currentPriceMin || currentPriceMax ? 1 : 0)

  const filterContent = (
    <>
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
            {colorsToShow.map((colorId) => {
              const colorConfig = COLOR_CONFIG[colorId]
              if (!colorConfig) return null
              const isSelected = currentColors.includes(colorId)
              return (
                <button
                  key={colorId}
                  onClick={() => handleColorToggle(colorId)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110',
                    isSelected && 'ring-2 ring-primary ring-offset-2',
                    colorConfig.border && 'border border-gray-300'
                  )}
                  style={{
                    background: colorConfig.color.includes('gradient')
                      ? colorConfig.color
                      : colorConfig.color
                  }}
                  title={colorConfig.label}
                >
                  {isSelected && (
                    <svg
                      className={cn(
                        'h-4 w-4',
                        colorId === 'vit' ? 'text-gray-800' : 'text-white'
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
          onClick={() => {
            router.push(`/${category.slug}`)
            setMobileOpen(false)
          }}
          className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Rensa filter
        </button>
      )}
    </>
  )

  return (
    <>
      {/* Mobile: Toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile: Slide-up drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90"
            >
              Visa {searchParams.toString() ? 'resultat' : 'produkter'}
            </button>
          </div>
        </div>
      )}

      {/* Desktop: Sticky sidebar */}
      <div className="sticky top-24 hidden rounded-xl bg-white p-6 shadow-sm lg:block">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Filter</h2>
        {filterContent}
      </div>
    </>
  )
}
