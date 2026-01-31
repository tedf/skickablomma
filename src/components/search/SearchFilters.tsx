'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductFilters, MainCategory, Partner } from '@/types'
import { MAIN_CATEGORIES } from '@/data/categories'
import { PARTNERS } from '@/data/partners'
import { trackFilterChange } from '@/lib/analytics'

interface SearchFiltersProps {
  initialFilters: Partial<ProductFilters>
}

const COLORS = [
  { id: 'röd', name: 'Röd', color: '#dc2626' },
  { id: 'rosa', name: 'Rosa', color: '#ec4899' },
  { id: 'vit', name: 'Vit', color: '#ffffff', border: true },
  { id: 'gul', name: 'Gul', color: '#eab308' },
  { id: 'lila', name: 'Lila', color: '#9333ea' },
  { id: 'orange', name: 'Orange', color: '#f97316' },
  { id: 'blå', name: 'Blå', color: '#3b82f6' },
]

const PRICE_RANGES = [
  { id: 'under-300', label: 'Under 300 kr', min: 0, max: 299 },
  { id: '300-500', label: '300-500 kr', min: 300, max: 500 },
  { id: '500-700', label: '500-700 kr', min: 500, max: 700 },
  { id: 'over-700', label: 'Över 700 kr', min: 700, max: undefined },
]

export function SearchFilters({ initialFilters }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Filter states
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'kategori',
    'pris',
    'farg',
    'leverans',
  ])

  // Current filters
  const [filters, setFilters] = useState<Partial<ProductFilters>>(initialFilters)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const updateFilter = (key: string, value: unknown) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
    trackFilterChange(key, String(value))
  }

  const applyFilters = (newFilters: Partial<ProductFilters>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Uppdatera params
    if (newFilters.query) params.set('q', newFilters.query)
    else params.delete('q')

    if (newFilters.mainCategory) params.set('kategori', newFilters.mainCategory)
    else params.delete('kategori')

    if (newFilters.priceMin) params.set('pris_min', String(newFilters.priceMin))
    else params.delete('pris_min')

    if (newFilters.priceMax) params.set('pris_max', String(newFilters.priceMax))
    else params.delete('pris_max')

    if (newFilters.colors?.length) params.set('farg', newFilters.colors.join(','))
    else params.delete('farg')

    if (newFilters.partners?.length) params.set('partner', newFilters.partners.join(','))
    else params.delete('partner')

    if (newFilters.sameDayOnly) params.set('samma_dag', 'true')
    else params.delete('samma_dag')

    // Reset page
    params.delete('sida')

    router.push(`/sok?${params.toString()}`)
  }

  const clearFilters = () => {
    const query = searchParams.get('q')
    setFilters({ query: query || undefined })
    router.push(query ? `/sok?q=${query}` : '/sok')
  }

  const activeFilterCount = [
    filters.mainCategory,
    filters.priceMin || filters.priceMax,
    filters.colors?.length,
    filters.partners?.length,
    filters.sameDayOnly,
  ].filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Aktiva filter */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between border-b pb-4">
          <span className="text-sm font-medium text-gray-700">
            {activeFilterCount} filter aktiva
          </span>
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Rensa alla
          </button>
        </div>
      )}

      {/* Kategori */}
      <FilterSection
        title="Kategori"
        id="kategori"
        expanded={expandedSections.includes('kategori')}
        onToggle={() => toggleSection('kategori')}
      >
        <div className="space-y-2">
          {Object.values(MAIN_CATEGORIES).map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="kategori"
                checked={filters.mainCategory === category.id}
                onChange={() =>
                  updateFilter(
                    'mainCategory',
                    filters.mainCategory === category.id ? undefined : category.id
                  )
                }
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{category.namePlural}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Pris */}
      <FilterSection
        title="Pris"
        id="pris"
        expanded={expandedSections.includes('pris')}
        onToggle={() => toggleSection('pris')}
      >
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.id}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="pris"
                checked={
                  filters.priceMin === range.min &&
                  filters.priceMax === range.max
                }
                onChange={() => {
                  updateFilter('priceMin', range.min)
                  updateFilter('priceMax', range.max)
                }}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Färg */}
      <FilterSection
        title="Färg"
        id="farg"
        expanded={expandedSections.includes('farg')}
        onToggle={() => toggleSection('farg')}
      >
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const isSelected = filters.colors?.includes(color.id)
            return (
              <button
                key={color.id}
                onClick={() => {
                  const newColors = isSelected
                    ? filters.colors?.filter((c) => c !== color.id)
                    : [...(filters.colors || []), color.id]
                  updateFilter('colors', newColors?.length ? newColors : undefined)
                }}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110',
                  isSelected && 'ring-2 ring-primary ring-offset-2',
                  color.border && 'border border-gray-300'
                )}
                style={{ backgroundColor: color.color }}
                aria-label={color.name}
                title={color.name}
              >
                {isSelected && (
                  <svg
                    className={cn(
                      'h-5 w-5',
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
      </FilterSection>

      {/* Partner */}
      <FilterSection
        title="Butik"
        id="partner"
        expanded={expandedSections.includes('partner')}
        onToggle={() => toggleSection('partner')}
      >
        <div className="space-y-2">
          {Object.values(PARTNERS).map((partner) => {
            const isSelected = filters.partners?.includes(partner.id)
            return (
              <label
                key={partner.id}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    const newPartners = isSelected
                      ? filters.partners?.filter((p) => p !== partner.id)
                      : [...(filters.partners || []), partner.id]
                    updateFilter(
                      'partners',
                      newPartners?.length ? newPartners : undefined
                    )
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{partner.displayName}</span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Leverans */}
      <FilterSection
        title="Leverans"
        id="leverans"
        expanded={expandedSections.includes('leverans')}
        onToggle={() => toggleSection('leverans')}
      >
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={filters.sameDayOnly}
            onChange={() => updateFilter('sameDayOnly', !filters.sameDayOnly)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">Leverans samma dag</span>
        </label>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Desktop filter */}
      <div className="sticky top-24 hidden rounded-xl bg-white p-6 shadow-sm lg:block">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Filter</h2>
        <FilterContent />
      </div>

      {/* Mobile filter button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-white shadow-lg lg:hidden"
      >
        <Filter className="h-5 w-5" />
        Filter
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile filter modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterContent />
            <div className="mt-6 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 rounded-full border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Rensa
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90"
              >
                Visa resultat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface FilterSectionProps {
  title: string
  id: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({
  title,
  id,
  expanded,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2"
        aria-expanded={expanded}
        aria-controls={`filter-${id}`}
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {expanded && (
        <div id={`filter-${id}`} className="mt-3">
          {children}
        </div>
      )}
    </div>
  )
}
