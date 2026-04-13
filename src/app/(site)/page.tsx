import { homeContent } from '@/content/en/home'
import { PageHero } from '@/components/sections/PageHero'
import { TrustBar } from '@/components/sections/TrustBar'
import { Timeline } from '@/components/sections/Timeline'
import { WhyBook } from '@/components/sections/WhyBook'
import { Qualifier } from '@/components/sections/Qualifier'
import { GuideVoice } from '@/components/sections/GuideVoice'
import { Testimonials } from '@/components/sections/Testimonials'
import { FinalCta } from '@/components/sections/FinalCta'

export default function HomePage() {
  return (
    <>
      <PageHero {...homeContent.hero} />
      <TrustBar {...homeContent.trustBar} />
      <Timeline {...homeContent.timeline} />
      <WhyBook {...homeContent.whyBook} />
      <Qualifier {...homeContent.qualifier} />
      <GuideVoice {...homeContent.guideVoice} />
      <Testimonials {...homeContent.testimonials} />
      <FinalCta {...homeContent.finalCta} />
    </>
  )
}
