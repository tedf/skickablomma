/**
 * Analytics & Spårning
 * ====================
 * Funktioner för att spåra användarinteraktioner och klick.
 */

import { ClickTrackingData, ImageSourceType, Partner } from '@/types'

// =============================================================================
// TYPER
// =============================================================================

interface TrackEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  custom?: Record<string, unknown>
}

interface PageViewData {
  path: string
  title: string
  referrer?: string
}

// =============================================================================
// GOOGLE ANALYTICS
// =============================================================================

/**
 * Skickar event till Google Analytics 4
 */
export function trackGA4Event(event: TrackEvent) {
  if (typeof window === 'undefined') return

  // @ts-ignore - gtag finns på window
  if (window.gtag) {
    // @ts-ignore
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom,
    })
  }

  // Logga i dev
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Event:', event)
  }
}

/**
 * Spårar sidvisning
 */
export function trackPageView(data: PageViewData) {
  if (typeof window === 'undefined') return

  // @ts-ignore
  if (window.gtag) {
    // @ts-ignore
    window.gtag('event', 'page_view', {
      page_path: data.path,
      page_title: data.title,
      page_referrer: data.referrer,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Page view:', data)
  }
}

// =============================================================================
// PRODUKTKLICK (AFFILIATE)
// =============================================================================

/**
 * Spårar klick på produktkort
 */
export function trackProductClick(data: ClickTrackingData) {
  // GA4 event
  trackGA4Event({
    event: 'product_click',
    category: 'affiliate',
    action: 'click',
    label: data.productId,
    value: 1,
    custom: {
      partner_id: data.partnerId,
      list_type: data.listType,
      position: data.position,
      image_source_type: data.imageSourceType,
    },
  })

  // Spara till localStorage för analys
  saveClickToLocalStorage(data)

  // Skicka till egen backend (om implementerad)
  sendClickToBackend(data)
}

/**
 * Sparar klickdata lokalt
 */
function saveClickToLocalStorage(data: ClickTrackingData) {
  if (typeof window === 'undefined') return

  try {
    const key = 'skickablomma_clicks'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    existing.push({
      ...data,
      timestamp: new Date().toISOString(),
    })

    // Behåll endast senaste 100 klick
    const trimmed = existing.slice(-100)
    localStorage.setItem(key, JSON.stringify(trimmed))
  } catch (error) {
    console.error('[Analytics] Failed to save click:', error)
  }
}

/**
 * Skickar klickdata till backend
 */
async function sendClickToBackend(data: ClickTrackingData) {
  try {
    // Implementera när backend finns
    // await fetch('/api/analytics/click', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
  } catch (error) {
    // Silently fail - inte kritiskt
  }
}

// =============================================================================
// BILDKÄLLA-ANALYS
// =============================================================================

interface ImageSourceStats {
  partner: number
  royaltyFree: number
  generated: number
  placeholder: number
  total: number
  clicksBySource: Record<ImageSourceType, number>
}

/**
 * Hämtar statistik om bildkällor för visade produkter
 */
export function getImageSourceStats(): ImageSourceStats | null {
  if (typeof window === 'undefined') return null

  try {
    const clicks = JSON.parse(localStorage.getItem('skickablomma_clicks') || '[]')

    const stats: ImageSourceStats = {
      partner: 0,
      royaltyFree: 0,
      generated: 0,
      placeholder: 0,
      total: clicks.length,
      clicksBySource: {
        partner: 0,
        royalty_free: 0,
        generated: 0,
        placeholder: 0,
      },
    }

    clicks.forEach((click: ClickTrackingData) => {
      if (click.imageSourceType) {
        stats.clicksBySource[click.imageSourceType]++
      }
    })

    return stats
  } catch {
    return null
  }
}

// =============================================================================
// WIZARD-ANALYS
// =============================================================================

interface WizardAnalytics {
  wizardId: string
  stepNumber: number
  stepId: string
  selectedOption?: string
  timestamp: Date
}

/**
 * Spårar wizard-steg
 */
export function trackWizardStep(data: WizardAnalytics) {
  trackGA4Event({
    event: 'wizard_step',
    category: 'wizard',
    action: `step_${data.stepNumber}`,
    label: data.stepId,
    custom: {
      wizard_id: data.wizardId,
      selected_option: data.selectedOption,
    },
  })
}

/**
 * Spårar wizard-avslut
 */
export function trackWizardComplete(wizardId: string, productCount: number) {
  trackGA4Event({
    event: 'wizard_complete',
    category: 'wizard',
    action: 'complete',
    label: wizardId,
    value: productCount,
  })
}

// =============================================================================
// SÖK-ANALYS
// =============================================================================

/**
 * Spårar sökning
 */
export function trackSearch(query: string, resultsCount: number) {
  trackGA4Event({
    event: 'search',
    category: 'search',
    action: 'search',
    label: query,
    value: resultsCount,
  })
}

/**
 * Spårar filterändring
 */
export function trackFilterChange(filterType: string, filterValue: string) {
  trackGA4Event({
    event: 'filter_change',
    category: 'search',
    action: 'filter',
    label: `${filterType}:${filterValue}`,
  })
}

// =============================================================================
// KONVERTERINGSOPTIMERING
// =============================================================================

/**
 * Spårar CTA-klick
 */
export function trackCTAClick(ctaId: string, ctaText: string, location: string) {
  trackGA4Event({
    event: 'cta_click',
    category: 'engagement',
    action: 'cta_click',
    label: ctaId,
    custom: {
      cta_text: ctaText,
      location,
    },
  })
}

/**
 * Spårar scroll-djup
 */
export function trackScrollDepth(depth: number, pageType: string) {
  if (depth % 25 === 0) {
    trackGA4Event({
      event: 'scroll_depth',
      category: 'engagement',
      action: 'scroll',
      label: pageType,
      value: depth,
    })
  }
}

// =============================================================================
// KPI-BERÄKNING
// =============================================================================

export interface KPIData {
  totalClicks: number
  uniqueProducts: number
  clicksPerSession: number
  topPartners: Array<{ partner: Partner; clicks: number }>
  topCategories: Array<{ category: string; clicks: number }>
  imageSourcePerformance: Record<ImageSourceType, { clicks: number; ctr: number }>
}

/**
 * Beräknar KPI:er från sparad data
 */
export function calculateKPIs(): KPIData | null {
  if (typeof window === 'undefined') return null

  try {
    const clicks = JSON.parse(localStorage.getItem('skickablomma_clicks') || '[]')

    if (clicks.length === 0) {
      return null
    }

    // Räkna unika produkter
    const uniqueProducts = new Set(clicks.map((c: ClickTrackingData) => c.productId)).size

    // Räkna per partner
    const partnerCounts: Record<string, number> = {}
    clicks.forEach((c: ClickTrackingData) => {
      partnerCounts[c.partnerId] = (partnerCounts[c.partnerId] || 0) + 1
    })

    const topPartners = Object.entries(partnerCounts)
      .map(([partner, count]) => ({ partner: partner as Partner, clicks: count }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)

    // Räkna per listtyp
    const listTypeCounts: Record<string, number> = {}
    clicks.forEach((c: ClickTrackingData) => {
      listTypeCounts[c.listType] = (listTypeCounts[c.listType] || 0) + 1
    })

    const topCategories = Object.entries(listTypeCounts)
      .map(([category, clicks]) => ({ category, clicks }))
      .sort((a, b) => b.clicks - a.clicks)

    // Bildkälla-prestanda
    const imageSourceCounts: Record<ImageSourceType, number> = {
      partner: 0,
      royalty_free: 0,
      generated: 0,
      placeholder: 0,
    }

    clicks.forEach((c: ClickTrackingData) => {
      if (c.imageSourceType) {
        imageSourceCounts[c.imageSourceType]++
      }
    })

    const total = clicks.length
    const imageSourcePerformance: Record<ImageSourceType, { clicks: number; ctr: number }> = {
      partner: { clicks: imageSourceCounts.partner, ctr: imageSourceCounts.partner / total },
      royalty_free: { clicks: imageSourceCounts.royalty_free, ctr: imageSourceCounts.royalty_free / total },
      generated: { clicks: imageSourceCounts.generated, ctr: imageSourceCounts.generated / total },
      placeholder: { clicks: imageSourceCounts.placeholder, ctr: imageSourceCounts.placeholder / total },
    }

    return {
      totalClicks: clicks.length,
      uniqueProducts,
      clicksPerSession: clicks.length / 1, // Placeholder - behöver session-tracking
      topPartners,
      topCategories,
      imageSourcePerformance,
    }
  } catch {
    return null
  }
}
