import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, MAIN_CATEGORIES, getSubCategoriesByParent, SUB_CATEGORIES } from '@/data/categories'
import { searchProducts, getAvailableColors } from '@/lib/products'
import { ProductCard } from '@/components/products/ProductCard'
import { CategoryFilters } from '@/components/categories/CategoryFilters'
import { FAQSection } from '@/components/content/FAQSection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CategorySchema } from '@/components/seo/CategorySchema'
import { SortSelect } from '@/components/categories/SortSelect'
import { MainCategory } from '@/types'

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    farg?: string
    pris_min?: string
    pris_max?: string
    partner?: string
    samma_dag?: string
    sortera?: string
    sida?: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category)

  if (!category) {
    return {
      title: 'Kategori inte hittad | Skicka Blomma',
    }
  }

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: {
      canonical: `https://skickablomma.se/${category.slug}`,
    },
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: `https://skickablomma.se/${category.slug}`,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  return Object.values(MAIN_CATEGORIES)
    .filter((category) => category.isActive)
    .map((category) => ({
      category: category.slug,
    }))
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category)

  if (!category) {
    notFound()
  }

  // Redirect inactive categories to home
  if (category.isActive === false) {
    redirect('/buketter')
  }

  const subCategoryIds = getSubCategoriesByParent(category.id as MainCategory)

  // Bygg filter från searchParams
  const filters = {
    mainCategory: category.id as MainCategory,
    priceMin: searchParams.pris_min ? parseInt(searchParams.pris_min) : undefined,
    priceMax: searchParams.pris_max ? parseInt(searchParams.pris_max) : undefined,
    colors: searchParams.farg ? searchParams.farg.split(',') : undefined,
    partners: searchParams.partner ? searchParams.partner.split(',') as any : undefined,
    sameDayOnly: searchParams.samma_dag === 'true',
  }

  const page = searchParams.sida ? parseInt(searchParams.sida) : 1
  const sortBy = searchParams.sortera || 'popularity'

  // Använd searchProducts för fullständig filtrering
  const searchResult = await searchProducts(filters, page, 24)

  // Hämta tillgängliga färger för filter
  const availableColors = await getAvailableColors(category.id as MainCategory)

  return (
    <>
      <CategorySchema category={category} products={searchResult.products} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <Breadcrumbs
              items={[
                { label: 'Hem', href: '/' },
                { label: category.namePlural, href: `/${category.slug}` },
              ]}
            />

            <h1 className="mt-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
              {category.namePlural}
            </h1>

            {category.seoContent?.intro && (
              <p className="mt-4 max-w-3xl text-lg text-gray-600">
                {category.seoContent.intro}
              </p>
            )}

            {/* Underkategorier - med korrekta länkar */}
            {subCategoryIds.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {subCategoryIds.slice(0, 8).map((subCatId) => {
                  const subCat = SUB_CATEGORIES[subCatId]
                  if (!subCat) return null
                  return (
                    <Link
                      key={subCatId}
                      href={`/${category.slug}/${subCat.slug}`}
                      className="filter-chip"
                    >
                      {subCat.namePlural}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 lg:flex-shrink-0">
              <CategoryFilters
                category={category}
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
                      showDeliveryBadge
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                  <p className="text-gray-600">
                    Inga produkter hittades med dina filter.
                  </p>
                  <Link
                    href={`/${category.slug}`}
                    className="mt-4 inline-block text-primary hover:underline"
                  >
                    Visa alla {category.namePlural.toLowerCase()}
                  </Link>
                </div>
              )}

              {/* Paginering */}
              {searchResult.pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: Math.min(searchResult.pagination.totalPages, 10) }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/${category.slug}?sida=${p}`}
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

        {/* FAQ */}
        {category.seoContent?.faq && category.seoContent.faq.length > 0 && (
          <div className="bg-white">
            <FAQSection
              title={`Vanliga frågor om ${category.namePlural.toLowerCase()}`}
              faqs={category.seoContent.faq}
            />
          </div>
        )}

        {/* SEO-innehåll */}
        <section className="border-t bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg mx-auto max-w-3xl">
              <h2>Om {category.namePlural}</h2>
              <p>{category.description}</p>

              {category.id === 'buketter' && (
                <>
                  <h3>Så väljer du rätt bukett</h3>
                  <p>
                    Att välja rätt bukett handlar om att tänka på mottagaren och tillfället.
                    Röda rosor är klassiskt romantiska, medan tulpaner passar perfekt för
                    vårkänsla och födelsedagar. Liljor är eleganta och fungerar både som
                    tack och vid sorgliga tillfällen.
                  </p>
                  <h3>Leverans och hållbarhet</h3>
                  <p>
                    Våra partners levererar fräscha blommor direkt från floristen. Med rätt
                    skötsel håller de flesta buketter 5-10 dagar. Byt vatten varannan dag
                    och klipp stjälkarna för bästa resultat.
                  </p>
                </>
              )}

              {category.id === 'begravning' && (
                <>
                  <h3>Att välja begravningsblommor</h3>
                  <p>
                    Begravningsblommor är ett sätt att visa respekt och visa att du tänker
                    på de anhöriga. Vita blommor symboliserar frid och renhet, medan röda
                    visar kärlek och saknad.
                  </p>
                  <h3>Leverans till kyrka och kapell</h3>
                  <p>
                    Alla våra partners kan leverera direkt till kyrkan eller kapellet.
                    Se till att ange rätt leveransadress och tidpunkt vid beställning.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
