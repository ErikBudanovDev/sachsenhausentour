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
    backgroundVideo: '/video/hero-bg.mp4',
    backgroundImage: '/images/gallery/DSCF5931-min-scaled.jpg',
  },

  trustBar: {
    rating: '4.8',
    reviewCount: '320+',
    since: '2015',
    platforms: ['Google', 'TripAdvisor'],
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
          'Book this tour. We learned so much about Sachsenhausen concentration camp and the historical context of how it came about and why. Georgia, our guide, was great. She was so knowledgeable and made the experience truly meaningful.',
        name: 'Chris R.',
        country: 'Google Review',
        date: 'June 2024',
        platform: 'google',
        rating: 5,
      },
      {
        quote:
          'Miguel is a fantastic guide with a real passion for 20th-century history. What I really liked was how he connected so many different parts of the story, giving us a broader understanding of how the world ended up on the path that led to the war.',
        name: 'Filipe P.',
        country: 'Google Review',
        date: 'April 2025',
        platform: 'google',
        rating: 5,
      },
      {
        quote:
          'The tour guide went above and beyond in telling us stories about the history, political climate and historical events around the Holocaust and how they echo in today\u2019s world. You can tell he is truly well-read and passionate about justice.',
        name: 'Wan Lin Q.',
        country: 'Google Review',
        date: 'August 2025',
        platform: 'google',
        rating: 5,
      },
      {
        quote:
          'Lewis was very knowledgeable and helpful with our group. His knowledge of the site memorial and history made this worth the trip and we highly recommend it. A very important site in history that everyone should experience.',
        name: 'Justin D.',
        country: 'Google Review',
        date: 'August 2024',
        platform: 'google',
        rating: 5,
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
