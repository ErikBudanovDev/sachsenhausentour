import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/book/confirmation',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://sachsenhausentour.de/sitemap.xml',
  }
}
