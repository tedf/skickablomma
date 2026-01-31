# SKICKABLOMMA.SE - Komplett Specifikation

## 1) Executive Summary

1. **Datadriven affiliate-webbplats** för den svenska blomstermarknaden med fokus på SEO och LLM-optimering
2. **Fyra partners integrerade** via Adtraction XML-feeds: Cramers, Interflora, Fakeflowers, My Perfect Day
3. **Image Resolver-pipeline** med 4-stegs fallback: Partner → Royalty-free → AI-genererad → Placeholder
4. **8 huvudkategorier** + 40+ underkategorier täcker alla svenska sökintentioner
5. **5 konverteringswizards** för att guida användare till rätt produkter
6. **Facetterad sökning** med filter för pris (SEK), färg, partner, leverans
7. **Schema.org-markup** på alla sidor för rik visning i Google och AI-sök
8. **Svensk terminologi** genomgående med fokus på svenska sökord
9. **Bildspårning** per sourceType för CTR-analys och optimering
10. **Responsiv design** med Tailwind CSS, optimerad för mobil konvertering

---

## 2) Informationsarkitektur

### Hierarki (max 3 nivåer)

```
skickablomma.se/
├── / (Startsida)
├── /buketter (Huvudkategori)
│   ├── /rosor
│   ├── /tulpaner
│   ├── /liljor
│   ├── /solrosor
│   ├── /orkideer
│   ├── /roda-blommor
│   ├── /rosa-blommor
│   ├── /vita-blommor
│   └── ...
├── /begravning
│   ├── /begravningskransar
│   ├── /begravningsbuketter
│   ├── /kondoleanser
│   └── /minnesbuketter
├── /brollop
│   ├── /brudbuketter
│   ├── /brollopsbuketter
│   └── /bordsdekoration-brollop
├── /foretag
│   ├── /kontorsblommor
│   ├── /representationsblommor
│   └── /event-blommor
├── /presenter
├── /konstgjorda-blommor
├── /samma-dag-leverans
├── /billiga-blommor (budget)
│   ├── /under-300-kr
│   ├── /under-500-kr
│   └── /under-700-kr
├── /wizard/
│   ├── /hitta-ratt-blommor
│   ├── /begravningsblommor
│   ├── /brollopsblommor
│   ├── /foretags-blommor
│   └── /presenter-till-henne
├── /sok
├── /guide/
│   ├── /rosors-betydelse
│   ├── /skicka-blommor-samma-dag
│   └── /begravningsblommor-guide
├── /produkt/[kategori]/[sku]
└── /[tillfalle]/
    ├── /mors-dag
    ├── /fars-dag
    ├── /alla-hjartans-dag
    ├── /student-blommor
    └── ...
```

### Sidtyper

| Typ | Exempel | Syfte |
|-----|---------|-------|
| Produktlista | `/buketter`, `/rosor` | Produktvisning + filter |
| Produktsida | `/produkt/buketter/INT001` | Konvertering |
| Guide | `/guide/rosors-betydelse` | Informativt, SEO |
| Wizard | `/wizard/hitta-ratt-blommor` | Konvertering |
| Topplista | `/basta-rosorna-2025` | SEO, editorial |
| Stadssida | `/blommor-stockholm` | Lokal SEO |
| Temasida | `/mors-dag` | Säsongs-SEO |

---

## 3) Datamodell

### Product
```typescript
interface Product {
  id: string              // "interflora-INT001"
  sku: string             // "INT001"
  partnerId: Partner      // "interflora"

  name: string
  description: string
  shortDescription: string

  mainCategory: MainCategory
  subCategories: SubCategory[]
  tags: string[]

  price: number           // SEK
  originalPrice?: number  // För rea
  currency: 'SEK'
  discountPercent?: number

  shipping: number
  inStock: boolean
  sameDayDelivery: boolean

  attributes: ProductAttributes

  primaryImage: ImageAsset  // Via Image Resolver
  additionalImages: ImageAsset[]

  productUrl: string
  trackingUrl: string       // Adtraction affiliate-länk

  popularityScore: number
  clickCount: number

  createdAt: Date
  updatedAt: Date
  feedUpdatedAt: Date

  isActive: boolean
  isPromoted: boolean
}
```

