import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import type { Product } from '@/types'
import { ProductCard } from '@/components/products/ProductCard'
import { AffiliateDisclosure } from './AffiliateDisclosure'

interface ProductEvidenceProps {
  products: Product[]
  /** Datum då partnerfeeden hämtades (YYYY-MM-DD). */
  feedDate: string | null
  heading: string
  /** Var på sajten klicket sker, för spårning och för länken till kategorin. */
  categoryHref?: string
}

/**
 * Produkter som underlag, inte som sortiment.
 *
 * Sajten säljer ingenting, men den visar gärna vad som faktiskt går att köpa
 * och vad det kostar. Det är samma sak som Prisjakt gör, och det gör dem inte
 * till butik. Skillnaden ligger i vem som tar emot beställningen.
 *
 * Två regler skiljer det här från ett produktrutnät i en webbshop:
 *
 * 1. Varje pris bär sitt datum. Ett odaterat pris är precis det sajten finns
 *    för att slippa.
 * 2. När feeden blivit gammal står det utskrivet. Vi gömmer inte att en
 *    uppgift har åldrats, vi daterar den och låter läsaren avgöra.
 */

/** Efter så här många dagar är feeden för gammal för att presenteras rakt av. */
const STALE_AFTER_DAYS = 60

function daysSince(iso: string): number {
  const then = new Date(iso).getTime()
  return Math.floor((Date.now() - then) / 86_400_000)
}

function formatSwedishDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  const months = [
    'januari', 'februari', 'mars', 'april', 'maj', 'juni',
    'juli', 'augusti', 'september', 'oktober', 'november', 'december',
  ]
  const monthName = months[Number(month) - 1]
  if (!monthName) return iso
  return `${Number(day)} ${monthName} ${year}`
}

/**
 * En bild vi inte har är inte en bild vi ska visa. Tio produkter i feeden
 * pekar fortfarande på ett nedlagt CDN, och för dem faller kortet tillbaka
 * på en platshållarblomma som ändå märks "Produktbild". Etiketten ljuger då,
 * vilket är precis det sajten finns för att undvika. De sorteras bort här.
 */
function hasRealImage(product: Product): boolean {
  const url = product.primaryImage?.url ?? ''
  return url.startsWith('/images/products/')
}

export function ProductEvidence({
  products,
  feedDate,
  heading,
  categoryHref,
}: ProductEvidenceProps) {
  const shown = products.filter(hasRealImage).slice(0, 4)
  if (shown.length === 0) return null

  const age = feedDate ? daysSince(feedDate) : null
  const isStale = age !== null && age > STALE_AFTER_DAYS

  return (
    <section className="mt-14">
      <h2 className="mb-4 font-display text-2xl text-ink">{heading}</h2>

      <AffiliateDisclosure pricesVerifiedAt={feedDate} className="mb-4" />

      {isStale && (
        <p className="mb-5 flex gap-3 rounded-lg border border-signal-200 bg-signal-50 p-4 text-sm text-signal-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            Priserna nedan hämtades {formatSwedishDate(feedDate as string)}, alltså för{' '}
            {age} dagar sedan. Sortiment och priser har med stor sannolikhet ändrats.
            Kontrollera hos tjänsten innan du beställer.
          </span>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            listType="category"
            position={index}
          />
        ))}
      </div>

      {categoryHref && (
        <p className="mt-5 text-sm">
          <Link href={categoryHref} className="text-brand underline hover:text-brand-700">
            Se fler
          </Link>
        </p>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        Vi säljer inget själva. Bilder och priser kommer från tjänsternas egna
        produktflöden och beställningen görs hos dem.
      </p>
    </section>
  )
}
