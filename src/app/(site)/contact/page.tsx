export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Mail, MessageCircle, MapPin } from 'lucide-react'
import { Section, Button } from '@/components/ui'
import { getPageContent } from '@/lib/page-content'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Contact Us — Sachsenhausen Tour Berlin',
  description: 'Get in touch with questions about our Sachsenhausen tour Berlin. Ask about concentration camp memorial tour availability, group bookings, and custom tours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Sachsenhausen Tour Berlin',
    description: 'Questions about our Sachsenhausen tour? Get in touch about availability, group bookings, and custom tours.',
    url: '/contact',
  },
}

export default async function ContactPage() {
  const { sections: p } = await getPageContent('contact')
  const hero = p.hero as { title?: string; subtitle?: string } | undefined
  const info = p.info as { email?: string; whatsapp?: string; address?: string } | undefined

  const email = info?.email || siteConfig.email
  const whatsapp = info?.whatsapp || siteConfig.whatsapp
  const whatsappHref = `https://wa.me/${whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('Hi! I have a question about the Sachsenhausen Tour.')}`

  return (
    <>
      <Section spacing="xl" className="pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-4xl font-bold">{hero?.title || 'Contact Us'}</h1>
          <p className="mt-4 text-text-muted">
            {hero?.subtitle || 'Have questions about our Sachsenhausen tour? Get in touch.'}
          </p>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-surface p-6 text-center">
            <Mail className="mx-auto h-6 w-6 text-accent" />
            <h3 className="mt-3 font-heading text-lg font-bold">Email</h3>
            <a href={`mailto:${email}`} className="mt-2 block text-sm text-accent hover:underline">
              {email}
            </a>
          </div>
          <div className="rounded-md border border-border bg-surface p-6 text-center">
            <MessageCircle className="mx-auto h-6 w-6 text-accent" />
            <h3 className="mt-3 font-heading text-lg font-bold">WhatsApp</h3>
            <a href={whatsappHref} className="mt-2 block text-sm text-accent hover:underline">
              {whatsapp}
            </a>
          </div>
          <div className="rounded-md border border-border bg-surface p-6 text-center">
            <MapPin className="mx-auto h-6 w-6 text-accent" />
            <h3 className="mt-3 font-heading text-lg font-bold">Location</h3>
            <p className="mt-2 text-sm text-text-muted">{info?.address || 'Berlin, Germany'}</p>
          </div>
        </div>
      </Section>

      <Section background="surface" spacing="lg">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-heading text-2xl font-bold">Ready to Book?</h2>
          <p className="mt-2 text-text-muted">Skip the questions — reserve your spot now.</p>
          <div className="mt-6">
            <Button href="/book#booking" size="lg">Book Your Tour</Button>
          </div>
        </div>
      </Section>
    </>
  )
}
