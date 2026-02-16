'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { Product } from '@/types'
import { cn } from '@/lib/utils'

type FlowerType = 'snittblommor' | 'konstgjorda' | 'lokar'

interface FlowerTypeToggleProps {
  snittblommor: Product[]
  konstgjorda: Product[]
  lokar: Product[]
}

const tabs: { id: FlowerType; label: string; emoji: string; description: string; href: string }[] = [
  {
    id: 'snittblommor',
    label: 'Snittblommor',
    emoji: '💐',
    description: 'Färska buketter & arrangemang',
    href: '/buketter',
  },
  {
    id: 'konstgjorda',
    label: 'Konstgjorda',
    emoji: '🌸',
    description: 'Håller för alltid – ingen skötsel',
    href: '/konstgjorda-blommor',
  },
  {
    id: 'lokar',
    label: 'Lökar & Frön',
    emoji: '🌱',
    description: 'Plantera egna blommor',
    href: '/sok?q=lökar',
  },
]

export function FlowerTypeToggle({ snittblommor, konstgjorda, lokar }: FlowerTypeToggleProps) {
  const [selected, setSelected] = useState<FlowerType>('snittblommor')

  const products: Record<FlowerType, Product[]> = { snittblommor, konstgjorda, lokar }
  const activeTab = tabs.find((t) => t.id === selected)!

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900">
            Populära produkter
          </h2>
          <p className="mt-2 text-gray-500">Välj vad du letar efter</p>
        </div>

        {/* Tab switcher */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-2xl bg-gray-100 p-1.5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelected(tab.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200',
                  selected === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <span className="text-lg">{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active tab description + link */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">{activeTab.description}</p>
          <Link
            href={activeTab.href}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Visa alla
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products[selected].map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              showDeliveryBadge
              listType="homepage"
              position={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
