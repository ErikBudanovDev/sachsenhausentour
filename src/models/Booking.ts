import mongoose, { Schema, type Document } from 'mongoose'

export interface IBooking extends Document {
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

const BookingSchema = new Schema<IBooking>(
  {
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
