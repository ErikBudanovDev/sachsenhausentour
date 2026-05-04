import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { PageContent } from '@/models/PageContent'
import { getStaticDefaults, PAGE_SLUGS } from '@/lib/page-content'

/** GET — get page content (DB + static defaults merged) */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const defaults = getStaticDefaults(slug)
  if (!defaults) {
    return NextResponse.json({ error: 'Unknown page' }, { status: 404 })
  }

  await connectDB()
  const doc = await PageContent.findOne({ slug }).lean()

  return NextResponse.json({
    slug,
    title: (doc as { title?: string })?.title || defaults.title,
    sections: (doc as { sections?: Record<string, unknown> })?.sections || defaults.sections,
    defaults: defaults.sections,
    seo: (doc as { seo?: Record<string, string> })?.seo || {},
    hasCustomContent: !!doc,
  })
}

/** PUT — save page content (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { slug } = await params
  if (!PAGE_SLUGS.includes(slug as typeof PAGE_SLUGS[number])) {
    return NextResponse.json({ error: 'Unknown page' }, { status: 404 })
  }

  const body = await request.json()
  const { title, sections, seo } = body

  if (!sections || typeof sections !== 'object') {
    return NextResponse.json({ error: 'sections is required' }, { status: 400 })
  }

  const defaults = getStaticDefaults(slug)

  await connectDB()

  const doc = await PageContent.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        title: title || defaults?.title || slug,
        sections,
        seo: seo || {},
        updatedBy: (session.user as { email?: string }).email || 'admin',
      },
    },
    { upsert: true, new: true, runValidators: true }
  ).lean()

  return NextResponse.json({ page: doc })
}
