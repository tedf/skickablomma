import { MainCategory, SubCategory, Category } from '@/types'

// =============================================================================
// HUVUDKATEGORIER
// =============================================================================

export const MAIN_CATEGORIES: Record<MainCategory, Category> = {
  buketter: {
    id: 'buketter',
    slug: 'buketter',
    name: 'Bukett',
    namePlural: 'Buketter',
    description: 'Vackra blomsterbuketter för alla tillfällen',
    metaTitle: 'Buketter - Skicka vackra blommor | Skicka Blomma',
    metaDescription:
      'Hitta den perfekta buketten för varje tillfälle. Jämför priser från Interflora, Cramers och fler. Leverans samma dag möjlig.',
    productCount: 0,
    isActive: true,
    sortOrder: 1,
    seoContent: {
      intro:
        'Hos oss hittar du ett brett utbud av vackra buketter för alla tillfällen. Oavsett om du söker en romantisk bukett till din partner, en färgglad födelsedagsbukett eller en elegant bukett för att tacka någon - vi hjälper dig hitta rätt.',
      faq: [
        {
          id: 'buketter-faq-1',
          question: 'Hur lång tid håller en bukett?',
          answer:
            'En bukett håller vanligtvis 5-10 dagar beroende på blomsorter och skötsel. Byt vatten varannan dag och klipp stjälkarna för längre hållbarhet.',
          sortOrder: 1,
        },
        {
          id: 'buketter-faq-2',
          question: 'Kan jag få buketten levererad samma dag?',
          answer:
            'Ja, flera av våra partners erbjuder leverans samma dag om du beställer före kl 13-14. Välj filtret "Samma dag leverans" för att se tillgängliga buketter.',
          sortOrder: 2,
        },
      ],
    },
  },
  begravning: {
    id: 'begravning',
    slug: 'begravning',
    name: 'Begravningsblomma',
    namePlural: 'Begravningsblommor',
    description: 'Värdiga begravningsarrangemang och kransar',
    metaTitle: 'Begravningsblommor - Kransar & Buketter | Skicka Blomma',
    metaDescription:
      'Begravningsblommor med värdighet. Kransar, begravningsbuketter och kondoleanser. Leverans direkt till kyrka eller begravningsplats.',
    productCount: 0,
    isActive: true,
    sortOrder: 2,
    seoContent: {
      intro:
        'Att välja begravningsblommor är ett sätt att visa sin sista hälsning till någon man bryr sig om. Vi erbjuder ett brett sortiment av begravningskransar, buketter och arrangemang som uttrycker respekt och saknad.',
      faq: [
        {
          id: 'begravning-faq-1',
          question: 'Hur väljer jag rätt begravningsblommor?',
          answer:
            'Välj blommor som speglar den avlidnas personlighet eller favoritfärger. Vita blommor symboliserar frid, röda visar kärlek och gula uttrycker vänskap.',
          sortOrder: 1,
        },
        {
          id: 'begravning-faq-2',
          question: 'Kan blommorna levereras direkt till kyrkan?',
          answer:
            'Ja, de flesta av våra partners kan leverera direkt till kyrka eller begravningsplats. Ange leveransadressen och tidpunkt vid beställning.',
          sortOrder: 2,
        },
      ],
    },
  },
  brollop: {
    id: 'brollop',
    slug: 'brollop',
    name: 'Bröllopsblomma',
    namePlural: 'Bröllopsblommor',
    description: 'Brudbuketter och bröllopsdekorationer',
    metaTitle: 'Bröllopsblommor - Brudbuketter & Dekorationer | Skicka Blomma',
    metaDescription:
      'Skapa det perfekta bröllopet med vackra brudblommor. Brudbuketter, bordsdekoration och kyrkoarrangemang från Sveriges bästa florister.',
    productCount: 0,
    isActive: true,
    sortOrder: 3,
  },
  foretag: {
    id: 'foretag',
    slug: 'foretag',
    name: 'Företagsblomma',
    namePlural: 'Företagsblommor',
    description: 'Blommor för kontor, event och representation',
    metaTitle: 'Företagsblommor - Kontor & Event | Skicka Blomma',
    metaDescription:
      'Professionella blomsterarrangemang för företag. Kontorsblommor, eventblommor och representationsblommor med faktura.',
    productCount: 0,
    isActive: false, // No products in feed
    sortOrder: 4,
  },
  presenter: {
    id: 'presenter',
    slug: 'presenter',
    name: 'Present',
    namePlural: 'Presenter',
    description: 'Choklad, vin och andra presentartiklar',
    metaTitle: 'Presenter - Choklad, Vin & Mer | Skicka Blomma',
    metaDescription:
      'Kombinera blommor med presenter! Choklad, vin, nallar och andra gåvor som kompletterar din blomsterhälsning.',
    productCount: 0,
    isActive: false, // No products in feed
    sortOrder: 5,
  },
  'konstgjorda-blommor': {
    id: 'konstgjorda-blommor',
    slug: 'konstgjorda-blommor',
    name: 'Konstgjord blomma',
    namePlural: 'Konstgjorda blommor',
    description: 'Sidenblommor och konstgjorda arrangemang',
    metaTitle: 'Konstgjorda Blommor - Sidenblommor | Skicka Blomma',
    metaDescription:
      'Underhållsfria konstgjorda blommor som ser ut som äkta. Perfekta för allergiker och för att dekorera hemmet året runt.',
    productCount: 0,
    isActive: true,
    sortOrder: 6,
  },
  'samma-dag-leverans': {
    id: 'samma-dag-leverans',
    slug: 'samma-dag-leverans',
    name: 'Samma dag leverans',
    namePlural: 'Samma dag leverans',
    description: 'Blommor som kan levereras idag',
    metaTitle: 'Blommor Samma Dag - Expressleverans | Skicka Blomma',
    metaDescription:
      'Beställ blommor med leverans samma dag! Skicka blommor idag till någon du bryr dig om. Beställ före kl 13-14.',
    productCount: 0,
    isActive: false, // No same-day-delivery data in feed
    sortOrder: 7,
    seoContent: {
      intro:
        'Behöver du skicka blommor snabbt? Många av våra partners erbjuder leverans samma dag om du beställer före kl 13-14. Perfekt när du glömt en födelsedag eller vill överraska någon idag!',
      faq: [
        {
          id: 'samma-dag-faq-1',
          question: 'Hur sent kan jag beställa för leverans samma dag?',
          answer:
            'Beställningsgränsen varierar mellan partners: Interflora kl 13:00, Cramers kl 14:00. Efter dessa tider levereras blommorna nästa dag.',
          sortOrder: 1,
        },
      ],
    },
  },
  budget: {
    id: 'budget',
    slug: 'billiga-blommor',
    name: 'Billig blomma',
    namePlural: 'Billiga blommor',
    description: 'Blommor under 300 kr',
    metaTitle: 'Billiga Blommor Under 300 kr | Skicka Blomma',
    metaDescription:
      'Vackra buketter behöver inte vara dyra! Hitta blommor under 300 kr som fortfarande imponerar. Jämför priser från flera butiker.',
    productCount: 0,
    isActive: false, // Use price filter on buketter instead
    sortOrder: 8,
  },
}

