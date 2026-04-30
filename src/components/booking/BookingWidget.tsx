'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  CalendarDays,
  Users,
  MessageCircle,
  ChevronLeft,
  CreditCard,
  User,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { BookingCalendar } from './BookingCalendar'
import { TimeSlotPicker } from './TimeSlotPicker'
import { StripeProvider } from './StripeProvider'
import { CheckoutForm } from './CheckoutForm'
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
  /** WooCommerce checkout URL (legacy, kept for WhatsApp fallback) */
  checkoutUrl: string
  /** Free cancellation text */
  reassurance: string
}

type Step = 'date' | 'time' | 'confirm' | 'checkout'

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

  // Contact info
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Stripe
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const dateLabel = useMemo(() => {
    if (!selectedDate) return ''
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [selectedDate])

  const shortDateLabel = useMemo(() => {
    if (!selectedDate) return ''
    return selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }, [selectedDate])

  const selectedSlotData = useMemo(
    () => defaultSlots.find((s) => s.id === selectedSlot),
    [defaultSlots, selectedSlot]
  )

  const total = price * guests

  const whatsappHref = useMemo(() => {
    const ph = siteConfig.whatsapp.replace(/\+/g, '')
    const msg =
      selectedDate && selectedSlotData
        ? `Hi! I'd like to book the Sachsenhausen Tour for ${guests} guest${guests > 1 ? 's' : ''} on ${dateLabel} at ${selectedSlotData.time}.`
        : `Hi! I'd like to book the Sachsenhausen Tour.`
    return `https://wa.me/${ph}?text=${encodeURIComponent(msg)}`
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

  async function handleProceedToCheckout() {
    if (!name.trim() || !email.trim()) return
    if (!selectedDate || !selectedSlotData) return

    setCheckoutLoading(true)
    setCheckoutError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guests,
          date: shortDateLabel,
          time: selectedSlotData.time,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || 'Failed to initialize checkout')
      }

      setClientSecret(data.clientSecret)
      setStep('checkout')
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    } finally {
      setCheckoutLoading(false)
    }
  }

  function goBack() {
    if (step === 'time') {
      setStep('date')
      setSelectedSlot(null)
    } else if (step === 'confirm') {
      setStep('time')
    } else if (step === 'checkout') {
      setStep('confirm')
      setClientSecret(null)
    }
  }

  const steps: Step[] = ['date', 'time', 'confirm', 'checkout']

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-md rounded-md border border-border bg-surface p-6 shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        {step !== 'date' && (
          <button
            onClick={goBack}
            className="rounded-md p-1 text-text-muted transition-colors hover:text-accent"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <h3 className="font-heading text-xl font-bold">
            {step === 'date' && 'Choose a Date'}
            {step === 'time' && 'Pick a Time'}
            {step === 'confirm' && 'Your Details'}
            {step === 'checkout' && 'Payment'}
          </h3>
          <p className="text-xs text-text-muted">
            {step === 'date' && 'Select your preferred tour date'}
            {step === 'time' && dateLabel}
            {step === 'confirm' && 'Enter your contact information'}
            {step === 'checkout' && 'Complete your booking'}
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="mb-6 flex gap-1">
        {steps.map((s, i) => (
          <div
            key={s}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i <= steps.indexOf(step) ? 'bg-accent' : 'bg-secondary'
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

      {/* Step: Confirm — contact info + guest count */}
      {step === 'confirm' && selectedDate && selectedSlotData && (
        <div className="space-y-5">
          {/* Booking summary */}
          <div className="rounded-md bg-secondary p-4 space-y-3">
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
                className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-lg font-bold text-text transition-colors hover:border-accent"
              >
                −
              </button>
              <span className="w-8 text-center font-heading text-xl font-bold">
                {guests}
              </span>
              <button
                onClick={() => setGuests((g) => Math.min(20, g + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-lg font-bold text-text transition-colors hover:border-accent"
              >
                +
              </button>
            </div>
          </div>

          {/* Contact fields */}
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm text-text-muted">
                <User className="h-3.5 w-3.5" />
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                required
                className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm text-text-muted">
                <Mail className="h-3.5 w-3.5" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm text-text-muted">
                <Phone className="h-3.5 w-3.5" />
                Phone <span className="text-xs text-text-muted">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+49 123 456 7890"
                className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm text-text-muted">
              {guests} × €{price}
            </span>
            <span className="font-heading text-2xl font-bold text-accent">
              €{total}
            </span>
          </div>

          {/* Error */}
          {checkoutError && (
            <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {checkoutError}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleProceedToCheckout}
              disabled={!name.trim() || !email.trim() || checkoutLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading…
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Continue to Payment
                </>
              )}
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-[#25D366] px-6 py-3 text-sm font-semibold text-[#25D366] transition-all duration-200 hover:bg-[#25D366]/10"
            >
              <MessageCircle className="h-4 w-4" />
              Book via WhatsApp
            </a>
          </div>

          <p className="text-center text-xs text-text-muted">{reassurance}</p>
        </div>
      )}

      {/* Step: Checkout — Stripe payment */}
      {step === 'checkout' && clientSecret && selectedSlotData && (
        <StripeProvider clientSecret={clientSecret}>
          <CheckoutForm
            name={name}
            email={email}
            phone={phone}
            date={shortDateLabel}
            time={selectedSlotData.time}
            guests={guests}
            total={total}
            onBack={goBack}
          />
        </StripeProvider>
      )}
    </div>
  )
}
