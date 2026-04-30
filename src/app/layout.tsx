import type { Metadata } from 'next'
import { Inter, Playfair_Display, EB_Garamond } from 'next/font/google'
import { siteConfig } from '@/config/site'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
  display: 'swap',
})

const garamond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Sachsenhausen Tour Berlin — Guided Concentration Camp Memorial Tour from €29',
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sachsenhausen Tour Berlin — Guided Memorial Tour',
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Sachsenhausen Tour Berlin — Guided Concentration Camp Memorial Tour',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sachsenhausen Tour Berlin — Guided Memorial Tour',
    description: siteConfig.description,
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${garamond.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-primary text-navy font-body">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <OrganizationSchema />
      </body>
    </html>
  )
}
