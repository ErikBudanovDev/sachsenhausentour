import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeSecretKey } from '@/lib/stripe'
import { connectDB } from '@/lib/mongodb'
import { TourConfig } from '@/models/TourConfig'
import { Booking } from '@/models/Booking'

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2026-04-22.dahlia',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { guests, date, time, name, email, phone } = body

    if (!guests || !date || !time || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Load active tour config from DB
    await connectDB()
    const config = await TourConfig.findOne({ active: true }).lean()

    if (!config) {
      return NextResponse.json(
        { error: 'No active tour configuration found' },
        { status: 404 }
      )
    }

    // Validate against blackout dates
    if (config.blackoutDates?.includes(date)) {
      return NextResponse.json(
        { error: 'Selected date is not available' },
        { status: 400 }
      )
    }

    // Validate time slot exists
    const validSlot = config.timeSlots?.some(
      (slot: { time: string }) => slot.time === time
    )
    if (!validSlot) {
      return NextResponse.json(
        { error: 'Invalid time slot selected' },
        { status: 400 }
      )
    }

    // Validate guest count against max
    const guestCount = typeof guests === 'string' ? parseInt(guests, 10) : guests
    if (guestCount < 1 || guestCount > config.maxGuestsPerSlot) {
      return NextResponse.json(
        { error: `Guest count must be between 1 and ${config.maxGuestsPerSlot}` },
        { status: 400 }
      )
    }

    // Check existing bookings for this slot to enforce capacity
    const existingGuests = await Booking.aggregate([
      {
        $match: {
          tourDate: date,
          tourTime: time,
          status: 'confirmed',
        },
      },
      { $group: { _id: null, total: { $sum: '$guests' } } },
    ])
    const bookedGuests = existingGuests[0]?.total || 0
    const remaining = config.maxGuestsPerSlot - bookedGuests

    if (guestCount > remaining) {
      return NextResponse.json(
        {
          error:
            remaining <= 0
              ? 'This time slot is fully booked'
              : `Only ${remaining} spot${remaining === 1 ? '' : 's'} remaining for this slot`,
        },
        { status: 400 }
      )
    }

    // Use price from DB config
    const pricePerPerson = config.pricePerPerson
    const amount = pricePerPerson * guestCount

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: config.currency || 'eur',
      metadata: {
        tour: config.name,
        date,
        time,
        guests: String(guestCount),
        name,
        email,
        phone: phone || '',
      },
      receipt_email: email,
      description: `${config.name} — ${guestCount} guest${guestCount > 1 ? 's' : ''} on ${date} at ${time}`,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
