import { Section, Card } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface TestimonialItem {
  quote: string
  name: string
  country: string
  date: string
}

export interface TestimonialsProps extends WithClassName {
  heading: string
  items: TestimonialItem[]
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
            <span className="font-accent text-3xl text-accent leading-none">&ldquo;</span>
            <p className="mt-1 text-text leading-relaxed">{item.quote}</p>
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
