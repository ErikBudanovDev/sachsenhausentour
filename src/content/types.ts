/* ─── Content Type Definitions ─── */

export interface HeroContent {
  title: string
  subtitle: string
  cta: string
  ctaHref: string
  ctaSecondary?: string
  ctaSecondaryHref?: string
  reassurance: string
  backgroundVideo?: string
  backgroundImage?: string
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
  platform?: 'google' | 'tripadvisor'
  rating?: number
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
  subheading?: string
  cta: string
  ctaHref: string
  ctaSecondary: string
  ctaSecondaryHref: string
  nextDate?: string
  urgencyNote?: string
}

/* ─── New 17-Section Homepage Types ─── */

export interface TrustStatItem {
  value: string
  label: string
}

export interface TrustStatsContent {
  heading: string
  subheading: string
  stats: TrustStatItem[]
}

export interface PartnerItem {
  name: string
  description: string
}

export interface TrustedByContent {
  heading: string
  subheading: string
  partners: PartnerItem[]
}

export interface WhyVisitContent {
  heading: string
  paragraphs: string[]
  highlights: { title: string; text: string }[]
}

export interface TravelOption {
  method: string
  duration: string
  description: string
  recommended?: boolean
}

export interface HowToGetContent {
  heading: string
  intro: string
  distance: string
  options: TravelOption[]
  guidedNote: string
}

export interface MeetGuideContent {
  heading: string
  name: string
  credentials: string
  bio: string[]
  image?: string
  quote: string
}

export interface InclusionItem {
  text: string
  included: boolean
}

export interface WhatsIncludedContent {
  heading: string
  items: InclusionItem[]
}

export interface ComparisonRow {
  feature: string
  guided: string
  selfGuided: string
}

export interface ComparisonContent {
  heading: string
  subheading: string
  rows: ComparisonRow[]
  verdict: string
}

export interface PricingTier {
  label: string
  price: string
  note?: string
}

export interface PricingContent {
  heading: string
  price: string
  currency: string
  perPerson: string
  tiers: PricingTier[]
  includes: string[]
  cancellation: string
  cta: string
  ctaHref: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQContent {
  heading: string
  items: FAQItem[]
}

export interface AboutCompanyContent {
  heading: string
  paragraphs: string[]
  founded: string
  mission: string
}

export interface EmotionalCloseContent {
  heading: string
  text: string
  attribution?: string
}

export interface HomeContent {
  hero: HeroContent
  trustBar: TrustBarContent
  trustStats: TrustStatsContent
  trustedBy: TrustedByContent
  whyVisit: WhyVisitContent
  howToGet: HowToGetContent
  whyBook: WhyBookContent
  meetGuide: MeetGuideContent
  timeline: TimelineContent
  whatsIncluded: WhatsIncludedContent
  comparison: ComparisonContent
  pricing: PricingContent
  testimonials: TestimonialsContent
  faq: FAQContent
  aboutCompany: AboutCompanyContent
  emotionalClose: EmotionalCloseContent
  finalCta: FinalCtaContent
  /* kept for backward compat, not used on new homepage */
  qualifier: QualifierContent
  guideVoice: GuideVoiceContent
  blogPreview: BlogPreviewContent
}
