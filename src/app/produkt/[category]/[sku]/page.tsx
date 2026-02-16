import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getProductBySku, getRelatedProducts } from '@/lib/products'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ProductCard } from '@/components/products/ProductCard'
import { getCategoryBySlug } from '@/data/categories'
import { PARTNERS } from '@/data/partners'

interface ProductPageProps {
  params: {
    category: string
    sku: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySku(params.sku)

  if (!product) {
    return {
      title: 'Produkt inte hittad | Skicka Blomma',
    }
  }

  return {
    title: `${product.name} | Skicka Blomma`,
    description: product.shortDescription,
    alternates: {
      canonical: `https://skickablomma.se/produkt/${params.category}/${params.sku}`,
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `https://skickablomma.se/produkt/${params.category}/${params.sku}`,
      type: 'website',
      images: product.primaryImage ? [product.primaryImage.url] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySku(params.sku)

  if (!product) {
    notFound()
  }

  const category = getCategoryBySlug(params.category)
  const partner = PARTNERS[product.partnerId as keyof typeof PARTNERS]
  const partnerName = partner?.displayName || product.brand
  const relatedProducts = await getRelatedProducts(product, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: 'Hem', href: '/' },
              { label: category?.namePlural || 'Produkter', href: `/${params.category}` },
              { label: product.name, href: `/produkt/${params.category}/${params.sku}` },
            ]}
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-sm">
            {product.primaryImage ? (
              <Image
                src={product.primaryImage.url}
                alt={product.primaryImage.altTextSv || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100">
                <p className="text-gray-400">Ingen bild tillgänglig</p>
              </div>
            )}

            {product.discountPercent && product.discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{product.discountPercent}%
              </div>
            )}

            {product.sameDayDelivery && (
              <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                Samma dag
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <h1 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              {product.originalPrice && product.originalPrice > product.price ? (
                <>
                  <span className="text-3xl font-bold text-red-600">
                    {product.price} kr
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice} kr
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {product.price} kr
                </span>
              )}
            </div>

            {product.shipping > 0 && (
              <p className="text-sm text-gray-600">
                + {product.shipping} kr frakt
              </p>
            )}

            <div className="prose prose-gray max-w-none">
              {product.description.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                <p key={i} className="text-lg text-gray-700 mb-2">{paragraph}</p>
              ))}
            </div>

            {/* Attributes */}
            <div className="space-y-3 border-t pt-6">
              {product.attributes.colors && product.attributes.colors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Färger:</span>
                  <div className="flex gap-2">
                    {product.attributes.colors.map((color) => (
                      <span
                        key={color}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.attributes.size && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Storlek:</span>
                  <span className="text-sm text-gray-600">{product.attributes.size}</span>
                </div>
              )}

              {product.deliveryDays && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Leveranstid:</span>
                  <span className="text-sm text-gray-600">
                    {product.sameDayDelivery ? 'Samma dag' : `${product.deliveryDays} dagar`}
                  </span>
                </div>
              )}

              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">I lager</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-sm font-medium">Tillfälligt slut</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="border-t pt-6">
              <a
                href={product.trackingUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="cta-button block w-full text-center"
              >
                Köp hos {partnerName}
              </a>
              <p className="mt-3 text-center text-xs text-gray-500">
                Du kommer till vår partner {partnerName}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold text-gray-900">
              Liknande produkter
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  listType="related"
                  position={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
