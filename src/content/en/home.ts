import type { HomeContent } from '../types'

export const homeContent: HomeContent = {
  /* ─── 1. Hero Section (Above Fold) ─── */
  hero: {
    title: 'Sachsenhausen Tour Berlin — Guided Concentration Camp Memorial Visit',
    subtitle:
      'Join our Sachsenhausen tour from Berlin — a historian-led 6-hour concentration camp memorial tour. Small groups, deep context, and a respectful approach to one of history\u2019s most important sites.',
    cta: 'Book Your Tour — \u20AC29',
    ctaHref: '/book',
    ctaSecondary: 'See Tour Details',
    ctaSecondaryHref: '/tour',
    reassurance:
      'Free cancellation up to 24 hours before departure. Secure booking.',
    backgroundVideo: '/video/hero-bg.mp4',
    backgroundImage: '/images/gallery/DSCF5931-min-scaled.jpg',
  },

  /* ─── 2. Tour Highlights (Snapshot strip) ─── */
  trustBar: {
    rating: '4.8',
    reviewCount: '320+',
    since: '2015',
    platforms: ['Google', 'TripAdvisor'],
    snapshots: [
      { label: 'Departure', value: 'Daily at 10:00 AM', icon: 'clock' },
      { label: 'Meeting Point', value: 'Berlin Alexanderplatz', icon: 'map-pin' },
      { label: 'Duration', value: '6 Hours Round-Trip', icon: 'timer' },
    ],
  },

  /* ─── 3. Trusted Sachsenhausen Tours Berlin ─── */
  trustStats: {
    heading: 'Trusted Sachsenhausen Tours Berlin',
    subheading: 'Numbers that reflect our commitment to quality and education.',
    stats: [
      { value: '4.8★', label: 'Average Rating' },
      { value: '15,000+', label: 'Visitors Guided' },
      { value: '10+', label: 'Years of Experience' },
      { value: '100%', label: 'Berlin-Based Guides' },
    ],
  },

  /* ─── 4. Partner / Trusted By Section ─── */
  trustedBy: {
    heading: 'Recognised & Trusted',
    subheading: 'We partner with leading Berlin tourism organisations to deliver the highest standard of guided memorial experiences.',
    partners: [
      {
        name: 'Visit Berlin',
        description: 'Official Berlin tourism partner — listed as a recommended cultural experience for visitors to the German capital.',
      },
      {
        name: 'Gateway Berlin DMC',
        description: 'Destination management collaboration ensuring seamless logistics for international groups and travel agencies.',
      },
      {
        name: 'Germany Retold',
        description: 'A trusted voice in German heritage tourism — partnering with us to share historically accurate, ethically guided experiences.',
      },
    ],
  },

  /* ─── 5. Why Visit Sachsenhausen from Berlin? ─── */
  whyVisit: {
    heading: 'Why Visit the Sachsenhausen Concentration Camp from Berlin?',
    paragraphs: [
      'The Sachsenhausen concentration camp near Berlin Germany, located just 35 kilometres north in Oranienburg, was one of the first major camps established by the Nazi regime in 1936. It served as a model for the entire concentration camp system and as a training ground for SS officers who went on to run camps across Europe.',
      'A Sachsenhausen tour from Berlin is not just about seeing a historical site — it is about understanding the mechanisms of state-organised terror, the experiences of over 200,000 prisoners, and the lessons that remain vital for our world today.',
      'As one of the most important historical places to visit in Berlin, Sachsenhausen offers an accessible yet profoundly impactful experience. With expert guidance on a Berlin concentration camp tour, visitors can grasp the full historical context that a self-guided visit simply cannot provide.',
    ],
    highlights: [
      {
        title: 'Historical Significance',
        text: 'The "model camp" that shaped the entire Nazi concentration camp system — understanding Sachsenhausen means understanding the Holocaust.',
      },
      {
        title: 'Proximity to Berlin',
        text: 'Only 35 km north of Berlin, reachable by S-Bahn in under an hour. A meaningful day trip that fits any Berlin itinerary.',
      },
      {
        title: 'Educational Depth',
        text: 'With a trained historian, you will understand not just what happened, but why — the political, social, and human forces at work.',
      },
    ],
  },

  /* ─── 6. How to Get to Sachsenhausen from Berlin ─── */
  howToGet: {
    heading: 'How to Get to Sachsenhausen from Berlin',
    intro: 'The Sachsenhausen Memorial is well-connected to central Berlin by public transport.',
    distance: '35 km from Berlin city centre — approximately 50 minutes by train',
    options: [
      {
        method: 'Train',
        duration: '~50 minutes',
        description: 'Take the S1 line from Friedrichstraße to Oranienburg, then a 20-minute walk to the memorial. Our guided tour includes the train journey with historical commentary along the way.',
        recommended: true,
      },
      {
        method: 'Car',
        duration: '~40 minutes',
        description: 'Drive north on the A111/B96. Free parking is available near the memorial. Note: parking can be limited during peak season.',
      },
      {
        method: 'On foot',
        duration: '20 min from station',
        description: 'From Oranienburg S-Bahn station, follow the marked route through the town to the memorial entrance.',
      },
    ],
    guidedNote: 'Our guided tour departs from Berlin Alexanderplatz and handles all transport logistics. Your guide provides historical context during the journey, turning the commute into the first chapter of the experience.',
  },

  /* ─── 7. Why Choose Our Tour? ─── */
  whyBook: {
    heading: 'Why Choose Our Sachsenhausen Tour Berlin?',
    differentiators: [
      {
        text: 'Led by historians trained specifically in Holocaust education — not general tour guides reading from a script.',
      },
      {
        text: 'Small group sizes (max 20) ensure a personal, respectful experience where every question is heard.',
      },
      {
        text: 'We focus on context and understanding. You\u2019ll leave knowing the \u201Cwhy,\u201D not just the \u201Cwhat.\u201D',
      },
      {
        text: 'Ethical storytelling: we centre the experiences of prisoners and survivors, not the perpetrators.',
      },
      {
        text: 'Transparent pricing with no hidden fees — student and group discounts available.',
      },
      {
        text: 'No rushed schedules — we allow time for reflection at key memorial sites including Station Z.',
      },
      {
        text: 'Free cancellation up to 24 hours before departure. No questions asked, full refund.',
      },
    ],
    priceAnchor:
      'An expert-led, full-day memorial experience for just \u20AC29 per person.',
  },

  /* ─── 8. Meet Your Guide ─── */
  meetGuide: {
    heading: 'Meet Your Guide',
    name: 'The Sachsenhausen Tour Team',
    credentials: 'Historians & Holocaust Educators | Berlin-based since 2015',
    bio: [
      'Our guides are not general tour leaders — they are trained historians with deep expertise in 20th-century European history, the Holocaust, and memorial education. Each guide brings years of study and a genuine commitment to preserving memory through education.',
      'We believe that the way a story is told matters as much as the story itself. Our approach centres the human experiences of prisoners and survivors, providing context without sensationalism and depth without overwhelm.',
    ],
    image: '/images/gallery/DSCF6098-scaled.jpg',
    quote: 'Our goal is not just to show you Sachsenhausen — it\u2019s to help you understand the human stories behind the walls.',
  },

  /* ─── 9. Sachsenhausen Tour Itinerary ─── */
  timeline: {
    heading: 'Sachsenhausen Concentration Camp Tour Itinerary',
    stops: [
      {
        title: 'Departure from Berlin',
        description:
          'We meet at Generator Berlin Alexanderplatz at 10:00 AM. On the train to Oranienburg, your guide introduces the political climate of 1930s Germany and the origins of the camp system.',
      },
      {
        title: 'Arrival & Camp Entrance',
        description:
          'Walking through Oranienburg, we discuss the town\u2019s relationship with the camp. At the gate inscribed \u201CArbeit Macht Frei,\u201D your guide explains the calculated cruelty behind the slogan.',
      },
      {
        title: 'Roll Call Area & Tower A',
        description:
          'The vast roll call area and the commandant\u2019s watchtower reveal the camp\u2019s geometry of control — designed to dehumanise and dominate through architecture itself.',
      },
      {
        title: 'Prisoner Barracks & Daily Life',
        description:
          'Inside the reconstructed barracks, we explore overcrowding, the prisoner hierarchy, and the strategies people used to survive. Your guide shares individual stories that bring the history to life.',
      },
      {
        title: 'Punishment Cells & Station Z',
        description:
          'The isolation cells and the former execution site (Station Z) represent the most harrowing part of the tour. We pause here for quiet contemplation and reflection.',
      },
      {
        title: 'Memorial, Reflection & Return',
        description:
          'We conclude at the Soviet memorial, discussing liberation, memory, and the site\u2019s significance today. We return to Berlin by approximately 4:00 PM.',
      },
    ],
  },

  /* ─── 10. What's Included / Not Included ─── */
  whatsIncluded: {
    heading: 'What\u2019s Included in Your Tour',
    items: [
      { text: 'Expert historian guide for the full 6-hour experience', included: true },
      { text: 'Historical commentary during the train journey', included: true },
      { text: 'Guided tour of all major memorial sites', included: true },
      { text: 'Small group size (max 20 participants)', included: true },
      { text: 'Free cancellation up to 24 hours before', included: true },
      { text: 'Train tickets (AB+C zone ticket required)', included: false },
      { text: 'Food and drinks', included: false },
      { text: 'Hotel pickup and drop-off', included: false },
    ],
  },

  /* ─── 11. Why Our Tour is Better (Comparison) ─── */
  comparison: {
    heading: 'Guided Tour vs. Self-Guided Visit',
    subheading: 'Understanding the difference can help you choose the right experience.',
    rows: [
      {
        feature: 'Historical Context',
        guided: 'Full narrative by a trained historian',
        selfGuided: 'Audio guide or printed brochure',
      },
      {
        feature: 'Individual Stories',
        guided: 'Personal accounts of prisoners & survivors',
        selfGuided: 'Limited to display panels',
      },
      {
        feature: 'Questions & Discussion',
        guided: 'Ask anything, get expert answers',
        selfGuided: 'No expert available on-site',
      },
      {
        feature: 'Transport from Berlin',
        guided: 'Guided journey with commentary',
        selfGuided: 'Navigate on your own',
      },
      {
        feature: 'Duration',
        guided: '6 hours including travel',
        selfGuided: 'Varies — easy to miss key sites',
      },
      {
        feature: 'Emotional Support',
        guided: 'Sensitive pacing with reflection time',
        selfGuided: 'Self-managed experience',
      },
    ],
    verdict: 'A guided tour transforms a visit into a deep, meaningful understanding of history.',
  },

  /* ─── 12. Pricing & Booking ─── */
  pricing: {
    heading: 'Pricing & Booking',
    price: '29',
    currency: '\u20AC',
    perPerson: 'Per Person',
    tiers: [
      { label: 'Adult', price: '\u20AC29', note: 'Standard rate' },
      { label: 'Student', price: '\u20AC24', note: 'Valid student ID required' },
      { label: 'Group (8+)', price: '\u20AC22', note: 'Per person, 8 or more guests' },
    ],
    includes: [
      '6-hour guided memorial experience',
      'Expert historian guide',
      'Small group (max 20)',
      'Free cancellation — 24 hours notice',
      'Daily departure at 10:00 AM',
    ],
    cancellation: 'Free cancellation up to 24 hours before departure',
    cta: 'Book Your Tour Now',
    ctaHref: '/book',
  },

  /* ─── 13. Testimonials ─── */
  testimonials: {
    heading: 'What Visitors Say About Our Sachsenhausen Tour Berlin',
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

  /* ─── 14. FAQs ─── */
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'Do you need tickets for Sachsenhausen concentration camp?',
        answer: 'Entry to the Sachsenhausen Memorial is free — no Sachsenhausen concentration camp tickets are required. However, if you want a guided experience with expert historical commentary, you can book a Sachsenhausen tour from Berlin starting at \u20AC29 per person. Our concentration camp memorial tour includes a trained historian, small group size, and transport guidance from central Berlin.',
      },
      {
        question: 'How long is the Sachsenhausen tour from Berlin?',
        answer: 'The full experience takes approximately 6 hours, including the train journey from Berlin Alexanderplatz to Oranienburg and back. You will spend around 3.5 hours at the memorial site itself.',
      },
      {
        question: 'How do we get to Sachsenhausen from Berlin?',
        answer: 'We travel together by S-Bahn (S1 line) from central Berlin. The journey takes about 50 minutes each way. Your guide provides historical context during the train ride, making it part of the experience.',
      },
      {
        question: 'Is the tour suitable for children?',
        answer: 'The tour is educational and respectful in tone. We recommend it for visitors aged 14 and above. Younger children may attend at the discretion of their guardians.',
      },
      {
        question: 'What should I wear and bring?',
        answer: 'Wear comfortable walking shoes and weather-appropriate clothing. Bring water, a snack, and a valid ABC zone transit ticket. The memorial grounds are largely outdoors, so rain gear is recommended in autumn and spring.',
      },
      {
        question: 'What is the cancellation policy?',
        answer: 'Free cancellation up to 24 hours before the tour departure time. No questions asked — you will receive a full refund.',
      },
      {
        question: 'Is the memorial site accessible?',
        answer: 'The memorial grounds are largely flat and wheelchair accessible. Some original structures have uneven surfaces. Please contact us in advance if you have specific accessibility needs and we will do our best to accommodate.',
      },
      {
        question: 'Do I need to buy a separate train ticket?',
        answer: 'Yes, a Berlin ABC zone ticket is required for the S-Bahn journey. This is not included in the tour price. Your guide will help you with ticket purchase if needed.',
      },
      {
        question: 'What happens if it rains?',
        answer: 'The tour runs rain or shine. Much of the experience is outdoors, so we recommend dressing appropriately. The history doesn\u2019t change with the weather — and some visitors find that quieter, overcast days add to the reflective atmosphere.',
      },
    ],
  },

  /* ─── 15. About the Company ─── */
  aboutCompany: {
    heading: 'About Sachsenhausen Tour Berlin',
    paragraphs: [
      'Sachsenhausen Tour Berlin is operated by Be Original Tours, a Berlin-based tour company founded in 2015. We specialise in historically grounded, ethically led concentration camp memorial tours that prioritise education, respect, and understanding.',
      'Over the past decade, we have guided more than 15,000 visitors on our Sachsenhausen concentration camp tour from Berlin — from students and educators to families and solo travellers from around the world. Our team of trained historians brings academic rigour and genuine passion to every tour.',
    ],
    founded: '2015',
    mission: 'To preserve memory through education, helping visitors understand not just what happened at Sachsenhausen, but why it matters today.',
  },

  /* ─── 16. Emotional Closing Section ─── */
  emotionalClose: {
    heading: 'Why This Visit Matters',
    text: 'Sachsenhausen is not just a place to visit — it is a place to understand. The stories held within these walls belong to over 200,000 people who were imprisoned here. By visiting with care and context, you honour their memory and carry their stories forward.',
    attribution: 'The Sachsenhausen Tour Team',
  },

  /* ─── 17. Final CTA ─── */
  finalCta: {
    heading: 'Ready to Experience History?',
    subheading: 'Daily departures from Berlin. Small groups. Expert historians. \u20AC29 per person.',
    cta: 'Book Your Tour Now',
    ctaHref: '/book',
    ctaSecondary: 'Ask a Question via WhatsApp',
    ctaSecondaryHref: '/contact',
    urgencyNote: 'Tours fill up quickly during peak season — secure your spot today.',
  },

  /* ─── Legacy sections (kept for backward compat) ─── */
  qualifier: {
    heading: 'Is This Tour Right for You?',
    items: [
      { text: 'You are interested in history and want a deeper understanding of the Holocaust.', positive: true },
      { text: 'You value expert context and thoughtful narration over surface-level sightseeing.', positive: true },
      { text: 'You appreciate an unhurried pace with time for reflection at meaningful sites.', positive: true },
      { text: 'This is not a casual sightseeing trip — it is an educational memorial experience.', positive: false },
    ],
  },

  guideVoice: {
    quote:
      'As guides, our goal is not just to show you Sachsenhausen — it\u2019s to help you understand the human stories behind the walls.',
    name: 'Tour Guide Team',
    role: 'Sachsenhausen Tour Historians',
  },

  blogPreview: {
    heading: 'From Our Journal',
    cta: 'Read More',
    ctaHref: '/blog',
  },
}
