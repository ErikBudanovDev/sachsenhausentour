import Image from 'next/image'
import { Section, Button } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface AboutCompanyProps extends WithClassName {
  heading: string
  paragraphs: string[]
  founded: string
  mission: string
}

export function AboutCompany({ heading, paragraphs, founded, mission, className }: AboutCompanyProps) {
  return (
    <Section spacing="lg" className={className}>
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
          <p className="mt-2 text-sm font-medium text-accent">Est. {founded}</p>
          <div className="mt-6 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-text-muted leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
        <div className="rounded-md bg-secondary p-8">
          <h3 className="font-heading text-xl font-bold mb-3">Our Mission</h3>
          <p className="font-accent text-lg italic text-text leading-relaxed">&ldquo;{mission}&rdquo;</p>
          <Image
            src="/images/logo/Logo-2-cropped.png"
            alt="Be Original Tours"
            width={160}
            height={40}
            className="mt-6"
          />
        </div>
      </div>
    </Section>
  )
}