// =============================================================================
// UNDERKATEGORIER
// =============================================================================

export const SUB_CATEGORIES: Record<SubCategory, Omit<Category, 'productCount' | 'isActive' | 'sortOrder'>> = {
  // Färger
  'roda-blommor': {
    id: 'roda-blommor',
    slug: 'roda-blommor',
    name: 'Röd blomma',
    namePlural: 'Röda blommor',
    description: 'Buketter med röda blommor - passion och kärlek',
    metaTitle: 'Röda Blommor - Buketter i Rött | Skicka Blomma',
    metaDescription:
      'Röda blommor symboliserar passion och kärlek. Perfekta för romantiska tillfällen eller för att visa djup uppskattning.',
    parentCategory: 'buketter',
  },
  'rosa-blommor': {
    id: 'rosa-blommor',
    slug: 'rosa-blommor',
    name: 'Rosa blomma',
    namePlural: 'Rosa blommor',
    description: 'Buketter med rosa blommor - elegans och ömhet',
    metaTitle: 'Rosa Blommor - Buketter i Rosa | Skicka Blomma',
    metaDescription:
      'Rosa blommor utstrålar elegans och ömhet. Passa perfekt för födelsedagar, tack eller bara för att glädja någon.',
    parentCategory: 'buketter',
  },
  'vita-blommor': {
    id: 'vita-blommor',
    slug: 'vita-blommor',
    name: 'Vit blomma',
    namePlural: 'Vita blommor',
    description: 'Buketter med vita blommor - renhet och elegans',
    metaTitle: 'Vita Blommor - Buketter i Vitt | Skicka Blomma',
    metaDescription:
      'Vita blommor symboliserar renhet och elegans. Perfekta för bröllop, sympati eller för att skapa en lugn atmosfär.',
    parentCategory: 'buketter',
  },
  'gula-blommor': {
    id: 'gula-blommor',
    slug: 'gula-blommor',
    name: 'Gul blomma',
    namePlural: 'Gula blommor',
    description: 'Buketter med gula blommor - glädje och vänskap',
    metaTitle: 'Gula Blommor - Buketter i Gult | Skicka Blomma',
    metaDescription:
      'Gula blommor sprider glädje och symboliserar vänskap. Perfekta för att lysa upp någons dag.',
    parentCategory: 'buketter',
  },
  'lila-blommor': {
    id: 'lila-blommor',
    slug: 'lila-blommor',
    name: 'Lila blomma',
    namePlural: 'Lila blommor',
    description: 'Buketter med lila blommor - mystik och lyx',
    metaTitle: 'Lila Blommor - Buketter i Lila | Skicka Blomma',
    metaDescription:
      'Lila blommor utstrålar mystik och lyx. Perfekta för speciella tillfällen och för att imponera.',
    parentCategory: 'buketter',
  },
  'orange-blommor': {
    id: 'orange-blommor',
    slug: 'orange-blommor',
    name: 'Orange blomma',
    namePlural: 'Orange blommor',
    description: 'Buketter med orange blommor - energi och entusiasm',
    metaTitle: 'Orange Blommor - Buketter i Orange | Skicka Blomma',
    metaDescription:
      'Orange blommor symboliserar energi och entusiasm. Perfekta för att sprida gott humör.',
    parentCategory: 'buketter',
  },
  'blandade-farger': {
    id: 'blandade-farger',
    slug: 'blandade-farger',
    name: 'Blandad bukett',
    namePlural: 'Blandade buketter',
    description: 'Färgglada buketter med blandade färger',
    metaTitle: 'Blandade Buketter - Färgglada Blommor | Skicka Blomma',
    metaDescription:
      'Färgglada buketter med en mix av blommor i olika nyanser. Perfekta för alla tillfällen.',
    parentCategory: 'buketter',
  },

  // Blomtyper
  rosor: {
    id: 'rosor',
    slug: 'rosor',
    name: 'Ros',
    namePlural: 'Rosor',
    description: 'Klassiska rosbuketter i alla färger',
    metaTitle: 'Rosor - Klassiska Rosbuketter | Skicka Blomma',
    metaDescription:
      'Rosor är den klassiska blomman för kärlek. Röda rosor för passion, rosa för ömhet, vita för renhet.',
    parentCategory: 'buketter',
  },
  tulpaner: {
    id: 'tulpaner',
    slug: 'tulpaner',
    name: 'Tulpan',
    namePlural: 'Tulpaner',
    description: 'Fräscha tulpaner för vårkänsla året runt',
    metaTitle: 'Tulpaner - Våriga Buketter | Skicka Blomma',
    metaDescription:
      'Tulpaner sprider vårkänsla och glädje. Perfekta för att fira våren eller bara lysa upp vardagen.',
    parentCategory: 'buketter',
  },
  liljor: {
    id: 'liljor',
    slug: 'liljor',
    name: 'Lilja',
    namePlural: 'Liljor',
    description: 'Eleganta liljor med fantastisk doft',
    metaTitle: 'Liljor - Eleganta Buketter | Skicka Blomma',
    metaDescription:
      'Liljor är kända för sin elegans och underbara doft. Perfekta för speciella tillfällen.',
    parentCategory: 'buketter',
  },
  solrosor: {
    id: 'solrosor',
    slug: 'solrosor',
    name: 'Solros',
    namePlural: 'Solrosor',
    description: 'Glada solrosor som sprider solsken',
    metaTitle: 'Solrosor - Glada Buketter | Skicka Blomma',
    metaDescription:
      'Solrosor sprider glädje och värme. Perfekta för att lysa upp någons dag med solsken.',
    parentCategory: 'buketter',
  },
  orkideer: {
    id: 'orkideer',
    slug: 'orkideer',
    name: 'Orkidé',
    namePlural: 'Orkidéer',
    description: 'Exotiska orkidéer som krukväxt eller snittblomma',
    metaTitle: 'Orkidéer - Exotiska Blommor | Skicka Blomma',
    metaDescription:
      'Orkidéer är exotiska och eleganta. Perfekta som present eller för att dekorera hemmet.',
    parentCategory: 'buketter',
  },
  pioner: {
    id: 'pioner',
    slug: 'pioner',
    name: 'Pion',
    namePlural: 'Pioner',
    description: 'Romantiska pioner - sommarens favorit',
    metaTitle: 'Pioner - Romantiska Buketter | Skicka Blomma',
    metaDescription:
      'Pioner är sommarens mest romantiska blomma. Perfekta för bröllop och speciella tillfällen.',
    parentCategory: 'buketter',
  },
  hortensia: {
    id: 'hortensia',
    slug: 'hortensia',
    name: 'Hortensia',
    namePlural: 'Hortensior',
    description: 'Fyllda hortensior i vackra färger',
    metaTitle: 'Hortensior - Fyllda Buketter | Skicka Blomma',
    metaDescription:
      'Hortensior ger volym och elegans till varje bukett. Perfekta för stora arrangemang.',
    parentCategory: 'buketter',
  },

  // Tillfällen
  'fodelsedags-blommor': {
    id: 'fodelsedags-blommor',
    slug: 'fodelsedags-blommor',
    name: 'Födelsedagsblomma',
    namePlural: 'Födelsedagsblommor',
    description: 'Buketter perfekta för födelsedagar',
    metaTitle: 'Födelsedagsblommor - Fira med Blommor | Skicka Blomma',
    metaDescription:
      'Överraska med blommor på födelsedagen! Färgglada och festliga buketter som gör dagen extra speciell.',
    parentCategory: 'buketter',
  },
  tackblommor: {
    id: 'tackblommor',
    slug: 'tackblommor',
    name: 'Tackblomma',
    namePlural: 'Tackblommor',
    description: 'Blommor för att säga tack',
    metaTitle: 'Tackblommor - Säg Tack med Blommor | Skicka Blomma',
    metaDescription:
      'Visa din uppskattning med en vacker tackhälsning. Blommor som säger mer än tusen ord.',
    parentCategory: 'buketter',
  },
  gratulationer: {
    id: 'gratulationer',
    slug: 'gratulationer',
    name: 'Gratulationsblomma',
    namePlural: 'Gratulationsblommor',
    description: 'Blommor för att gratulera',
    metaTitle: 'Gratulationsblommor | Skicka Blomma',
    metaDescription:
      'Gratulera med stil! Blommor för examen, nytt jobb, ny bostad eller andra framgångar.',
    parentCategory: 'buketter',
  },
  'karlek-romantik': {
    id: 'karlek-romantik',
    slug: 'karlek-romantik',
    name: 'Kärleksblomma',
    namePlural: 'Kärleksblommor',
    description: 'Romantiska blommor för din älskade',
    metaTitle: 'Kärleksblommor - Romantiska Buketter | Skicka Blomma',
    metaDescription:
      'Visa din kärlek med romantiska blommor. Röda rosor, hjärtformade buketter och mer.',
    parentCategory: 'buketter',
  },
  'ursakt-blommor': {
    id: 'ursakt-blommor',
    slug: 'ursakt-blommor',
    name: 'Ursäktsblomma',
    namePlural: 'Ursäktsblommor',
    description: 'Blommor för att be om ursäkt',
    metaTitle: 'Ursäktsblommor - Be om Förlåtelse | Skicka Blomma',
    metaDescription:
      'Ibland behövs en extra gest. Blommor kan hjälpa dig att be om ursäkt på ett fint sätt.',
    parentCategory: 'buketter',
  },
  kramblommor: {
    id: 'kramblommor',
    slug: 'kramblommor',
    name: 'Kramblomma',
    namePlural: 'Kramblommor',
    description: 'Skicka en blommig kram',
    metaTitle: 'Kramblommor - Skicka en Kram | Skicka Blomma',
    metaDescription:
      'Kan du inte vara där personligen? Skicka en blommig kram istället!',
    parentCategory: 'buketter',
  },

  // Säsong
  'var-blommor': {
    id: 'var-blommor',
    slug: 'var-blommor',
    name: 'Vårblomma',
    namePlural: 'Vårblommor',
    description: 'Fräscha vårblommor som tulpaner och påskliljor',
    metaTitle: 'Vårblommor - Fräscha Buketter | Skicka Blomma',
    metaDescription:
      'Fira våren med fräscha vårblommor! Tulpaner, påskliljor och andra vårfavoriter.',
    parentCategory: 'buketter',
  },
  'sommar-blommor': {
    id: 'sommar-blommor',
    slug: 'sommar-blommor',
    name: 'Sommarblomma',
    namePlural: 'Sommarblommor',
    description: 'Färgglada sommarblommor fulla av liv',
    metaTitle: 'Sommarblommor - Färgglada Buketter | Skicka Blomma',
    metaDescription:
      'Njut av sommarens alla färger! Solrosor, dahlior och andra sommarfavoriter.',
    parentCategory: 'buketter',
  },
  'host-blommor': {
    id: 'host-blommor',
    slug: 'host-blommor',
    name: 'Höstblomma',
    namePlural: 'Höstblommor',
    description: 'Höstens varma färger i bukett',
    metaTitle: 'Höstblommor - Varma Färger | Skicka Blomma',
    metaDescription:
      'Höstens varma färger i vackra buketter. Orange, röda och gula toner som värmer.',
    parentCategory: 'buketter',
  },
  'jul-blommor': {
    id: 'jul-blommor',
    slug: 'jul-blommor',
    name: 'Julblomma',
    namePlural: 'Julblommor',
    description: 'Julstämning med blommor',
    metaTitle: 'Julblommor - Festliga Arrangemang | Skicka Blomma',
    metaDescription:
      'Skapa julstämning med vackra julblommor! Julstjärnor, amaryllis och festliga arrangemang.',
    parentCategory: 'buketter',
  },

  // Högtider
  'mors-dag': {
    id: 'mors-dag',
    slug: 'mors-dag',
    name: 'Mors dag-blomma',
    namePlural: 'Mors dag-blommor',
    description: 'Fira mamma med blommor på mors dag',
    metaTitle: 'Mors Dag Blommor 2025 | Skicka Blomma',
    metaDescription:
      'Överraska mamma med vackra blommor på mors dag! Beställ i tid för garanterad leverans.',
    parentCategory: 'buketter',
  },
  'fars-dag': {
    id: 'fars-dag',
    slug: 'fars-dag',
    name: 'Fars dag-blomma',
    namePlural: 'Fars dag-blommor',
    description: 'Fira pappa med blommor på fars dag',
    metaTitle: 'Fars Dag Blommor 2025 | Skicka Blomma',
    metaDescription:
      'Överraska pappa med blommor på fars dag! Klassiska och stilfulla buketter.',
    parentCategory: 'buketter',
  },
  'alla-hjartans-dag': {
    id: 'alla-hjartans-dag',
    slug: 'alla-hjartans-dag',
    name: 'Alla hjärtans dag-blomma',
    namePlural: 'Alla hjärtans dag-blommor',
    description: 'Romantiska blommor för alla hjärtans dag',
    metaTitle: 'Alla Hjärtans Dag Blommor 2025 | Skicka Blomma',
    metaDescription:
      'Fira kärleken med romantiska blommor! Röda rosor och hjärtformade buketter för alla hjärtans dag.',
    parentCategory: 'buketter',
  },
  pask: {
    id: 'pask',
    slug: 'pask-blommor',
    name: 'Påskblomma',
    namePlural: 'Påskblommor',
    description: 'Våriga påskblommor',
    metaTitle: 'Påskblommor 2025 | Skicka Blomma',
    metaDescription:
      'Fira påsk med fräscha vårblommor! Påskliljor, tulpaner och andra våriga favoriter.',
    parentCategory: 'buketter',
  },
  student: {
    id: 'student',
    slug: 'student-blommor',
    name: 'Studentblomma',
    namePlural: 'Studentblommor',
    description: 'Gratulera studenten med blommor',
    metaTitle: 'Studentblommor 2025 | Skicka Blomma',
    metaDescription:
      'Gratulera studenten med vackra blommor! Festliga buketter för den stora dagen.',
    parentCategory: 'buketter',
  },
  midsommar: {
    id: 'midsommar',
    slug: 'midsommar-blommor',
    name: 'Midsommarblomma',
    namePlural: 'Midsommarblommor',
    description: 'Somriga midsommarblommor',
    metaTitle: 'Midsommarblommor 2025 | Skicka Blomma',
    metaDescription:
      'Fira midsommar med svenska sommarblommor! Traditionella och moderna buketter.',
    parentCategory: 'buketter',
  },

  // Prisklass
  'under-300-kr': {
    id: 'under-300-kr',
    slug: 'under-300-kr',
    name: 'Bukett under 300 kr',
    namePlural: 'Buketter under 300 kr',
    description: 'Fina buketter för liten budget',
    metaTitle: 'Blommor Under 300 kr | Skicka Blomma',
    metaDescription:
      'Vackra buketter behöver inte vara dyra. Hitta blommor under 300 kr inklusive leverans.',
    parentCategory: 'budget',
  },
  'under-500-kr': {
    id: 'under-500-kr',
    slug: 'under-500-kr',
    name: 'Bukett under 500 kr',
    namePlural: 'Buketter under 500 kr',
    description: 'Buketter för 300-500 kr',
    metaTitle: 'Blommor Under 500 kr | Skicka Blomma',
    metaDescription:
      'Stort urval av buketter för 300-500 kr. Bra pris utan att kompromissa med kvaliteten.',
    parentCategory: 'budget',
  },
  'under-700-kr': {
    id: 'under-700-kr',
    slug: 'under-700-kr',
    name: 'Bukett under 700 kr',
    namePlural: 'Buketter under 700 kr',
    description: 'Buketter för 500-700 kr',
    metaTitle: 'Blommor Under 700 kr | Skicka Blomma',
    metaDescription:
      'Imponerande buketter för 500-700 kr. Perfekta för speciella tillfällen.',
    parentCategory: 'budget',
  },
  premium: {
    id: 'premium',
    slug: 'premium-buketter',
    name: 'Premium-bukett',
    namePlural: 'Premium-buketter',
    description: 'Lyxiga buketter för speciella tillfällen',
    metaTitle: 'Premium Buketter - Lyxiga Blommor | Skicka Blomma',
    metaDescription:
      'Lyxiga premium-buketter som imponerar. Utvalda blommor och exklusiva arrangemang.',
    parentCategory: 'buketter',
  },

  // Begravning
  begravningskransar: {
    id: 'begravningskransar',
    slug: 'begravningskransar',
    name: 'Begravningskrans',
    namePlural: 'Begravningskransar',
    description: 'Värdiga kransar för begravning',
    metaTitle: 'Begravningskransar | Skicka Blomma',
    metaDescription:
      'Traditionella begravningskransar som visar respekt och saknad. Leverans till kyrka eller kapell.',
    parentCategory: 'begravning',
  },
  begravningsbuketter: {
    id: 'begravningsbuketter',
    slug: 'begravningsbuketter',
    name: 'Begravningsbukett',
    namePlural: 'Begravningsbuketter',
    description: 'Avskedsbuketter för begravning',
    metaTitle: 'Begravningsbuketter | Skicka Blomma',
    metaDescription:
      'Värdiga begravningsbuketter som sista hälsning. Eleganta arrangemang med respekt.',
    parentCategory: 'begravning',
  },
  kondoleanser: {
    id: 'kondoleanser',
    slug: 'kondoleanser',
    name: 'Kondoleans',
    namePlural: 'Kondoleanser',
    description: 'Kondoleanser och sympatiblommor',
    metaTitle: 'Kondoleanser - Sympatiblommor | Skicka Blomma',
    metaDescription:
      'Visa medkänsla med sympatiblommor. Diskreta och värdiga arrangemang för svåra stunder.',
    parentCategory: 'begravning',
  },
  minnesbuketter: {
    id: 'minnesbuketter',
    slug: 'minnesbuketter',
    name: 'Minnesbukett',
    namePlural: 'Minnesbuketter',
    description: 'Blommor för att minnas',
    metaTitle: 'Minnesbuketter | Skicka Blomma',
    metaDescription:
      'Vackra minnesbuketter för att hedra någons minne. Till gravplats eller minnesceremoni.',
    parentCategory: 'begravning',
  },

  // Bröllop
  brudbuketter: {
    id: 'brudbuketter',
    slug: 'brudbuketter',
    name: 'Brudbukett',
    namePlural: 'Brudbuketter',
    description: 'Klassiska och moderna brudbuketter',
    metaTitle: 'Brudbuketter 2025 | Skicka Blomma',
    metaDescription:
      'Hitta den perfekta brudbuketten! Klassiska, romantiska och moderna brudbuketter för ditt bröllop.',
    parentCategory: 'brollop',
  },
  brollopsbuketter: {
    id: 'brollopsbuketter',
    slug: 'brollopsbuketter',
    name: 'Bröllopsbukett',
    namePlural: 'Bröllopsbuketter',
    description: 'Buketter för bröllop och fest',
    metaTitle: 'Bröllopsbuketter | Skicka Blomma',
    metaDescription:
      'Buketter för hela bröllopet! Till brudtärnor, mödrar och som dekoration.',
    parentCategory: 'brollop',
  },
  bordsdekoration: {
    id: 'bordsdekoration',
    slug: 'bordsdekoration-brollop',
    name: 'Bordsdekoration',
    namePlural: 'Bordsdekorationer',
    description: 'Bordsarrangemang för bröllopsfest',
    metaTitle: 'Bordsdekoration Bröllop | Skicka Blomma',
    metaDescription:
      'Vackra bordsarrangemang för bröllopsfesten. Skapa rätt stämning med blommor.',
    parentCategory: 'brollop',
  },
  'kyrko-dekoration': {
    id: 'kyrko-dekoration',
    slug: 'kyrko-dekoration',
    name: 'Kyrkodekoration',
    namePlural: 'Kyrkodekorationer',
    description: 'Blomsterdekoration för kyrkan',
    metaTitle: 'Kyrkodekoration Bröllop | Skicka Blomma',
    metaDescription:
      'Dekorera kyrkan med vackra blommor! Altararrangemang och dekoration för vigseln.',
    parentCategory: 'brollop',
  },

  // Företag
  kontorsblommor: {
    id: 'kontorsblommor',
    slug: 'kontorsblommor',
    name: 'Kontorsblomma',
    namePlural: 'Kontorsblommor',
    description: 'Blommor och växter för kontoret',
    metaTitle: 'Kontorsblommor | Skicka Blomma',
    metaDescription:
      'Lyft arbetsmiljön med vackra kontorsblommor! Växter och buketter för kontoret.',
    parentCategory: 'foretag',
  },
  representationsblommor: {
    id: 'representationsblommor',
    slug: 'representationsblommor',
    name: 'Representationsblomma',
    namePlural: 'Representationsblommor',
    description: 'Blommor för representation och möten',
    metaTitle: 'Representationsblommor | Skicka Blomma',
    metaDescription:
      'Professionella blommor för representation. Imponera på kunder och samarbetspartners.',
    parentCategory: 'foretag',
  },
  'event-blommor': {
    id: 'event-blommor',
    slug: 'event-blommor',
    name: 'Eventblomma',
    namePlural: 'Eventblommor',
    description: 'Blommor för event och tillställningar',
    metaTitle: 'Eventblommor | Skicka Blomma',
    metaDescription:
      'Blomsterarrangemang för event och tillställningar. Stora och små beställningar.',
    parentCategory: 'foretag',
  },
}

