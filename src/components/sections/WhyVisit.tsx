import Image from 'next/image'
import { Section } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface WhyVisitHighlight {
  title: string
  text: string
}

export interface WhyVisitProps extends WithClassName {
  heading: string
  paragraphs: string[]
  highlights: WhyVisitHighlight[]
}

export function WhyVisit({ heading, paragraphs, highlights, className }: WhyVisitProps) {
  return (
    <Section background="surface" spacing="lg" className={className}>
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 items-start">
        <div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
          <div className="mt-6 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-text-muted leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {highlights.map((h) => (
            <div key={h.title} className="border-l-2 border-accent pl-5">
              <h3 className="font-heading text-lg font-bold">{h.title}</h3>
              <p className="mt-1 text-sm text-text-muted leading-relaxed">{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
