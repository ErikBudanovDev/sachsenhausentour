import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles about Sachsenhausen history, visiting tips, and Holocaust education.',
}

export default function BlogPage() {
  return (
    <Section spacing="xl" className="pt-32">
      <h1 className="font-heading text-4xl font-bold">Blog</h1>
      <p className="mt-4 text-text-muted">Blog coming soon.</p>
    </Section>
  )
}
