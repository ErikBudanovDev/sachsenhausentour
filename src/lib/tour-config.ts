import { connectDB } from '@/lib/mongodb'
import { TourConfig } from '@/models/TourConfig'

export interface PublicPricingTier {
  label: string
  /** Price in cents */
  price: number
  note: string
  highlight: boolean
}

export interface PublicTourConfig {
  slug: string
  name: string
  pricePerPerson: number
  /** Original / strikethrough price in cents (0 = no strikethrough) */
  originalPrice: number
  /** Discount badge text (empty = hidden) */
  discountBadge: string
  /** Pricing tiers for display */
  pricingTiers: PublicPricingTier[]
  currency: string
  timeSlots: { id: string; time: string; label: string }[]
  maxGuestsPerSlot: number
  blackoutDates: string[]
  minAdvanceDays: number
  duration: string
  meetingPoint: string
}

/** Default fallback when DB is unreachable */
const FALLBACK_CONFIG: PublicTourConfig = {
  slug: 'sachsenhausen-tour',
  name: 'Sachsenhausen Memorial Tour',
  pricePerPerson: 2900,
  originalPrice: 4900,
  discountBadge: '40% OFF',
  pricingTiers: [
    { label: 'Adult', price: 2900, note: 'Standard rate', highlight: true },
    { label: 'Student (valid ID)', price: 2400, note: 'Valid student ID required', highlight: false },
    { label: 'Group (8+)', price: 2200, note: 'Per person, 8 or more guests', highlight: false },
  ],
  currency: 'eur',
  timeSlots: [
    { id: 'morning-10', time: '10:00 AM', label: 'Morning Tour' },
  ],
  maxGuestsPerSlot: 20,
  blackoutDates: [],
  minAdvanceDays: 1,
  duration: '6 hours',
  meetingPoint: 'Generator Berlin Alexanderplatz',
}

/**
 * Fetch the active tour config from MongoDB.
 * Falls back to static defaults if DB is unavailable.
 * Use in server components and API routes.
 */
export async function getActiveTourConfig(): Promise<PublicTourConfig> {
  try {
    await connectDB()
    const config = await TourConfig.findOne({ active: true }).lean()

    if (!config) return FALLBACK_CONFIG

    const tiers = (config.pricingTiers as PublicPricingTier[]) || []

    return {
      slug: config.slug as string,
      name: config.name as string,
      pricePerPerson: config.pricePerPerson as number,
      originalPrice: (config.originalPrice as number) || 0,
      discountBadge: (config.discountBadge as string) || '',
      pricingTiers: tiers.length > 0 ? tiers : FALLBACK_CONFIG.pricingTiers,
      currency: (config.currency as string) || 'eur',
      timeSlots: config.timeSlots as { id: string; time: string; label: string }[],
      maxGuestsPerSlot: (config.maxGuestsPerSlot as number) || 20,
      blackoutDates: (config.blackoutDates as string[]) || [],
      minAdvanceDays: (config.minAdvanceDays as number) || 1,
      duration: (config.duration as string) || '6 hours',
      meetingPoint: (config.meetingPoint as string) || 'Generator Berlin Alexanderplatz',
    }
  } catch (err) {
    console.error('Failed to load tour config, using fallback:', err)
    return FALLBACK_CONFIG
  }
}
