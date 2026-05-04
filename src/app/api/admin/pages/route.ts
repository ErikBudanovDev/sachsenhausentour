import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { PageContent } from '@/models/PageContent'
import { PAGE_SLUGS } from '@/lib/page-content'

/** GET — list all pages with edit status */
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  // Get all DB-stored page content docs
  const dbPages = await PageContent.find({}, 'slug title updatedAt updatedBy')
    .sort({ slug: 1 })
    .lean()

  const dbMap = new Map(
    dbPages.map((p) => [(p as { slug: string }).slug, p])
  )

  // Build list with all known pages, marking which have DB overrides
  const pages = PAGE_SLUGS.map((slug) => {
    const db = dbMap.get(slug) as { title?: string; updatedAt?: Date; updatedBy?: string } | undefined
    const titles: Record<string, string> = {
      home: 'Homepage',
      tour: 'Tour Details',
      about: 'About Us',
      gallery: 'Gallery',
      book: 'Book Your Tour',
      contact: 'Contact',
    }
    return {
      slug,
      title: db?.title || titles[slug] || slug,
      hasCustomContent: !!db,
      updatedAt: db?.updatedAt || null,
      updatedBy: db?.updatedBy || null,
    }
  })

  return NextResponse.json({ pages })
}
