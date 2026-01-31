import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, MAIN_CATEGORIES, getSubCategoriesByParent } from '@/data/categories'
import { getProductsByCategory } from '@/lib/products'
import { ProductCard } from '@/components/products/ProductCard'
import { CategoryFilters } from '@/components/categories/CategoryFilters'
import { FAQSection } from '@/components/content/FAQSection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CategorySchema } from '@/components/seo/CategorySchema'

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    farg?: string
    pris_min?: string
    pris_max?: string
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
  return Object.values(MAIN_CATEGORIES).map((category) => ({
    category: category.slug,
  }))
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(category.id as any, 24)
  const subCategories = getSubCategoriesByParent(category.id as any)

  // Filtrera produkter baserat på searchParams
  let filteredProducts = [...products]

  if (searchParams.pris_min) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseInt(searchParams.pris_min!)
    )
  }
  if (searchParams.pris_max) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseInt(searchParams.pris_max!)
    )
  }
  if (searchParams.farg) {
    const colors = searchParams.farg.split(',')
    filteredProducts = filteredProducts.filter((p) =>
      p.attributes.colors?.some((c) => colors.includes(c))
    )
  }

  // Sortering
  if (searchParams.sortera === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (searchParams.sortera === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (searchParams.sortera === 'newest') {
    filteredProducts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  return (
    <>
      <CategorySchema category={category} products={filteredProducts} />

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

            {/* Underkategorier */}
            {subCategories.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {subCategories.slice(0, 8).map((subCat) => (
                  <a
                    key={subCat}
                    href={`/${subCat}`}
                    className="filter-chip"
                  >
                    {subCat.replace(/-/g, ' ')}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 lg:flex-shrink-0">
              <CategoryFilters category={category} />
            </aside>

            {/* Produkter */}
            <main className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {filteredProducts.length} produkter
                </p>
                <select
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  defaultValue={searchParams.sortera || 'popularity'}
                  onChange={(e) => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('sortera', e.target.value)
                    window.location.href = url.toString()
                  }}
                >
                  <option value="popularity">Popularitet</option>
                  <option value="price_asc">Pris (lägst först)</option>
                  <option value="price_desc">Pris (högst först)</option>
                  <option value="newest">Nyast</option>
                </select>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {filteredProducts.map((product, index) => (
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
                  <a
                    href={`/${category.slug}`}
                    className="mt-4 inline-block text-primary hover:underline"
                  >
                    Visa alla {category.namePlural.toLowerCase()}
                  </a>
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
