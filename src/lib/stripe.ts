/**
 * Stripe configuration — reads STRIPE_LIVE env to pick live or test keys.
 * Set STRIPE_LIVE=true in Vercel env to go live.
 */

export function isStripeLive() {
  return process.env.STRIPE_LIVE === 'true'
}

export function getStripeSecretKey() {
  return isStripeLive()
    ? process.env.STRIPE_SECRET_KEY_LIVE!
    : process.env.STRIPE_SECRET_KEY_TEST!
}

export function getStripePublishableKey() {
  return isStripeLive()
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE!
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST!
}
