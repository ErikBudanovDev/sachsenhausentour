import mongoose, { Schema, type Document } from 'mongoose'
import crypto from 'crypto'

export interface IBooking extends Document {
  /** Human-readable booking reference, e.g. BOT-20260504-A3K7 */
  bookingRef: string
  /** Stripe PaymentIntent ID */
  stripePaymentId: string
  /** Customer details */
  customerName: string
  customerEmail: string
  customerPhone?: string
  /** Tour details */
  tourDate: string
  tourTime: string
  guests: number
  pricePerPerson: number
  totalPaid: number
  currency: string
  /** Status */
  status: 'confirmed' | 'cancelled' | 'refunded'
  /** Internal */
  notes?: string
  assignedGuide?: string
  cancelledAt?: Date
  refundedAt?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Generate a human-readable booking reference.
 * Format: BOT-YYYYMMDD-XXXX (e.g. BOT-20260504-A3K7)
 */
export function generateBookingRef(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I to avoid confusion
  let suffix = ''
  const bytes = crypto.randomBytes(4)
  for (let i = 0; i < 4; i++) {
    suffix += chars[bytes[i] % chars.length]
  }
  return `BOT-${y}${m}${d}-${suffix}`
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingRef: { type: String, required: true, unique: true },
    stripePaymentId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    customerPhone: { type: String },
    tourDate: { type: String, required: true },
    tourTime: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    pricePerPerson: { type: Number, required: true },
    totalPaid: { type: Number, required: true },
    currency: { type: String, default: 'eur' },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'refunded'],
      default: 'confirmed',
    },
    notes: { type: String },
    assignedGuide: { type: String },
    cancelledAt: { type: Date },
    refundedAt: { type: Date },
  },
  { timestamps: true }
)

BookingSchema.index({ tourDate: 1 })
BookingSchema.index({ customerEmail: 1 })
BookingSchema.index({ status: 1 })

export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)
