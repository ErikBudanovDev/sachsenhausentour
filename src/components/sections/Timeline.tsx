'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Section } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface TimelineStop {
  title: string
  description: string
}

export interface TimelineProps extends WithClassName {
  heading: string
  stops: TimelineStop[]
}

function TimelineItem({ stop, index }: { stop: TimelineStop; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'relative pl-8 pb-12 last:pb-0 transition-all duration-[600ms] ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      {/* Connector line */}
      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-secondary last:hidden" />

      {/* Dot */}
      <div className="absolute left-0 top-1 h-[23px] w-[23px] rounded-full border-2 border-accent bg-primary" />

      {/* Content */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-accent mb-1">
          Stop {index + 1}
        </p>
        <h3 className="font-heading text-xl font-bold">{stop.title}</h3>
        <p className="mt-2 text-text-muted leading-relaxed">{stop.description}</p>
      </div>
    </div>
  )
}

export function Timeline({ heading, stops, className }: TimelineProps) {
  return (
    <Section spacing="xl" className={className}>
      <h2 className="mb-12 text-center font-heading text-3xl font-bold sm:text-4xl">
        {heading}
      </h2>
      <div className="mx-auto max-w-2xl">
        {stops.map((stop, i) => (
          <TimelineItem key={stop.title} stop={stop} index={i} />
        ))}
      </div>
    </Section>
  )
}
