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
    metaTitle: 'Buketter - Skicka vackra blommor',
    metaDescription:
      'Buketter från Interflora och Cramers sorterade på totalpris, alltså bukett plus budavgift. Varje pris bär datumet då vi kontrollerade det.',
    productCount: 0,
    isActive: true,
    sortOrder: 1,
    seoContent: {
      intro:
        'Buketter är den vanligaste formen av blomsterhälsning och finns i alla prisklasser. Skillnaden mellan tjänsterna ligger mindre i sortimentet än i vad budet kostar och hur sent du kan beställa. Nedan jämför vi buketter från de tjänster vi följer.',
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
            'Flera av tjänsterna levererar samma dag om beställningen ligger inne före lunch på en vardag. Använd filtret för samma dag-leverans för att se vilka buketter det gäller.',
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
    metaTitle: 'Begravningsblommor - Kransar & Buketter',
    metaDescription:
      'Kransar, sorgbuketter och kondoleansblommor med leverans till kyrka, kapell eller hem till familjen. Vad som skiljer dem åt och vad de kostar.',
    productCount: 0,
    isActive: true,
    sortOrder: 2,
    seoContent: {
      intro:
        'Att välja begravningsblommor är ett sätt att visa din sista hälsning till någon du bryr dig om. Vi samlar de vackraste begravningskransarna, begravningsbuketter och kondoleansarrangemang från Interflora och andra ledande florister. Alla blommor binds av erfarna florister och kan levereras samma dag direkt till kyrka, kapell eller begravningsplats.',
      faq: [
        {
          id: 'begravning-faq-1',
          question: 'Hur väljer jag rätt begravningsblommor?',
          answer:
            'Välj blommor som speglar den avlidnas personlighet eller favoritfärger. Vita blommor symboliserar frid och renhet, röda rosor visar djup kärlek, och pastellfärger uttrycker ömhet. En klassisk begravningskrans är alltid ett värdigt val, medan en bukett passar bra som personlig hälsning.',
          sortOrder: 1,
        },
        {
          id: 'begravning-faq-2',
          question: 'Kan blommorna levereras direkt till kyrkan?',
          answer:
            'Ja. Tjänsterna levererar till kyrka, kapell eller begravningsplats. Ange ceremoniplats, datum och klockslag vid beställning, så samordnar floristen med begravningsbyrån.',
          sortOrder: 2,
        },
        {
          id: 'begravning-faq-3',
          question: 'Vad kostar en begravningskrans?',
          answer:
            'Begravningskransar kostar vanligtvis mellan 1 500 och 3 000 kr beroende på storlek och blomval. Enklare buketter finns från 399 kr. Vi visar alltid totalpris inklusive leverans.',
          sortOrder: 3,
        },
        {
          id: 'begravning-faq-4',
          question: 'Kan jag lägga till ett textat band?',
          answer:
            'Ja, de flesta arrangemang kan kompletteras med ett textat band där du skriver en personlig hälsning. Detta väljer du i nästa steg efter att du klickat på produkten.',
          sortOrder: 4,
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
    metaTitle: 'Bröllopsblommor - Brudbuketter & Dekorationer',
    metaDescription:
      'Brudbuketter, bordsdekoration och kyrkoarrangemang. Bröllopsblommor beställs oftast hos en florist på plats, och här ser du vad de kostar.',
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
    metaTitle: 'Företagsblommor - Kontor & Event',
    metaDescription:
      'Kontorsblommor, eventblommor och representation, med faktura. Se vad tjänsterna tar för leverans och vad totalpriset landar på.',
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
    metaTitle: 'Presenter - Choklad, Vin & Mer',
    metaDescription:
      'Choklad, vin och andra gåvor som går att beställa tillsammans med blommorna. Tillvalen prissätts separat och påverkar inte budavgiften.',
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
    metaTitle: 'Konstgjorda Blommor - Sidenblommor',
    metaDescription:
      'Konstgjorda blommor kräver inget vatten och håller år efter år. De levereras som paket, inte med blombud, vilket påverkar både pris och leveranstid.',
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
    metaTitle: 'Blommor Samma Dag - Expressleverans',
    metaDescription:
      'Blommor som når mottagaren samma dag. Kräver att beställningen ligger inne före tjänstens stopptid, normalt före lunch på en vardag.',
    productCount: 0,
    isActive: false, // No same-day-delivery data in feed
    sortOrder: 7,
    seoContent: {
      intro:
        'Många av tjänsterna levererar samma dag om beställningen ligger inne före lunch på en vardag. Efter stopptiden flyttas leveransen till nästa arbetsdag.',
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
    metaTitle: 'Billiga Blommor Under 300 kr',
    metaDescription:
      'Buketter under 300 kr. Tänk på att budavgiften tillkommer och är densamma oavsett bukettens pris — jämför därför totalen, inte från-priset.',
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
    metaTitle: 'Röda Blommor - Buketter i Rött',
    metaDescription:
      'Röda blommor läses som kärlek i Sverige, vilket gör dem självklara till alla hjärtans dag och missvisande till en begravning. Se urvalet och priserna.',
    parentCategory: 'buketter',
  },
  'rosa-blommor': {
    id: 'rosa-blommor',
    slug: 'rosa-blommor',
    name: 'Rosa blomma',
    namePlural: 'Rosa blommor',
    description: 'Buketter med rosa blommor - elegans och ömhet',
    metaTitle: 'Rosa Blommor - Buketter i Rosa',
    metaDescription:
      'Rosa blommor fungerar till det mesta utan att bli laddade: födelsedag, tack eller en hälsning utan anledning. Se urvalet och totalpriset.',
    parentCategory: 'buketter',
  },
  'vita-blommor': {
    id: 'vita-blommor',
    slug: 'vita-blommor',
    name: 'Vit blomma',
    namePlural: 'Vita blommor',
    description: 'Buketter med vita blommor - renhet och elegans',
    metaTitle: 'Vita Blommor - Buketter i Vitt',
    metaDescription:
      'Vita blommor används till både bröllop och begravning. Det är sammanhanget som avgör tolkningen, inte färgen. Se urvalet och vad det kostar.',
    parentCategory: 'buketter',
  },
  'gula-blommor': {
    id: 'gula-blommor',
    slug: 'gula-blommor',
    name: 'Gul blomma',
    namePlural: 'Gula blommor',
    description: 'Buketter med gula blommor - glädje och vänskap',
    metaTitle: 'Gula Blommor - Buketter i Gult',
    metaDescription:
      'Gula blommor står för vänskap snarare än romantik, vilket gör dem trygga till en kollega eller granne. Se urvalet och totalpriset inklusive bud.',
    parentCategory: 'buketter',
  },
  'lila-blommor': {
    id: 'lila-blommor',
    slug: 'lila-blommor',
    name: 'Lila blomma',
    namePlural: 'Lila blommor',
    description: 'Buketter med lila blommor - mystik och lyx',
    metaTitle: 'Lila Blommor - Buketter i Lila',
    metaDescription:
      'Lila blommor är ovanligare än rosa och rött och sticker därför ut i en bukett. Se vilka sorter som finns och vad de kostar levererade.',
    parentCategory: 'buketter',
  },
  'orange-blommor': {
    id: 'orange-blommor',
    slug: 'orange-blommor',
    name: 'Orange blomma',
    namePlural: 'Orange blommor',
    description: 'Buketter med orange blommor - energi och entusiasm',
    metaTitle: 'Orange Blommor - Buketter i Orange',
    metaDescription:
      'Orange blommor hörs på håll och passar när buketten ska synas i ett rum. Se urvalet, från-priset och vad budavgiften lägger till.',
    parentCategory: 'buketter',
  },
  'blandade-farger': {
    id: 'blandade-farger',
    slug: 'blandade-farger',
    name: 'Blandad bukett',
    namePlural: 'Blandade buketter',
    description: 'Färgglada buketter med blandade färger',
    metaTitle: 'Blandade Buketter - Färgglada Blommor',
    metaDescription:
      'Blandade buketter kombinerar flera sorter och färger, vilket gör dem svårare att välja fel med. Se urvalet och totalpriset inklusive budavgift.',
    parentCategory: 'buketter',
  },

  // Blomtyper
  rosor: {
    id: 'rosor',
    slug: 'rosor',
    name: 'Ros',
    namePlural: 'Rosor',
    description: 'Klassiska rosbuketter i alla färger',
    metaTitle: 'Rosor - Klassiska Rosbuketter',
    metaDescription:
      'Rosor är den mest köpta snittblomman i Sverige. Röda läses som kärlek, rosa som ömhet, vita som neutrala. Se antal, längd och totalpris.',
    parentCategory: 'buketter',
  },
  tulpaner: {
    id: 'tulpaner',
    slug: 'tulpaner',
    name: 'Tulpan',
    namePlural: 'Tulpaner',
    description: 'Fräscha tulpaner för vårkänsla året runt',
    metaTitle: 'Tulpaner - Våriga Buketter',
    metaDescription:
      'Tulpaner säljs främst från januari till april och är då bland de billigaste snittblommorna. De fortsätter växa i vasen efter leverans.',
    parentCategory: 'buketter',
  },
  liljor: {
    id: 'liljor',
    slug: 'liljor',
    name: 'Lilja',
    namePlural: 'Liljor',
    description: 'Eleganta liljor med fantastisk doft',
    metaTitle: 'Liljor - Eleganta Buketter',
    metaDescription:
      'Liljor doftar starkt och håller länge, men är giftiga för katt. Se vilka sorter som finns och vad de kostar levererade.',
    parentCategory: 'buketter',
  },
  solrosor: {
    id: 'solrosor',
    slug: 'solrosor',
    name: 'Solros',
    namePlural: 'Solrosor',
    description: 'Glada solrosor som sprider solsken',
    metaTitle: 'Solrosor - Glada Buketter',
    metaDescription:
      'Solrosor är säsongsvara från juli till oktober och har grov stjälk som håller i en hand. Se urvalet och vad de kostar inklusive bud.',
    parentCategory: 'buketter',
  },
  orkideer: {
    id: 'orkideer',
    slug: 'orkideer',
    name: 'Orkidé',
    namePlural: 'Orkidéer',
    description: 'Exotiska orkidéer som krukväxt eller snittblomma',
    metaTitle: 'Orkidéer - Exotiska Blommor',
    metaDescription:
      'Orkidéer säljs som krukväxt och blommar i månader, till skillnad från en bukett. Se sorterna och vad de kostar levererade.',
    parentCategory: 'buketter',
  },
  pioner: {
    id: 'pioner',
    slug: 'pioner',
    name: 'Pion',
    namePlural: 'Pioner',
    description: 'Romantiska pioner - sommarens favorit',
    metaTitle: 'Pioner - Romantiska Buketter',
    metaDescription:
      'Pioner har kort säsong, i Sverige främst juni. Utanför den är de importerade och dyrare. Se vad de kostar just nu inklusive budavgift.',
    parentCategory: 'buketter',
  },
  hortensia: {
    id: 'hortensia',
    slug: 'hortensia',
    name: 'Hortensia',
    namePlural: 'Hortensior',
    description: 'Fyllda hortensior i vackra färger',
    metaTitle: 'Hortensior - Fyllda Buketter',
    metaDescription:
      'Hortensia finns som både snittblomma och krukväxt och ger volym med få stjälkar. Se urvalet och totalpriset inklusive leverans.',
    parentCategory: 'buketter',
  },

  // Tillfällen
  'fodelsedags-blommor': {
    id: 'fodelsedags-blommor',
    slug: 'fodelsedags-blommor',
    name: 'Födelsedagsblomma',
    namePlural: 'Födelsedagsblommor',
    description: 'Buketter perfekta för födelsedagar',
    metaTitle: 'Födelsedagsblommor - Fira med Blommor',
    metaDescription:
      'Blommor till en födelsedag har inga regler, bara en tidsgräns: de flesta tjänster kör ut samma dag om beställningen ligger inne före lunch.',
    parentCategory: 'buketter',
  },
  tackblommor: {
    id: 'tackblommor',
    slug: 'tackblommor',
    name: 'Tackblomma',
    namePlural: 'Tackblommor',
    description: 'Blommor för att säga tack',
    metaTitle: 'Tackblommor - Säg Tack med Blommor',
    metaDescription:
      'Tackblommor skickas efter en middag, en tjänst eller en insats. Vanligast är en enkel bukett med kort text. Se urvalet och totalpriset.',
    parentCategory: 'buketter',
  },
  gratulationer: {
    id: 'gratulationer',
    slug: 'gratulationer',
    name: 'Gratulationsblomma',
    namePlural: 'Gratulationsblommor',
    description: 'Blommor för att gratulera',
    metaTitle: 'Gratulationsblommor',
    metaDescription:
      'Blommor till examen, nytt jobb eller ny bostad. Se vilka buketter som finns, vad de kostar och vilka tjänster som kör ut samma dag.',
    parentCategory: 'buketter',
  },
  'karlek-romantik': {
    id: 'karlek-romantik',
    slug: 'karlek-romantik',
    name: 'Kärleksblomma',
    namePlural: 'Kärleksblommor',
    description: 'Romantiska blommor för din älskade',
    metaTitle: 'Kärleksblommor - Romantiska Buketter',
    metaDescription:
      'Röda rosor är standardsvaret, men inte det enda. Se urvalet, antalet stjälkar per bukett och vad totalpriset blir inklusive budavgift.',
    parentCategory: 'buketter',
  },
  'ursakt-blommor': {
    id: 'ursakt-blommor',
    slug: 'ursakt-blommor',
    name: 'Ursäktsblomma',
    namePlural: 'Ursäktsblommor',
    description: 'Blommor för att be om ursäkt',
    metaTitle: 'Ursäktsblommor - Be om Förlåtelse',
    metaDescription:
      'En bukett ersätter inte en ursäkt men gör den svårare att avfärda. Se urvalet, vad det kostar och vilka tjänster som levererar idag.',
    parentCategory: 'buketter',
  },
  kramblommor: {
    id: 'kramblommor',
    slug: 'kramblommor',
    name: 'Kramblomma',
    namePlural: 'Kramblommor',
    description: 'Skicka en blommig kram',
    metaTitle: 'Kramblommor - Skicka en Kram',
    metaDescription:
      'Buketter som fungerar som en hälsning snarare än en present, till någon som har det tungt. Se urvalet och totalpriset inklusive bud.',
    parentCategory: 'buketter',
  },

  // Säsong
  'var-blommor': {
    id: 'var-blommor',
    slug: 'var-blommor',
    name: 'Vårblomma',
    namePlural: 'Vårblommor',
    description: 'Fräscha vårblommor som tulpaner och påskliljor',
    metaTitle: 'Vårblommor - Fräscha Buketter',
    metaDescription:
      'Tulpaner, påskliljor och hyacinter är billigast under sin säsong, ungefär februari till april. Se vad de kostar levererade just nu.',
    parentCategory: 'buketter',
  },
  'sommar-blommor': {
    id: 'sommar-blommor',
    slug: 'sommar-blommor',
    name: 'Sommarblomma',
    namePlural: 'Sommarblommor',
    description: 'Färgglada sommarblommor fulla av liv',
    metaTitle: 'Sommarblommor - Färgglada Buketter',
    metaDescription:
      'Solrosor, dahlior och pioner har alla kort säsong och är billigast inom den. Se vad sommarens buketter kostar inklusive budavgift.',
    parentCategory: 'buketter',
  },
  'host-blommor': {
    id: 'host-blommor',
    slug: 'host-blommor',
    name: 'Höstblomma',
    namePlural: 'Höstblommor',
    description: 'Höstens varma färger i bukett',
    metaTitle: 'Höstblommor - Varma Färger',
    metaDescription:
      'Höstbuketter bygger på krysantemum, dahlia och kvistar i orange och rött. Se urvalet och vad totalpriset blir inklusive leverans.',
    parentCategory: 'buketter',
  },
  'jul-blommor': {
    id: 'jul-blommor',
    slug: 'jul-blommor',
    name: 'Julblomma',
    namePlural: 'Julblommor',
    description: 'Julstämning med blommor',
    metaTitle: 'Julblommor - Festliga Arrangemang',
    metaDescription:
      'Julstjärna, amaryllis och hyacint är julens vanligaste blommor. Se vad de kostar levererade och när sista beställningsdagen infaller.',
    parentCategory: 'buketter',
  },

  // Högtider
  'mors-dag': {
    id: 'mors-dag',
    slug: 'mors-dag',
    name: 'Mors dag-blomma',
    namePlural: 'Mors dag-blommor',
    description: 'Fira mamma med blommor på mors dag',
    metaTitle: 'Mors Dag Blommor 2025',
    metaDescription:
      'Mors dag firas sista söndagen i maj, en dag då de flesta blombud inte kör ut. Se urvalet och när beställningen behöver ligga inne.',
    parentCategory: 'buketter',
  },
  'fars-dag': {
    id: 'fars-dag',
    slug: 'fars-dag',
    name: 'Fars dag-blomma',
    namePlural: 'Fars dag-blommor',
    description: 'Fira pappa med blommor på fars dag',
    metaTitle: 'Fars Dag Blommor 2025',
    metaDescription:
      'Fars dag firas andra söndagen i november. Se vilka buketter som finns, vad de kostar och vilka tjänster som levererar på helger.',
    parentCategory: 'buketter',
  },
  'alla-hjartans-dag': {
    id: 'alla-hjartans-dag',
    slug: 'alla-hjartans-dag',
    name: 'Alla hjärtans dag-blomma',
    namePlural: 'Alla hjärtans dag-blommor',
    description: 'Romantiska blommor för alla hjärtans dag',
    metaTitle: 'Alla Hjärtans Dag Blommor 2025',
    metaDescription:
      'Alla hjärtans dag är blomsterhandelns dyraste dag och rosor kostar mest då. Se priserna och när beställningen behöver vara inne.',
    parentCategory: 'buketter',
  },
  pask: {
    id: 'pask',
    slug: 'pask-blommor',
    name: 'Påskblomma',
    namePlural: 'Påskblommor',
    description: 'Våriga påskblommor',
    metaTitle: 'Påskblommor 2025',
    metaDescription:
      'Påskliljor, tulpaner och pärlhyacint säljs som både snitt och kruka. Se urvalet och vad det kostar levererat inklusive budavgift.',
    parentCategory: 'buketter',
  },
  student: {
    id: 'student',
    slug: 'student-blommor',
    name: 'Studentblomma',
    namePlural: 'Studentblommor',
    description: 'Gratulera studenten med blommor',
    metaTitle: 'Studentblommor 2025',
    metaDescription:
      'Studentbuketten bärs i handen i timmar, i värme och i trängsel. Se vilka buketter som klarar det och vad de kostar levererade.',
    parentCategory: 'buketter',
  },
  midsommar: {
    id: 'midsommar',
    slug: 'midsommar-blommor',
    name: 'Midsommarblomma',
    namePlural: 'Midsommarblommor',
    description: 'Somriga midsommarblommor',
    metaTitle: 'Midsommarblommor 2025',
    metaDescription:
      'Midsommarafton är röd dag och de flesta blombud kör inte ut då. Se urvalet och vilken dag beställningen behöver ligga inne.',
    parentCategory: 'buketter',
  },

  // Prisklass
  'under-300-kr': {
    id: 'under-300-kr',
    slug: 'under-300-kr',
    name: 'Bukett under 300 kr',
    namePlural: 'Buketter under 300 kr',
    description: 'Fina buketter för liten budget',
    metaTitle: 'Blommor Under 300 kr',
    metaDescription:
      'Buketter under 300 kronor. Budavgiften tillkommer och är densamma oavsett bukettens pris, så jämför totalen och inte från-priset.',
    parentCategory: 'budget',
  },
  'under-500-kr': {
    id: 'under-500-kr',
    slug: 'under-500-kr',
    name: 'Bukett under 500 kr',
    namePlural: 'Buketter under 500 kr',
    description: 'Buketter för 300-500 kr',
    metaTitle: 'Blommor Under 500 kr',
    metaDescription:
      'Buketter mellan 300 och 500 kronor. Budavgiften tillkommer och ligger normalt mellan 69 och 99 kronor hos tjänsterna vi kontrollerat.',
    parentCategory: 'budget',
  },
  'under-700-kr': {
    id: 'under-700-kr',
    slug: 'under-700-kr',
    name: 'Bukett under 700 kr',
    namePlural: 'Buketter under 700 kr',
    description: 'Buketter för 500-700 kr',
    metaTitle: 'Blommor Under 700 kr',
    metaDescription:
      'Buketter mellan 500 och 700 kronor, alltså fler stjälkar eller dyrare sorter. Se vad totalpriset blir när budavgiften läggs till.',
    parentCategory: 'budget',
  },
  premium: {
    id: 'premium',
    slug: 'premium-buketter',
    name: 'Premium-bukett',
    namePlural: 'Premium-buketter',
    description: 'Lyxiga buketter för speciella tillfällen',
    metaTitle: 'Premium Buketter - Lyxiga Blommor',
    metaDescription:
      'De dyraste buketterna i tjänsternas sortiment. Se vad du får för pengarna i antal stjälkar och sorter, och vad totalpriset blir.',
    parentCategory: 'buketter',
  },

  // Begravning
  begravningskransar: {
    id: 'begravningskransar',
    slug: 'begravningskransar',
    name: 'Begravningskrans',
    namePlural: 'Begravningskransar',
    description: 'Värdiga kransar för begravning',
    metaTitle: 'Begravningskransar',
    metaDescription:
      'Kransen står vid kistan under ceremonin och beställs med begravningsdatum, kyrka och den avlidnes namn. Se urvalet och priserna.',
    parentCategory: 'begravning',
  },
  begravningsbuketter: {
    id: 'begravningsbuketter',
    slug: 'begravningsbuketter',
    name: 'Begravningsbukett',
    namePlural: 'Begravningsbuketter',
    description: 'Avskedsbuketter för begravning',
    metaTitle: 'Begravningsbuketter',
    metaDescription:
      'Sorgbuketten läggs eller ställs vid kistan och är mindre än kransen. Se urvalet, vad den kostar och vad du behöver ange vid beställning.',
    parentCategory: 'begravning',
  },
  kondoleanser: {
    id: 'kondoleanser',
    slug: 'kondoleanser',
    name: 'Kondoleans',
    namePlural: 'Kondoleanser',
    description: 'Kondoleanser och sympatiblommor',
    metaTitle: 'Kondoleanser - Sympatiblommor',
    metaDescription:
      'Kondoleansblommor går hem till de efterlevande, inte till ceremonin. Se urvalet, vad det kostar och när det passar att skicka.',
    parentCategory: 'begravning',
  },
  minnesbuketter: {
    id: 'minnesbuketter',
    slug: 'minnesbuketter',
    name: 'Minnesbukett',
    namePlural: 'Minnesbuketter',
    description: 'Blommor för att minnas',
    metaTitle: 'Minnesbuketter',
    metaDescription:
      'Buketter till gravplats eller minnesceremoni, ofta enklare och tåligare än en inomhusbukett. Se urvalet och totalpriset inklusive bud.',
    parentCategory: 'begravning',
  },

  // Bröllop
  brudbuketter: {
    id: 'brudbuketter',
    slug: 'brudbuketter',
    name: 'Brudbukett',
    namePlural: 'Brudbuketter',
    description: 'Klassiska och moderna brudbuketter',
    metaTitle: 'Brudbuketter 2025',
    metaDescription:
      'Brudbuketten binds oftast av en florist på plats, eftersom den ska passa klänningen och hållas i handen en hel dag. Se urval och priser.',
    parentCategory: 'brollop',
  },
  brollopsbuketter: {
    id: 'brollopsbuketter',
    slug: 'brollopsbuketter',
    name: 'Bröllopsbukett',
    namePlural: 'Bröllopsbuketter',
    description: 'Buketter för bröllop och fest',
    metaTitle: 'Bröllopsbuketter',
    metaDescription:
      'Buketter till brudtärnor, mödrar och dekoration, alltså allt utom brudbuketten. Se urvalet och vad totalpriset blir per bukett.',
    parentCategory: 'brollop',
  },
  bordsdekoration: {
    id: 'bordsdekoration',
    slug: 'bordsdekoration-brollop',
    name: 'Bordsdekoration',
    namePlural: 'Bordsdekorationer',
    description: 'Bordsarrangemang för bröllopsfest',
    metaTitle: 'Bordsdekoration Bröllop',
    metaDescription:
      'Bordsarrangemang till bröllopsfesten är låga med flit, så att gästerna kan prata över dem. Se urvalet och vad de kostar per bord.',
    parentCategory: 'brollop',
  },
  'kyrko-dekoration': {
    id: 'kyrko-dekoration',
    slug: 'kyrko-dekoration',
    name: 'Kyrkodekoration',
    namePlural: 'Kyrkodekorationer',
    description: 'Blomsterdekoration för kyrkan',
    metaTitle: 'Kyrkodekoration Bröllop',
    metaDescription:
      'Altararrangemang och dekoration till vigseln. Många kyrkor har egna regler för vad som får sättas upp, så kontrollera med församlingen först.',
    parentCategory: 'brollop',
  },

  // Företag
  kontorsblommor: {
    id: 'kontorsblommor',
    slug: 'kontorsblommor',
    name: 'Kontorsblomma',
    namePlural: 'Kontorsblommor',
    description: 'Blommor och växter för kontoret',
    metaTitle: 'Kontorsblommor',
    metaDescription:
      'Blommor och växter till kontoret, ofta som abonnemang med fast leverans. Se urvalet, vad det kostar och vilka tjänster som fakturerar.',
    parentCategory: 'foretag',
  },
  representationsblommor: {
    id: 'representationsblommor',
    slug: 'representationsblommor',
    name: 'Representationsblomma',
    namePlural: 'Representationsblommor',
    description: 'Blommor för representation och möten',
    metaTitle: 'Representationsblommor',
    metaDescription:
      'Blommor till kunder och samarbetspartners, oftast med företagets namn på kortet. Se urvalet, totalpriset och vilka tjänster som fakturerar.',
    parentCategory: 'foretag',
  },
  'event-blommor': {
    id: 'event-blommor',
    slug: 'event-blommor',
    name: 'Eventblomma',
    namePlural: 'Eventblommor',
    description: 'Blommor för event och tillställningar',
    metaTitle: 'Eventblommor',
    metaDescription:
      'Blomsterarrangemang till event och tillställningar, från enstaka bord till hela lokaler. Se urvalet och vad tjänsterna tar för leverans.',
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
