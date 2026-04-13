'use client'

import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WithClassName } from '@/types'

export interface TimeSlot {
  id: string
  time: string
  label: string
  available: boolean
}

export interface TimeSlotPickerProps extends WithClassName {
  slots: TimeSlot[]
  selectedSlot: string | null
  onSelectSlot: (slotId: string) => void
  dateLabel: string
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  dateLabel,
  className,
}: TimeSlotPickerProps) {
  return (
    <div className={cn('w-full', className)}>
      <p className="mb-3 text-sm text-text-muted">
        Available times for <span className="font-semibold text-text">{dateLabel}</span>
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.id
          return (
            <button
              key={slot.id}
              onClick={() => slot.available && onSelectSlot(slot.id)}
              disabled={!slot.available}
              className={cn(
                'flex items-center gap-3 rounded-sm border p-3 transition-all duration-150',
                slot.available
                  ? 'cursor-pointer border-secondary hover:border-accent/60'
                  : 'cursor-not-allowed border-secondary/50 opacity-40',
                isSelected && slot.available && 'border-accent bg-accent/10'
              )}
            >
              <Clock className={cn(
                'h-4 w-4 shrink-0',
                isSelected ? 'text-accent' : 'text-text-muted'
              )} />
              <div className="text-left">
                <p className={cn(
                  'text-sm font-semibold',
                  isSelected ? 'text-accent' : 'text-text'
                )}>
                  {slot.time}
                </p>
                <p className="text-xs text-text-muted">{slot.label}</p>
              </div>
              {!slot.available && (
                <span className="ml-auto text-xs text-text-muted">Full</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
