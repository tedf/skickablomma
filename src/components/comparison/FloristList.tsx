import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react'
import type { Florist } from '@/types/comparison'

interface FloristListProps {
  florists: Florist[]
  cityName: string
}

/**
 * Listar verifierade florister. Varje post är ett verkligt företag och fylls i
 * manuellt från kontrollerad källa — därför visas ingenting alls hellre än en
 * halv uppgift. Listan är också vår viktigaste länkkälla (siteplanen §8).
 */
export function FloristList({ florists, cityName }: FloristListProps) {
  if (florists.length === 0) {
    return (
      <p className="text-ink-muted">
        Vi har ännu inte kontrollerat några florister i {cityName}.
      </p>
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {florists.map((florist) => (
        <li
          key={florist.name}
          className="rounded-lg border border-line p-4"
        >
          <h3 className="font-semibold text-ink">{florist.name}</h3>

          <dl className="mt-2 space-y-1 text-sm text-ink-muted">
            {florist.area && (
              <div className="flex items-center gap-2">
                <dt className="sr-only">Område</dt>
                <MapPin className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden />
                <dd>{florist.area}</dd>
              </div>
            )}
            {florist.hours && (
              <div className="flex items-center gap-2">
                <dt className="sr-only">Öppettider</dt>
                <Clock className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden />
                <dd>{florist.hours}</dd>
              </div>
            )}
            {florist.phone && (
              <div className="flex items-center gap-2">
                <dt className="sr-only">Telefon</dt>
                <Phone className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden />
                <dd>
                  <a href={`tel:${florist.phone.replace(/\s/g, '')}`} className="hover:underline">
                    {florist.phone}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          {florist.source && (
            <p className="mt-2 text-xs text-ink-faint">{florist.source}</p>
          )}

          {florist.url && (
            <a
              href={florist.url}
              rel="noopener"
              target="_blank"
              className="mt-3 inline-flex items-center gap-1 text-sm text-ink hover:underline"
            >
              Webbplats
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}
