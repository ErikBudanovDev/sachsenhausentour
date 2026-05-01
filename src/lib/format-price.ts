/**
 * Format a price in cents to a display string.
 * @param cents - Price in cents (e.g. 2900 = €29)
 * @param currency - Currency code (default 'eur')
 * @returns Formatted string like "€29" or "€29.50"
 */
export function formatPrice(cents: number, currency = 'eur'): string {
  const euros = cents / 100
  const symbol = currency === 'eur' ? '€' : currency === 'usd' ? '$' : currency === 'gbp' ? '£' : `${currency.toUpperCase()} `
  const display = Number.isInteger(euros) ? euros.toString() : euros.toFixed(2)
  return `${symbol}${display}`
}

/**
 * Format price with "pp" suffix for group pricing.
 */
export function formatPricePP(cents: number, currency = 'eur'): string {
  return `${formatPrice(cents, currency)} pp`
}
