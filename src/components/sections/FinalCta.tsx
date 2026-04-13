import { Section, Button } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface FinalCtaProps extends WithClassName {
  heading: string
  cta: string
  ctaHref: string
  ctaSecondary: string
  ctaSecondaryHref: string
  nextDate?: string
}

export function FinalCta({
  heading,
  cta,
  ctaHref,
  ctaSecondary,
  ctaSecondaryHref,
  nextDate,
  className,
}: FinalCtaProps) {
  return (
    <Section background="surface" spacing="xl" className={className}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
        {nextDate && (
          <p className="mt-4 text-sm text-text-muted">
            Next available: {nextDate}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href={ctaHref} size="lg">
            {cta}
          </Button>
          <Button href={ctaSecondaryHref} variant="secondary" size="lg">
            {ctaSecondary}
          </Button>
        </div>
      </div>
    </Section>
  )
}
