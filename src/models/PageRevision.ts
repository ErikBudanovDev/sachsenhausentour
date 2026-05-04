import { Schema, model, models, type Document } from 'mongoose'

export interface IPageRevision extends Document {
  slug: string
  sections: Record<string, unknown>
  seo?: Record<string, string>
  savedBy: string
  savedAt: Date
}

const PageRevisionSchema = new Schema<IPageRevision>(
  {
    slug: { type: String, required: true, index: true },
    sections: { type: Schema.Types.Mixed, required: true },
    seo: { type: Schema.Types.Mixed, default: {} },
    savedBy: { type: String, required: true },
    savedAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: false,
    strict: false,
  }
)

// Auto-delete revisions older than 90 days
PageRevisionSchema.index({ savedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

// Compound index for efficient queries: all revisions for a page, newest first
PageRevisionSchema.index({ slug: 1, savedAt: -1 })

export const PageRevision =
  models.PageRevision || model<IPageRevision>('PageRevision', PageRevisionSchema)
