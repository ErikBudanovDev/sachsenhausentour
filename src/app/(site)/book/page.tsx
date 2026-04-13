import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Book Your Tour',
  description: 'Reserve your guided Sachsenhausen Memorial tour from Berlin. Free cancellation up to 24 hours.',
}

export default function BookPage() {
  return (
    <Section spacing="xl" className="pt-32">
      <h1 className="font-heading text-4xl font-bold">Book Your Tour</h1>
      <p className="mt-4 text-text-muted">Booking flow coming soon.</p>
    </Section>
  )
}
