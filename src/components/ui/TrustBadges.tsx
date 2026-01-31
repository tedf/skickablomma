import { Shield, Truck, CreditCard, HeartHandshake } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    title: 'Säkra köp',
    description: 'Du handlar direkt hos våra betrodda partners',
  },
  {
    icon: Truck,
    title: 'Leverans samma dag',
    description: 'Hos flera partners om du beställer i tid',
  },
  {
    icon: CreditCard,
    title: 'Flera betalsätt',
    description: 'Kort, Swish, faktura hos partners',
  },
  {
    icon: HeartHandshake,
    title: 'Kundnöjdhetsgaranti',
    description: 'Våra partners erbjuder garanti',
  },
]

export function TrustBadges() {
  return (
    <section className="border-y bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <badge.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{badge.title}</p>
                <p className="text-xs text-gray-500">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
