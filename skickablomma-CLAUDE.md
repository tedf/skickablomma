# SKICKABLOMMA.SE - Claude Code Instructions

## Projektöversikt

Skickablomma.se är en datadriven, SEO-optimerad affiliate-webbplats för blommor och presenter i Sverige.

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
npm run dev          # Starta dev-server
npm run build        # Bygg för produktion
npm run feed:fetch   # Hämta partner-feeder
npm run feed:process # Processa och normalisera
npm run images:resolve # Kör Image Resolver
npm run sitemap:generate # Generera sitemap
```

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
