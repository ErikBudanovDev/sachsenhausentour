import { Star } from 'lucide-react'
import { Section, Card } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface TestimonialItem {
  quote: string
  name: string
  country: string
  date: string
  platform?: 'google' | 'tripadvisor'
  rating?: number
}

export interface TestimonialsProps extends WithClassName {
  heading: string
  items: TestimonialItem[]
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function TripAdvisorIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M12 2C7.64 2 3.89 3.95 1.68 7H0l1.97 2.17A6.5 6.5 0 0 0 5.5 19a6.47 6.47 0 0 0 4.75-2.07L12 19l1.75-2.07A6.47 6.47 0 0 0 18.5 19a6.5 6.5 0 0 0 3.53-9.83L24 7h-1.68C20.11 3.95 16.36 2 12 2zm0 2.5c2.59 0 4.97.82 6.93 2.21A6.47 6.47 0 0 0 12 9.55a6.47 6.47 0 0 0-6.93-2.84A10.45 10.45 0 0 1 12 4.5zM5.5 9a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm13 0a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM5.5 11a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm13 0a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" fill="#34E0A1"/>
    </svg>
  )
}

const platformIcons: Record<string, ({ className }: { className?: string }) => React.JSX.Element> = {
  google: GoogleIcon,
  tripadvisor: TripAdvisorIcon,
}

export function Testimonials({ heading, items, className }: TestimonialsProps) {
  return (
    <Section background="surface" spacing="lg" className={className}>
      <h2 className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl">
        {heading}
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => {
          const PlatformIcon = item.platform ? platformIcons[item.platform] : null
          return (
            <Card key={item.name} padding="lg" hoverable>
              <div className="flex items-start justify-between">
                <span className="font-accent text-3xl text-accent leading-none">&ldquo;</span>
                {PlatformIcon && (
                  <PlatformIcon className="h-5 w-5 opacity-60" />
                )}
              </div>
              {item.rating && (
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
              )}
              <p className="mt-2 text-text leading-relaxed">{item.quote}</p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="font-semibold text-text">{item.name}</p>
                <p className="text-xs text-text-muted">
                  {item.country} &middot; {item.date}
                </p>
              </div>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
