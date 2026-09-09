import Link from 'next/link'

interface WordmarkProps {
  /** 'full' visar märke + namn, 'mark' bara märket. */
  variant?: 'full' | 'mark'
  /** Sätt false när märket redan ligger i en länk. */
  asLink?: boolean
  className?: string
}

/**
 * Märket är en kvist: en stjälk med två blad, förskjutna i höjd och sida.
 *
 * Det var tidigare ett tankstreck, med motiveringen att tecknet vi sätter i en
 * okontrollerad tabellcell också kunde bära avsändaren. Den idén höll inte.
 * Ett vågrätt streck i en rundad ruta är redan upptaget i gränssnitt — minus,
 * kollapsa, ta bort, avstängd — och vid 16 px i en flik gick märket inte att
 * skilja från en minusknapp. Värre: samma glyf står i tabellen och betyder
 * "ej kontrollerat". Logotypen sa alltså bokstavligen att vi inte vet.
 *
 * Kvisten säger i stället vad sajten handlar om. Bladen är solida och sitter
 * på olika höjd, vilket gör att formen läser som något som växer och inte som
 * en pil. Ingen blomknopp, ingen hjärtform: kvisten är ämnet, inte sortimentet.
 *
 * Ritad för 16 px först. Stjälken är 2,4 enheter bred i en ruta på 32, alltså
 * drygt en px vid flikstorlek, och båda bladen har full opacitet eftersom
 * opacitetsskillnader försvinner vid nedskalning.
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
      <path
        d="M15.4 25.5V7.5"
        className="stroke-paper"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M15.4 14.4c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" className="fill-paper" />
      <path d="M15.4 21c0-2.7-2.2-4.9-4.9-4.9 0 2.7 2.2 4.9 4.9 4.9Z" className="fill-paper" />
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
