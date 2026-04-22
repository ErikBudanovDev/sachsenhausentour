import { cn } from '@/lib/utils'
import { Container } from './Container'
import type { WithChildrenAndClassName } from '@/types'

type SectionBackground = 'primary' | 'secondary' | 'surface'
type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl'

export interface SectionProps extends WithChildrenAndClassName {
  background?: SectionBackground
  spacing?: SectionSpacing
  id?: string
}

const bgStyles: Record<SectionBackground, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  surface: 'bg-surface',
}

const spacingStyles: Record<SectionSpacing, string> = {
  sm: 'py-6 md:py-8',
  md: 'py-10 md:py-14',
  lg: 'py-14 md:py-20',
  xl: 'py-20 md:py-28',
}

export function Section({
  children,
  className,
  background = 'primary',
  spacing = 'lg',
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn(bgStyles[background], spacingStyles[spacing], className)}>
      <Container>{children}</Container>
    </section>
  )
}
