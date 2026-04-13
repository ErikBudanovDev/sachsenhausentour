import { Check, X } from 'lucide-react'
import { Section } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface QualifierItem {
  text: string
  positive: boolean
}

export interface QualifierProps extends WithClassName {
  heading: string
  items: QualifierItem[]
}

export function Qualifier({ heading, items, className }: QualifierProps) {
  return (
    <Section spacing="md" className={className}>
      <h2 className="mb-8 text-center font-heading text-2xl font-bold sm:text-3xl">
        {heading}
      </h2>
      <div className="mx-auto max-w-xl space-y-4">
        {items.map((item) => (
          <div key={item.text} className="flex items-start gap-3">
            {item.positive ? (
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            ) : (
              <X className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />
            )}
            <p className={item.positive ? 'text-text' : 'text-text-muted'}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
}