### ImageAsset (KRITISK)
```typescript
interface ImageAsset {
  id: string
  url: string
  localPath?: string

  sourceType: 'partner' | 'royalty_free' | 'generated' | 'placeholder'
  license: 'partner_provided' | 'cc0' | 'cc_by' | 'ai_generated'

  attribution?: {
    text: string
    url?: string
    author?: string
  }

  prompt?: string           // Endast för generated
  hash?: string             // För deduplicering

  dimensions: { width: number; height: number }
  format: 'webp' | 'avif' | 'jpg' | 'png'
  fileSize: number

  altText: string           // Engelska
  altTextSv: string         // Svenska (används för SEO)

  validationStatus: 'pending' | 'valid' | 'invalid' | 'expired'
}
```

### CategoryMapping
```typescript
interface Category {
  id: string
  slug: string
  name: string
  namePlural: string
  description: string
  metaTitle: string
  metaDescription: string
  parentCategory?: MainCategory
  productCount: number
  seoContent?: {
    intro: string
    faq: FAQ[]
  }
}
```

---

## 4) Feed-ingestion Pipeline

### Pipeline-flöde

```
1. FETCH       → Hämta XML från Adtraction (retry med exponential backoff)
2. PARSE       → Konvertera XML till JSON (fast-xml-parser)
3. MERGE       → Kombinera produktfeed med statusfeed
4. VALIDATE    → Validera mot schema (Zod), logga fel
5. NORMALIZE   → Konvertera till intern datamodell
6. IMAGE_RESOLVE → Kör Image Resolver för varje produkt
7. UPSERT      → Spara till databas (SQLite/PostgreSQL)
8. REINDEX     → Uppdatera sökindex
9. SITEMAP     → Regenerera sitemaps
10. CACHE_INVALIDATE → Rensa CDN-cache
```

### Frekvens

| Feed | Intervall | Cron |
|------|-----------|------|
| Produktfeed | 4x/dag | `0 */6 * * *` |
| Statusfeed | 1x/timme | `0 * * * *` |
| Full re-index | 1x/dag | `0 3 * * *` |
| Sitemap | Efter produktuppdatering | `after:productFeed` |

### Valideringsregler

- **Obligatoriska fält:** SKU, Name, TrackingUrl, Price
- **Prisvalidering:** 0 < price < 50000 SEK
- **URL-validering:** Korrekt format för ProductUrl, TrackingUrl, ImageUrl
- **Valuta:** Måste vara SEK

---

## 5) Bildpipeline: Image Resolver

### Fallback-kedja

```
A. PARTNERBILD (primär)
   ├── Om ImageUrl finns i feed
   ├── Validera: HEAD-request, status 200
   ├── Kontrollera: korrekt MIME-typ
   ├── Kontrollera: min 200x200 px
   └── Om OK → använd

B. ROYALTY-FREE (sekundär)
   ├── Om partnerbild saknas/ogiltig
   ├── Matcha mot intern bildbank baserat på:
   │   ├── subCategories
   │   ├── mainCategory
   │   ├── colors
   │   └── flowerTypes
   ├── Välj deterministiskt (hash av produkt-ID)
   └── Spara licensinfo + attribution

C. AI-GENERERAD (tertiär)
   ├── Om ingen royalty-free match
   ├── Generera prompt baserat på:
   │   ├── mainCategory
   │   ├── flowerTypes
   │   ├── colors
   │   └── Svenska preferenser
   ├── Skicka till DALL-E/Midjourney
   ├── Spara prompt + metadata
   └── [FILL: Märk med "Illustrationsbild" - JA]

D. PLACEHOLDER (sista utväg)
   ├── Kategori-specifik SVG
   ├── Text: "Bild kommer snart"
   └── Neutral design
```

### Policy

- **Bilder:** WebP/AVIF, lazyload, responsive srcset
- **Alt-text:** Svenska, beskrivande, inkludera pris
- **AI-bilder:** Märks med "Illustrationsbild" i UI
- **Deduplicering:** Hash-baserad för att undvika dubletter

### Metadata per bild

```typescript
{
  sourceType: 'partner' | 'royalty_free' | 'generated' | 'placeholder',
  license: 'partner_provided' | 'cc0' | 'ai_generated',
  attribution?: { text, url, author },
  prompt?: string,
  hash: string
}
```

---

## 6) Onsite Search & Filter

### Fulltextsök
- **Motor:** Fuse.js (client) / Elasticsearch (server)
- **Fält:** name, description, tags, category
- **Fuzzy matching:** Ja, för att hantera stavfel

### Facetter

