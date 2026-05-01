/**
 * One-off script: pull recent PaymentIntents from Stripe and backfill
 * any that are missing from MongoDB.
 *
 * Usage:  npx tsx scripts/backfill-bookings.ts
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import Stripe from 'stripe'
import mongoose from 'mongoose'
import { Booking } from '../src/models/Booking'

const STRIPE_LIVE = process.env.STRIPE_LIVE === 'true'
const secretKey = STRIPE_LIVE
  ? process.env.STRIPE_SECRET_KEY_LIVE!
  : process.env.STRIPE_SECRET_KEY_TEST!

console.log(`Using ${STRIPE_LIVE ? 'LIVE' : 'TEST'} Stripe key`)

const stripe = new Stripe(secretKey)

async function main() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI!)
  console.log('Connected to MongoDB')

  // List recent successful PaymentIntents (last 100)
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
  })

  const succeeded = paymentIntents.data.filter(pi => pi.status === 'succeeded')
  console.log(`Found ${succeeded.length} succeeded PaymentIntents`)

  let inserted = 0
  let skipped = 0

  for (const pi of succeeded) {
    const exists = await Booking.findOne({ stripePaymentId: pi.id })
    if (exists) {
      console.log(`  SKIP ${pi.id} — already in DB`)
      skipped++
      continue
    }

    const meta = pi.metadata || {}
    const guests = parseInt(meta.guests || '1', 10)

    const booking = await Booking.create({
      stripePaymentId: pi.id,
      customerName: meta.name || 'Unknown',
      customerEmail: (meta.email || pi.receipt_email || '').toLowerCase(),
      customerPhone: meta.phone || undefined,
      tourDate: meta.date || '',
      tourTime: meta.time || '',
      guests,
      pricePerPerson: Math.round(pi.amount / guests),
      totalPaid: pi.amount,
      currency: pi.currency,
      status: 'confirmed',
    })

    console.log(`  INSERT ${pi.id} — ${booking.customerName}, ${guests} guests, ${meta.date}`)
    inserted++
  }

  console.log(`\nDone: ${inserted} inserted, ${skipped} skipped`)
  await mongoose.disconnect()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
