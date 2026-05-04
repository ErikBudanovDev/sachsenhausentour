import type { MetadataRoute } from 'next'

const BASE_URL = 'https://sachsenhausentour.de'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  /* ── Static pages ─────────────────────────────────── */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tour`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/book`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/imprint`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  /* ── Published blog posts (non-draft) ─────────────── */
  const blogPosts: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog/concentration-camp-berlin`,
      lastModified: '2025-06-01',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Draft posts excluded:
    // /blog/sachsenhausen-tour-berlin-journey
    // /blog/what-to-expect-sachsenhausen-tour
  ]

  /* ── Localised pages ──────────────────────────────── */
  const localisedPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/es`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  return [...staticPages, ...blogPosts, ...localisedPages]
}
