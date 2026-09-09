import { Metadata } from 'next'
import Link from 'next/link'
import { getAllServices } from '@/lib/comparison'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Så tjänar vi pengar',
  description:
    'Vi säljer inga blommor. Vi får provision när du beställer via våra länkar. Här står exakt hur det fungerar och vad det innebär för rangordningen.',
  alternates: { canonical: 'https://skickablomma.se/om/sa-tjanar-vi-pengar' },
}

/**
 * Transparenssidan. Länkas från varje jämförelsetabell och från footern.
 * Marknadsföringslagen kräver att kommersiellt innehåll är identifierbart
 * (siteplanen §9), och sidan är samtidigt E-E-A-T-material.
 */
export default function SaTjanarViPengarPage() {
  const services = getAllServices()
  const withAffiliate = services.filter((service) => service.affiliateUrl !== null)
  const withoutAffiliate = services.filter((service) => service.affiliateUrl === null)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Start', href: '/' },
          { label: 'Så tjänar vi pengar', href: '/om/sa-tjanar-vi-pengar' },
        ]}
      />

      <header className="mt-6 space-y-4">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Så tjänar vi pengar
        </h1>
        <p className="text-lg leading-relaxed text-ink">
          Vi säljer inga blommor och tar aldrig emot din beställning eller betalning. När du
          klickar vidare till en tjänst och beställer där får vi en provision från den
          tjänsten. Du betalar inte mer för det. Provisionen påverkar inte i vilken ordning
          tjänsterna rankas i våra tabeller.
        </p>
      </header>

      <div className="prose prose-gray mt-10 max-w-none">
        <h2>Varför rangordningen inte går att köpa</h2>
        <p>
          En jämförelsesajt som säljer sin topplacering är en annonsplats som låtsas vara en
          jämförelse. Vi sorterar på totalpris — bukettens från-pris plus budavgiften — och
          markerar ett val med en motivering som du kan kontrollera mot tabellen. Håller inte
          motiveringen så håller inte sajten.
        </p>

        <h2>Vad som är kontrollerat och vad som inte är det</h2>
        <p>
          Varje tabell visar när priserna senast kontrollerades. En uppgift vi inte har
          kontrollerat skrivs som ett tankstreck, aldrig som en nolla eller en uppskattning.
          Det gör tabellerna glesare än konkurrenternas, och mer användbara.
        </p>

        <h2>Vilka vi har avtal med</h2>
        {withAffiliate.length > 0 && (
          <>
            <p>Vi får provision från:</p>
            <ul>
              {withAffiliate.map((service) => (
                <li key={service.id}>
                  {service.name} (via {service.network})
                </li>
              ))}
            </ul>
          </>
        )}
        {withoutAffiliate.length > 0 && (
          <>
            <p>
              Vi får ingen provision från följande tjänster, men jämför dem ändå eftersom de
              hör hemma i en rättvis jämförelse:
            </p>
            <ul>
              {withoutAffiliate.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
          </>
        )}

        <h2>Länkarna</h2>
        <p>
          Alla länkar som ger oss provision är märkta med{' '}
          <code>rel=&quot;sponsored nofollow&quot;</code>. Affiliate-nätverkens cookies sätts
          först när du klickar vidare till tjänsten, inte när du läser hos oss.
        </p>

        <h2>Hittar du ett fel?</h2>
        <p>
          Priser ändras, och vi hinner inte alltid först. Är en uppgift fel, hör av dig så
          rättar vi den och uppdaterar kontrolldatumet.
        </p>
      </div>

      <p className="mt-10 text-sm text-ink-muted">
        Se även <Link href="/jamfor" className="underline">jämförelsen av blombud</Link>.
      </p>
    </div>
  )
}
