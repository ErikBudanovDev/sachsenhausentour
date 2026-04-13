import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Tour Details',
  description: 'Everything you need to know about our guided Sachsenhausen Memorial tour from Berlin.',
}

export default function TourPage() {
  return (
    <Section spacing="xl" className="pt-32">
      <h1 className="font-heading text-4xl font-bold">Tour Details</h1>
      <p className="mt-4 text-text-muted">Full tour page coming soon.</p>
    </Section>
  )
}
