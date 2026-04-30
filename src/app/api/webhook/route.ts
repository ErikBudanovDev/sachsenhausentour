import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeSecretKey } from '@/lib/stripe'
import { connectDB } from '@/lib/mongodb'
import { Booking } from '@/models/Booking'

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2026-04-22.dahlia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  await connectDB()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const meta = pi.metadata

      // Avoid duplicates
      const exists = await Booking.findOne({ stripePaymentId: pi.id })
      if (!exists) {
        await Booking.create({
          stripePaymentId: pi.id,
          customerName: meta.name || 'Unknown',
          customerEmail: meta.email || pi.receipt_email || '',
          customerPhone: meta.phone || undefined,
          tourDate: meta.date || '',
          tourTime: meta.time || '',
          guests: parseInt(meta.guests || '1', 10),
          pricePerPerson: pi.amount / parseInt(meta.guests || '1', 10),
          totalPaid: pi.amount,
          currency: pi.currency,
          status: 'confirmed',
        })
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent as string
      if (paymentIntentId) {
        await Booking.findOneAndUpdate(
          { stripePaymentId: paymentIntentId },
          {
            status: charge.amount_refunded === charge.amount ? 'refunded' : 'confirmed',
            refundedAt: new Date(),
          }
        )
      }
      break
    }

    default:
      // Unhandled event type — ignore
      break
  }

  return NextResponse.json({ received: true })
}
