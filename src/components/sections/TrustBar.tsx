import { Clock, MapPin, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Section, Card } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface SnapshotItem {
  label: string
  value: string
  icon: 'clock' | 'map-pin' | 'timer'
}

export interface TrustBarProps extends WithClassName {
  rating: string
  reviewCount: string
  since: string
  snapshots: SnapshotItem[]
}

const iconMap = {
  clock: Clock,
  'map-pin': MapPin,
  timer: Timer,
}

export function TrustBar({
  rating,
  reviewCount,
  since,
  snapshots,
  className,
}: TrustBarProps) {
  return (
    <Section background="secondary" spacing="md" className={className}>
      {/* Social proof strip */}
      <div className="mb-8 text-center">
        <p className="text-sm text-text-muted tracking-wide">
          <span className="text-accent font-semibold">{rating}</span>
          {' on TripAdvisor '}
          <span className="mx-2 text-secondary">|</span>
          {reviewCount} reviews
          <span className="mx-2 text-secondary">|</span>
          Trusted since {since}
        </p>
      </div>

      {/* Snapshot cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {snapshots.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <Card key={item.label} padding="md" className="text-center">
              <Icon className="mx-auto mb-3 h-6 w-6 text-accent" />
              <p className="font-heading text-xl font-bold">{item.value}</p>
              <p className="mt-1 text-sm text-text-muted">{item.label}</p>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
