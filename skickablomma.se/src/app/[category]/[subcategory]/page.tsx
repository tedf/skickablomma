import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getCategoryBySlug,
  MAIN_CATEGORIES,
  SUB_CATEGORIES,
  getMainCategory,
  getSubCategory
} from '@/data/categories'
import { searchProducts, getAvailableColors } from '@/lib/products'
import { ProductCard } from '@/components/products/ProductCard'
import { CategoryFilters } from '@/components/categories/CategoryFilters'
import { FAQSection } from '@/components/content/FAQSection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CategorySchema } from '@/components/seo/CategorySchema'
import { SortSelect } from '@/components/categories/SortSelect'
import { MainCategory, SubCategory as SubCategoryType } from '@/types'

interface SubCategoryPageProps {
  params: {
    category: string
    subcategory: string
  }
  searchParams: {
    farg?: string
    pris_min?: string
    pris_max?: string
    partner?: string
    sortera?: string
    sida?: string
  }
}

// Hitta huvudkategori för en underkategori
function findParentCategory(subcategorySlug: string): MainCategory | null {
  for (const [subId, subCat] of Object.entries(SUB_CATEGORIES)) {
    if (subCat.slug === subcategorySlug && subCat.parentCategory) {
      return subCat.parentCategory
    }
  }
  return null
}

// Hitta underkategori-ID från slug
function getSubCategoryIdFromSlug(slug: string): SubCategoryType | null {
  for (const [subId, subCat] of Object.entries(SUB_CATEGORIES)) {
    if (subCat.slug === slug) {
      return subId as SubCategoryType
    }
  }
  return null
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const parentCategory = getCategoryBySlug(params.category)
  const subCategoryId = getSubCategoryIdFromSlug(params.subcategory)

  if (!parentCategory || !subCategoryId) {
    return {
      title: 'Kategori inte hittad | Skicka Blomma',
    }
  }

  const subCategory = SUB_CATEGORIES[subCategoryId]

  return {
    title: subCategory.metaTitle,
    description: subCategory.metaDescription,
    alternates: {
      canonical: `https://skickablomma.se/${params.category}/${params.subcategory}`,
    },
    openGraph: {
      title: subCategory.metaTitle,
      description: subCategory.metaDescription,
      url: `https://skickablomma.se/${params.category}/${params.subcategory}`,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = []

  // Generera params för alla underkategorier med deras föräldrakategori
  for (const [subId, subCat] of Object.entries(SUB_CATEGORIES)) {
    if (subCat.parentCategory) {
      const parentCat = MAIN_CATEGORIES[subCat.parentCategory]
      if (parentCat) {
        params.push({
          category: parentCat.slug,
          subcategory: subCat.slug,
        })
      }
    }
  }

  return params
}

export default async function SubCategoryPage({ params, searchParams }: SubCategoryPageProps) {
  const parentCategory = getCategoryBySlug(params.category)
  const subCategoryId = getSubCategoryIdFromSlug(params.subcategory)

  if (!parentCategory || !subCategoryId) {
    notFound()
  }

  const subCategory = SUB_CATEGORIES[subCategoryId]

  // Verifiera att underkategorin tillhör rätt föräldrakategori
  if (subCategory.parentCategory !== parentCategory.id) {
    notFound()
  }

  // Bygg filter från searchParams
  const filters = {
    mainCategory: parentCategory.id as MainCategory,
    subCategories: [subCategoryId],
    priceMin: searchParams.pris_min ? parseInt(searchParams.pris_min) : undefined,
    priceMax: searchParams.pris_max ? parseInt(searchParams.pris_max) : undefined,
    colors: searchParams.farg ? searchParams.farg.split(',') : undefined,
    partners: searchParams.partner ? searchParams.partner.split(',') as any : undefined,
  }

  const page = searchParams.sida ? parseInt(searchParams.sida) : 1
  const sortBy = searchParams.sortera || 'popularity'

  // Använd searchProducts för fullständig filtrering
  const searchResult = await searchProducts(filters, page, 24)

  // Hämta tillgängliga färger för filter
  const availableColors = await getAvailableColors(parentCategory.id as MainCategory)

  return (
    <>
      <CategorySchema
        category={{
          ...subCategory,
          productCount: searchResult.totalCount,
          isActive: true,
          sortOrder: 0,
        }}
        products={searchResult.products}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <Breadcrumbs
              items={[
                { label: 'Hem', href: '/' },
                { label: parentCategory.namePlural, href: `/${parentCategory.slug}` },
                { label: subCategory.namePlural, href: `/${parentCategory.slug}/${subCategory.slug}` },
              ]}
            />

            <h1 className="mt-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
              {subCategory.namePlural}
            </h1>

            <p className="mt-4 max-w-3xl text-lg text-gray-600">
              {subCategory.description}
            </p>

            {/* Relaterade underkategorier */}
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={`/${parentCategory.slug}`}
                className="filter-chip"
              >
                Alla {parentCategory.namePlural.toLowerCase()}
              </Link>
              {Object.entries(SUB_CATEGORIES)
                .filter(([id, cat]) =>
                  cat.parentCategory === parentCategory.id &&
                  id !== subCategoryId
                )
                .slice(0, 6)
                .map(([id, cat]) => (
                  <Link
                    key={id}
                    href={`/${parentCategory.slug}/${cat.slug}`}
                    className="filter-chip"
                  >
                    {cat.namePlural}
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 lg:flex-shrink-0">
              <CategoryFilters
                category={parentCategory}
                availableColors={availableColors}
              />
            </aside>

            {/* Produkter */}
            <main className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {searchResult.totalCount} produkter
                </p>
                <SortSelect defaultValue={sortBy} />
              </div>

              {searchResult.products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {searchResult.products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      listType="category"
                      position={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                  <p className="text-gray-600">
                    Inga produkter hittades med dina filter.
                  </p>
                  <Link
                    href={`/${parentCategory.slug}/${subCategory.slug}`}
                    className="mt-4 inline-block text-primary hover:underline"
                  >
                    Visa alla {subCategory.namePlural.toLowerCase()}
                  </Link>
                </div>
              )}

              {/* Paginering */}
              {searchResult.pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: searchResult.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/${parentCategory.slug}/${subCategory.slug}?sida=${p}`}
                      className={`px-4 py-2 rounded ${
                        p === page
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* SEO-innehåll */}
        <section className="border-t bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg mx-auto max-w-3xl">
              <h2>Om {subCategory.namePlural}</h2>
              <p>{subCategory.description}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
