import { connectDB } from '@/lib/mongodb'
import { TourConfig } from '@/models/TourConfig'

export interface PublicTourConfig {
  slug: string
  name: string
  pricePerPerson: number
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
  pricePerPerson: 5900,
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

    return {
      slug: config.slug as string,
      name: config.name as string,
      pricePerPerson: config.pricePerPerson as number,
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
