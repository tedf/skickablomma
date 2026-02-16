'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WizardConfig, WizardStep, WizardOption, ProductFilters } from '@/types'
import { ProductCard } from '@/components/products/ProductCard'
import { searchProducts } from '@/lib/products'
import { trackWizardStep, trackWizardComplete } from '@/lib/analytics'

interface WizardContainerProps {
  config: WizardConfig
}

export function WizardContainer({ config }: WizardContainerProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const step = config.steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === config.steps.length - 1
  const progress = ((currentStep + 1) / config.steps.length) * 100

  const handleOptionSelect = (option: WizardOption) => {
    const stepId = step.id

    if (step.type === 'single_choice') {
      setAnswers((prev) => ({ ...prev, [stepId]: option.value }))
    } else if (step.type === 'multiple_choice') {
      const current = (answers[stepId] as string[]) || []
      const newValue = current.includes(option.value)
        ? current.filter((v) => v !== option.value)
        : [...current, option.value]

      // Respektera maxSelections
      if (step.validation?.maxSelections && newValue.length > step.validation.maxSelections) {
        return
      }

      setAnswers((prev) => ({ ...prev, [stepId]: newValue }))
    }

    trackWizardStep({
      wizardId: config.id,
      stepNumber: currentStep + 1,
      stepId,
      selectedOption: option.value,
      timestamp: new Date(),
    })
  }

  const isOptionSelected = (option: WizardOption): boolean => {
    const answer = answers[step.id]
    if (!answer) return false

    if (step.type === 'single_choice') {
      return answer === option.value
    } else {
      return (answer as string[]).includes(option.value)
    }
  }

  const canProceed = (): boolean => {
    if (!step.validation?.required) return true

    const answer = answers[step.id]
    if (!answer) return false

    if (step.type === 'multiple_choice') {
      const arr = answer as string[]
      if (step.validation?.minSelections && arr.length < step.validation.minSelections) {
        return false
      }
    }

    return true
  }

  const handleNext = async () => {
    if (!canProceed()) return

    if (isLastStep) {
      // Beräkna filter och visa resultat
      setLoading(true)
      const filters = buildFiltersFromAnswers()
      const searchResult = await searchProducts(filters, 1, config.resultCount)
      setResults(searchResult.products)
      setShowResults(true)
      setLoading(false)

      trackWizardComplete(config.id, searchResult.products.length)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (showResults) {
      setShowResults(false)
    } else if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const buildFiltersFromAnswers = (): ProductFilters => {
    const filters: ProductFilters = {}

    // Gå igenom alla steg och samla ihop filterkriteria
    config.steps.forEach((s) => {
      const answer = answers[s.id]
      if (!answer) return

      const selectedOptions = s.options?.filter((opt) => {
        if (s.type === 'single_choice') {
          return opt.value === answer
        } else {
          return (answer as string[]).includes(opt.value)
        }
      })

      selectedOptions?.forEach((opt) => {
        if (opt.filterCriteria) {
          // Merge filter criteria
          Object.entries(opt.filterCriteria).forEach(([key, value]) => {
            if (key === 'subCategories' || key === 'colors' || key === 'styles') {
              const existing = (filters as any)[key] || []
              ;(filters as any)[key] = [...existing, ...(value as string[])]
            } else if (key === 'priceMin' || key === 'priceMax') {
              // Ta det mest restriktiva värdet
              if (key === 'priceMin') {
                filters.priceMin = Math.max(filters.priceMin || 0, value as number)
              } else {
                filters.priceMax = filters.priceMax
                  ? Math.min(filters.priceMax, value as number)
                  : (value as number)
              }
            } else {
              ;(filters as any)[key] = value
            }
          })
        }
      })
    })

    return filters
  }

  if (showResults) {
    return (
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Dina personliga rekommendationer
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Vi hittade {results.length} buketter för dig
          </h1>
          <p className="mt-2 text-gray-600">
            {config.ctaDescription || 'Baserat på dina svar har vi valt ut dessa buketter'}
          </p>
        </div>

        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till guiden
        </button>

        {/* Results grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {results.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                listType="wizard"
                position={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">
              Vi kunde tyvärr inte hitta några exakta matchningar.
            </p>
            <a
              href="/buketter"
              className="mt-4 inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Visa alla buketter
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-gray-500">
          <span>
            Steg {currentStep + 1} av {config.steps.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="wizard-step animate-fade-in">
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-gray-900">
          {step.title}
        </h2>
        {step.description && (
          <p className="mb-8 text-center text-gray-600">{step.description}</p>
        )}

        {/* Options */}
        <div
          className={cn(
            'grid gap-3',
            step.options && step.options.length <= 4
              ? 'grid-cols-2'
              : 'grid-cols-2 md:grid-cols-3'
          )}
        >
          {step.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className={cn(
                'wizard-option',
                isOptionSelected(option) && 'wizard-option-selected'
              )}
            >
              {option.icon && (
                <span className="text-3xl" role="img" aria-hidden>
                  {option.icon}
                </span>
              )}
              <span className="text-sm font-medium text-gray-900">
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-gray-500">{option.description}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={isFirstStep}
          className={cn(
            'flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors',
            isFirstStep
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className={cn(
            'flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors',
            canProceed() && !loading
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'cursor-not-allowed bg-gray-200 text-gray-400'
          )}
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Söker...
            </>
          ) : isLastStep ? (
            <>
              {config.ctaText}
              <Sparkles className="h-4 w-4" />
            </>
          ) : (
            <>
              Nästa
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
