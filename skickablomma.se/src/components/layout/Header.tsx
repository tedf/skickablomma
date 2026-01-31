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
  Gift,
  Building2,
  Sparkles,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Buketter',
    href: '/buketter',
    icon: Flower2,
    children: [
      { name: 'Alla buketter', href: '/buketter' },
      { name: 'Rosor', href: '/buketter/rosor' },
      { name: 'Tulpaner', href: '/buketter/tulpaner' },
      { name: 'Liljor', href: '/buketter/liljor' },
      { name: 'Blandade buketter', href: '/buketter/blandade-farger' },
    ],
  },
  {
    name: 'Tillfällen',
    href: '/tillfallen',
    icon: Heart,
    children: [
      { name: 'Födelsedag', href: '/fodelsedags-blommor' },
      { name: 'Tack', href: '/tackblommor' },
      { name: 'Kärlek & Romantik', href: '/karlek-romantik' },
      { name: 'Gratulationer', href: '/gratulationer' },
      { name: 'Ursäkt', href: '/ursakt-blommor' },
    ],
  },
  {
    name: 'Begravning',
    href: '/begravning',
    icon: Sparkles,
    children: [
      { name: 'Alla begravningsblommor', href: '/begravning' },
      { name: 'Kransar', href: '/begravningskransar' },
      { name: 'Begravningsbuketter', href: '/begravningsbuketter' },
      { name: 'Kondoleanser', href: '/kondoleanser' },
    ],
  },
  {
    name: 'Bröllop',
    href: '/brollop',
    icon: Heart,
    children: [
      { name: 'Brudbuketter', href: '/brudbuketter' },
      { name: 'Bröllopsbuketter', href: '/brollopsbuketter' },
      { name: 'Bordsdekoration', href: '/bordsdekoration-brollop' },
    ],
  },
  {
    name: 'Presenter',
    href: '/presenter',
    icon: Gift,
  },
  {
    name: 'Företag',
    href: '/foretag',
    icon: Building2,
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top bar */}
      <div className="bg-primary text-white">
        <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>
            Beställ före kl 14:00 för <strong>leverans idag</strong> hos utvalda partners
          </span>
        </div>
      </div>

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
              href="/samma-dag-leverans"
              className="hidden rounded-full bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90 sm:block"
            >
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Samma dag
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
                href="/samma-dag-leverans"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-base font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Clock className="h-5 w-5" />
                Leverans samma dag
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
