import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/lib/auth'
import { getStripeSecretKey } from '@/lib/stripe'
import { connectDB } from '@/lib/mongodb'
import { Booking } from '@/models/Booking'

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2026-04-22.dahlia',
})

/** GET single booking */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { id } = await params
  const booking = await Booking.findById(id).lean()
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  return NextResponse.json({ booking })
}

/** PATCH — update booking (notes, status, guide assignment) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { id } = await params
  const body = await request.json()

  const allowed = ['notes', 'assignedGuide', 'status']
  const update: Record<string, unknown> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key]
  }

  // Handle cancellation with Stripe refund
  if (body.action === 'cancel') {
    const booking = await Booking.findById(id)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    try {
      // Refund via Stripe
      await stripe.refunds.create({
        payment_intent: booking.stripePaymentId,
      })
      update.status = 'refunded'
      update.cancelledAt = new Date()
      update.refundedAt = new Date()
    } catch (err) {
      console.error('Stripe refund error:', err)
      return NextResponse.json(
        { error: 'Failed to process refund' },
        { status: 500 }
      )
    }
  }

  const updated = await Booking.findByIdAndUpdate(id, update, { new: true }).lean()
  return NextResponse.json({ booking: updated })
}
