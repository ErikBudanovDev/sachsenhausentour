import mongoose, { Schema, type Document } from 'mongoose'

export interface ITourConfig extends Document {
  /** Slug identifier — e.g. "sachsenhausen-tour" */
  slug: string
  name: string
  description: string
  pricePerPerson: number
  currency: string
  /** Available time slots */
  timeSlots: { id: string; time: string; label: string }[]
  /** Max guests per slot */
  maxGuestsPerSlot: number
  /** ISO date strings for days with no tours */
  blackoutDates: string[]
  /** Min days in advance a booking can be made */
  minAdvanceDays: number
  /** Duration label */
  duration: string
  /** Meeting point */
  meetingPoint: string
  active: boolean
  updatedAt: Date
}

const TourConfigSchema = new Schema<ITourConfig>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    pricePerPerson: { type: Number, required: true },
    currency: { type: String, default: 'eur' },
    timeSlots: [
      {
        id: { type: String, required: true },
        time: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    maxGuestsPerSlot: { type: Number, default: 20 },
    blackoutDates: [{ type: String }],
    minAdvanceDays: { type: Number, default: 1 },
    duration: { type: String, default: '6 hours' },
    meetingPoint: { type: String, default: 'Generator Berlin Alexanderplatz' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Enforce singleton: when setting active=true, deactivate all others
TourConfigSchema.pre('save', async function () {
  if (this.isModified('active') && this.active) {
    await mongoose.model('TourConfig').updateMany(
      { _id: { $ne: this._id }, active: true },
      { $set: { active: false } }
    )
  }
})

// Also handle findOneAndUpdate
TourConfigSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate() as Record<string, unknown>
  if (update?.active === true || (update?.$set as Record<string, unknown>)?.active === true) {
    const docId = this.getQuery()._id
    await mongoose.model('TourConfig').updateMany(
      { _id: { $ne: docId }, active: true },
      { $set: { active: false } }
    )
  }
})

export const TourConfig =
  mongoose.models.TourConfig || mongoose.model<ITourConfig>('TourConfig', TourConfigSchema)
