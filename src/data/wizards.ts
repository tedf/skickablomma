import { WizardConfig, WizardStep } from '@/types'

// =============================================================================
// WIZARD CONFIGURATIONS
// =============================================================================

export const WIZARD_CONFIGS: Record<string, WizardConfig> = {
  'hitta-ratt-blommor': {
    id: 'hitta-ratt-blommor',
    slug: 'hitta-ratt-blommor',
    title: 'Hitta rätt blommor',
    description: 'Svara på några enkla frågor så hjälper vi dig hitta den perfekta buketten',
    metaTitle: 'Hitta rätt blommor – en guide i fyra steg',
    metaDescription:
      'Fyra frågor om mottagare, tillfälle och budget, sedan visar vi buketter som passar och vad de kostar inklusive budavgift.',
    steps: [
      {
        id: 'mottagare',
        title: 'Vem ska få blommorna?',
        description: 'Välj vem som ska ta emot buketten',
        type: 'single_choice',
        options: [
          {
            id: 'kvinna',
            label: 'En kvinna',
            value: 'kvinna',
            icon: '👩',
            filterCriteria: { subCategories: ['rosa-blommor', 'rosor'] },
          },
          {
            id: 'man',
            label: 'En man',
            value: 'man',
            icon: '👨',
            filterCriteria: { colors: ['gul', 'orange', 'vit'] },
          },
          {
            id: 'par',
            label: 'Ett par',
            value: 'par',
            icon: '💑',
            filterCriteria: { subCategories: ['karlek-romantik'] },
          },
          {
            id: 'foretag',
            label: 'Ett företag',
            value: 'foretag',
            icon: '🏢',
            filterCriteria: { mainCategory: 'foretag' },
          },
          {
            id: 'alla',
            label: 'Vet ej / Alla',
            value: 'alla',
            icon: '🌸',
          },
        ],
        validation: { required: true },
      },
      {
        id: 'tillfalle',
        title: 'Vad är tillfället?',
        description: 'Välj anledningen till att du skickar blommor',
        type: 'single_choice',
        options: [
          {
            id: 'fodelsedag',
            label: 'Födelsedag',
            value: 'fodelsedag',
            icon: '🎂',
            filterCriteria: { subCategories: ['fodelsedags-blommor'] },
          },
          {
            id: 'tack',
            label: 'Tack',
            value: 'tack',
            icon: '🙏',
            filterCriteria: { subCategories: ['tackblommor'] },
          },
          {
            id: 'karlek',
            label: 'Kärlek & Romantik',
            value: 'karlek',
            icon: '❤️',
            filterCriteria: { subCategories: ['karlek-romantik', 'rosor'] },
          },
          {
            id: 'gratulation',
            label: 'Gratulera',
            value: 'gratulation',
            icon: '🎉',
            filterCriteria: { subCategories: ['gratulationer'] },
          },
          {
            id: 'kramblommor',
            label: 'Skicka en kram',
            value: 'kram',
            icon: '🤗',
            filterCriteria: { subCategories: ['kramblommor'] },
          },
          {
            id: 'ursakt',
            label: 'Be om ursäkt',
            value: 'ursakt',
            icon: '😔',
            filterCriteria: { subCategories: ['ursakt-blommor'] },
          },
          {
            id: 'annat',
            label: 'Annat / Vet ej',
            value: 'annat',
            icon: '🌺',
          },
        ],
        validation: { required: true },
      },
      {
        id: 'farg',
        title: 'Vilken färg föredrar du?',
        description: 'Välj en eller flera färger (valfritt)',
        type: 'multiple_choice',
        options: [
          { id: 'rod', label: 'Röd', value: 'röd', icon: '🔴', filterCriteria: { colors: ['röd'] } },
          { id: 'rosa', label: 'Rosa', value: 'rosa', icon: '🩷', filterCriteria: { colors: ['rosa'] } },
          { id: 'vit', label: 'Vit', value: 'vit', icon: '⚪', filterCriteria: { colors: ['vit'] } },
          { id: 'gul', label: 'Gul', value: 'gul', icon: '🟡', filterCriteria: { colors: ['gul'] } },
          { id: 'lila', label: 'Lila', value: 'lila', icon: '🟣', filterCriteria: { colors: ['lila'] } },
          { id: 'orange', label: 'Orange', value: 'orange', icon: '🟠', filterCriteria: { colors: ['orange'] } },
          { id: 'blandad', label: 'Blandade färger', value: 'blandad', icon: '🌈' },
        ],
        validation: { required: false, maxSelections: 3 },
      },
      {
        id: 'budget',
        title: 'Vilken är din budget?',
        description: 'Välj prisintervall för buketten',
        type: 'single_choice',
        options: [
          {
            id: 'budget-low',
            label: 'Under 300 kr',
            value: 'under-300',
            description: 'Fina buketter till lägre pris',
            filterCriteria: { priceMax: 300 },
          },
          {
            id: 'budget-medium',
            label: '300-500 kr',
            value: '300-500',
            description: 'Populäraste prisklassen',
            filterCriteria: { priceMin: 300, priceMax: 500 },
          },
          {
            id: 'budget-high',
            label: '500-700 kr',
            value: '500-700',
            description: 'Imponerande buketter',
            filterCriteria: { priceMin: 500, priceMax: 700 },
          },
          {
            id: 'budget-premium',
            label: 'Över 700 kr',
            value: 'over-700',
            description: 'Lyxiga och storslagna',
            filterCriteria: { priceMin: 700 },
          },
          {
            id: 'budget-any',
            label: 'Spelar ingen roll',
            value: 'any',
          },
        ],
        validation: { required: true },
      },
      {
        id: 'leverans',
        title: 'När behöver du blommorna?',
        description: 'Välj önskad leveranstid',
        type: 'single_choice',
        options: [
          {
            id: 'idag',
            label: 'Idag (samma dag)',
            value: 'idag',
            icon: '⚡',
            description: 'Leverans inom några timmar',
            filterCriteria: { sameDayOnly: true },
          },
          {
            id: 'imorgon',
            label: 'Imorgon',
            value: 'imorgon',
            icon: '📅',
            description: 'Standard leverans',
          },
          {
            id: 'specifikt-datum',
            label: 'Specifikt datum',
            value: 'specifikt',
            icon: '🗓️',
            description: 'Välj leveransdatum vid köp',
          },
          {
            id: 'flexibel',
            label: 'Flexibel',
            value: 'flexibel',
            icon: '🕐',
            description: 'Spelar ingen roll',
          },
        ],
        validation: { required: true },
      },
    ],
    resultCount: 8,
    ctaText: 'Visa mina rekommendationer',
    ctaDescription: 'Baserat på dina svar har vi valt ut de bästa buketter för dig',
  },

  'begravningsblommor': {
    id: 'begravningsblommor',
    slug: 'begravningsblommor',
    title: 'Hitta rätt begravningsblommor',
    description: 'Vi hjälper dig hitta värdiga blommor för att visa din sista hälsning',
    metaTitle: 'Begravningsblommor – hitta rätt i fyra steg',
    metaDescription:
      'Fyra frågor om ceremoni, relation och budget, sedan visar vi kransar, sorgbuketter och kondoleansblommor med totalpris.',
    steps: [
      {
        id: 'typ',
        title: 'Vilken typ av arrangement?',
        type: 'single_choice',
        options: [
          {
            id: 'krans',
            label: 'Begravningskrans',
            value: 'krans',
            description: 'Traditionell rund krans',
            filterCriteria: { subCategories: ['begravningskransar'] },
          },
          {
            id: 'bukett',
            label: 'Begravningsbukett',
            value: 'bukett',
            description: 'Liggande eller stående bukett',
            filterCriteria: { subCategories: ['begravningsbuketter'] },
          },
          {
            id: 'kondoleans',
            label: 'Kondoleans/Sympati',
            value: 'kondoleans',
            description: 'Till anhöriga',
            filterCriteria: { subCategories: ['kondoleanser'] },
          },
          {
            id: 'minne',
            label: 'Minnesbukett',
            value: 'minne',
            description: 'Till gravplats eller ceremoni',
            filterCriteria: { subCategories: ['minnesbuketter'] },
          },
        ],
        validation: { required: true },
      },
      {
        id: 'farg-begravning',
        title: 'Vilka färger passar?',
        description: 'Traditionellt används ljusa färger, men du kan välja utifrån den avlidnas önskemål',
        type: 'single_choice',
        options: [
          { id: 'vit', label: 'Vitt (frid)', value: 'vit', filterCriteria: { colors: ['vit'] } },
          { id: 'rosa', label: 'Rosa/Ljust', value: 'rosa', filterCriteria: { colors: ['rosa'] } },
          { id: 'rod', label: 'Rött (kärlek)', value: 'rod', filterCriteria: { colors: ['röd'] } },
          { id: 'gul', label: 'Gult (vänskap)', value: 'gul', filterCriteria: { colors: ['gul'] } },
          { id: 'blandad', label: 'Blandade färger', value: 'blandad' },
        ],
        validation: { required: true },
      },
      {
        id: 'budget-begravning',
        title: 'Budget',
        type: 'single_choice',
        options: [
          { id: 'under-500', label: 'Under 500 kr', value: 'under-500', filterCriteria: { priceMax: 500 } },
          { id: '500-1000', label: '500-1000 kr', value: '500-1000', filterCriteria: { priceMin: 500, priceMax: 1000 } },
          { id: '1000-1500', label: '1000-1500 kr', value: '1000-1500', filterCriteria: { priceMin: 1000, priceMax: 1500 } },
          { id: 'over-1500', label: 'Över 1500 kr', value: 'over-1500', filterCriteria: { priceMin: 1500 } },
        ],
        validation: { required: true },
      },
    ],
    resultCount: 6,
    ctaText: 'Visa begravningsblommor',
  },

  'presenter-till-henne': {
    id: 'presenter-till-henne',
    slug: 'presenter-till-henne',
    title: 'Hitta present till henne',
    description: 'Vi hjälper dig hitta den perfekta presenten för henne',
    metaTitle: 'Blommor som present – hitta rätt i fyra steg',
    metaDescription:
      'Fyra frågor om relation, tillfälle och budget, sedan visar vi buketter som passar och vad de kostar inklusive budavgift.',
    steps: [
      {
        id: 'relation',
        title: 'Vem är hon för dig?',
        type: 'single_choice',
        options: [
          { id: 'partner', label: 'Partner/Fru/Flickvän', value: 'partner', filterCriteria: { subCategories: ['karlek-romantik'] } },
          { id: 'mamma', label: 'Mamma', value: 'mamma', filterCriteria: { subCategories: ['mors-dag', 'tackblommor'] } },
          { id: 'syster', label: 'Syster', value: 'syster' },
          { id: 'van', label: 'Vän', value: 'van', filterCriteria: { subCategories: ['fodelsedags-blommor'] } },
          { id: 'kollega', label: 'Kollega', value: 'kollega', filterCriteria: { mainCategory: 'foretag' } },
          { id: 'annan', label: 'Annan', value: 'annan' },
        ],
        validation: { required: true },
      },
      {
        id: 'tillfalle-henne',
        title: 'Vad är anledningen?',
        type: 'single_choice',
        options: [
          { id: 'fodelsedag', label: 'Födelsedag', value: 'fodelsedag', filterCriteria: { subCategories: ['fodelsedags-blommor'] } },
          { id: 'tack', label: 'Tack', value: 'tack', filterCriteria: { subCategories: ['tackblommor'] } },
          { id: 'karlek', label: 'Kärlek', value: 'karlek', filterCriteria: { subCategories: ['karlek-romantik'] } },
          { id: 'bara-for-att', label: 'Bara för att', value: 'bara-for-att' },
          { id: 'ursakt', label: 'Ursäkt', value: 'ursakt', filterCriteria: { subCategories: ['ursakt-blommor'] } },
        ],
        validation: { required: true },
      },
      {
        id: 'stil',
        title: 'Vilken stil gillar hon?',
        type: 'single_choice',
        options: [
          { id: 'klassisk', label: 'Klassisk & Elegant', value: 'klassisk', filterCriteria: { styles: ['klassisk'] } },
          { id: 'modern', label: 'Modern & Trendig', value: 'modern', filterCriteria: { styles: ['modern'] } },
          { id: 'romantisk', label: 'Romantisk', value: 'romantisk', filterCriteria: { styles: ['romantisk'] } },
          { id: 'farglad', label: 'Färgglad & Glad', value: 'farglad', filterCriteria: { subCategories: ['blandade-farger'] } },
          { id: 'vet-ej', label: 'Vet ej', value: 'vet-ej' },
        ],
        validation: { required: true },
      },
      {
        id: 'budget-henne',
        title: 'Din budget',
        type: 'single_choice',
        options: [
          { id: 'under-400', label: 'Under 400 kr', value: 'under-400', filterCriteria: { priceMax: 400 } },
          { id: '400-600', label: '400-600 kr', value: '400-600', filterCriteria: { priceMin: 400, priceMax: 600 } },
          { id: '600-800', label: '600-800 kr', value: '600-800', filterCriteria: { priceMin: 600, priceMax: 800 } },
          { id: 'over-800', label: 'Över 800 kr', value: 'over-800', filterCriteria: { priceMin: 800 } },
        ],
        validation: { required: true },
      },
    ],
    resultCount: 8,
    ctaText: 'Visa presenter till henne',
  },

  'brollopsblommor': {
    id: 'brollopsblommor',
    slug: 'brollopsblommor',
    title: 'Bröllopsblommor',
    description: 'Hitta perfekta blommor för bröllopet',
    metaTitle: 'Bröllopsblommor – hitta rätt i fyra steg',
    metaDescription: 'Fyra frågor om mottagare, tillfälle och budget, sedan visar vi buketter som passar och vad de kostar inklusive budavgift.',
    steps: [
      {
        id: 'brollop-typ',
        title: 'Vad behöver du blommor till?',
        type: 'multiple_choice',
        options: [
          { id: 'brudbukett', label: 'Brudbukett', value: 'brudbukett', filterCriteria: { subCategories: ['brudbuketter'] } },
          { id: 'brudtarna', label: 'Brudtärnebuketter', value: 'brudtarna', filterCriteria: { subCategories: ['brollopsbuketter'] } },
          { id: 'bordsdekoration', label: 'Bordsdekoration', value: 'bord', filterCriteria: { subCategories: ['bordsdekoration'] } },
          { id: 'kyrka', label: 'Kyrkodekoration', value: 'kyrka', filterCriteria: { subCategories: ['kyrko-dekoration'] } },
        ],
        validation: { required: true, minSelections: 1 },
      },
      {
        id: 'brollop-stil',
        title: 'Bröllops stil',
        type: 'single_choice',
        options: [
          { id: 'klassisk', label: 'Klassiskt & Traditionellt', value: 'klassisk' },
          { id: 'romantisk', label: 'Romantiskt & Drömskt', value: 'romantisk' },
          { id: 'modern', label: 'Modernt & Minimalistiskt', value: 'modern' },
          { id: 'rustik', label: 'Rustikt & Lantligt', value: 'rustik' },
          { id: 'bohemiskt', label: 'Bohemiskt', value: 'bohemiskt' },
        ],
        validation: { required: true },
      },
      {
        id: 'brollop-farg',
        title: 'Färgtema',
        type: 'multiple_choice',
        options: [
          { id: 'vit', label: 'Vitt', value: 'vit', filterCriteria: { colors: ['vit'] } },
          { id: 'rosa', label: 'Rosa', value: 'rosa', filterCriteria: { colors: ['rosa'] } },
          { id: 'lila', label: 'Lavendel/Lila', value: 'lila', filterCriteria: { colors: ['lila'] } },
          { id: 'persika', label: 'Persika/Aprikos', value: 'persika' },
          { id: 'burgundy', label: 'Burgundy/Vinröd', value: 'burgundy', filterCriteria: { colors: ['röd'] } },
          { id: 'gron', label: 'Grönt & Vitt', value: 'gron' },
        ],
        validation: { required: false, maxSelections: 3 },
      },
    ],
    resultCount: 10,
    ctaText: 'Visa bröllopsblommor',
  },

  'foretags-blommor': {
    id: 'foretags-blommor',
    slug: 'foretags-blommor',
    title: 'Företagsblommor',
    description: 'Hitta rätt blommor för ditt företag',
    metaTitle: 'Företagsblommor – hitta rätt i fyra steg',
    metaDescription: 'Fyra frågor om tillfälle, mottagare och budget, sedan visar vi blommor för kontor, representation och event med totalpris.',
    steps: [
      {
        id: 'foretag-typ',
        title: 'Vad ska blommorna användas till?',
        type: 'single_choice',
        options: [
          { id: 'kontor', label: 'Kontorsblommor', value: 'kontor', filterCriteria: { subCategories: ['kontorsblommor'] } },
          { id: 'representation', label: 'Representation', value: 'representation', filterCriteria: { subCategories: ['representationsblommor'] } },
          { id: 'event', label: 'Event/Tillställning', value: 'event', filterCriteria: { subCategories: ['event-blommor'] } },
          { id: 'tack-personal', label: 'Tack till personal', value: 'tack', filterCriteria: { subCategories: ['tackblommor'] } },
          { id: 'gratulation', label: 'Gratulation till kund/partner', value: 'gratulation', filterCriteria: { subCategories: ['gratulationer'] } },
        ],
        validation: { required: true },
      },
      {
        id: 'foretag-antal',
        title: 'Hur många buketter/arrangemang?',
        type: 'single_choice',
        options: [
          { id: '1', label: '1 styck', value: '1' },
          { id: '2-5', label: '2-5 stycken', value: '2-5' },
          { id: '6-10', label: '6-10 stycken', value: '6-10' },
          { id: '10+', label: 'Fler än 10', value: '10+' },
        ],
        validation: { required: true },
      },
      {
        id: 'foretag-budget',
        title: 'Budget per arrangemang',
        type: 'single_choice',
        options: [
          { id: 'under-500', label: 'Under 500 kr', value: 'under-500', filterCriteria: { priceMax: 500 } },
          { id: '500-800', label: '500-800 kr', value: '500-800', filterCriteria: { priceMin: 500, priceMax: 800 } },
          { id: '800-1200', label: '800-1200 kr', value: '800-1200', filterCriteria: { priceMin: 800, priceMax: 1200 } },
          { id: 'over-1200', label: 'Över 1200 kr', value: 'over-1200', filterCriteria: { priceMin: 1200 } },
        ],
        validation: { required: true },
      },
    ],
    resultCount: 8,
    ctaText: 'Visa företagsblommor',
  },
}

export const getWizardConfig = (wizardId: string): WizardConfig | undefined => {
  return WIZARD_CONFIGS[wizardId]
}

export const getAllWizards = (): WizardConfig[] => {
  return Object.values(WIZARD_CONFIGS)
}
