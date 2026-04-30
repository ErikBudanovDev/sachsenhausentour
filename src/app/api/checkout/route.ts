import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeSecretKey } from '@/lib/stripe'

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

    const pricePerPerson = 29_00 // €29.00 in cents — change this to update pricing
    const amount = pricePerPerson * guests

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: {
        tour: 'Sachsenhausen Memorial Tour',
        date,
        time,
        guests: String(guests),
        name,
        email,
        phone: phone || '',
      },
      receipt_email: email,
      description: `Sachsenhausen Tour — ${guests} guest${guests > 1 ? 's' : ''} on ${date} at ${time}`,
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
