'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, ExternalLink, CheckCircle, Clock } from 'lucide-react'

interface PageInfo {
  slug: string
  title: string
  hasCustomContent: boolean
  updatedAt: string | null
  updatedBy: string | null
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/pages')
      .then((r) => r.json())
      .then((data) => {
        setPages(data.pages || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const slugToPath: Record<string, string> = {
    home: '/',
    tour: '/tour',
    about: '/about',
    gallery: '/gallery',
    book: '/book',
    contact: '/contact',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Edit text, images, and content for each page on the website.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading pages…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/admin/pages/${page.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-[#0F8B6E] hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-[#0F8B6E]/10">
                    <FileText className="h-5 w-5 text-gray-500 group-hover:text-[#0F8B6E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{page.title}</h3>
                    <p className="text-xs text-gray-400">{slugToPath[page.slug] || `/${page.slug}`}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-[#0F8B6E]" />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs">
                {page.hasCustomContent ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 text-[#0F8B6E]" />
                    <span className="text-[#0F8B6E]">Custom content saved</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-400">Using defaults</span>
                  </>
                )}
              </div>

              {page.updatedAt && (
                <p className="mt-2 text-[11px] text-gray-400">
                  Last edited {new Date(page.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {page.updatedBy ? ` by ${page.updatedBy}` : ''}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
