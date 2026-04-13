import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface PageHeroProps extends WithClassName {
  title: string
  subtitle: string
  cta: string
  ctaHref: string
  ctaSecondary?: string
  ctaSecondaryHref?: string
  reassurance?: string
  backgroundImage?: string
}

export function PageHero({
  title,
  subtitle,
  cta,
  ctaHref,
  ctaSecondary,
  ctaSecondaryHref,
  reassurance,
  backgroundImage,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center text-center',
        className
      )}
    >
      {/* Background */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-primary/70" />
        </div>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-primary" />}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted sm:text-xl">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href={ctaHref} size="lg">
            {cta}
          </Button>
          {ctaSecondary && ctaSecondaryHref && (
            <Button href={ctaSecondaryHref} variant="secondary" size="lg">
              {ctaSecondary}
            </Button>
          )}
        </div>
      </div>

      {/* Reassurance strip */}
      {reassurance && (
        <div className="relative z-10 mt-16 w-full border-t border-secondary/50 bg-primary/50 backdrop-blur-sm">
          <p className="py-4 text-center text-sm text-text-muted italic font-accent">
            {reassurance}
          </p>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-5 rounded-full border-2 border-text-muted/50 p-1">
          <div className="h-2 w-1 mx-auto rounded-full bg-accent" />
        </div>
      </div>
    </section>
  )
}
