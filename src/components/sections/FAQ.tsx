'use client'

import { Section, Accordion } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQProps extends WithClassName {
  heading: string
  items: FAQItem[]
}

export function FAQ({ heading, items, className }: FAQProps) {
  return (
    <Section background="surface" spacing="lg" className={className}>
      <h2 className="mb-8 text-center font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
      <div className="mx-auto max-w-2xl">
        {items.map((item) => (
          <Accordion key={item.question} title={item.question}>
            {item.answer}
          </Accordion>
        ))}
      </div>
    </Section>
  )
}
