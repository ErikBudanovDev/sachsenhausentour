import { Section } from '@/components/ui'
import type { WithClassName } from '@/types'

export interface GuideVoiceProps extends WithClassName {
  quote: string
  name: string
  role: string
}

export function GuideVoice({ quote, name, role, className }: GuideVoiceProps) {
  return (
    <Section background="secondary" spacing="lg" className={className}>
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-accent text-5xl text-accent leading-none">&ldquo;</span>
        <blockquote className="mt-2 font-accent text-xl leading-relaxed text-text sm:text-2xl">
          {quote}
        </blockquote>
        <div className="mt-6">
          <p className="font-semibold text-text">{name}</p>
          <p className="text-sm text-text-muted">{role}</p>
        </div>
      </div>
    </Section>
  )
}
