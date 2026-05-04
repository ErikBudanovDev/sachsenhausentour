import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { PageRevision } from '@/models/PageRevision'
import { PAGE_SLUGS } from '@/lib/page-content'

/** GET — list revisions for a page (newest first, last 90 days) */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  if (!PAGE_SLUGS.includes(slug as typeof PAGE_SLUGS[number])) {
    return NextResponse.json({ error: 'Unknown page' }, { status: 404 })
  }

  await connectDB()

  const revisions = await PageRevision.find({ slug })
    .sort({ savedAt: -1 })
    .limit(50)
    .select('_id slug savedBy savedAt')
    .lean()

  return NextResponse.json({ revisions })
}
