interface MicroAnswerProps {
  children: string
}

/**
 * Sidans första stycke: 40–80 ord som svarar på frågan utan att kräva kontext.
 * Formatet är valt för att kunna citeras av AI-svar och utdrag i sökresultat
 * (siteplanen §6). Längden kontrolleras av validatePageMeta.
 */
export function MicroAnswer({ children }: MicroAnswerProps) {
  return (
    <p className="text-lg leading-relaxed text-ink">{children}</p>
  )
}
