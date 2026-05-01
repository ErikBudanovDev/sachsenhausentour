/**
 * One-time migration: fix the existing TourConfig record
 * - Set pricePerPerson to 2900 (€29)
 * - Set originalPrice to 4900 (€49)
 * - Set discountBadge to "40% OFF"
 * - Save the 3 pricing tiers (Adult, Student, Group 8+)
 */
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local')
  process.exit(1)
}

await mongoose.connect(MONGODB_URI)
console.log('Connected to MongoDB')

const result = await mongoose.connection.db.collection('tourconfigs').updateOne(
  { active: true },
  {
    $set: {
      pricePerPerson: 2900,
      originalPrice: 4900,
      discountBadge: '40% OFF',
      pricingTiers: [
        { label: 'Adult', price: 2900, note: 'Standard rate', highlight: true },
        { label: 'Student (valid ID)', price: 2400, note: 'Valid student ID required', highlight: false },
        { label: 'Group (8+)', price: 2200, note: 'Per person, 8 or more guests', highlight: false },
      ],
    },
  }
)

console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`)

// Verify
const doc = await mongoose.connection.db.collection('tourconfigs').findOne({ active: true })
console.log('Updated record:', JSON.stringify({
  pricePerPerson: doc.pricePerPerson,
  originalPrice: doc.originalPrice,
  discountBadge: doc.discountBadge,
  pricingTiers: doc.pricingTiers,
}, null, 2))

await mongoose.disconnect()
console.log('Done!')
