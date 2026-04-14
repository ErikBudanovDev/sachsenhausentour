import { Shield } from 'lucide-react'
import { Section, Card } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface PartnerItem {
  name: string
  description: string
}

export interface TrustedByProps extends WithClassName {
  heading: string
  subheading: string
  partners: PartnerItem[]
}

export function TrustedBy({ heading, subheading, partners, className }: TrustedByProps) {
  return (
    <Section spacing="lg" className={className}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
        <p className="mt-3 text-text-muted">{subheading}</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <Card key={partner.name} padding="lg" hoverable>
            <Shield className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-heading text-lg font-bold">{partner.name}</h3>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">{partner.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
