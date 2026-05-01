import { siteConfig } from '@/config/site'

interface TourSchemaProps {
  /** Price in cents (e.g. 2900 = 29.00) */
  priceInCents?: number
  /** Currency code */
  currency?: string
}

export function TourSchema({ priceInCents = 2900, currency = 'EUR' }: TourSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: 'Sachsenhausen Concentration Camp Memorial Tour from Berlin',
    description:
      'A 6-hour guided walking tour of the Sachsenhausen Memorial, led by trained historians. Departs daily from Berlin Alexanderplatz. Covers the full memorial site including Tower A, Roll Call Square, barracks, detention areas, and memorial zones.',
    touristType: ['History enthusiasts', 'Educational groups', 'Families', 'Solo travellers'],
    itinerary: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Meeting at Berlin Alexanderplatz',
          description: 'Meet your guide at Generator Berlin Alexanderplatz, Otto-Braun-Straße 65.',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Train to Oranienburg',
          description: 'Travel by S-Bahn with historical introduction during the journey.',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Sachsenhausen Memorial guided tour',
          description: 'Guided walk through Tower A entrance, Roll Call Square, barracks, detention cells, and memorial zones.',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Return to Berlin',
          description: 'Travel back to Berlin with time for questions and reflection.',
        },
      ],
    },
    offers: {
      '@type': 'Offer',
      price: (priceInCents / 100).toFixed(2),
      priceCurrency: currency.toUpperCase(),
      availability: 'https://schema.org/InStock',
      url: `${siteConfig.url}/book`,
      validFrom: '2024-01-01',
    },
    provider: {
      '@type': 'Organization',
      name: 'Sachsenhausen Tour Berlin — Be Original Tours',
      url: siteConfig.url,
    },
    subjectOf: {
      '@type': 'Place',
      name: 'Sachsenhausen Memorial and Museum',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Straße der Nationen 22',
        addressLocality: 'Oranienburg',
        postalCode: '16515',
        addressCountry: 'DE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 52.7667,
        longitude: 13.2633,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
