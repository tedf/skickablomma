import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate-information | Skicka Blomma',
  description: 'Information om hur vi använder affiliate-länkar och hur vi tjänar pengar.',
}

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 font-display text-3xl font-bold text-gray-900">
          Affiliate-information
        </h1>

        <div className="prose prose-gray max-w-none rounded-xl bg-white p-8 shadow-sm">
          <h2>Hur vi finansieras</h2>
          <p>
            Skicka Blomma är en prisjämförelsetjänst för blommor och buketter. Vi samarbetar
            med ledande blomsterbutiker i Sverige och använder affiliate-länkar för att
            finansiera vår verksamhet.
          </p>

          <h2>Vad är affiliate-länkar?</h2>
          <p>
            När du klickar på en knapp som "Köp hos Interflora" eller "Köp hos Cramers
            Blommor" på vår webbplats och sedan genomför ett köp, får vi en liten provision
            från partnern. Detta kostar dig ingenting extra – du betalar samma pris som
            om du hade gått direkt till butiken.
          </p>

          <h2>Våra partners</h2>
          <ul>
            <li><strong>Interflora</strong> – Sveriges ledande blomsterbutik med leverans till hela landet</li>
            <li><strong>Cramers Blommor</strong> – Prisvärd blomsterbutik med snabb leverans</li>
            <li><strong>Fakeflowers</strong> – Specialister på konstgjorda blommor</li>
            <li><strong>My Perfect Day</strong> – Bröllops- och festdekorationer</li>
          </ul>

          <h2>Oberoende innehåll</h2>
          <p>
            Vi strävar alltid efter att presentera produkter och priser objektivt. Vår
            provision påverkar inte vilka produkter vi lyfter fram eller i vilken ordning
            de visas – detta baseras på popularitet och relevans.
          </p>

          <h2>Kontakt</h2>
          <p>
            Har du frågor om våra affiliate-samarbeten? Du hittar oss via vår sökfunktion
            eller guider på sajten.
          </p>
        </div>
      </div>
    </div>
  )
}
