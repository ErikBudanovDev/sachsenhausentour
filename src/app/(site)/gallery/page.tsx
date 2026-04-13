import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from the Sachsenhausen Memorial and our guided tours.',
}

export default function GalleryPage() {
  return (
    <Section spacing="xl" className="pt-32">
      <h1 className="font-heading text-4xl font-bold">Gallery</h1>
      <p className="mt-4 text-text-muted">Photo gallery coming soon.</p>
    </Section>
  )
}
