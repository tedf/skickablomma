# SKICKABLOMMA.SE - Claude Code Instructions

## Projektöversikt

Skickablomma.se är en **neutral jämförelsesajt för blombud** i Sverige och utomlands, finansierad via affiliate. Vi säljer inga blommor själva.

Sajten har två lager:
- **Jämförelsedelen** (`/blombud/`, `/utomlands/`, `/tillfalle/`, `/jamfor/`, `/guider/`) — kärnan, byggd på redaktionell data i `/data/`.
- **Produktkatalogen** (`/[category]/`, `/produkt/`, `/wizard/`, `/sok/`) — byggd på Adtraction-feeds, fungerar som stödmaterial.

**Tech stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zod (validering)
- SWR (data fetching)

## Projektstruktur

```
skickablomma.se/
├── src/
│   ├── app/                 # Next.js pages & routes
│   │   ├── [category]/      # Dynamiska kategorisidor
│   │   ├── wizard/[id]/     # Wizard-sidor
│   │   └── sok/             # Söksida
│   ├── components/          # React-komponenter
│   │   ├── layout/          # Header, Footer
│   │   ├── products/        # ProductCard, ProductGrid
│   │   ├── categories/      # CategoryCard, CategoryFilters
│   │   ├── search/          # SearchHeader, SearchFilters
│   │   ├── wizards/         # WizardContainer, WizardCTA
│   │   ├── content/         # FAQSection, GuideContent
│   │   ├── seo/             # Schema markup
│   │   └── ui/              # Grundläggande UI-komponenter
│   ├── data/                # Statisk data
│   │   ├── categories.ts    # Kategorier & underkategorier
│   │   ├── partners.ts      # Partner-konfiguration
│   │   └── wizards.ts       # Wizard-konfiguration
│   ├── lib/                 # Hjälpfunktioner
│   │   ├── utils.ts         # Utilities
│   │   ├── products.ts      # Produktfunktioner
│   │   └── analytics.ts     # Analys & spårning
│   ├── services/            # Backend-tjänster
│   │   ├── feed-ingestion.ts
│   │   ├── product-normalizer.ts
│   │   └── image-resolver.ts
│   └── types/               # TypeScript-typer
│       └── index.ts
├── data/                    # Redaktionell data för jämförelsedelen
│   ├── services.json        # Tjänster: pris, budavgift, affiliate-länk
│   ├── cities.json          # Städer: florister, leveransområden, sidcopy
│   ├── countries.json       # Länder: ledtider, tull, helgdagar
│   ├── occasions.json       # Tillfällen: etikett, blomval, korttexter
│   ├── static-pages.json    # Startsida, hubbar, /jamfor/, guider
│   └── products.json        # Genererad produktfeed
├── content/                 # Markdown-innehåll
│   ├── guides/              # Guider (rosors-betydelse.md, etc.)
│   └── faqs/                # FAQ-innehåll
├── public/                  # Statiska filer
│   └── images/
│       ├── categories/
│       ├── placeholders/
│       └── royalty-free/
└── scripts/                 # Build & feed-scripts
```

## Viktiga koncept

### Partners
- Cramers Blommor
- Interflora
- Fakeflowers
- My Perfect Day

Alla partners har produktfeed + statusfeed från Adtraction.

### Image Resolver (KRITISK)
Fallback-kedja för bilder:
1. **Partner** - Originalbilden från feeden
2. **Royalty-free** - Matchad bild från intern bildbank
3. **AI-genererad** - Genererad baserat på produkt
4. **Placeholder** - Kategori-specifik fallback

### Datamodell
Se `src/types/index.ts` för fullständig datamodell:
- Product
- ImageAsset (inkl. sourceType, license)
- Category
- WizardConfig

## Kommandon

```bash
npm run dev          # Starta dev-server (visar även utkast)
npm run build        # Bygg för produktion (kör check:content först)
npm run check:content    # Publiceringskontroll: platshållare, florister, spärrade ord
npm run content:sanitize # Städar spärrade varumärkesord ur data/products.json
npm run feed:fetch   # Hämta partner-feeder
npm run feed:process # Processa och normalisera
npm run images:resolve # Kör Image Resolver
npm run sitemap:generate # Generera sitemap
```

## Publiceringsregler (viktigast)

Sidor i jämförelsedelen har `status: 'draft' | 'published'` i sin datafil.
Utkast renderas i dev men **genereras aldrig i produktionsbygget** och får
`robots: noindex`. `npm run check:content` fäller bygget om en sida märkt
`published` bryter mot någon regel:

- Mikrosvar måste finnas och vara 40–80 ord.
- Inga platshållare av formen `[149–399]` eller `[kl. X]` får vara kvar.
- Stadssidor kräver minst **tre verifierade florister** (`verifiedAt` satt).
- Jämförelsetabeller kräver `pricesVerifiedAt`.

Grundprincip för data: allt som är ett faktapåstående om pris, tid eller en
namngiven verksamhet är `null` tills det kontrollerats, och renderas som
tankstreck. **Aldrig 0 som "vet ej", aldrig en gissad siffra.**

En "Vårt val"-markering sätts bara när minst två tjänster har kontrollerat
totalpris. Billigast av en är inte en jämförelse.

## Spärrade varumärkesord

"Blommogram", "Chokladogram" och böjningar får inte förekomma på sajten —
Interfloras affiliate-villkor förbjuder dem på sajter som länkar till
konkurrenter. Orden kommer in via produktfeeden och städas i
`src/lib/restricted-terms.ts`, både vid normalisering och vid inläsning.
Saneringen byter även determinerare och predikativa adjektiv, eftersom
ersättningen har annat genus än originalet.

## Tonalitet

Rak, praktisk, varm. Ingen butiksröst ("hos oss", "våra partners"), inga
utropstecken, inga blomstermetaforer. Sentence case, du-tilltal. Vi jämför,
vi säljer inte.

## SEO-riktlinjer

- Varje kategori ska ha unik intro-text och FAQs
- Alla sidor ska ha korrekt schema.org-markup
- Produktbilder ska ha svensk alt-text
- AI-genererade bilder märks med "Illustrationsbild"

## Verifiering

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run build        # Full build
```

## Fil-gränser
- **Säkert att redigera:** /src/, /content/, /public/images/
- **Läs-only:** /node_modules/, /.next/
- **Känsligt:** .env (aldrig committa secrets)
