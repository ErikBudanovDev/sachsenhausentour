'use client'

import { useState, useMemo, useCallback } from 'react'
import { CalendarDays, Users, MessageCircle, ExternalLink, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { BookingCalendar } from './BookingCalendar'
import { TimeSlotPicker } from './TimeSlotPicker'
import type { TimeSlot } from './TimeSlotPicker'
import type { WithClassName } from '@/types'

export interface BookingWidgetProps extends WithClassName {
  /** Price per person in EUR */
  price: number
  /** Available time slots per day */
  defaultSlots: TimeSlot[]
  /** ISO date strings of unavailable days */
  blackoutDates?: string[]
  /** Min days in advance for booking */
  minAdvanceDays?: number
  /** WooCommerce checkout URL */
  checkoutUrl: string
  /** Free cancellation text */
  reassurance: string
}

type Step = 'date' | 'time' | 'confirm'

export function BookingWidget({
  price,
  defaultSlots,
  blackoutDates = [],
  minAdvanceDays = 1,
  checkoutUrl,
  reassurance,
  className,
}: BookingWidgetProps) {
  const [step, setStep] = useState<Step>('date')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [guests, setGuests] = useState(2)

  const dateLabel = useMemo(() => {
    if (!selectedDate) return ''
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [selectedDate])

  const selectedSlotData = useMemo(
    () => defaultSlots.find((s) => s.id === selectedSlot),
    [defaultSlots, selectedSlot]
  )

  const total = price * guests

  const whatsappHref = useMemo(() => {
    const phone = siteConfig.whatsapp.replace(/\+/g, '')
    const msg = selectedDate && selectedSlotData
      ? `Hi! I'd like to book the Sachsenhausen Tour for ${guests} guest${guests > 1 ? 's' : ''} on ${dateLabel} at ${selectedSlotData.time}.`
      : `Hi! I'd like to book the Sachsenhausen Tour.`
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
  }, [selectedDate, selectedSlotData, guests, dateLabel])

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setStep('time')
  }, [])

  const handleSelectSlot = useCallback((slotId: string) => {
    setSelectedSlot(slotId)
    setStep('confirm')
  }, [])

  function goBack() {
    if (step === 'time') {
      setStep('date')
      setSelectedSlot(null)
    } else if (step === 'confirm') {
      setStep('time')
    }
  }

  return (
    <div className={cn(
      'mx-auto w-full max-w-md rounded-sm border border-secondary bg-surface/80 p-6 backdrop-blur-sm',
      className
    )}>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        {step !== 'date' && (
          <button
            onClick={goBack}
            className="rounded-sm p-1 text-text-muted transition-colors hover:text-accent"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <h3 className="font-heading text-xl font-bold">
            {step === 'date' && 'Choose a Date'}
            {step === 'time' && 'Pick a Time'}
            {step === 'confirm' && 'Confirm Booking'}
          </h3>
          <p className="text-xs text-text-muted">
            {step === 'date' && 'Select your preferred tour date'}
            {step === 'time' && dateLabel}
            {step === 'confirm' && 'Review your selection'}
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="mb-6 flex gap-1">
        {(['date', 'time', 'confirm'] as Step[]).map((s, i) => (
          <div
            key={s}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i <= ['date', 'time', 'confirm'].indexOf(step)
                ? 'bg-accent'
                : 'bg-secondary'
            )}
          />
        ))}
      </div>

      {/* Step: Date */}
      {step === 'date' && (
        <BookingCalendar
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          blackoutDates={blackoutDates}
          minAdvanceDays={minAdvanceDays}
        />
      )}

      {/* Step: Time */}
      {step === 'time' && selectedDate && (
        <TimeSlotPicker
          slots={defaultSlots}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSelectSlot}
          dateLabel={dateLabel}
        />
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && selectedDate && selectedSlotData && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="rounded-sm bg-primary/60 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-accent" />
              <div>
                <p className="text-xs text-text-muted">Date & Time</p>
                <p className="text-sm font-semibold text-text">
                  {dateLabel} at {selectedSlotData.time}
                </p>
              </div>
            </div>
          </div>

          {/* Guest count */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm text-text-muted">
              <Users className="h-4 w-4" />
              Number of guests
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-secondary text-lg font-bold text-text transition-colors hover:border-accent"
              >
                −
              </button>
              <span className="w-8 text-center font-heading text-xl font-bold">{guests}</span>
              <button
                onClick={() => setGuests((g) => Math.min(20, g + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-secondary text-lg font-bold text-text transition-colors hover:border-accent"
              >
                +
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between border-t border-secondary pt-4">
            <span className="text-sm text-text-muted">
              {guests} × €{price}
            </span>
            <span className="font-heading text-2xl font-bold text-accent">€{total}</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 font-semibold text-primary transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
            >
              <ExternalLink className="h-4 w-4" />
              Book & Pay Online
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-sm border border-[#25D366] px-6 py-3 text-sm font-semibold text-[#25D366] transition-all duration-200 hover:bg-[#25D366]/10"
            >
              <MessageCircle className="h-4 w-4" />
              Book via WhatsApp
            </a>
          </div>

          {/* Reassurance */}
          <p className="text-center text-xs text-text-muted">{reassurance}</p>
        </div>
      )}
    </div>
  )
}
