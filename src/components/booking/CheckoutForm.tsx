'use client'

import { useState, FormEvent } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, AlertCircle } from 'lucide-react'

interface CheckoutFormProps {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  total: number
  onBack: () => void
}

export function CheckoutForm({
  name,
  email,
  phone,
  date,
  time,
  guests,
  total,
  onBack,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Validation failed')
      setProcessing(false)
      return
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book/confirmation`,
        payment_method_data: {
          billing_details: { name, email, phone: phone || undefined },
        },
      },
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.')
      setProcessing(false)
      return
    }

    // Payment succeeded — send confirmation email and get booking reference
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      let bookingRef = ''
      try {
        const res = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            date,
            time,
            guests,
            total: `€${total}`,
            paymentId: paymentIntent.id,
          }),
        })
        const data = await res.json()
        bookingRef = data.bookingRef || ''
      } catch {
        // Email failure shouldn't block the user
      }

      // Redirect to confirmation page with booking reference
      const params = new URLSearchParams({
        name,
        date,
        time,
        guests: String(guests),
        total: String(total),
        ...(bookingRef ? { ref: bookingRef } : {}),
      })
      router.push(`/book/confirmation?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order summary */}
      <div className="rounded-md bg-secondary p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-text-muted">
            {guests} guest{guests > 1 ? 's' : ''} · {date} at {time}
          </span>
          <span className="font-heading text-xl font-bold text-accent">€{total}</span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="rounded-md border border-border p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            business: { name: 'Sachsenhausen Tour' },
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Actions */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {processing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay €{total}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={processing}
        className="w-full text-center text-sm text-text-muted hover:text-text transition-colors disabled:opacity-40"
      >
        Go back
      </button>

      <p className="text-center text-xs text-text-muted">
        <Lock className="mr-1 inline h-3 w-3" />
        Payments secured by Stripe. Your card details never touch our servers.
      </p>
    </form>
  )
}
