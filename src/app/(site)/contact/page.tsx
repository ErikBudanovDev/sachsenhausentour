import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with questions about our Sachsenhausen Memorial tours.',
}

export default function ContactPage() {
  return (
    <Section spacing="xl" className="pt-32">
      <h1 className="font-heading text-4xl font-bold">Contact Us</h1>
      <p className="mt-4 text-text-muted">Contact page coming soon.</p>
    </Section>
  )
}
