import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Truck, Heart, Gift, Clock, Star, ArrowRight, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { WizardCTA } from '@/components/wizards/WizardCTA'
import { TrustBadges } from '@/components/ui/TrustBadges'
import { FAQSection } from '@/components/content/FAQSection'
import { FlowerTypeToggle } from '@/components/products/FlowerTypeToggle'
import { MAIN_CATEGORIES } from '@/data/categories'
import { getProductsByFlowerType, getSameDayProducts } from '@/lib/products'
import { getAllGuides } from '@/lib/guides'
import { getAllServices, getStaticPage } from '@/lib/comparison'
import { validateStaticPage } from '@/lib/publishing'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'
import { MicroAnswer } from '@/components/comparison/MicroAnswer'
import { DraftNotice } from '@/components/comparison/DraftNotice'
import { BotanicalRule } from '@/components/brand/Botanical'

export const metadata: Metadata = {
  title: {
    absolute: 'Skickablomma – jämför blombud, pris och leveranstid',
  },
  description:
    'Jämför blombud i Sverige: från-pris, budavgift och totalpris sida vid sida. Vi visar vad vi kontrollerat och när, och tankstreck för resten.',
  alternates: {
    canonical: 'https://skickablomma.se',
  },
}

// Schema.org för startsidan
const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Skickablomma',
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
  name: 'Skickablomma',
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
  // Hämta produkter per typ för toggle
  const [snittblommor, konstgjorda, lokar, sameDayProducts] = await Promise.all([
    getProductsByFlowerType('snittblommor', 8),
    getProductsByFlowerType('konstgjorda', 8),
    getProductsByFlowerType('lokar', 8),
    getSameDayProducts(4),
  ])
  const mainCategories = Object.values(MAIN_CATEGORIES).slice(0, 6)
  const guides = getAllGuides()

  // Fas 1-copyn ligger i data/static-pages.json och innehåller siffror som ska
  // verifieras. Den går live först när sidan sätts till published — tills dess
  // står den befintliga hero-texten kvar, som inte påstår något om pris.
  const landing = getStaticPage('/')
  const landingIsLive = landing?.page.status === 'published'
  const services = getAllServices()

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
              {landingIsLive && landing ? (
                landing.page.h1
              ) : (
                <>
                  Jämför <span className="text-primary">blombud</span>
                  <br />i Sverige
                </>
              )}
            </h1>
            {landingIsLive && landing ? (
              <div className="mb-8 text-left">
                <MicroAnswer>{landing.page.microAnswer}</MicroAnswer>
              </div>
            ) : (
              <p className="mb-8 text-lg text-gray-600 md:text-xl">
                Pris, leveranstid och täckning sida vid sida. Vi säljer inga blommor
                själva.
              </p>
            )}

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
              <Link href="/buketter/tulpaner" className="filter-chip">
                Tulpaner
              </Link>
              <Link href="/brollop" className="filter-chip">
                <Gift className="h-4 w-4" />
                Bröllop
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

      {/* Hubbar — sitearkitekturens fem ingångar (siteplanen §3) */}
      <section className="border-b border-gray-100 py-12">
        <div className="container mx-auto px-4">
          {!landingIsLive && landing && (
            <div className="mb-8">
              <DraftNotice issues={validateStaticPage(landing)} />
            </div>
          )}
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: '/blombud',
                title: 'Blombud stad för stad',
                text: 'Vem levererar var, när stopptiden går och vad budet kostar.',
              },
              {
                href: '/utomlands',
                title: 'Skicka utomlands',
                text: 'Leveranstid, pris och praktiska regler land för land.',
              },
              {
                href: '/tillfalle',
                title: 'Tillfällen',
                text: 'Vad som passar och vad du skriver på kortet.',
              },
              {
                href: '/jamfor',
                title: 'Jämför tjänster',
                text: 'Totalpris, stopptid och täckning sida vid sida.',
              },
            ].map((hub) => (
              <li key={hub.href}>
                <Link
                  href={hub.href}
                  className="block h-full rounded-lg border border-line bg-surface p-5 transition-colors hover:border-leaf-300 hover:bg-leaf-50"
                >
                  <span className="font-display text-lg font-semibold text-gray-900">
                    {hub.title}
                  </span>
                  <span className="mt-2 block text-sm text-gray-600">{hub.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Jämförelsetabellen ligger ovanför fold på mobil (siteplanen §7) */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <BotanicalRule className="mb-12" />
        </div>
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-6 font-display text-2xl font-bold text-gray-900">
            De största blombuden
          </h2>
          <ComparisonTable
            rows={services.map((service) => ({ service }))}
            pricesVerifiedAt={landing?.page.pricesVerifiedAt ?? null}
            trackingContext="startsida"
          />
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
              href="/buketter"
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

      {/* Produkttyp-toggle */}
      <FlowerTypeToggle
        snittblommor={snittblommor}
        konstgjorda={konstgjorda}
        lokar={lokar}
      />

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
                Många av tjänsterna levererar samma dag om beställningen ligger inne i tid.
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

      {/* Guider Section */}
      {guides.length > 0 && (
        <section className="border-t bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <span>📚</span>
                  Guider
                </div>
                <h2 className="font-display text-3xl font-bold text-gray-900">
                  Lär dig mer om blommor
                </h2>
                <p className="mt-2 text-gray-600">
                  Få hjälp att välja rätt blommor och förstå deras betydelse
                </p>
              </div>
              <Link
                href="/guider"
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
              >
                Alla guider
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {guides.slice(0, 3).map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guide/${guide.slug}`}
                  className="group rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all duration-200 hover:border-primary hover:bg-white hover:shadow-md"
                >
                  <div className="mb-3 text-4xl">📖</div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-gray-900 group-hover:text-primary">
                    {guide.title}
                  </h3>
                  {guide.excerpt && (
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                      {guide.excerpt}
                    </p>
                  )}
                  <div className="flex items-center text-sm font-medium text-primary">
                    Läs mer
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center md:hidden">
              <Link
                href="/guider"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Alla guider
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection
        title="Vanliga frågor om att skicka blommor"
        faqs={[
          {
            id: 'faq-1',
            question: 'Hur snabbt kan jag få blommorna levererade?',
            answer:
              'Flera av tjänsterna levererar samma dag om beställningen ligger inne före lunch på en vardag. Med standardleverans kommer blommorna normalt nästa dag.',
            sortOrder: 1,
          },
          {
            id: 'faq-2',
            question: 'Kan jag jämföra priser från olika butiker?',
            answer:
              'Ja. Vi visar från-pris, budavgift och totalpris sida vid sida för de tjänster vi kontrollerat. Det vi inte kontrollerat står med tankstreck i stället för en gissning.',
            sortOrder: 2,
          },
          {
            id: 'faq-3',
            question: 'Hur fungerar beställningen?',
            answer:
              'Du klickar på "Till Interflora" eller motsvarande knapp och skickas vidare till tjänstens egen sajt, där du slutför beställningen. Vi tar aldrig emot din betalning och säljer ingenting själva.',
            sortOrder: 3,
          },
          {
            id: 'faq-4',
            question: 'Kan jag skicka blommor till hela Sverige?',
            answer:
              'Ja, de rikstäckande tjänsterna täcker hela Sverige. Hur många ombud var och en har på en enskild ort har vi inte kontrollerat.',
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
            Jämför innan du beställer
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
