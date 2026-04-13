import { Check } from 'lucide-react'
import { Section } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface DifferentiatorItem {
  text: string
}

export interface WhyBookProps extends WithClassName {
  heading: string
  differentiators: DifferentiatorItem[]
  priceAnchor: string
}

export function WhyBook({
  heading,
  differentiators,
  priceAnchor,
  className,
}: WhyBookProps) {
  return (
    <Section background="surface" spacing="lg" className={className}>
      <h2 className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl">
        {heading}
      </h2>
      <div className="mx-auto max-w-2xl space-y-5">
        {differentiators.map((item) => (
          <div key={item.text} className="flex items-start gap-4">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <Check className="h-4 w-4 text-accent" />
            </div>
            <p className="text-text leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-text-muted italic font-accent">
        {priceAnchor}
      </p>
    </Section>
  )
}
