'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FAQ } from '@/types'

interface FAQSectionProps {
  title?: string
  faqs: FAQ[]
  showSchema?: boolean
}

// Schema.org FAQ-schema
function generateFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function FAQSection({ title, faqs, showSchema = true }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16">
      {showSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
        />
      )}

      <div className="container mx-auto px-4">
        {title && (
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-gray-900">
            {title}
          </h2>
        )}

        <div className="mx-auto max-w-3xl divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="py-5">
              <button
                className="flex w-full items-start justify-between text-left"
                onClick={() => toggleFaq(index)}
                aria-expanded={openIndex === index}
              >
                <h3 className="pr-8 text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'mt-4 max-h-96' : 'max-h-0'
                )}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
