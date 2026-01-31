import Link from 'next/link'
import { Sparkles, ArrowRight, Heart, Gift, Building2, Flower2 } from 'lucide-react'

const wizards = [
  {
    id: 'hitta-ratt-blommor',
    title: 'Hitta rätt blommor',
    description: 'Svar på några frågor så hjälper vi dig hitta den perfekta buketten',
    icon: Sparkles,
    href: '/wizard/hitta-ratt-blommor',
    color: 'bg-primary',
  },
  {
    id: 'begravningsblommor',
    title: 'Begravningsblommor',
    description: 'Värdiga blommor för att visa din sista hälsning',
    icon: Flower2,
    href: '/wizard/begravningsblommor',
    color: 'bg-gray-700',
  },
  {
    id: 'presenter-till-henne',
    title: 'Present till henne',
    description: 'Hitta den perfekta presenten för henne',
    icon: Gift,
    href: '/wizard/presenter-till-henne',
    color: 'bg-pink-500',
  },
]

export function WizardCTA() {
  return (
    <div className="text-center">
      <h2 className="mb-4 font-display text-3xl font-bold text-gray-900">
        Behöver du hjälp att välja?
      </h2>
      <p className="mb-10 text-lg text-gray-600">
        Låt oss hjälpa dig hitta de perfekta blommorna med vår guide
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {wizards.map((wizard) => (
          <Link
            key={wizard.id}
            href={wizard.href}
            className="group flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${wizard.color}`}
            >
              <wizard.icon className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {wizard.title}
            </h3>
            <p className="mb-4 text-sm text-gray-600">{wizard.description}</p>
            <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Starta guiden
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
