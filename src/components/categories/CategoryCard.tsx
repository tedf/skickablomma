import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/types'
import { cn } from '@/lib/utils'
import {
  Building2,
  Church,
  Clock,
  Flower2,
  Gift,
  Leaf,
  PartyPopper,
  Sparkles,
  Sprout,
  Tag,
  type LucideIcon,
} from 'lucide-react'

interface CategoryCardProps {
  category: Category
  size?: 'small' | 'medium' | 'large'
}

/*
  Tidigare låg åtta godtyckliga regnbågsgradienter här — rosa, lila, röd,
  blå. De var ren dekor och drog sajten mot e-handel. Korten skiljs nu åt
  med djup i varumärkesskalan i stället för med kulör. Ett enda undantag:
  begravning får den dovaste tonen, eftersom sammanhanget kräver det.
*/
const categoryGradients: Record<string, string> = {
  buketter: 'from-brand-400 to-brand-600',
  begravning: 'from-brand-800 to-brand-900',
  brollop: 'from-brand-300 to-brand-500',
  foretag: 'from-brand-600 to-brand-800',
  presenter: 'from-signal-400 to-signal-600',
  'lokar-och-fron': 'from-leaf-200 to-leaf-400',
  'dukning-och-fest': 'from-petal-200 to-petal-400',
  'samma-dag-leverans': 'from-signal-500 to-signal-700',
  budget: 'from-brand-500 to-brand-700',
}

/*
  Emojier ersatta med linjeikoner. 💐 💍 🎁 💚 läser som present- och
  bröllopsbutik, vilket är precis den avsändare sajten inte ska ha.
*/
const categoryIcons: Record<string, LucideIcon> = {
  buketter: Flower2,
  begravning: Leaf,
  brollop: Church,
  foretag: Building2,
  presenter: Gift,
  'lokar-och-fron': Sprout,
  'dukning-och-fest': PartyPopper,
  'samma-dag-leverans': Clock,
  budget: Tag,
}

export function CategoryCard({ category, size = 'medium' }: CategoryCardProps) {
  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-[4/5]',
    large: 'aspect-[3/4]',
  }

  const gradient = categoryGradients[category.id] || 'from-brand-500 to-brand-700'
  const Icon = categoryIcons[category.id] ?? Flower2

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
          <Icon className="absolute right-4 top-4 h-12 w-12 text-white opacity-25" aria-hidden />
        </div>
      )}

      {/* Overlay */}
      <div className="category-card-overlay" />

      {/* Innehåll */}
      <div className="category-card-content">
        <Icon className="mb-1.5 h-5 w-5" aria-hidden />
        <h3 className="font-display text-lg md:text-xl">
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
