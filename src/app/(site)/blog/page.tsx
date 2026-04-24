import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Blog — Sachsenhausen History, Berlin Tours & Memorial Guides',
  description: 'Articles about the Sachsenhausen concentration camp near Berlin Germany, visiting tips, historical places to visit in Berlin, and Holocaust education guides.',
}

export default function BlogPage() {
  return (
    <Section spacing="xl" className="pt-32">
      <h1 className="font-heading text-4xl font-bold">Blog</h1>
      <p className="mt-4 text-text-muted">Blog coming soon.</p>
    </Section>
  )
}
