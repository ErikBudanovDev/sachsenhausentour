import { Button } from '@/components/ui'
import type { WithClassName } from '@/types'
import { cn } from '@/lib/utils'

export interface FinalCtaProps extends WithClassName {
  heading: string
  subheading?: string
  cta: string
  ctaHref: string
  ctaSecondary: string
  ctaSecondaryHref: string
  nextDate?: string
  urgencyNote?: string
}

export function FinalCta({
  heading,
  subheading,
  cta,
  ctaHref,
  ctaSecondary,
  ctaSecondaryHref,
  nextDate,
  urgencyNote,
  className,
}: FinalCtaProps) {
  return (
    <section className={cn('border-t border-border bg-secondary py-20 md:py-28', className)}>
      <div className="mx-auto max-w-2xl text-center px-4">
        <h2 className="font-heading text-3xl font-bold text-text sm:text-4xl">{heading}</h2>
        {subheading && (
          <p className="mt-4 text-text-muted">{subheading}</p>
        )}
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
        {urgencyNote && (
          <p className="mt-6 text-sm text-text-muted italic">{urgencyNote}</p>
        )}
      </div>
    </section>
  )
}
