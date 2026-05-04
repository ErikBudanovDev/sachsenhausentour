import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { PageContent } from '@/models/PageContent'
import { PageRevision } from '@/models/PageRevision'
import { getStaticDefaults, PAGE_SLUGS } from '@/lib/page-content'

/** GET — get full revision content */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; revisionId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug, revisionId } = await params

  await connectDB()
  const revision = await PageRevision.findById(revisionId).lean()

  if (!revision || (revision as { slug: string }).slug !== slug) {
    return NextResponse.json({ error: 'Revision not found' }, { status: 404 })
  }

  return NextResponse.json({ revision })
}

/** POST — restore this revision (saves current as a new revision first) */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string; revisionId: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { slug, revisionId } = await params
  if (!PAGE_SLUGS.includes(slug as typeof PAGE_SLUGS[number])) {
    return NextResponse.json({ error: 'Unknown page' }, { status: 404 })
  }

  await connectDB()

  // Find the revision to restore
  const revision = await PageRevision.findById(revisionId).lean() as {
    slug: string
    sections: Record<string, unknown>
    seo?: Record<string, string>
  } | null

  if (!revision || revision.slug !== slug) {
    return NextResponse.json({ error: 'Revision not found' }, { status: 404 })
  }

  const editorEmail = (session.user as { email?: string }).email || 'admin'
  const defaults = getStaticDefaults(slug)

  // Save current version as a revision before restoring
  const existing = await PageContent.findOne({ slug }).lean() as {
    sections?: Record<string, unknown>
    seo?: Record<string, string>
    updatedBy?: string
    updatedAt?: Date
  } | null

  if (existing?.sections) {
    await PageRevision.create({
      slug,
      sections: existing.sections,
      seo: existing.seo || {},
      savedBy: existing.updatedBy || 'unknown',
      savedAt: existing.updatedAt || new Date(),
    })
  }

  // Restore the revision
  const doc = await PageContent.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        title: defaults?.title || slug,
        sections: revision.sections,
        seo: revision.seo || {},
        updatedBy: editorEmail,
      },
    },
    { upsert: true, new: true, runValidators: true }
  ).lean()

  return NextResponse.json({ page: doc, restored: true })
}
