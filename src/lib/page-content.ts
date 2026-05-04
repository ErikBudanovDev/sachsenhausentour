import { connectDB } from '@/lib/mongodb'
import { PageContent } from '@/models/PageContent'
import { homeContent } from '@/content/en/home'
import { bookContent } from '@/content/en/book'
import { teamMembers, companyHistory, achievements } from '@/content/en/team'

/* ─── Static fallback content per page ─── */

const STATIC_DEFAULTS: Record<string, { title: string; sections: Record<string, unknown> }> = {
  home: {
    title: 'Homepage',
    sections: homeContent as unknown as Record<string, unknown>,
  },
  tour: {
    title: 'Tour Details',
    sections: {
      hero: {
        title: 'Sachsenhausen Concentration Camp Memorial Tour',
        subtitle: 'A full-day guided tour of the Sachsenhausen concentration camp from Berlin',
        backgroundImage: '/images/gallery/DSCF5939-min-scaled.jpg',
      },
      atAGlance: {
        heading: 'At a Glance',
        items: [
          { label: 'Departure', value: 'Daily at 10:00 AM' },
          { label: 'Duration', value: 'Approx. 6 hours (round trip)' },
          { label: 'Meeting Point', value: 'Generator Berlin Alexanderplatz' },
          { label: 'Group Size', value: 'Max 20 per guide' },
          { label: 'Languages', value: 'English (daily), Spanish (select dates)' },
        ],
      },
      description: {
        heading: 'What to Expect on Our Sachsenhausen Tour',
        paragraphs: [
          'Our Sachsenhausen concentration camp tour from Berlin provides a deeply educational experience led by trained historians. This is not a generic walking tour — it is a carefully crafted journey through one of the most significant memorial sites in Europe.',
          'From the moment we board the train at Alexanderplatz, your guide provides the political and historical context that led to the creation of the camp system. By the time you walk through the gates of Sachsenhausen, you will understand not just what happened here — but how and why.',
        ],
      },
      itinerary: {
        heading: 'Tour Itinerary',
        stops: [
          { time: '10:00', title: 'Meet at Generator Berlin Alexanderplatz', description: 'Introduction and historical context briefing.' },
          { time: '10:30', title: 'Train to Oranienburg', description: 'Guided briefing on the rise of the Nazi regime during the journey.' },
          { time: '11:15', title: 'Arrive at Sachsenhausen Memorial', description: 'Enter through the original camp gates.' },
          { time: '11:15–15:00', title: 'Guided Memorial Tour', description: 'Visit all major sites including barracks, Station Z, and the punishment cells.' },
          { time: '15:30', title: 'Return to Berlin', description: 'Train back with time for reflection and questions.' },
          { time: '~16:00', title: 'Arrive back in Berlin', description: 'Tour concludes at Alexanderplatz.' },
        ],
      },
      whatYouWillSee: {
        heading: 'Key Memorial Sites',
        items: [
          'Entrance gate with "Arbeit Macht Frei" inscription',
          'Roll-Call Square',
          'Prisoner barracks with original bunk beds',
          'Punishment cells',
          'Camp infirmary',
          'Station Z — execution and extermination area',
          'Guard tower',
          'Soviet Special Camp memorial',
        ],
      },
      practicalInfo: {
        heading: 'Practical Information',
        items: [
          { label: 'What to wear', value: 'Comfortable walking shoes and weather-appropriate clothing.' },
          { label: 'What to bring', value: 'Water, snack, valid ABC zone transit ticket.' },
          { label: 'Accessibility', value: 'Mostly flat terrain. Contact us for specific needs.' },
          { label: 'Age recommendation', value: 'Suitable for visitors aged 14+.' },
        ],
      },
    },
  },
  about: {
    title: 'About Us',
    sections: {
      hero: {
        title: 'About Sachsenhausen Tour Berlin',
        subtitle: 'The historians behind Berlin\'s most trusted concentration camp memorial tour.',
      },
      values: [
        { title: 'Education First', text: 'Every tour is built on rigorous historical research. Our guides hold degrees in history, Holocaust studies, and political science from leading European universities.', icon: 'BookOpen' },
        { title: 'Respect & Sensitivity', text: 'We centre the experiences of prisoners and survivors, approaching every memorial site with the dignity and solemnity it deserves.', icon: 'Heart' },
        { title: 'Ethical Storytelling', text: 'We believe how a story is told matters as much as the story itself. Our narrative approach prioritises understanding over shock.', icon: 'Award' },
        { title: 'Accessibility', text: 'History belongs to everyone. We offer tours in multiple languages, student discounts, and transparent pricing.', icon: 'Globe' },
      ],
      team: teamMembers as unknown as Record<string, unknown>[],
      history: companyHistory as unknown as Record<string, unknown>[],
      achievements: achievements as unknown as Record<string, unknown>[],
    },
  },
  gallery: {
    title: 'Gallery',
    sections: {
      hero: {
        title: 'Gallery',
        subtitle: 'These are not just places — they are stories.',
      },
      images: [
        { src: '/images/gallery/DSCF5931-min-scaled.jpg', alt: 'Sachsenhausen Memorial entrance and grounds', caption: 'The memorial grounds — a place of remembrance and reflection.' },
        { src: '/images/gallery/DSCF5936-min-scaled.jpg', alt: 'Historical structures at the memorial site', caption: 'Preserved structures that bear witness to the camp\'s history.' },
        { src: '/images/gallery/DSCF5939-min-scaled.jpg', alt: 'Memorial pathway through the camp', caption: 'Walking the paths once walked by thousands of prisoners.' },
        { src: '/images/gallery/DSCF5947-min-1-scaled.jpg', alt: 'Guard tower and perimeter at Sachsenhausen', caption: 'The watchtowers that once overlooked the entire camp complex.' },
        { src: '/images/gallery/DSCF5948-min-scaled.jpg', alt: 'Interior view of the memorial museum', caption: 'Inside the memorial — documenting stories that must not be forgotten.' },
        { src: '/images/gallery/DSCF5956-min-scaled.jpg', alt: 'Visitors exploring the Sachsenhausen memorial', caption: 'Visitors from around the world come to learn and reflect.' },
        { src: '/images/gallery/DSCF5958-min-scaled.jpg', alt: 'Historical remnants at the memorial', caption: 'The physical remnants that connect us to the past.' },
        { src: '/images/gallery/DSCF5967-min-scaled.jpg', alt: 'View across the memorial grounds', caption: 'The vast expanse of the camp — scale that defies comprehension.' },
        { src: '/images/gallery/DSCF5969-min-scaled.jpg', alt: 'Memorial monument at Sachsenhausen', caption: 'Monuments erected to honor the memory of those who suffered here.' },
        { src: '/images/gallery/DSCF5971-min-scaled.jpg', alt: 'Detailed view of memorial structures', caption: 'Every structure tells a story of resilience and loss.' },
        { src: '/images/gallery/DSCF6098-scaled.jpg', alt: 'Guided tour group at Sachsenhausen', caption: 'Our guides provide context that transforms a visit into understanding.' },
      ],
    },
  },
  book: {
    title: 'Book Your Tour',
    sections: bookContent as unknown as Record<string, unknown>,
  },
  contact: {
    title: 'Contact',
    sections: {
      hero: {
        title: 'Contact Us',
        subtitle: 'Have questions about our Sachsenhausen tour? Get in touch.',
      },
      info: {
        email: 'booking@original-europe-tours.com',
        whatsapp: '+49 157 83893416',
        address: 'Berlin, Germany',
      },
    },
  },
}