| Facett | Typ | Värden |
|--------|-----|--------|
| Kategori | Single-select | Alla huvudkategorier |
| Pris | Range | Under 300, 300-500, 500-700, 700+ |
| Färg | Multi-select | Röd, Rosa, Vit, Gul, Lila, Orange |
| Partner | Multi-select | Alla partners |
| Leverans | Toggle | Samma dag |
| Rabatt | Toggle | Endast rea |

### Sortering

| Alternativ | Beskrivning |
|------------|-------------|
| `popularity` | popularityScore DESC (default) |
| `price_asc` | price ASC |
| `price_desc` | price DESC |
| `newest` | createdAt DESC |
| `discount` | discountPercent DESC |

### Rankingformel

```
score =
  popularityScore * 0.4 +
  clickCount * 0.2 +
  (hasRealImage ? 10 : 0) * 0.1 +  // Preferera riktiga bilder
  (inStock ? 20 : 0) * 0.15 +
  (sameDayDelivery ? 15 : 0) * 0.15
```

---

## 7) Wizards (5 st)

### 1. Hitta rätt blommor
- **URL:** `/wizard/hitta-ratt-blommor`
- **Steg:** Mottagare → Tillfälle → Färg → Budget → Leverans
- **Output:** 8 produkter
- **CTA:** "Visa mina rekommendationer"

### 2. Begravningsblommor
- **URL:** `/wizard/begravningsblommor`
- **Steg:** Typ (krans/bukett/kondoleans) → Färg → Budget
- **Output:** 6 produkter
- **CTA:** "Visa begravningsblommor"

### 3. Bröllopsblommor
- **URL:** `/wizard/brollopsblommor`
- **Steg:** Typ (brud/tärna/bord) → Stil → Färg
- **Output:** 10 produkter
- **CTA:** "Visa bröllopsblommor"

### 4. Företagsblommor
- **URL:** `/wizard/foretags-blommor`
- **Steg:** Användning → Antal → Budget
- **Output:** 8 produkter
- **CTA:** "Visa företagsblommor"

### 5. Present till henne
- **URL:** `/wizard/presenter-till-henne`
- **Steg:** Relation → Tillfälle → Stil → Budget
- **Output:** 8 produkter
- **CTA:** "Visa presenter"

---

## 8) SEO & LLM-optimering

### Schema.org Markup

**Startsida:**
- WebSite med SearchAction
- Organization

**Kategorisida:**
- CollectionPage
- ItemList med produkter
- BreadcrumbList

**Produktsida:**
- Product med Offer
- AggregateRating (om tillgängligt)
- FAQPage (om FAQ finns)

**Guidesida:**
- Article
- FAQPage

### Meta-taggar

```html
<title>{sida.metaTitle} | Skicka Blomma</title>
<meta name="description" content="{sida.metaDescription}" />
<link rel="canonical" href="https://skickablomma.se{sida.path}" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="sv_SE" />
```

### Bild-SEO

- **Alt-text:** Svenska, beskrivande, inkludera pris för produkter
- **Filnamn:** `roda-rosor-bukett-499kr.webp`
- **Image sitemap:** Inkludera alla produktbilder

### AI-genererade bilder

Om `sourceType === 'generated'`:
- Alt-text: `{produktnamn} (illustrationsbild)`
- Visuell märkning i UI: "Illustrationsbild"
- Inte primärt marknadsföringsmaterial

### LLM-optimering

- Strukturerat innehåll med tydliga H-taggar
- FAQ-sektioner på alla kategorisidor
- Kort, koncist intro-innehåll
- Fakta presenterade i tabellformat

---

## 9) Content-plan

### 25+ innehållsidéer

**Guider (informativt):**
1. Rosors betydelse - Vad olika färger symboliserar
2. Skicka blommor samma dag - Så fungerar det
3. Begravningsblommor - En komplett guide
4. Bröllopsblommor - Planera blomsterprakten
5. Tulpaner - Vårens favorit
6. Så håller blommorna längre - Skötselråd
7. Presentetikette - När ska man ge blommor?
8. Blommor som allergivänner kan uppskatta
9. Säsongsblommor månad för månad
10. Blommor till kontoret - Tips för företag

**Säsong/högtid (transaktionellt):**
11. Mors dag blommor 2025 - Guide
12. Alla hjärtans dag - Romantiska buketter
13. Studentblommor 2025
14. Julblommor och jularrangemang
15. Påskblommor - Våriga favoriter
16. Midsommarblommor

