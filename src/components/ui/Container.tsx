import { cn } from '@/lib/utils'
import type { WithChildrenAndClassName } from '@/types'

type ContainerPadding = 'default' | 'narrow' | 'wide'

export interface ContainerProps extends WithChildrenAndClassName {
  padding?: ContainerPadding
  as?: 'div' | 'section' | 'article'
}

const paddingStyles: Record<ContainerPadding, string> = {
  narrow: 'px-4 sm:px-6',
  default: 'px-4 sm:px-6 lg:px-8',
  wide: 'px-6 sm:px-8 lg:px-12',
}

export function Container({
  children,
  className,
  padding = 'default',
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full max-w-7xl', paddingStyles[padding], className)}
    >
      {children}
    </Component>
  )
}
