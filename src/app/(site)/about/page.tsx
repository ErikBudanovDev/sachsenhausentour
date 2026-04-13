import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet the historians behind Sachsenhausen Tour and learn why we do this work.',
}

export default function AboutPage() {
  return (
    <Section spacing="xl" className="pt-32">
      <h1 className="font-heading text-4xl font-bold">About Us</h1>
      <p className="mt-4 text-text-muted">About page coming soon.</p>
    </Section>
  )
}
