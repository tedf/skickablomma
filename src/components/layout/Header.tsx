'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Flower2,
  Heart,
  Sparkles,
  Truck,
  Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Jämförelsehubbarna först, produktkatalogen efter. Ordningen speglar
// sitearkitekturen i siteplanen §3: sajten är en jämförelse, inte en butik.
const navigation = [
  {
    name: 'Blombud',
    href: '/blombud',
    icon: Truck,
    children: [
      { name: 'Jämför blombud', href: '/blombud' },
      { name: 'Linköping', href: '/blombud/linkoping' },
      { name: 'Jönköping', href: '/blombud/jonkoping' },
    ],
  },
  {
    name: 'Utomlands',
    href: '/utomlands',
    icon: Globe,
    children: [
      { name: 'Alla länder', href: '/utomlands' },
      { name: 'Norge', href: '/utomlands/norge' },
      { name: 'Danmark', href: '/utomlands/danmark' },
      { name: 'Finland', href: '/utomlands/finland' },
      { name: 'Tyskland', href: '/utomlands/tyskland' },
      { name: 'USA', href: '/utomlands/usa' },
    ],
  },
  {
    name: 'Tillfällen',
    href: '/tillfalle',
    icon: Heart,
    children: [
      { name: 'Alla tillfällen', href: '/tillfalle' },
      { name: 'Begravning', href: '/tillfalle/begravning' },
      { name: 'Födelsedag', href: '/fodelsedags-blommor' },
      { name: 'Tack', href: '/tackblommor' },
      { name: 'Kärlek & Romantik', href: '/karlek-romantik' },
    ],
  },
  {
    name: 'Jämför',
    href: '/jamfor',
    icon: Sparkles,
    children: [
      { name: 'Alla tjänster', href: '/jamfor' },
      { name: 'Billigast', href: '/jamfor/billigt' },
    ],
  },
  {
    name: 'Guider',
    href: '/guider',
    icon: Flower2,
    children: [
      { name: 'Alla guider', href: '/guider' },
      { name: 'Vad kostar det?', href: '/guider/vad-kostar-det' },
      { name: 'Skicka samma dag', href: '/guide/skicka-blommor-samma-dag' },
    ],
  },
  {
    name: 'Buketter',
    href: '/buketter',
    icon: Flower2,
    children: [
      { name: 'Alla buketter', href: '/buketter' },
      { name: 'Rosor', href: '/buketter/rosor' },
      { name: 'Tulpaner', href: '/buketter/tulpaner' },
      { name: 'Liljor', href: '/buketter/liljor' },
      { name: 'Begravningsblommor', href: '/begravning' },
      { name: 'Bröllopsblommor', href: '/brollop' },
    ],
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">

      {/* Main header */}
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Flower2 className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-gray-900">
              Skicka Blomma
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  {item.name}
                  {item.children && (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && activeDropdown === item.name && (
                  <div className="absolute left-0 top-full z-50 w-56 rounded-xl border bg-white p-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/sok"
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
              aria-label="Sök"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              href="/konstgjorda-blommor"
              className="hidden rounded-full bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90 sm:block"
            >
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Konstgjorda blommor
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-white lg:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium',
                      pathname === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="ml-12 space-y-1 py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-4 border-t pt-4">
              <Link
                href="/konstgjorda-blommor"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-base font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="h-5 w-5" />
                Konstgjorda blommor
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
