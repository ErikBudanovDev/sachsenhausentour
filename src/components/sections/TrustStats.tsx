'use client'

import { useRef, useEffect, useState } from 'react'
import { Section, Card } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface TrustStatItem {
  value: string
  label: string
}

export interface TrustStatsProps extends WithClassName {
  heading: string
  subheading: string
  stats: TrustStatItem[]
}

function AnimatedStat({ value, label }: TrustStatItem) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <p className="font-heading text-4xl font-bold text-accent sm:text-5xl">{value}</p>
      <p className="mt-2 text-sm text-text-muted">{label}</p>
    </div>
  )
}

export function TrustStats({ heading, subheading, stats, className }: TrustStatsProps) {
  return (
    <Section background="surface" spacing="lg" className={className}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
        <p className="mt-3 text-text-muted">{subheading}</p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <AnimatedStat key={stat.label} {...stat} />
        ))}
      </div>
    </Section>
  )
}