// =============================================================================
// HJÄLPFUNKTIONER
// =============================================================================

export const getMainCategory = (id: MainCategory): Category => {
  return MAIN_CATEGORIES[id]
}

export const getSubCategory = (id: SubCategory): Omit<Category, 'productCount' | 'isActive' | 'sortOrder'> => {
  return SUB_CATEGORIES[id]
}

export const getAllMainCategories = (): Category[] => {
  return Object.values(MAIN_CATEGORIES).sort((a, b) => a.sortOrder - b.sortOrder)
}

export const getSubCategoriesByParent = (parentId: MainCategory): SubCategory[] => {
  return (Object.entries(SUB_CATEGORIES) as [SubCategory, typeof SUB_CATEGORIES[SubCategory]][])
    .filter(([_, cat]) => cat.parentCategory === parentId)
    .map(([id]) => id)
}

export const getCategoryBySlug = (slug: string): Category | undefined => {
  const main = Object.values(MAIN_CATEGORIES).find((c) => c.slug === slug)
  if (main) return main

  const sub = Object.entries(SUB_CATEGORIES).find(([_, c]) => c.slug === slug)
  if (sub) {
    return {
      ...sub[1],
      productCount: 0,
      isActive: true,
      sortOrder: 0,
    }
  }

  return undefined
}
