import { Section } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface EmotionalCloseProps extends WithClassName {
  heading: string
  text: string
  attribution?: string
}

export function EmotionalClose({ heading, text, attribution, className }: EmotionalCloseProps) {
  return (
    <Section background="secondary" spacing="lg" className={className}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
        <p className="mt-6 font-accent text-xl leading-relaxed text-text sm:text-2xl">
          {text}
        </p>
        {attribution && (
          <p className="mt-4 text-sm text-text-muted italic">&mdash; {attribution}</p>
        )}
      </div>
    </Section>
  )
}
