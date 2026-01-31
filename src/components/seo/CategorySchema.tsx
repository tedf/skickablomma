import { Category, Product } from '@/types'

interface CategorySchemaProps {
  category: Category
  products: Product[]
}

export function CategorySchema({ category, products }: CategorySchemaProps) {
  // CollectionPage schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.namePlural,
    description: category.description,
    url: `https://skickablomma.se/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.shortDescription,
          image: product.primaryImage.url,
          url: `https://skickablomma.se/produkt/${product.mainCategory}/${product.sku}`,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'SEK',
            availability: product.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: product.brand,
            },
          },
        },
      })),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
    />
  )
}
