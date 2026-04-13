/* ─── Content Type Definitions ─── */

export interface HeroContent {
  title: string
  subtitle: string
  cta: string
  ctaHref: string
  ctaSecondary?: string
  ctaSecondaryHref?: string
  reassurance: string
}

export interface SnapshotItem {
  label: string
  value: string
  icon: 'clock' | 'map-pin' | 'timer'
}

export interface TrustBarContent {
  rating: string
  reviewCount: string
  since: string
  platforms: string[]
  snapshots: SnapshotItem[]
}

export interface TimelineStop {
  title: string
  description: string
}

export interface TimelineContent {
  heading: string
  stops: TimelineStop[]
}

export interface DifferentiatorItem {
  text: string
}

export interface WhyBookContent {
  heading: string
  differentiators: DifferentiatorItem[]
  priceAnchor: string
}

export interface QualifierItem {
  text: string
  positive: boolean
}

export interface QualifierContent {
  heading: string
  items: QualifierItem[]
}

export interface GuideVoiceContent {
  quote: string
  name: string
  role: string
}

export interface TestimonialItem {
  quote: string
  name: string
  country: string
  date: string
}

export interface TestimonialsContent {
  heading: string
  items: TestimonialItem[]
}

export interface BlogPreviewContent {
  heading: string
  cta: string
  ctaHref: string
}

export interface FinalCtaContent {
  heading: string
  cta: string
  ctaHref: string
  ctaSecondary: string
  ctaSecondaryHref: string
  nextDate?: string
}

export interface HomeContent {
  hero: HeroContent
  trustBar: TrustBarContent
  timeline: TimelineContent
  whyBook: WhyBookContent
  qualifier: QualifierContent
  guideVoice: GuideVoiceContent
  testimonials: TestimonialsContent
  blogPreview: BlogPreviewContent
  finalCta: FinalCtaContent
}
