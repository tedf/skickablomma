/**
 * Botaniska element
 * =================
 * Sajtens bildpolicy säger att en bild aldrig får påstå något. En bukett
 * fotograferad i studio är en produktbild, alltså ett påstående om vad du får,
 * och den hör inte hemma här.
 *
 * Men "ingen produktbild" blev i praktiken "ingen bild alls", och då försvann
 * ämnet ur sajten. Identiteten blev en elprisjämförelse med ordet blomma i
 * namnet.
 *
 * De här figurerna löser det. De är tecknade i linje, inte fotograferade, och
 * de påstår ingenting om ett sortiment. De säger bara vad sajten handlar om.
 * Låg kontrast, tunn linje, aldrig som huvudmotiv.
 */

interface BotanicalProps {
  className?: string
  /** Pixelhöjd. Figurerna är ritade för 24–72 px. */
  size?: number
}

/** Enkel stjälk med alternerande blad. Den mest neutrala figuren. */
export function Stem({ className = '', size = 48 }: BotanicalProps) {
  return (
    <svg
      viewBox="0 0 24 64"
      width={(size * 24) / 64}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 64 C12 48 12 32 12 4" />
      <path d="M12 44 C6 42 3 37 3 31 C9 31 12 36 12 44 Z" />
      <path d="M12 34 C18 32 21 27 21 21 C15 21 12 26 12 34 Z" />
      <path d="M12 24 C6 22 3 17 3 11 C9 11 12 16 12 24 Z" />
    </svg>
  )
}

/** Kvist med små knoppar. Något varmare än stjälken. */
export function Sprig({ className = '', size = 48 }: BotanicalProps) {
  return (
    <svg
      viewBox="0 0 28 64"
      width={(size * 28) / 64}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M14 64 C14 50 14 34 14 10" />
      <path d="M14 40 C9 38 6 34 6 29" />
      <path d="M14 30 C19 28 22 24 22 19" />
      <path d="M14 20 C9 18 6 14 6 9" />
      <circle cx="6" cy="28.5" r="2.5" />
      <circle cx="22" cy="18.5" r="2.5" />
      <circle cx="6" cy="8.5" r="2.5" />
      <circle cx="14" cy="8" r="3" />
    </svg>
  )
}

interface RuleProps {
  /** 'stem' är neutral, 'sprig' används på tillfällessidor. */
  figure?: 'stem' | 'sprig'
  className?: string
}

/**
 * Avdelare: hårstreck med en figur i mitten. Används mellan större
 * avsnitt, aldrig oftare än ett par gånger per sida.
 */
export function BotanicalRule({ figure = 'stem', className = '' }: RuleProps) {
  const Figure = figure === 'sprig' ? Sprig : Stem

  return (
    <div
      className={`flex items-center gap-5 text-leaf-400 ${className}`}
      role="presentation"
    >
      <span className="h-px flex-1 bg-line" />
      <Figure size={40} />
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
