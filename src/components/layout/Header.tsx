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
import { Wordmark } from '@/components/brand/Wordmark'
import type { NavGroup } from '@/lib/navigation'


interface HeaderProps {
  /*
    Menyn byggs av samma data som sidorna, i layout.tsx som är en
    serverkomponent. Header är en klientkomponent för rullgardinernas
    tillstånd och ska inte läsa datafilerna själv — då hamnar hela
    innehållet i klientbundlen.
  */
  navigation: NavGroup[]
}

export function Header({ navigation }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">

      {/* Main header */}
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Wordmark />

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

                {/*
                  Rullgardinen renderas alltid och döljs med CSS. Tidigare
                  monterades den först när activeDropdown matchade, alltså vid
                  hover, vilket betyder att den aldrig fanns i den serverrenderade
                  HTML:en. Googlebot hovrar inte: sajtens hela sekundärnavigation
                  var osynlig för sökmotorn, och stadssidorna fick sina enda
                  internlänkar från hubben och Läs vidare-blocken.
                */}
                {item.children && (
                  <div
                    className={cn(
                      'absolute left-0 top-full z-50 w-56 rounded-xl border bg-white p-2 shadow-lg',
                      activeDropdown === item.name ? 'block' : 'hidden'
                    )}
                  >
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

            {/*
              Primär åtgärd är att jämföra, inte att handla. Den gamla knappen
              pekade på en produktkategori, vilket är fel signal i en header
              som ska säga "vi säljer inget".
            */}
            <Link
              href="/jamfor"
              className="hidden rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-700 sm:block"
            >
              Jämför blombud
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
                href="/jamfor"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-base font-medium text-paper"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jämför blombud
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
