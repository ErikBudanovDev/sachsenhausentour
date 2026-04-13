'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WithClassName } from '@/types'

export interface BookingCalendarProps extends WithClassName {
  /** Dates that are unavailable (ISO strings: 'YYYY-MM-DD') */
  blackoutDates?: string[]
  /** Minimum days from today that can be booked */
  minAdvanceDays?: number
  /** Called when a date is selected */
  onSelectDate: (date: Date) => void
  /** Currently selected date */
  selectedDate: Date | null
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export function BookingCalendar({
  blackoutDates = [],
  minAdvanceDays = 1,
  onSelectDate,
  selectedDate,
  className,
}: BookingCalendarProps) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(today)
    d.setDate(1)
    return d
  })

  const minDate = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() + minAdvanceDays)
    return d
  }, [today, minAdvanceDays])

  const blackoutSet = useMemo(() => new Set(blackoutDates), [blackoutDates])

  // Build the calendar grid
  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()

    // First day of month (0=Sun, convert to Mon-based: 0=Mon)
    const firstDay = new Date(year, month, 1)
    let startWeekday = firstDay.getDay() - 1
    if (startWeekday < 0) startWeekday = 6

    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: (Date | null)[] = []

    // Leading empty cells
    for (let i = 0; i < startWeekday; i++) {
      days.push(null)
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d))
    }

    return days
  }, [viewMonth])

  function isDisabled(date: Date): boolean {
    if (date < minDate) return true
    if (blackoutSet.has(toISODate(date))) return true
    return false
  }

  function prevMonth() {
    setViewMonth((prev) => {
      const d = new Date(prev)
      d.setMonth(d.getMonth() - 1)
      // Don't go before current month
      if (d < new Date(today.getFullYear(), today.getMonth(), 1)) return prev
      return d
    })
  }

  function nextMonth() {
    setViewMonth((prev) => {
      const d = new Date(prev)
      d.setMonth(d.getMonth() + 1)
      // Max 3 months ahead
      const max = new Date(today)
      max.setMonth(max.getMonth() + 3)
      if (d > max) return prev
      return d
    })
  }

  const monthLabel = viewMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const canGoPrev = viewMonth > new Date(today.getFullYear(), today.getMonth(), 1)

  return (
    <div className={cn('w-full max-w-sm', className)}>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="rounded-sm p-2 text-text-muted transition-colors hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-heading text-lg font-semibold">{monthLabel}</h3>
        <button
          onClick={nextMonth}
          className="rounded-sm p-2 text-text-muted transition-colors hover:text-accent"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-medium uppercase tracking-wider text-text-muted"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} />
          }

          const disabled = isDisabled(date)
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
          const isToday = isSameDay(date, today)

          return (
            <button
              key={toISODate(date)}
              onClick={() => !disabled && onSelectDate(date)}
              disabled={disabled}
              className={cn(
                'flex h-10 w-full items-center justify-center rounded-sm text-sm transition-all duration-150',
                disabled
                  ? 'cursor-not-allowed text-text-muted/30'
                  : 'cursor-pointer hover:bg-accent/20 text-text',
                isSelected && !disabled && 'bg-accent text-primary font-bold hover:bg-accent',
                isToday && !isSelected && !disabled && 'ring-1 ring-accent/50'
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
