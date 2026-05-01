import { NextResponse } from 'next/server'
import { getActiveTourConfig } from '@/lib/tour-config'

/**
 * GET /api/tour-config
 * Public endpoint — returns the active tour configuration.
 * Used by the booking page and checkout to get current price,
 * time slots, blackout dates, etc.
 */
export async function GET() {
  try {
    const config = await getActiveTourConfig()
    return NextResponse.json(config)
  } catch (err) {
    console.error('Tour config fetch error:', err)
    return NextResponse.json(
      { error: 'Failed to load tour configuration' },
      { status: 500 }
    )
  }
}
