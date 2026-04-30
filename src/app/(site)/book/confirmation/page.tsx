'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, CalendarDays, Users, MapPin, Clock, Mail } from 'lucide-react'
import { Section, Button } from '@/components/ui'
import { siteConfig } from '@/config/site'

function ConfirmationContent() {
  const params = useSearchParams()
  const name = params.get('name') || 'Guest'
  const date = params.get('date') || ''
  const time = params.get('time') || ''
  const guests = params.get('guests') || '1'
  const total = params.get('total') || '29'

  return (
    <Section spacing="xl">
      <div className="mx-auto max-w-lg text-center">
        {/* Success icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle className="h-8 w-8 text-accent" />
        </div>

        <h1 className="mt-6 font-heading text-3xl font-bold">Booking Confirmed!</h1>
        <p className="mt-3 text-text-muted">
          Thank you, {name}. Your Sachsenhausen Memorial Tour is booked.
          A confirmation email has been sent to your inbox.
        </p>

        {/* Booking details card */}
        <div className="mt-8 rounded-md border border-border bg-surface p-6 text-left">
          <h2 className="mb-4 font-heading text-lg font-bold">Booking Details</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-text-muted">Date & Time</p>
                <p className="font-semibold text-text">{date} at {time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-text-muted">Guests</p>
                <p className="font-semibold text-text">{guests} guest{Number(guests) > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-text-muted">Meeting Point</p>
                <p className="font-semibold text-text">{siteConfig.booking.meetingPoint}</p>
                <p className="text-sm text-text-muted">{siteConfig.booking.meetingAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-text-muted">Duration</p>
                <p className="font-semibold text-text">{siteConfig.booking.duration}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex items-baseline justify-between">
              <span className="text-sm text-text-muted">Total paid</span>
              <span className="font-heading text-xl font-bold text-accent">€{total}</span>
            </div>
          </div>
        </div>

        {/* Reminder */}
        <div className="mt-6 rounded-md bg-secondary p-4 text-left">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-semibold text-text">Check your email</p>
              <p className="mt-1 text-xs text-text-muted">
                We&apos;ve sent a confirmation with all the details. Please arrive 5–10 minutes before the tour start time.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/" variant="secondary" size="md">
            Back to Home
          </Button>
          <Button
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(`Hi! I just booked the Sachsenhausen Tour for ${date}. My name is ${name}.`)}`}
            variant="primary"
            size="md"
          >
            Questions? WhatsApp Us
          </Button>
        </div>
      </div>
    </Section>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <Section spacing="xl">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-text-muted">Loading confirmation…</p>
          </div>
        </Section>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
