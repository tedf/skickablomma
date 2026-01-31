import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Truck, Heart, Gift, Clock, Star, ArrowRight, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { WizardCTA } from '@/components/wizards/WizardCTA'
import { TrustBadges } from '@/components/ui/TrustBadges'
import { FAQSection } from '@/components/content/FAQSection'
import { MAIN_CATEGORIES } from '@/data/categories'
import { getPopularProducts, getSameDayProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Skicka Blomma - Jämför priser på blommor och buketter i Sverige',
  description:
    'Hitta och jämför de bästa blomsterbuden i Sverige. Buketter, begravningsblommor, bröllopsblommor med leverans samma dag. Spara pengar genom att jämföra Interflora, Cramers och fler.',
  alternates: {
    canonical: 'https://skickablomma.se',
  },
}

// Schema.org för startsidan
const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Skicka Blomma',
  url: 'https://skickablomma.se',
  description: 'Jämför priser på blommor och buketter från Sveriges bästa blomsterbutiker',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://skickablomma.se/sok?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Skicka Blomma',
  url: 'https://skickablomma.se',
  logo: 'https://skickablomma.se/images/logo.png',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Swedish',
  },
}

export default async function HomePage() {
  // Hämta produkter (i produktion från databas/API)
  const popularProducts = await getPopularProducts(8)
  const sameDayProducts = await getSameDayProducts(4)
  const mainCategories = Object.values(MAIN_CATEGORIES).slice(0, 6)

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              Hitta de <span className="text-primary">vackraste blommorna</span>
              <br />till bästa pris
            </h1>
            <p className="mb-8 text-lg text-gray-600 md:text-xl">
              Jämför buketter och presenter från Sveriges bästa blomsterbutiker.
              Leverans samma dag möjlig hos flera partners.
            </p>

            {/* Sökfält */}
            <div className="mx-auto max-w-xl">
              <form action="/sok" method="GET" className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  name="q"
                  placeholder="Sök efter buketter, rosor, tulpaner..."
                  className="search-input pl-12"
                  aria-label="Sök blommor"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Sök
                </button>
              </form>
            </div>

            {/* Snabblänkar */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/samma-dag-leverans" className="filter-chip filter-chip-active">
                <Clock className="h-4 w-4" />
                Leverans idag
              </Link>
              <Link href="/buketter/rosor" className="filter-chip">
                <Heart className="h-4 w-4" />
                Rosor
              </Link>
              <Link href="/billiga-blommor" className="filter-chip">
                Under 300 kr
              </Link>
              <Link href="/begravning" className="filter-chip">
                Begravning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Kategorier */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900">
                Utforska kategorier
              </h2>
              <p className="mt-2 text-gray-600">
                Hitta rätt blommor för varje tillfälle
              </p>
            </div>
            <Link
              href="/kategorier"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
            >
              Visa alla kategorier
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {mainCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Wizard CTA */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <WizardCTA />
        </div>
      </section>

      {/* Populära produkter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900">
                Populära buketter
              </h2>
              <p className="mt-2 text-gray-600">
                Upptäck våra mest populära val just nu
              </p>
            </div>
            <Link
              href="/buketter"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
            >
              Visa alla buketter
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Samma dag leverans */}
      <section className="bg-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-secondary/20 px-3 py-1 text-sm font-medium text-secondary-700">
                  <Truck className="h-4 w-4" />
                  Express
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-gray-900">
                Leverans samma dag
              </h2>
              <p className="mt-2 text-gray-600">
                Beställ före kl 13-14 för leverans idag
              </p>
            </div>
            <Link
              href="/samma-dag-leverans"
              className="hidden items-center gap-1 text-sm font-medium text-secondary-700 hover:underline md:flex"
            >
              Visa alla
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {sameDayProducts.map((product) => (
              <ProductCard key={product.id} product={product} showDeliveryBadge />
            ))}
          </div>
        </div>
      </section>

      {/* USP:ar */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Jämför enkelt</h3>
              <p className="text-gray-600">
                Vi samlar blommor från flera butiker så att du kan hitta det bästa priset
                och rätt stil på ett ställe.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                <Truck className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Snabb leverans</h3>
              <p className="text-gray-600">
                Många av våra partners erbjuder leverans samma dag om du beställer i tid.
                Perfekt för sista-minuten-överraskningar.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Pålitliga partners</h3>
              <p className="text-gray-600">
                Vi samarbetar endast med etablerade och välrenommerade blomsterbutiker
                som Interflora och Cramers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        title="Vanliga frågor om att skicka blommor"
        faqs={[
          {
            id: 'faq-1',
            question: 'Hur snabbt kan jag få blommorna levererade?',
            answer:
              'Flera av våra partners erbjuder leverans samma dag om du beställer före kl 13-14. För standardleverans får du vanligtvis blommorna nästa dag.',
            sortOrder: 1,
          },
          {
            id: 'faq-2',
            question: 'Kan jag jämföra priser från olika butiker?',
            answer:
              'Ja! Vi visar blommor från flera butiker (Interflora, Cramers, m.fl.) så att du enkelt kan jämföra priser och hitta det bästa erbjudandet.',
            sortOrder: 2,
          },
          {
            id: 'faq-3',
            question: 'Hur fungerar beställningen?',
            answer:
              'När du hittar en bukett du gillar klickar du på "Köp" så skickas du vidare till butikens egen webbplats där du slutför köpet. Vi tar aldrig emot din betalning.',
            sortOrder: 3,
          },
          {
            id: 'faq-4',
            question: 'Kan jag skicka blommor till hela Sverige?',
            answer:
              'Ja, våra partners levererar till hela Sverige. Interflora har till exempel florister i de flesta städer för personlig leverans.',
            sortOrder: 4,
          },
          {
            id: 'faq-5',
            question: 'Vad kostar leveransen?',
            answer:
              'Leveranskostnaden varierar mellan butiker och leveranssätt. Vi visar alltid totalpriset inklusive leverans så att du kan jämföra rättvist.',
            sortOrder: 5,
          },
        ]}
      />

      {/* CTA */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold">
            Hitta den perfekta buketten idag
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Över 500 buketter att välja mellan. Jämför och spara pengar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/buketter" className="cta-button bg-white text-primary hover:bg-gray-100">
              Utforska buketter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/wizard/hitta-ratt-blommor" className="cta-button-outline border-white text-white hover:bg-white hover:text-primary">
              Hjälp mig välja
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