**Topplista (transaktionellt):**
17. Bästa rosorna 2025 - Jämförelse
18. Billigaste buketter som fortfarande imponerar
19. Bästa begravningskransarna - Jämförelse
20. Premium-buketter för speciella tillfällen

**Lokalt (lokal SEO):**
21. Blommor Stockholm - Butiker & leverans
22. Blommor Göteborg
23. Blommor Malmö
24. Blommor Uppsala

**Övrigt:**
25. Om skickablomma.se
26. Våra partners
27. Så fungerar det
28. Vanliga frågor

### 5 Mini-briefs

#### Brief 1: Rosors betydelse
- **Målsökord:** "rosor betydelse", "röda rosor betydelse"
- **Sökvolym:** 1 000/mån
- **Intent:** Informativt
- **Längd:** 1 500 ord
- **Struktur:** Introduktion → Färg-för-färg → Antal → Tips
- **CTA:** Länk till `/buketter/rosor`

#### Brief 2: Mors dag blommor 2025
- **Målsökord:** "mors dag blommor", "blommor mors dag"
- **Sökvolym:** 8 000/mån (peak i maj)
- **Intent:** Transaktionellt
- **Längd:** 800 ord
- **Struktur:** Intro → Topplista → FAQ
- **CTA:** Wizard + produktlista

#### Brief 3: Skicka blommor samma dag
- **Målsökord:** "skicka blommor idag", "blomsterbud samma dag"
- **Sökvolym:** 3 000/mån
- **Intent:** Transaktionellt
- **Längd:** 1 000 ord
- **Struktur:** Hur det fungerar → Partners → FAQ
- **CTA:** `/samma-dag-leverans`

#### Brief 4: Begravningsblommor guide
- **Målsökord:** "begravningsblommor", "kransar begravning"
- **Sökvolym:** 2 500/mån
- **Intent:** Informativt/transaktionellt
- **Längd:** 2 000 ord
- **Struktur:** Typer → Färger → Etikette → Praktiskt
- **CTA:** `/begravning` + wizard

#### Brief 5: Blommor Stockholm
- **Målsökord:** "blommor stockholm", "blomsterbud stockholm"
- **Sökvolym:** 5 000/mån
- **Intent:** Transaktionellt/lokalt
- **Längd:** 1 200 ord
- **Struktur:** Partners i Stockholm → Samma dag → Tips
- **CTA:** Filter på Stockholm-leverans

---

## 10) Mätning & KPI

### Primära KPI:er

| KPI | Mål | Mätmetod |
|-----|-----|----------|
| Affiliate-klick | 5% CTR | GA4 + egen tracking |
| EPC (Earnings Per Click) | 2 SEK | Adtraction rapport |
| Revenue/session | 0.50 SEK | GA4 e-commerce |
| SEO visibility | Top 10 för 50 sökord | Ahrefs/Semrush |
| Index coverage | 95%+ | Google Search Console |

### image_source_type-spårning

```typescript
// Spåra per visning
trackProductImpression({
  productId: 'INT001',
  imageSourceType: 'partner' | 'royalty_free' | 'generated' | 'placeholder'
})

// Spåra per klick
trackProductClick({
  productId: 'INT001',
  imageSourceType: 'partner',
  position: 3,
  listType: 'category'
})
```

### Dashboard-metrics

1. **CTR per imageSourceType** - För att se om placeholders sänker konvertering
2. **Konverteringsgrad per kategori**
3. **Populäraste produkter**
4. **Wizard completion rate**
5. **Söktermer utan resultat**

### Verktyg

- **Google Analytics 4** - Trafik, beteende
- **Google Search Console** - SEO-prestanda
- **Adtraction Dashboard** - Affiliate-statistik
- **Egen databas** - Detaljerad klickspårning

---

## Constraints & Antaganden

### Fakta
- Alla priser i SEK
- Svenska leveransvillkor
- Partners: Cramers, Interflora, Fakeflowers, My Perfect Day
- Feed-format: Adtraction XML

### Antaganden [FILL]
- [FILL: CMS/tech-stack] → Next.js 14 valt
- [FILL: Bildpolicy] → AI-bilder märks med "Illustrationsbild"
- [FILL: Exakt feed-URL:er] → Placeholders i .env.example

### Policy-beslut
- AI-genererade bilder: Märks visuellt i UI
- Royalty-free bilder: CC0/commercial license endast
- Placeholder: Används som sista utväg, påverkar ranking negativt
