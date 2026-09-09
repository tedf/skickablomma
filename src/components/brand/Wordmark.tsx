import Link from 'next/link'

interface WordmarkProps {
  /** 'full' visar märke + namn, 'mark' bara märket. */
  variant?: 'full' | 'mark'
  /** Sätt false när märket redan ligger i en länk. */
  asLink?: boolean
  className?: string
}

/**
 * Märket är ett tankstreck i en ruta.
 *
 * Tankstrecket är tecknet vi sätter i en tabellcell där vi inte kontrollerat
 * uppgiften. Ingen konkurrent skriver ut sin okunskap — Interflora och
 * Euroflorist fyller varje fält, oavsett om de vet. Därför är tecknet ledigt,
 * och därför betyder det något: logotypen och produktlogiken är samma sak.
 *
 * Rutan är kvadratisk och strikt. Ingen blomma, ingen kvist, ingen hjärtform.
 */
function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="7" className="fill-brand" />
      <rect x="8" y="15" width="16" height="2" rx="1" className="fill-paper" />
    </svg>
  )
}

export function Wordmark({
  variant = 'full',
  asLink = true,
  className = '',
}: WordmarkProps) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark />
      {variant === 'full' && (
        <span className="text-[1.0625rem] font-medium leading-none tracking-[-0.02em] text-ink">
          skickablomma
        </span>
      )}
    </span>
  )

  if (!asLink) return content

  return (
    <Link href="/" aria-label="Skickablomma, till startsidan">
      {content}
    </Link>
  )
}

export { Mark as WordmarkMark }