/** All page slugs available for editing */
export const PAGE_SLUGS = ['home', 'tour', 'about', 'gallery', 'book', 'contact'] as const
export type PageSlug = (typeof PAGE_SLUGS)[number]

/**
 * Deep-merge DB content over static defaults.
 * DB values win; missing fields fall back to static.
 */
function deepMerge(base: Record<string, unknown>, overlay: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base }
  for (const key of Object.keys(overlay)) {
    const bVal = base[key]
    const oVal = overlay[key]
    if (
      oVal !== null &&
      oVal !== undefined &&
      typeof oVal === 'object' &&
      !Array.isArray(oVal) &&
      typeof bVal === 'object' &&
      !Array.isArray(bVal) &&
      bVal !== null
    ) {
      result[key] = deepMerge(bVal as Record<string, unknown>, oVal as Record<string, unknown>)
    } else if (oVal !== undefined) {
      result[key] = oVal
    }
  }
  return result
}

/**
 * Get page content for a given slug.
 * Reads from MongoDB and deep-merges with static fallback.
 */
export async function getPageContent(slug: PageSlug): Promise<{
  title: string
  sections: Record<string, unknown>
  seo?: Record<string, string>
}> {
  const fallback = STATIC_DEFAULTS[slug]
  if (!fallback) {
    return { title: slug, sections: {} }
  }

  try {
    await connectDB()
    const doc = await PageContent.findOne({ slug }).lean()

    if (!doc) {
      return { title: fallback.title, sections: fallback.sections }
    }

    const dbSections = (doc as Record<string, unknown>).sections as Record<string, unknown> | undefined
    const merged = dbSections
      ? deepMerge(fallback.sections, dbSections)
      : fallback.sections

    return {
      title: (doc as { title?: string }).title || fallback.title,
      sections: merged,
      seo: (doc as { seo?: Record<string, string> }).seo,
    }
  } catch (err) {
    console.error(`Failed to load page content for "${slug}":`, err)
    return { title: fallback.title, sections: fallback.sections }
  }
}

/**
 * Get the static defaults for a page (used by admin to show current values).
 */
export function getStaticDefaults(slug: string) {
  return STATIC_DEFAULTS[slug] || null
}
