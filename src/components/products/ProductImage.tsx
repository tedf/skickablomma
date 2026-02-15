'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function ProductImage({ src, alt, className = 'object-cover', priority = false }: ProductImageProps) {
  const [error, setError] = useState(false)

  return (
    <Image
      src={error ? '/images/placeholders/flower-placeholder.svg' : src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      onError={() => setError(true)}
    />
  )
}
