import { Check, X } from 'lucide-react'
import { Section } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface InclusionItem {
  text: string
  included: boolean
}

export interface WhatsIncludedProps extends WithClassName {
  heading: string
  items: InclusionItem[]
}

export function WhatsIncluded({ heading, items, className }: WhatsIncludedProps) {
  const included = items.filter((i) => i.included)
  const excluded = items.filter((i) => !i.included)

  return (
    <Section spacing="lg" className={className}>
      <h2 className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
      <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
        {/* Included */}
        <div className="rounded-md border border-accent/30 bg-accent/5 p-6">
          <h3 className="font-heading text-lg font-bold text-accent mb-4">What&apos;s Included</h3>
          <ul className="space-y-3">
            {included.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-text leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not included */}
        <div className="rounded-md border border-border bg-surface p-6">
          <h3 className="font-heading text-lg font-bold text-text-muted mb-4">Not Included</h3>
          <ul className="space-y-3">
            {excluded.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <X className="mt-0.5 h-5 w-5 shrink-0 text-text-muted/50" />
                <span className="text-text-muted leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
