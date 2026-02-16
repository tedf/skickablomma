import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://skickablomma.se'),
  title: {
    default: 'Skicka Blomma - Jämför priser på blommor och buketter i Sverige',
    template: '%s | Skicka Blomma',
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
  authors: [{ name: 'Skicka Blomma' }],
  creator: 'Skicka Blomma',
  publisher: 'Skicka Blomma',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://skickablomma.se',
    siteName: 'Skicka Blomma',
    title: 'Skicka Blomma - Jämför priser på blommor i Sverige',
    description:
      'Hitta de bästa blomsterbuden. Jämför priser, läs recensioner och beställ blommor med leverans samma dag.',
  },
  twitter: {
    card: 'summary',
    title: 'Skicka Blomma - Jämför priser på blommor i Sverige',
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
    <html lang="sv" className={`${inter.variable} ${playfair.variable}`}>
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
