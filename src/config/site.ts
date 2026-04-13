export const siteConfig = {
  name: 'Sachsenhausen Tour',
  description:
    'Guided 6-hour journey from Berlin to Sachsenhausen Memorial. Led by historians trained in Holocaust education.',
  url: 'https://sachsenhausentour.de',
  ogImage: '/images/og-default.jpg',
  locale: 'en',
  locales: ['en', 'de', 'es'] as const,
  whatsapp: '+4915783893416',
  email: 'service@beoriginaltours.com',
  social: {
    facebook: 'https://facebook.com/sachsenhausentour',
    instagram: 'https://instagram.com/sachsenhausentour',
  },
  booking: {
    price: 29,
    currency: 'EUR',
    departureTime: '10:00 AM',
    duration: '6 hours',
    meetingPoint: 'Generator Berlin Alexanderplatz',
    meetingAddress: 'Otto-Braun-Straße 65, 10178 Berlin',
  },
} as const

export type Locale = (typeof siteConfig.locales)[number]
