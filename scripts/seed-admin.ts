/**
 * Seed script — creates the first admin user and default tour config.
 *
 * Run once:
 *   npx tsx scripts/seed-admin.ts
 *
 * Environment:
 *   MONGODB_URI must be set (or add a .env.local file)
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not set. Add it to .env.local')
  process.exit(1)
}

async function seed() {
  await mongoose.connect(MONGODB_URI!)
  console.log('Connected to MongoDB')

  const db = mongoose.connection.db!

  // ── 1. Admin user ──────────────────────────────────
  const usersCol = db.collection('users')
  const existingAdmin = await usersCol.findOne({ email: 'admin@sachsenhausentour.de' })

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists — skipping')
  } else {
    const hashed = await bcrypt.hash('Admin2025!', 12)
    await usersCol.insertOne({
      email: 'admin@sachsenhausentour.de',
      password: hashed,
      name: 'Erik Budanov',
      role: 'admin',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('✅  Admin user created: admin@sachsenhausentour.de / Admin2025!')
  }

  // ── 2. Default tour config ─────────────────────────
  const toursCol = db.collection('tourconfigs')
  const existingTour = await toursCol.findOne({ slug: 'sachsenhausen-tour' })

  if (existingTour) {
    console.log('⚠️  Tour config already exists — skipping')
  } else {
    await toursCol.insertOne({
      slug: 'sachsenhausen-tour',
      name: 'Sachsenhausen Memorial Tour',
      description:
        'A full-day guided tour of the Sachsenhausen concentration camp from Berlin',
      pricePerPerson: 2900,
      currency: 'eur',
      timeSlots: [
        { id: 'morning', time: '10:00 AM', label: 'Morning Tour' },
      ],
      maxGuestsPerSlot: 20,
      blackoutDates: [],
      minAdvanceDays: 1,
      duration: '6 hours',
      meetingPoint: 'Generator Berlin Alexanderplatz',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('✅  Default tour config created')
  }

  await mongoose.disconnect()
  console.log('\nDone! You can now log in at /admin/login')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
