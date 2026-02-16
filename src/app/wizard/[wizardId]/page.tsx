import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WizardContainer } from '@/components/wizards/WizardContainer'
import { WIZARD_CONFIGS } from '@/data/wizards'

interface WizardPageProps {
  params: {
    wizardId: string
  }
}

export async function generateMetadata({ params }: WizardPageProps): Promise<Metadata> {
  const config = WIZARD_CONFIGS[params.wizardId]

  if (!config) {
    return {
      title: 'Wizard inte hittad',
    }
  }

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `https://skickablomma.se/wizard/${params.wizardId}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(WIZARD_CONFIGS).map((wizardId) => ({
    wizardId,
  }))
}

export default function WizardPage({ params }: WizardPageProps) {
  const config = WIZARD_CONFIGS[params.wizardId]

  if (!config) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white py-12">
      <div className="container mx-auto px-4">
        <WizardContainer config={config} />
      </div>
    </div>
  )
}
