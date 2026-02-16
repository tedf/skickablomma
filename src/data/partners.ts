import { Partner, PartnerConfig } from '@/types'

export const PARTNERS: Record<Partner, PartnerConfig> = {
  cramers: {
    id: 'cramers',
    name: 'cramers',
    displayName: 'Cramers Blommor',
    logoUrl: '/images/partners/cramers-logo.svg',
    websiteUrl: 'https://www.cramers.se',
    productFeedUrl: process.env.ADTRACTION_CRAMERS_PRODUCT_FEED || '',
    statusFeedUrl: process.env.ADTRACTION_CRAMERS_STATUS_FEED || '',
    deliveryInfo: {
      sameDayAvailable: true,
      sameDayCutoff: '14:00',
      standardDays: 1,
      expressAvailable: true,
    },
    trackingParams: {
      epi: 'skickablomma',
    },
  },
  interflora: {
    id: 'interflora',
    name: 'interflora',
    displayName: 'Interflora',
    logoUrl: '/images/partners/interflora-logo.svg',
    websiteUrl: 'https://www.interflora.se',
    productFeedUrl: process.env.ADTRACTION_INTERFLORA_PRODUCT_FEED || '',
    statusFeedUrl: process.env.ADTRACTION_INTERFLORA_STATUS_FEED || '',
    deliveryInfo: {
      sameDayAvailable: true,
      sameDayCutoff: '13:00',
      standardDays: 1,
      expressAvailable: true,
    },
    trackingParams: {
      epi: 'skickablomma',
    },
  },
  fakeflowers: {
    id: 'fakeflowers',
    name: 'fakeflowers',
    displayName: 'Fakeflowers',
    logoUrl: '/images/partners/fakeflowers-logo.svg',
    websiteUrl: 'https://www.fakeflowers.se',
    productFeedUrl: process.env.ADTRACTION_FAKEFLOWERS_PRODUCT_FEED || '',
    statusFeedUrl: process.env.ADTRACTION_FAKEFLOWERS_STATUS_FEED || '',
    deliveryInfo: {
      sameDayAvailable: false,
      sameDayCutoff: '',
      standardDays: 2,
      expressAvailable: false,
    },
    trackingParams: {
      epi: 'skickablomma',
    },
  },
  myperfectday: {
    id: 'myperfectday',
    name: 'myperfectday',
    displayName: 'My Perfect Day',
    logoUrl: '/images/partners/myperfectday-logo.svg',
    websiteUrl: 'https://www.myperfectday.se',
    productFeedUrl: process.env.ADTRACTION_MYPERFECTDAY_PRODUCT_FEED || '',
    statusFeedUrl: process.env.ADTRACTION_MYPERFECTDAY_STATUS_FEED || '',
    deliveryInfo: {
      sameDayAvailable: false,
      sameDayCutoff: '',
      standardDays: 3,
      expressAvailable: false,
    },
    trackingParams: {
      epi: 'skickablomma',
    },
  },
}

export const getPartnerConfig = (partnerId: Partner): PartnerConfig => {
  return PARTNERS[partnerId]
}

export const getAllPartners = (): Partner[] => {
  return Object.keys(PARTNERS) as Partner[]
}

export const getPartnersWithSameDay = (): Partner[] => {
  return getAllPartners().filter(
    (partner) => PARTNERS[partner].deliveryInfo.sameDayAvailable
  )
}
