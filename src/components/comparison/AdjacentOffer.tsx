import Link from 'next/link'
import type { Product } from '@/types'
import { planteringstid } from '@/lib/products'
import { ProductCard } from '@/components/products/ProductCard'

/**
 * Två sortiment som inte är blommor, och som säger det själva.
 *
 * Cramers säljer trädgård: buskar, perenner, krukor och lökar. My Perfect Day
 * säljer fest: servetter, bordslöpare och sugrör. Ingen av dem är ett blombud,
 * och feedens taggning som satte båda under "buketter" är anledningen till att
 * en påse alliumlökar en gång låg under rubriken "buketter att skicka".
 *
 * De är ändå inte fel att visa. Lökarna svarar på en annan fråga än buketten
 * gör — vad får jag som håller längre än en vecka — och dukningen hör till
 * samma bord som buketten ställs på. Villkoret är att skillnaden står utskriven
 * och att de aldrig blandas in i jämförelsen av blombud.
 */

interface AdjacentOfferProps {
  products: Product[]
  variant: 'lokar' | 'dukning'
}

const TEXTER = {
  lokar: {
    rubrik: 'Eller något som kommer tillbaka nästa vår',
    ingress:
      'En bukett håller en dryg vecka. En lök som sätts i höst blommar i maj och sedan varje vår i många år. Det är en annan present, inte en billigare.',
    villkor:
      'Lökar kommer som paket från en trädgårdshandel, inte med blombud. Ingen budavgift, ingen leverans samma dag, och mottagaren får något att göra i stället för något att ställa i vas.',
    lank: { href: '/lokar-och-fron', text: 'Se alla lökar och frön' },
  },
  dukning: {
    rubrik: 'Till bordet buketten ska stå på',
    ingress:
      'Servetter, bordslöpare och annat till festen. Det här är inte blommor och ingår inte i någon jämförelse av blombud.',
    villkor:
      'Annan butik och en separat beställning med egen frakt. Vi tar inte emot någon av dem.',
    lank: { href: '/dukning-och-fest', text: 'Se allt till dukningen' },
  },
} as const

export function AdjacentOffer({ products, variant }: AdjacentOfferProps) {
  if (products.length === 0) return null
  const t = TEXTER[variant]

  return (
    <section className="mt-14 rounded-lg border border-line bg-muted/40 p-6">
      <h2 className="font-display text-2xl text-ink">{t.rubrik}</h2>
      <p className="mb-2 mt-1.5 text-ink-muted">{t.ingress}</p>
      <p className="mb-5 text-sm text-ink-faint">{t.villkor}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <div key={product.id}>
            <ProductCard product={product} listType="category" position={index} />
            {variant === 'lokar' && planteringstid(product) && (
              <p className="mt-1.5 text-xs text-ink-faint">
                Planteras {planteringstid(product)?.toLowerCase()}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm">
        <Link href={t.lank.href} className="text-brand underline hover:text-brand-700">
          {t.lank.text}
        </Link>
      </p>
    </section>
  )
}
