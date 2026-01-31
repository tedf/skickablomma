import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/types'
import { cn } from '@/lib/utils'

interface CategoryCardProps {
  category: Category
  size?: 'small' | 'medium' | 'large'
}

// Platshållarbilder för kategorier
const categoryImages: Record<string, string> = {
  buketter: '/images/categories/buketter.jpg',
  begravning: '/images/categories/begravning.jpg',
  brollop: '/images/categories/brollop.jpg',
  foretag: '/images/categories/foretag.jpg',
  presenter: '/images/categories/presenter.jpg',
  'konstgjorda-blommor': '/images/categories/konstgjorda.jpg',
  'samma-dag-leverans': '/images/categories/express.jpg',
  budget: '/images/categories/budget.jpg',
}

export function CategoryCard({ category, size = 'medium' }: CategoryCardProps) {
  const imageUrl = category.imageAsset?.url || categoryImages[category.id] || '/images/categories/default.jpg'

  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-[4/5]',
    large: 'aspect-[3/4]',
  }

  return (
    <Link
      href={`/${category.slug}`}
      className={cn('category-card', sizeClasses[size])}
    >
      {/* Bakgrundsbild */}
      <Image
        src={imageUrl}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="category-card-overlay" />

      {/* Innehåll */}
      <div className="category-card-content">
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
