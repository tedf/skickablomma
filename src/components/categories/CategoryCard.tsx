import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/types'
import { cn } from '@/lib/utils'

interface CategoryCardProps {
  category: Category
  size?: 'small' | 'medium' | 'large'
}

const categoryGradients: Record<string, string> = {
  buketter: 'from-pink-400 to-rose-500',
  begravning: 'from-gray-500 to-gray-700',
  brollop: 'from-purple-300 to-pink-400',
  foretag: 'from-blue-400 to-indigo-500',
  presenter: 'from-amber-400 to-orange-500',
  'konstgjorda-blommor': 'from-emerald-400 to-teal-500',
  'samma-dag-leverans': 'from-red-400 to-rose-500',
  budget: 'from-green-400 to-emerald-500',
}

const categoryEmojis: Record<string, string> = {
  buketter: '💐',
  begravning: '🌿',
  brollop: '💍',
  foretag: '🏢',
  presenter: '🎁',
  'konstgjorda-blommor': '🌸',
  'samma-dag-leverans': '⚡',
  budget: '💚',
}

export function CategoryCard({ category, size = 'medium' }: CategoryCardProps) {
  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-[4/5]',
    large: 'aspect-[3/4]',
  }

  const gradient = categoryGradients[category.id] || 'from-primary to-primary/70'
  const emoji = categoryEmojis[category.id] || '🌷'

  return (
    <Link
      href={`/${category.slug}`}
      className={cn('category-card', sizeClasses[size])}
    >
      {/* Bakgrundsbild eller gradient */}
      {category.imageAsset?.url ? (
        <Image
          src={category.imageAsset.url}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className={cn('absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105', gradient)}>
          <span className="absolute right-4 top-4 text-5xl opacity-30">{emoji}</span>
        </div>
      )}

      {/* Overlay */}
      <div className="category-card-overlay" />

      {/* Innehåll */}
      <div className="category-card-content">
        <div className="mb-1 text-2xl">{emoji}</div>
        <h3 className="font-display text-lg font-bold md:text-xl">
          {category.namePlural}
        </h3>
        {category.productCount > 0 && (
          <p className="mt-1 text-sm text-white/80">
            {category.productCount} produkter
          </p>
        )}
      </div>
    </Link>
  )
}
