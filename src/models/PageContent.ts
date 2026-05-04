import mongoose, { Schema, type Document } from 'mongoose'

export interface IPageContent extends Document {
  /** URL slug identifying the page, e.g. 'home', 'tour', 'about' */
  slug: string
  /** Human-readable page title for admin list */
  title: string
  /** Section data — flexible JSON keyed by section name */
  sections: Record<string, unknown>
  /** SEO metadata overrides */
  seo?: {
    title?: string
    description?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
  }
  /** Last editor */
  updatedBy?: string
  createdAt: Date
  updatedAt: Date
}

const PageContentSchema = new Schema<IPageContent>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    sections: { type: Schema.Types.Mixed, default: {} },
    seo: {
      title: String,
      description: String,
      ogTitle: String,
      ogDescription: String,
      ogImage: String,
    },
    updatedBy: String,
  },
  { timestamps: true, strict: false }
)

export const PageContent =
  mongoose.models.PageContent ||
  mongoose.model<IPageContent>('PageContent', PageContentSchema)
