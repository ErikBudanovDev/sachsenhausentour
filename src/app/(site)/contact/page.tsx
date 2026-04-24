import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Contact Us — Sachsenhausen Tour Berlin',
  description: 'Get in touch with questions about our Sachsenhausen tour Berlin. Ask about concentration camp memorial tour availability, group bookings, and custom tours.',
}

export default function ContactPage() {
  return (
    <Section spacing="xl" className="pt-32">
      <h1 className="font-heading text-4xl font-bold">Contact Us</h1>
      <p className="mt-4 text-text-muted">Contact page coming soon.</p>
    </Section>
  )
}
