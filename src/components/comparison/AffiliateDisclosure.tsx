import Link from 'next/link'
import { Info } from 'lucide-react'

interface AffiliateDisclosureProps {
  /** Datum då priserna i tabellen kontrollerades (YYYY-MM-DD). */
  pricesVerifiedAt?: string | null
  className?: string
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
 * Placeras direkt ovanför varje jämförelsetabell (siteplanen §9).
 * Marknadsföringslagen kräver att kommersiellt innehåll är identifierbart, och
 * rangordningen ska sägas vara oberoende av provisionen.
 */
export function AffiliateDisclosure({
  pricesVerifiedAt,
  className = '',
}: AffiliateDisclosureProps) {
  return (
    <div
      className={`flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 ${className}`}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
      <p>
        Vi får provision när du beställer via länkarna. Det påverkar inte vår
        rangordning.{' '}
        <Link href="/om/sa-tjanar-vi-pengar" className="underline hover:text-gray-900">
          Så tjänar vi pengar
        </Link>
        {pricesVerifiedAt ? (
          <>
            {' · '}
            <span className="text-gray-500">
              Priser kontrollerade {formatSwedishDate(pricesVerifiedAt)}
            </span>
          </>
        ) : null}
      </p>
    </div>
  )
}
