import { cn } from '@/lib/utils'
import type { WithChildrenAndClassName } from '@/types'

type CardPadding = 'sm' | 'md' | 'lg'

export interface CardProps extends WithChildrenAndClassName {
  padding?: CardPadding
  hoverable?: boolean
}

const paddingStyles: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  children,
  className,
  padding = 'md',
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-surface border border-border',
        paddingStyles[padding],
        hoverable && 'transition-all duration-[var(--transition-medium)] hover:border-accent hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  )
}
