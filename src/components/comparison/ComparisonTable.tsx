'use client'

import { useMemo, useState } from 'react'
import { Check, Minus, Star } from 'lucide-react'
import type { Service } from '@/types/comparison'
import { AffiliateDisclosure } from './AffiliateDisclosure'

export interface ComparisonRow {
  service: Service
  /** Stopptid som gäller på just den här sidan, om den avviker från riksnivån. */
  cutoffOverride?: string | null
  /** Budavgift som gäller på just den här sidan. */
  feeOverride?: number | null
  /** Från-pris som gäller på just den här sidan (används av landsidor). */
  priceOverride?: number | null
}

interface ComparisonTableProps {
  rows: ComparisonRow[]
  pricesVerifiedAt: string | null
  /** id på tjänsten som är vårt val, plus motiveringen i en mening. */
  pick?: { serviceId: string; reason: string } | null
  /** Var på sajten klicket skedde, för Plausible-eventet. */
  trackingContext: string
}

type SortMode = 'price' | 'speed'

function effectivePrice(row: ComparisonRow): number | null {
  const price = row.priceOverride ?? row.service.priceFromSek
  const fee = row.feeOverride ?? row.service.deliveryFeeSek
  if (price === null || fee === null) return null
  return price + fee
}

function effectiveCutoff(row: ComparisonRow): string | null {
  return row.cutoffOverride ?? row.service.cutoffWeekday
}

/** Okänt värde skrivs ut som tankstreck, aldrig som noll eller en gissning. */
function Unknown() {
  return (
    <span className="text-gray-400" title="Ej kontrollerat">
      –
    </span>
  )
}

export function ComparisonTable({
  rows,
  pricesVerifiedAt,
  pick = null,
  trackingContext,
}: ComparisonTableProps) {
  const [sortMode, setSortMode] = useState<SortMode>('price')

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      if (sortMode === 'speed') {
        // Samma dag först, därefter tidigast stopptid.
        if (a.service.sameDay !== b.service.sameDay) {
          return a.service.sameDay ? -1 : 1
        }
        const cutoffA = effectiveCutoff(a)
        const cutoffB = effectiveCutoff(b)
        if (cutoffA === null && cutoffB === null) return 0
        if (cutoffA === null) return 1
        if (cutoffB === null) return -1
        return cutoffB.localeCompare(cutoffA)
      }

      const priceA = effectivePrice(a)
      const priceB = effectivePrice(b)
      if (priceA === null && priceB === null) {
        return a.service.name.localeCompare(b.service.name, 'sv')
      }
      // Tjänster utan kontrollerat pris sorteras sist, aldrig som billigast.
      if (priceA === null) return 1
      if (priceB === null) return -1
      return priceA - priceB
    })
    return copy
  }, [rows, sortMode])

  function handleClick(service: Service) {
    if (typeof window === 'undefined') return
    const plausible = (window as unknown as { plausible?: (...args: unknown[]) => void })
      .plausible
    plausible?.('affiliate_click', {
      props: { service: service.id, context: trackingContext },
    })
  }

  return (
    <section className="space-y-4">
      <AffiliateDisclosure pricesVerifiedAt={pricesVerifiedAt} />

      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Sortera:</span>
        <button
          type="button"
          onClick={() => setSortMode('price')}
          className={`rounded-full px-3 py-1 transition-colors ${
            sortMode === 'price'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-pressed={sortMode === 'price'}
        >
          Totalpris
        </button>
        <button
          type="button"
          onClick={() => setSortMode('speed')}
          className={`rounded-full px-3 py-1 transition-colors ${
            sortMode === 'speed'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-pressed={sortMode === 'speed'}
        >
          Snabbast
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            Jämförelse av blombud: totalpris, leverans samma dag, sista beställningstid
            och budavgift.
          </caption>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              <th scope="col" className="p-3 font-semibold">Tjänst</th>
              <th scope="col" className="p-3 font-semibold">Samma dag</th>
              <th scope="col" className="p-3 font-semibold">Beställ före</th>
              <th scope="col" className="p-3 font-semibold">Från-pris</th>
              <th scope="col" className="p-3 font-semibold">Budavgift</th>
              <th scope="col" className="p-3 font-semibold">Totalt</th>
              <th scope="col" className="p-3">
                <span className="sr-only">Länk till tjänsten</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const { service } = row
              const isPick = pick?.serviceId === service.id
              const price = row.priceOverride ?? service.priceFromSek
              const fee = row.feeOverride ?? service.deliveryFeeSek
              const total = effectivePrice(row)
              const cutoff = effectiveCutoff(row)

              return (
                <tr
                  key={service.id}
                  className={`border-b border-gray-100 last:border-0 ${
                    isPick ? 'bg-amber-50/60' : ''
                  }`}
                >
                  <th scope="row" className="p-3 text-left font-medium">
                    {service.name}
                    {isPick && (
                      <span className="mt-1 flex items-center gap-1 text-xs font-normal text-amber-700">
                        <Star className="h-3 w-3 fill-current" aria-hidden />
                        Vårt val
                      </span>
                    )}
                  </th>
                  <td className="p-3">
                    {service.sameDay ? (
                      <Check className="h-4 w-4 text-green-600" aria-label="Ja" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-400" aria-label="Nej" />
                    )}
                  </td>
                  <td className="p-3">{cutoff ?? <Unknown />}</td>
                  <td className="p-3">{price !== null ? `${price} kr` : <Unknown />}</td>
                  <td className="p-3">{fee !== null ? `${fee} kr` : <Unknown />}</td>
                  <td className="p-3 font-semibold">
                    {total !== null ? `${total} kr` : <Unknown />}
                  </td>
                  <td className="p-3 text-right">
                    {service.affiliateUrl ? (
                      <a
                        href={service.affiliateUrl}
                        rel="sponsored nofollow noopener"
                        target="_blank"
                        onClick={() => handleClick(service)}
                        className="inline-block rounded-lg bg-gray-900 px-3 py-2 text-white transition-colors hover:bg-gray-700"
                      >
                        Till {service.name}
                      </a>
                    ) : (
                      <a
                        href={service.websiteUrl}
                        rel="nofollow noopener"
                        target="_blank"
                        className="inline-block rounded-lg border border-gray-300 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Till {service.name}
                      </a>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pick && (
        <p className="text-sm text-gray-600">
          <strong className="font-medium">Vårt val:</strong> {pick.reason}
        </p>
      )}

      <p className="text-xs text-gray-500">
        Tankstreck betyder att uppgiften inte är kontrollerad av oss. Vi skriver hellre
        ingenting än en siffra vi inte kan stå för.
      </p>
    </section>
  )
}
