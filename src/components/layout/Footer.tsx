import Link from 'next/link'
import { Flower2, Mail, MapPin, Phone } from 'lucide-react'
import { Wordmark } from '@/components/brand/Wordmark'
import { buildFooterLinks } from '@/lib/navigation'


const partners = [
  { name: 'Interflora' },
  { name: 'Cramers' },
  { name: 'My Perfect Day' },
]

export function Footer() {
  // Samma källa som huvudmenyn, så footern inte halkar efter innehållet.
  const footerLinks = buildFooterLinks()
  return (
    <footer className="border-t border-line bg-leaf-50">
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
            <Wordmark />
            <p className="mt-4 text-sm text-gray-600">
              Vi jämför pris, budavgift och leveranstid hos blombuden i Sverige. Vi
              säljer inga blommor själva.
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

          {/* Städer */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Städer
            </h3>
            <ul className="space-y-2">
              {footerLinks.stader.map((link) => (
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
              &copy; {new Date().getFullYear()} Skickablomma. Alla rättigheter förbehållna.
            </p>
            <p className="text-xs text-gray-400">
              Vi använder affiliate-länkar. När du köper via våra länkar får vi en liten
              provision utan extra kostnad för dig.{' '}
              <Link href="/om/sa-tjanar-vi-pengar" className="underline hover:text-gray-600">
                Läs mer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
