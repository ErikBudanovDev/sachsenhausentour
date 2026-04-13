import type { HeroContent } from '@/content/types'
import type { TimeSlot } from '@/components/booking'

export interface BookingHighlight {
  icon: 'clock' | 'map-pin' | 'users' | 'calendar' | 'euro' | 'train'
  label: string
  value: string
}

export interface ItineraryStop {
  time: string
  title: string
  description: string
}

export interface WhatToBring {
  item: string
  note: string
}

export interface BookingContent {
  hero: HeroContent
  highlights: BookingHighlight[]
  description: {
    heading: string
    paragraphs: string[]
  }
  itinerary: {
    heading: string
    stops: ItineraryStop[]
  }
  siteHighlights: {
    heading: string
    items: string[]
  }
  whatToBring: {
    heading: string
    items: WhatToBring[]
  }
  bookingCta: {
    heading: string
    subheading: string
    price: string
    perPerson: string
    buttonText: string
    buttonHref: string
    reassurance: string
  }
  contact: {
    heading: string
    subheading: string
    whatsappText: string
    emailText: string
  }
  bookingWidget: {
    slots: TimeSlot[]
    blackoutDates: string[]
    minAdvanceDays: number
  }
}

export const bookContent: BookingContent = {
  hero: {
    title: 'The Original Sachsenhausen Tour',
    subtitle: 'A full-day guided memorial experience from Berlin. Expert historians. Small groups. Real stories.',
    cta: 'Reserve Your Spot',
    ctaHref: '#booking',
    ctaSecondary: 'Questions? WhatsApp us',
    ctaSecondaryHref: 'https://wa.me/4915783893416?text=Hi!%20I%27d%20like%20to%20book%20the%20Sachsenhausen%20Tour.',
    reassurance: 'Free cancellation up to 24 hours before departure.',
    backgroundImage: '/images/gallery/DSCF5931-min-scaled.jpg',
  },

  highlights: [
    { icon: 'calendar', label: 'Schedule', value: 'Daily at 10:00 AM' },
    { icon: 'clock', label: 'Duration', value: 'Approx. 6 hours' },
    { icon: 'euro', label: 'Price', value: '€29 per person' },
    { icon: 'map-pin', label: 'Meeting Point', value: 'Generator Berlin Alexanderplatz' },
    { icon: 'users', label: 'Group Size', value: 'Small groups' },
    { icon: 'train', label: 'Transport', value: 'ABC ticket required' },
  ],

  description: {
    heading: 'More Than a Tour — An Education',
    paragraphs: [
      'This is not a walking tour with dates and facts. Our licensed guides use survivor testimony, personal research, and historical context to help you understand one of the darkest chapters in human history — and why it still matters today.',
      'From the moment we meet at Alexanderplatz, the experience begins. On the train ride to Oranienburg, your guide provides the political context that led to the creation of the camp system. By the time you step through the gates of Sachsenhausen, you\'ll understand not just what happened — but how and why.',
      'We visit the key sites within the memorial: the entrance gate inscribed "Arbeit Macht Frei," the roll-call square, prisoner barracks with original wooden bunk beds, punishment cells, the camp infirmary where medical experiments took place, and Station Z — the execution and extermination facilities.',
    ],
  },

  itinerary: {
    heading: 'Your Day',
    stops: [
      {
        time: '10:00 AM',
        title: 'Meet at Generator Berlin Alexanderplatz',
        description: 'Your guide introduces the group and provides historical context for the journey ahead.',
      },
      {
        time: '10:30 AM',
        title: 'Train to Oranienburg',
        description: 'A guided briefing on the rise of the Nazi regime and the concentration camp system during the 45-minute train ride.',
      },
      {
        time: '11:15 AM',
        title: 'Arrive at Sachsenhausen Memorial',
        description: 'Walk through the entrance gate and begin the guided exploration of the memorial grounds.',
      },
      {
        time: '11:15 – 3:00 PM',
        title: 'Guided Memorial Tour',
        description: 'Visit punishment cells, gas chambers, guard tower, "the pit," roll-call square, prisoner barracks, camp infirmary, and Station Z.',
      },
      {
        time: '3:30 PM',
        title: 'Return to Berlin',
        description: 'Train back to Alexanderplatz. Time for reflection and final questions with your guide.',
      },
      {
        time: '~4:00 PM',
        title: 'Arrive back in Berlin',
        description: 'Tour concludes at Berlin Alexanderplatz station.',
      },
    ],
  },

  siteHighlights: {
    heading: 'What You\'ll See',
    items: [
      'Entrance gate with "Arbeit Macht Frei" inscription',
      'Roll-Call Square — centre of daily prisoner life',
      'Prisoner barracks with original wooden bunk beds',
      'Punishment cells — solitary confinement and torture',
      'Camp infirmary — site of medical experiments',
      'Station Z — execution trench, gas chamber, and crematorium',
      'Guard tower — overlooking the triangular camp layout',
      '"The Pit" — the camp\'s isolation punishment area',
      'Soviet Special Camp memorial (1945–1950)',
    ],
  },

  whatToBring: {
    heading: 'What to Bring',
    items: [
      { item: 'Valid ABC transit ticket', note: 'Required for the S-Bahn to Oranienburg. Purchase before the tour.' },
      { item: '€3 for memorial donation', note: 'The memorial kindly requests a personal donation. Bring exact change.' },
      { item: 'Food and water', note: 'Limited food options at the memorial site. Pack a snack and a drink.' },
      { item: 'Comfortable shoes', note: 'The memorial grounds are extensive. Expect 3+ hours of walking.' },
      { item: 'Weather-appropriate clothing', note: 'The tour runs rain or shine. Bring a rain jacket in spring/autumn.' },
    ],
  },

  bookingCta: {
    heading: 'Reserve Your Spot',
    subheading: 'Join us for a meaningful journey through history. Small groups ensure a personal, thoughtful experience.',
    price: '€29',
    perPerson: 'per person',
    buttonText: 'Book Now',
    buttonHref: 'https://sachsenhausentour.de/product/sachsenhausen-memorial-and-museum-tour/',
    reassurance: 'Free cancellation up to 24 hours before departure. No questions asked.',
  },

  contact: {
    heading: 'Questions?',
    subheading: 'We respond within minutes. Reach us anytime.',
    whatsappText: 'Chat on WhatsApp',
    emailText: 'Send us an email',
  },

  bookingWidget: {
    slots: [
      {
        id: 'morning-10',
        time: '10:00 AM',
        label: 'Morning tour — most popular',
        available: true,
      },
      {
        id: 'morning-1030',
        time: '10:30 AM',
        label: 'Morning tour — small group',
        available: true,
      },
    ],
    blackoutDates: [
      '2026-12-24',
      '2026-12-25',
      '2026-12-31',
      '2027-01-01',
    ],
    minAdvanceDays: 1,
  },
}
