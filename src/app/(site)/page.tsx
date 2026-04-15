import type { Metadata } from 'next'
import { homeContent } from '@/content/en/home'
import { PageHero } from '@/components/sections/PageHero'
import { TrustBar } from '@/components/sections/TrustBar'
import { TrustStats } from '@/components/sections/TrustStats'
import { TrustedBy } from '@/components/sections/TrustedBy'
import { WhyVisit } from '@/components/sections/WhyVisit'
import { HowToGet } from '@/components/sections/HowToGet'
import { WhyBook } from '@/components/sections/WhyBook'
import { MeetGuide } from '@/components/sections/MeetGuide'
import { Timeline } from '@/components/sections/Timeline'
import { WhatsIncluded } from '@/components/sections/WhatsIncluded'
import { Comparison } from '@/components/sections/Comparison'
import { Pricing } from '@/components/sections/Pricing'
import { ReviewSlider } from '@/components/sections/ReviewSlider'
import type { Review } from '@/components/sections/ReviewSlider'
import { FAQ } from '@/components/sections/FAQ'
import reviewsData from '@/content/reviews.json'
import { AboutCompany } from '@/components/sections/AboutCompany'
import { EmotionalClose } from '@/components/sections/EmotionalClose'
import { FinalCta } from '@/components/sections/FinalCta'
import { FAQSchema } from '@/components/seo/FAQSchema'

export const metadata: Metadata = {
  title: 'Sachsenhausen Tour from Berlin – Expert Guided Memorial Visit | €29',
  description:
    'Join a historian-led 6-hour guided tour from Berlin to Sachsenhausen Memorial. Small groups, expert context, free cancellation. Book online for €29.',
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — conversion, booking badges */}
      <PageHero {...homeContent.hero} />

      {/* 2. Tour Highlights — departure, meeting point, duration */}
      <TrustBar {...homeContent.trustBar} />

      {/* 3. Trusted Sachsenhausen Tours Berlin — stats */}
      <TrustStats {...homeContent.trustStats} />

      {/* 4. Partner / Trusted By */}
      <TrustedBy {...homeContent.trustedBy} />

      {/* 5. Why Visit Sachsenhausen from Berlin? */}
      <WhyVisit {...homeContent.whyVisit} />

      {/* 6. How to Get to Sachsenhausen from Berlin */}
      <HowToGet {...homeContent.howToGet} />

      {/* 7. Why Choose Our Tour? */}
      <WhyBook {...homeContent.whyBook} />

      {/* 8. Meet Your Guide */}
      <MeetGuide {...homeContent.meetGuide} />

      {/* 9. Sachsenhausen Tour Itinerary */}
      <Timeline {...homeContent.timeline} />

      {/* 10. What's Included / Not Included */}
      <WhatsIncluded {...homeContent.whatsIncluded} />

      {/* 11. Guided vs. Self-Guided Comparison */}
      <Comparison {...homeContent.comparison} />

      {/* 12. Pricing & Booking */}
      <Pricing {...homeContent.pricing} />

      {/* 13. Reviews — real Google reviews from MongoDB */}
      <ReviewSlider
        heading="What Visitors Say About Our Sachsenhausen Tour"
        subheading="Real reviews from verified visitors on Google."
        reviews={reviewsData as Review[]}
        avgRating="4.8"
        totalReviews="320+"
      />

      {/* 14. FAQs */}
      <FAQ {...homeContent.faq} />

      {/* 15. About the Company */}
      <AboutCompany {...homeContent.aboutCompany} />

      {/* 16. Emotional Closing */}
      <EmotionalClose {...homeContent.emotionalClose} />

      {/* 17. Final CTA */}
      <FinalCta {...homeContent.finalCta} />

      {/* Structured Data */}
      <FAQSchema items={homeContent.faq.items} />
    </>
  )
}
