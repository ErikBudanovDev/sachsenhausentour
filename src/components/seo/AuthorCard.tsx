import Image from 'next/image'
import { ExternalLink, GraduationCap } from 'lucide-react'
import type { TeamMember } from '@/content/en/team'

interface AuthorCardProps {
  author: TeamMember
  publishedDate: string
  updatedDate?: string
}

export function AuthorCard({ author, publishedDate, updatedDate }: AuthorCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-surface p-5 sm:flex-row sm:items-start">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
        <Image
          src={author.image}
          alt={`${author.name} — ${author.role} at Sachsenhausen Tour`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">Written by</p>
        <h3 className="mt-1 font-heading text-lg font-bold">{author.name}</h3>
        <p className="text-sm font-medium text-accent">{author.role}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <GraduationCap className="h-3.5 w-3.5 text-text-muted" />
          <p className="text-xs text-text-muted">{author.credentials}</p>
        </div>
        <p className="mt-2 text-sm text-text-muted leading-relaxed">{author.bio}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {author.expertise.map((e) => (
              <span key={e} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-text-muted">{e}</span>
            ))}
          </div>
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              LinkedIn <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
          <span>Published: {publishedDate}</span>
          {updatedDate && (
            <>
              <span>&middot;</span>
              <span>Updated: {updatedDate}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function AuthorSchema({ author, publishedDate, updatedDate }: AuthorCardProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    author: {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
      alumniOf: author.credentials,
      knowsAbout: author.expertise,
      sameAs: author.linkedin ? [author.linkedin] : [],
    },
    datePublished: publishedDate,
    ...(updatedDate && { dateModified: updatedDate }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
