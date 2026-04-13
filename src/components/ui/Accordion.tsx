'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WithChildrenAndClassName } from '@/types'

export interface AccordionProps extends WithChildrenAndClassName {
  title: string
  defaultOpen?: boolean
}

export function Accordion({
  title,
  children,
  className,
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('border-b border-secondary', className)}>
      <button
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-accent"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-heading text-lg font-medium">{title}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-accent transition-transform duration-[var(--transition-medium)]',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-[var(--transition-slow)]',
          isOpen ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="text-text-muted leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}
