import { Check, ShieldCheck } from 'lucide-react'
import { Section, Button, Card } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface PricingProps extends WithClassName {
  heading: string
  price: string
  currency: string
  perPerson: string
  includes: string[]
  cancellation: string
  cta: string
  ctaHref: string
}

export function Pricing({
  heading,
  price,
  currency,
  perPerson,
  includes,
  cancellation,
  cta,
  ctaHref,
  className,
}: PricingProps) {
  return (
    <Section spacing="lg" className={className} id="pricing">
      <h2 className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
      <div className="mx-auto max-w-md">
        <Card padding="lg" className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">{perPerson}</p>
          <p className="mt-2 font-heading text-5xl font-bold text-navy sm:text-6xl">
            {currency}{price}
          </p>

          <ul className="mt-8 space-y-3 text-left">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-text leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href={ctaHref} size="lg" className="w-full">
              {cta}
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-muted">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>{cancellation}</span>
          </div>
        </Card>
      </div>
    </Section>
  )
}
