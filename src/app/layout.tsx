import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/**
 * Newsreader ersätter Playfair Display. Playfair är en high-contrast display-
 * serif med bröllops- och blomsterbutikskonnotationer — exakt fel signal för
 * en sajt vars löfte är att den inte säljer något. Newsreader är ritad för
 * redaktionell brödtext och läser som ett uppslagsverk.
 */
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://skickablomma.se'),
  title: {
    /*
      Suffixet " | Skickablomma" kostade 15 tecken av de omkring 60 Google
      visar, och tryckte 30 av 44 sidtitlar över gränsen. Sidtitlarna är redan
      skrivna för att stå på egna ben, och avsändaren visas ändå: Google läser
      sajtnamnet ur WebSite-schemat på startsidan och ritar det på egen rad.

      Startsidans titel bär namnet själv, eftersom den är den enda sida där
      titeln annars inte säger vem vi är.
    */
    default: 'Skickablomma – jämför blombud, priser och leveranstid',
    template: '%s',
  },
  description:
    'Hitta och jämför de bästa blomsterbuden i Sverige. Buketter, begravningsblommor, bröllopsblommor med leverans samma dag. Spara pengar genom att jämföra Interflora, Cramers och fler.',
  keywords: [
    'skicka blommor',
    'blommor',
    'buketter',
    'blomsterbud',
    'leverans samma dag',
    'begravningsblommor',
    'bröllopsblommor',
    'interflora',
    'cramers',
    'blommor online',
    'skicka blommor idag',
  ],
  authors: [{ name: 'Skickablomma' }],
  creator: 'Skickablomma',
  publisher: 'Skickablomma',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://skickablomma.se',
    siteName: 'Skickablomma',
    title: 'Skickablomma - Jämför priser på blommor i Sverige',
    description:
      'Hitta de bästa blomsterbuden. Jämför priser, läs recensioner och beställ blommor med leverans samma dag.',
  },
  twitter: {
    card: 'summary',
    title: 'Skickablomma - Jämför priser på blommor i Sverige',
    description:
      'Hitta de bästa blomsterbuden. Jämför priser och beställ blommor med leverans samma dag.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '[FILL: Google Search Console verification]',
  },
  alternates: {
    canonical: 'https://skickablomma.se',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={`${inter.variable} ${newsreader.variable}`}>
      <head>
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
