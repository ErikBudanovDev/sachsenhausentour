import { siteConfig } from '@/config/site'
import { formatPrice } from '@/lib/format-price'

interface OrganizationSchemaProps {
  /** Price per person in cents */
  priceInCents?: number
  /** Currency code */
  currency?: string
}

export function OrganizationSchema({ priceInCents = 2900, currency = 'eur' }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristInformationCenter',
    name: 'Sachsenhausen Tour Berlin — Be Original Tours',
    alternateName: 'Sachsenhausen Tour',
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/og-default.jpg`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.whatsapp,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.booking.meetingAddress,
      addressLocality: 'Berlin',
      addressCountry: 'DE',
      postalCode: '10178',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.5233,
      longitude: 13.4158,
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      'https://www.tripadvisor.com/AttractionProductReview-g187323-d12934907-From_Berlin_Sachsenhausen_Concentration_Camp_Memorial_Tour-Berlin.html',
      'https://www.google.com/maps/place/Sachsenhausen+Tour+Berlin+-+Be+Original+Tours/',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '4363',
      bestRating: '5',
      worstRating: '1',
    },
    priceRange: formatPrice(priceInCents, currency),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
