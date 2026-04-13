import Image from 'next/image'
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

const platformLogos: Record<string, string> = {
  google: '/images/icons/google.svg',
  tripadvisor: '/images/icons/tripadvisor.svg',
}

export function Testimonials({ heading, items, className }: TestimonialsProps) {
  return (
    <Section background="surface" spacing="lg" className={className}>
      <h2 className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl">
        {heading}
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.name} padding="lg" hoverable>
            <div className="flex items-start justify-between">
              <span className="font-accent text-3xl text-accent leading-none">&ldquo;</span>
              {item.platform && (
                <Image
                  src={platformLogos[item.platform]}
                  alt={item.platform}
                  width={20}
                  height={20}
                  className="h-5 w-5 opacity-60"
                />
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
            <div className="mt-4 border-t border-secondary pt-4">
              <p className="font-semibold text-text">{item.name}</p>
              <p className="text-xs text-text-muted">
                {item.country} &middot; {item.date}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
