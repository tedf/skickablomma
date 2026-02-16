import Link from 'next/link'
import { Flower2, Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = {
  kategorier: [
    { name: 'Buketter', href: '/buketter' },
    { name: 'Begravningsblommor', href: '/begravning' },
    { name: 'Bröllopsblommor', href: '/brollop' },
    { name: 'Företagsblommor', href: '/foretag' },
    { name: 'Presenter', href: '/presenter' },
    { name: 'Konstgjorda blommor', href: '/konstgjorda-blommor' },
  ],
  tillfallen: [
    { name: 'Födelsedagsblommor', href: '/fodelsedags-blommor' },
    { name: 'Tackblommor', href: '/tackblommor' },
    { name: 'Mors dag', href: '/mors-dag' },
    { name: 'Alla hjärtans dag', href: '/alla-hjartans-dag' },
    { name: 'Jul', href: '/jul-blommor' },
    { name: 'Student', href: '/student-blommor' },
  ],
  information: [
    { name: 'Om oss', href: '/om-oss' },
    { name: 'Så fungerar det', href: '/sa-fungerar-det' },
    { name: 'Våra partners', href: '/partners' },
    { name: 'Vanliga frågor', href: '/vanliga-fragor' },
    { name: 'Kontakt', href: '/kontakt' },
    { name: 'Blogg', href: '/blogg' },
  ],
  juridiskt: [
    { name: 'Integritetspolicy', href: '/integritetspolicy' },
    { name: 'Cookiepolicy', href: '/cookies' },
    { name: 'Användarvillkor', href: '/villkor' },
    { name: 'Affiliate-information', href: '/affiliate' },
  ],
}

const partners = [
  { name: 'Interflora' },
  { name: 'Cramers' },
  { name: 'Fakeflowers' },
  { name: 'My Perfect Day' },
]

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      {/* Partner logos */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <p className="mb-4 text-center text-sm text-gray-500">
            Vi jämför priser från Sveriges ledande blomsterbutiker
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {partners.map((partner) => (
              <span
                key={partner.name}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:border-primary hover:text-primary"
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Flower2 className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-gray-900">
                Skicka Blomma
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Sveriges smartaste sätt att hitta och jämföra blommor. Vi hjälper dig hitta
              den perfekta buketten till bästa pris.
            </p>
          </div>

          {/* Kategorier */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Kategorier
            </h3>
            <ul className="space-y-2">
              {footerLinks.kategorier.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tillfällen */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Tillfällen
            </h3>
            <ul className="space-y-2">
              {footerLinks.tillfallen.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Information
            </h3>
            <ul className="space-y-2">
              {footerLinks.information.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Juridiskt */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Juridiskt
            </h3>
            <ul className="space-y-2">
              {footerLinks.juridiskt.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Skicka Blomma. Alla rättigheter förbehållna.
            </p>
            <p className="text-xs text-gray-400">
              Vi använder affiliate-länkar. När du köper via våra länkar får vi en liten
              provision utan extra kostnad för dig.{' '}
              <Link href="/affiliate" className="underline hover:text-gray-600">
                Läs mer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
