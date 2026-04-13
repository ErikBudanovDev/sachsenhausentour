import type { HomeContent } from '../types'

export const homeContent: HomeContent = {
  hero: {
    title: 'Walk Through History. Understand the Past.',
    subtitle:
      'A guided 6-hour journey from Berlin to Sachsenhausen Memorial, led by historians trained in Holocaust education.',
    cta: 'Book Your Tour',
    ctaHref: '/book',
    ctaSecondary: 'Learn More',
    ctaSecondaryHref: '/tour',
    reassurance:
      'A respectful, educational experience \u2014 suitable for all visitors interested in understanding history.',
  },

  trustBar: {
    rating: '4.9',
    reviewCount: '2,400+',
    since: '2015',
    platforms: ['TripAdvisor', 'Google'],
    snapshots: [
      { label: 'Departure', value: 'Daily at 10:00 AM', icon: 'clock' },
      { label: 'Meeting Point', value: 'Berlin Alexanderplatz', icon: 'map-pin' },
      { label: 'Duration', value: '6 Hours', icon: 'timer' },
    ],
  },

  timeline: {
    heading: 'What You Will Experience',
    stops: [
      {
        title: 'The Journey North',
        description:
          'We travel together by train from Berlin, using the 35-kilometre journey to introduce the historical context of the camp\u2019s creation in 1936 and its role within the Nazi concentration camp system.',
      },
      {
        title: 'The Entrance Gate',
        description:
          'Standing before the gate inscribed with \u201CArbeit Macht Frei,\u201D your guide explains the calculated cruelty behind the slogan and what prisoners faced upon arrival.',
      },
      {
        title: 'Prisoner Barracks',
        description:
          'Inside the reconstructed barracks, we explore the daily reality of camp life \u2014 the overcrowding, the hierarchy imposed among prisoners, and the strategies people used to survive.',
      },
      {
        title: 'Punishment Cells',
        description:
          'The isolation cells reveal the systematic use of punishment as a tool of terror. Your guide provides context for understanding these methods within the broader system of repression.',
      },
      {
        title: 'Station Z',
        description:
          'At the former execution site, we pause to reflect on the thousands who lost their lives here. This is a moment for quiet contemplation and understanding.',
      },
      {
        title: 'Memorial and Reflection',
        description:
          'We conclude at the memorial, discussing how Sachsenhausen is remembered today, its significance in Holocaust education, and the importance of bearing witness to history.',
      },
    ],
  },

  whyBook: {
    heading: 'Why Choose This Tour',
    differentiators: [
      {
        text: 'Led by historians trained specifically in Holocaust education \u2014 not general tour guides.',
      },
      {
        text: 'We focus on context and understanding, not just locations. You\u2019ll leave knowing the \u201Cwhy,\u201D not just the \u201Cwhat.\u201D',
      },
      {
        text: 'No rushed schedules. We allow time for reflection at key memorial sites.',
      },
      {
        text: 'Small groups ensure a personal, respectful experience where every question matters.',
      },
      {
        text: 'Free cancellation up to 24 hours before departure. No questions asked.',
      },
    ],
    priceAnchor:
      'An expert-led, full-day memorial experience at an accessible price.',
  },

  qualifier: {
    heading: 'Is This Tour Right for You?',
    items: [
      { text: 'You are interested in history and want a deeper understanding of the Holocaust.', positive: true },
      { text: 'You value expert context and thoughtful narration over surface-level sightseeing.', positive: true },
      { text: 'You appreciate an unhurried pace with time for reflection at meaningful sites.', positive: true },
      { text: 'This is not a casual sightseeing trip \u2014 it is an educational memorial experience.', positive: false },
    ],
  },

  guideVoice: {
    quote:
      'As guides, our goal is not just to show you Sachsenhausen \u2014 it\u2019s to help you understand the human stories behind the walls. Every tour is different, because every group brings their own questions, their own perspective, and their own reasons for wanting to learn.',
    name: 'Tour Guide Team',
    role: 'Sachsenhausen Tour Historians',
  },

  testimonials: {
    heading: 'What Visitors Say',
    items: [
      {
        quote:
          'This was not just a tour \u2014 it was an education. Our guide brought the history to life with such depth and sensitivity. I left with a completely different understanding of what happened here.',
        name: 'Sarah M.',
        country: 'United Kingdom',
        date: 'March 2026',
      },
      {
        quote:
          'The level of knowledge our guide had was extraordinary. Every question was answered with care and detail. The pace was perfect \u2014 never rushed, always respectful.',
        name: 'James K.',
        country: 'Australia',
        date: 'February 2026',
      },
      {
        quote:
          'I\u2019ve visited many memorials, but this experience stood apart. The train ride briefing set the context perfectly, and by the time we arrived, I was prepared for what I would see.',
        name: 'Maria L.',
        country: 'Spain',
        date: 'January 2026',
      },
      {
        quote:
          'Worth every minute of the six hours. The guide didn\u2019t just tell us facts \u2014 they helped us understand the people behind the numbers. Deeply moving and important.',
        name: 'Thomas W.',
        country: 'Germany',
        date: 'March 2026',
      },
    ],
  },

  blogPreview: {
    heading: 'From Our Journal',
    cta: 'Read More',
    ctaHref: '/blog',
  },

  finalCta: {
    heading: 'Ready to Experience History?',
    cta: 'Book Your Tour',
    ctaHref: '/book',
    ctaSecondary: 'Ask a Question',
    ctaSecondaryHref: '/contact',
  },
}
