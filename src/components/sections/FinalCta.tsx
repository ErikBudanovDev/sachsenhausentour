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
    <section className={cn('bg-navy py-24 md:py-32', className)}>
      <div className="mx-auto max-w-2xl text-center px-4">
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">{heading}</h2>
        {subheading && (
          <p className="mt-4 text-white/70">{subheading}</p>
        )}
        {nextDate && (
          <p className="mt-4 text-sm text-white/60">
            Next available: {nextDate}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href={ctaHref} size="lg">
            {cta}
          </Button>
          <Button href={ctaSecondaryHref} variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
            {ctaSecondary}
          </Button>
        </div>
        {urgencyNote && (
          <p className="mt-6 text-sm text-white/50 italic">{urgencyNote}</p>
        )}
      </div>
    </section>
  )
}
