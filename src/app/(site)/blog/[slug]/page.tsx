import { Section } from '@/components/ui'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  return (
    <Section spacing="xl" className="pt-32">
      <h1 className="font-heading text-4xl font-bold">{slug.replace(/-/g, ' ')}</h1>
      <p className="mt-4 text-text-muted">Blog post content coming soon.</p>
    </Section>
  )
}
