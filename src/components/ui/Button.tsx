import { cn } from '@/lib/utils'
import type { WithClassName } from '@/types'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'navy'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends WithClassName {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
  ariaLabel?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white font-semibold hover:bg-accent-hover shadow-md hover:shadow-lg',
  secondary:
    'border-2 border-accent text-accent hover:bg-accent hover:text-white',
  ghost:
    'text-accent hover:text-accent-hover hover:underline underline-offset-4',
  navy:
    'bg-navy text-white font-semibold hover:bg-navy-light shadow-md',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  disabled = false,
  onClick,
  children,
  className,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-md transition-all duration-[var(--transition-medium)] font-body tracking-wide',
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  )

  if (href && !disabled) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
