import Image from 'next/image'
import { Section } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface MeetGuideProps extends WithClassName {
  heading: string
  name: string
  credentials: string
  bio: string[]
  image?: string
  quote: string
}

export function MeetGuide({ heading, name, credentials, bio, image, quote, className }: MeetGuideProps) {
  return (
    <Section background="secondary" spacing="lg" className={className}>
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5 items-center">
        {/* Image */}
        <div className="lg:col-span-2">
          {image ? (
            <div className="overflow-hidden rounded-md">
              <Image
                src={image}
                alt={name}
                width={400}
                height={500}
                className="w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-md bg-surface">
              <p className="text-4xl font-heading font-bold text-accent">
                {name.split(' ').map(n => n[0]).join('')}
              </p>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="lg:col-span-3">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
          <p className="mt-2 text-lg font-medium text-accent">{name}</p>
          <p className="text-sm text-text-muted">{credentials}</p>
          <div className="mt-6 space-y-4">
            {bio.map((p, i) => (
              <p key={i} className="text-text-muted leading-relaxed">{p}</p>
            ))}
          </div>
          <blockquote className="mt-8 border-l-2 border-accent pl-5">
            <p className="font-accent text-lg italic text-text leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </Section>
  )
}
