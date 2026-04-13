import Image from 'next/image'
import { Clock, MapPin, Timer, Star } from 'lucide-react'
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
  platforms: string[]
  snapshots: SnapshotItem[]
}

const iconMap = {
  clock: Clock,
  'map-pin': MapPin,
  timer: Timer,
}

const platformLogos: Record<string, { src: string; alt: string }> = {
  Google: { src: '/images/icons/google.svg', alt: 'Google Reviews' },
  TripAdvisor: { src: '/images/icons/tripadvisor.svg', alt: 'TripAdvisor Reviews' },
}

export function TrustBar({
  rating,
  reviewCount,
  since,
  platforms,
  snapshots,
  className,
}: TrustBarProps) {
  return (
    <Section background="secondary" spacing="md" className={className}>
      {/* Social proof strip */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
        {/* Star rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-accent text-accent"
              />
            ))}
          </div>
          <span className="font-heading text-2xl font-bold text-accent">{rating}</span>
        </div>

        <span className="hidden sm:block text-text-muted/40">|</span>

        {/* Platform logos */}
        <div className="flex items-center gap-3">
          {platforms.map((platform) => {
            const logo = platformLogos[platform]
            if (!logo) return null
            return (
              <div key={platform} className="flex items-center gap-1.5">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                <span className="text-sm text-text-muted">{platform}</span>
              </div>
            )
          })}
        </div>

        <span className="hidden sm:block text-text-muted/40">|</span>

        {/* Review count */}
        <p className="text-sm text-text-muted">
          {reviewCount} reviews since {since}
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
