import { Check, Minus } from 'lucide-react'
import { Section } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface ComparisonRow {
  feature: string
  guided: string
  selfGuided: string
}

export interface ComparisonProps extends WithClassName {
  heading: string
  subheading: string
  rows: ComparisonRow[]
  verdict: string
}

export function Comparison({ heading, subheading, rows, verdict, className }: ComparisonProps) {
  return (
    <Section background="surface" spacing="lg" className={className}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
        <p className="mt-3 text-text-muted">{subheading}</p>
      </div>

      <div className="mt-10 mx-auto max-w-3xl overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-accent">
              <th className="py-3 pr-4 text-sm font-medium uppercase tracking-widest text-text-muted">Feature</th>
              <th className="py-3 px-4 text-sm font-medium uppercase tracking-widest text-accent">Our Guided Tour</th>
              <th className="py-3 pl-4 text-sm font-medium uppercase tracking-widest text-text-muted">Self-Guided</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-border">
                <td className="py-4 pr-4 font-medium text-text">{row.feature}</td>
                <td className="py-4 px-4 text-sm text-text">
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    {row.guided}
                  </span>
                </td>
                <td className="py-4 pl-4 text-sm text-text-muted">
                  <span className="flex items-center gap-2">
                    <Minus className="h-4 w-4 shrink-0 text-text-muted/50" />
                    {row.selfGuided}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-center font-accent text-lg italic text-text-muted">{verdict}</p>
    </Section>
  )
}
