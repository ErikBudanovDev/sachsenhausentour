import { Train, Car, Footprints, CheckCircle } from 'lucide-react'
import { Section, Card } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface TravelOption {
  method: string
  duration: string
  description: string
  recommended?: boolean
}

export interface HowToGetProps extends WithClassName {
  heading: string
  intro: string
  distance: string
  options: TravelOption[]
  guidedNote: string
}

const methodIcons: Record<string, typeof Train> = {
  Train: Train,
  Car: Car,
  'On foot': Footprints,
}

export function HowToGet({ heading, intro, distance, options, guidedNote, className }: HowToGetProps) {
  return (
    <Section spacing="lg" className={className}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
        <p className="mt-3 text-text-muted">{intro}</p>
        <p className="mt-2 text-sm font-medium text-accent">{distance}</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
        {options.map((opt) => {
          const Icon = methodIcons[opt.method] || Train
          return (
            <Card key={opt.method} padding="lg" hoverable className={opt.recommended ? 'ring-2 ring-accent' : ''}>
              {opt.recommended && (
                <span className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  Recommended
                </span>
              )}
              <Icon className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-heading text-lg font-bold">{opt.method}</h3>
              <p className="mt-1 text-sm font-medium text-accent">{opt.duration}</p>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{opt.description}</p>
            </Card>
          )
        })}
      </div>
      <div className="mt-8 mx-auto max-w-2xl flex items-start gap-3 rounded-md bg-secondary p-4">
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <p className="text-sm text-text-muted leading-relaxed">{guidedNote}</p>
      </div>
    </Section>
  )
}
