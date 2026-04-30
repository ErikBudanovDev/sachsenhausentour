'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import type { ReactNode } from 'react'

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_LIVE === 'true'
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE!
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST!

const stripePromise = loadStripe(publishableKey)

interface StripeProviderProps {
  clientSecret: string
  children: ReactNode
}

export function StripeProvider({ clientSecret, children }: StripeProviderProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0F8B6E',
            colorText: '#1B1B1B',
            colorTextSecondary: '#555555',
            colorDanger: '#DC2626',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '6px',
          },
        },
      }}
    >
      {children}
    </Elements>
  )
}
