import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Blog — Sachsenhausen History, Berlin Tours & Memorial Guides',
  description: 'Articles about the Sachsenhausen concentration camp near Berlin Germany, visiting tips, historical places to visit in Berlin, and Holocaust education guides.',
}

const blogPosts = [
  {
    slug: 'concentration-camp-berlin',
    title: 'Concentration Camp Near Berlin Germany: Visiting Sachsenhausen Memorial',
    description: 'The most important World War Two memorial site and historical place to visit in Berlin — accessible as a day trip from the German capital.',
    image: '/images/gallery/DSCF5939-min-scaled.jpg',
    date: '2025-03-15',
    category: 'Memorial Guide',
    draft: false,
  },
  {
    slug: 'sachsenhausen-tour-berlin-journey',
    title: 'Sachsenhausen Tour Berlin: A Journey Through History and Memory',
    description: 'Everything you need to know before visiting the Sachsenhausen concentration camp memorial — what to see, how long the tour takes, and practical tips.',
    image: '/images/gallery/DSCF5947-min-1-scaled.jpg',
    date: '2025-04-21',
    category: 'Tour Guide',
    draft: true,
  },
  {
    slug: 'what-to-expect-sachsenhausen-tour',
    title: 'What to Expect from a Sachsenhausen Tour Berlin: History, Routes, and Insights',
    description: 'A step-by-step guide to every area you will visit on the Sachsenhausen concentration camp memorial tour from Berlin.',
    image: '/images/gallery/DSCF5931-min-scaled.jpg',
    date: '2025-04-21',
    category: 'Tour Guide',
    draft: true,
  },
]

export default function BlogPage() {
  return (
    <>
      <Section spacing="xl" className="pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">Blog</h1>
          <p className="mt-4 font-accent text-lg italic text-text-muted">
            Guides, history, and practical advice for visiting Sachsenhausen and Berlin&apos;s memorial sites.
          </p>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="mx-auto max-w-4xl space-y-8">
          {blogPosts.filter((post) => !post.draft).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-md border border-border bg-surface transition-shadow hover:shadow-md sm:flex-row"
            >
              <div className="relative h-56 w-full shrink-0 sm:h-auto sm:w-72">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-accent">{post.category}</p>
                <h2 className="mt-2 font-heading text-xl font-bold group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{post.description}</p>
                <p className="mt-3 text-xs text-text-muted">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}
