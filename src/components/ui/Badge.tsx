import { cn } from '@/lib/utils'
import type { WithClassName } from '@/types'

type BadgeVariant = 'default' | 'muted'

export interface BadgeProps extends WithClassName {
  variant?: BadgeVariant
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-accent/20 text-accent border-accent/30',
  muted: 'bg-secondary text-text-muted border-text-muted/20',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
