'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ExternalLink, Truck, Clock, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product, ImageSourceType } from '@/types'
import { PARTNERS } from '@/data/partners'
import { trackProductClick } from '@/lib/analytics'

interface ProductCardProps {
  product: Product
  showDeliveryBadge?: boolean
  listType?: 'category' | 'search' | 'wizard' | 'related' | 'homepage'
  position?: number
}

// Bildkälla-indikator (konfigurerbart via IMAGE_CONFIG)
const showImageSourceIndicator = process.env.NODE_ENV === 'development'

const imageSourceLabels: Record<ImageSourceType, string> = {
  partner: 'Produktbild',
  royalty_free: 'Stockbild',
  generated: 'Illustrationsbild',
  placeholder: 'Bild saknas',
}

const imageSourceStyles: Record<ImageSourceType, string> = {
  partner: 'image-source-partner',
  royalty_free: 'image-source-royalty-free',
  generated: 'image-source-generated',
  placeholder: 'image-source-placeholder',
}

export function ProductCard({
  product,
  showDeliveryBadge = false,
  listType = 'category',
  position = 0,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const partner = PARTNERS[product.partnerId]
  const hasDiscount = product.discountPercent && product.discountPercent > 0

  const handleClick = () => {
    trackProductClick({
      productId: product.id,
      partnerId: product.partnerId,
      trackingUrl: product.trackingUrl,
      position,
      listType,
      imageSourceType: product.primaryImage.sourceType,
      timestamp: new Date(),
    })
  }

  const productUrl = `/produkt/${product.mainCategory}/${product.sku}`

  return (
    <article
      className="product-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bild */}
      <Link href={productUrl} className="product-card-image" onClick={handleClick}>
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {hasDiscount && (
            <span className="product-card-badge product-card-badge-sale">
              -{product.discountPercent}%
            </span>
          )}
          {product.sameDayDelivery && (
            <span className="product-card-badge product-card-badge-express">
              <Clock className="mr-1 inline h-3 w-3" />
              Idag
            </span>
          )}
        </div>

        {/* Partner logo */}
        <div className="absolute right-3 top-3 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partner.logoUrl}
            alt={partner.displayName}
            className="h-5 w-auto rounded bg-white/90 px-2 py-1"
          />
        </div>

        {/* Bildkälla-indikator (endast i dev) */}
        {showImageSourceIndicator && (
          <span
            className={cn(
              'image-source-indicator',
              imageSourceStyles[product.primaryImage.sourceType]
            )}
          >
            {imageSourceLabels[product.primaryImage.sourceType]}
          </span>
        )}

        {/* Produktbild */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageError ? '/images/placeholders/flower-placeholder.svg' : product.primaryImage.url}
            alt={product.primaryImage.altTextSv}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-500',
              isHovered && 'scale-105'
            )}
            onError={() => setImageError(true)}
          />

          {/* Illustrationsbild-märkning för AI-genererade bilder */}
          {product.primaryImage.sourceType === 'generated' && (
            <div className="absolute bottom-0 left-0 right-0 bg-purple-900/80 px-2 py-1 text-center text-xs text-white">
              Illustrationsbild
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4">
        {/* Namn */}
        <Link href={productUrl} onClick={handleClick}>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Pris */}
        <div>
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="price-discount">{product.price} kr</span>
              <span className="price-original">{product.originalPrice} kr</span>
            </div>
          ) : (
            <span className="price-display">{product.price} kr</span>
          )}
          <p className="mt-0.5 text-xs text-gray-500">
            Totalt: {product.price + product.shipping} kr{product.shipping === 0 ? ' (fri frakt)' : ` inkl. ${product.shipping} kr frakt`}
          </p>
        </div>

        {/* Leveransinfo */}
        {product.sameDayDelivery && (
          <div className="flex items-center gap-1 rounded-md bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary-700">
            <Truck className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Leverans idag – beställ före {partner.deliveryInfo.sameDayCutoff}</span>
          </div>
        )}

        {/* CTA */}
        <a
          href={product.trackingUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="cta-button cta-button-gradient w-full py-3 text-sm font-bold"
          onClick={handleClick}
        >
          Köp hos {partner.displayName}
          <ExternalLink className="ml-2 h-4 w-4 flex-shrink-0" />
        </a>
      </div>
    </article>
  )
}
