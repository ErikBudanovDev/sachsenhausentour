import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Clock,
  MapPin,
  Users,
  Euro,
  Check,
  X,
  Star,
  ShieldCheck,
  GraduationCap,
  CalendarCheck,
  Sparkles,
  MessageCircle,
} from 'lucide-react'
import { homeContent } from '@/content/en/home'
import { Section, Button, Card, Accordion } from '@/components/ui'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { MobileBookingBar } from '@/components/sections/MobileBookingBar'
import { GallerySlider } from '@/components/sections/GallerySlider'
import { VisitorInfo } from '@/components/sections/VisitorInfo'
import { ReviewSlider } from '@/components/sections/ReviewSlider'
import type { Review } from '@/components/sections/ReviewSlider'
import reviewsData from '@/content/reviews.json'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Sachsenhausen Tour from Berlin – Expert Guided Memorial Visit | €29',
  description:
    'Join a historian-led 6-hour guided tour from Berlin to Sachsenhausen Memorial. Small groups, expert context, free cancellation. Book online for €29.',
}

const quickHighlights = [
  'The Punishment Cells',
  'Station Z — Execution Site',
  'Guard Tower A & Roll Call Area',
  'Reconstructed Barracks',
  'Soviet Memorial',
  'Detailed tour with a licensed historian',
  'Stories of survival and resistance',
  'Political context of 1930s Germany',
]

const galleryImages = [
  { src: '/images/gallery/DSCF5931-min-scaled.jpg', alt: 'Sachsenhausen memorial entrance gate' },
  { src: '/images/gallery/DSCF5939-min-scaled.jpg', alt: 'Sachsenhausen concentration camp grounds' },
  { src: '/images/gallery/DSCF5947-min-1-scaled.jpg', alt: 'Tour group at Sachsenhausen memorial' },
  { src: '/images/gallery/DSCF5948-min-scaled.jpg', alt: 'Memorial structures at Sachsenhausen' },
  { src: '/images/gallery/DSCF5956-min-scaled.jpg', alt: 'Historical exhibits inside the memorial' },
  { src: '/images/gallery/DSCF5958-min-scaled.jpg', alt: 'Walking through the memorial grounds' },
  { src: '/images/gallery/DSCF5967-min-scaled.jpg', alt: 'Sachsenhausen camp grounds with visitors' },
  { src: '/images/gallery/DSCF5969-min-scaled.jpg', alt: 'Guard tower and perimeter wall' },
  { src: '/images/gallery/DSCF5971-min-scaled.jpg', alt: 'Guide leading group at Sachsenhausen' },
  { src: '/images/gallery/DSCF6098-scaled.jpg', alt: 'Tour group learning about the memorial history' },
]

const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('Hi! I would like to book the Sachsenhausen Tour.')}`

export default function HomePage() {
  const c = homeContent

  return (
    <>
      {/* ═══════════════ 1. HERO + BOOKING CARD ═══════════════ */}
      <section className="relative overflow-hidden bg-navy">
        {/* Background */}
        <Image
          src="/images/gallery/DSCF5931-min-scaled.jpg"
          alt="Sachsenhausen Memorial — guided tour from Berlin"
          fill
          className="object-cover"
          priority
        />
        <video
          autoPlay muted loop playsInline
          poster="/images/gallery/DSCF5931-min-scaled.jpg"
          className="absolute inset-0 z-[1] h-full w-full object-cover"
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[2] bg-navy/40" />

        {/* Content */}
        <div className="relative z-[3] mx-auto max-w-7xl px-4 py-28 lg:py-32">
          <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-12 lg:items-start">

            {/* Left: Hero text */}
            <div className="text-center lg:text-left lg:pt-8">
              <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl xl:text-[3.25rem] xl:leading-[1.15]">
                {c.hero.title}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90 lg:mx-0">
                {c.hero.subtitle}
              </p>

              {/* Trust signals */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#FBBC05] text-[#FBBC05]" />
                  <span className="text-sm font-bold text-white">4.8/5</span>
                  <span className="text-sm text-white/60">(320+ reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60">Free cancellation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60">Small groups</span>
                </div>
              </div>

              {/* Mobile CTA (booking card hidden on mobile) */}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:hidden">
                <Button href="/book#booking" size="lg">Book Your Tour — €29</Button>
                <Button href="#tour-details" variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                  See Tour Details
                </Button>
              </div>
            </div>

            {/* Right: Booking Card (desktop only — mobile uses sticky bar) */}
            <div className="hidden lg:block">
              <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* Price header */}
                <div className="bg-navy px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-white/50 line-through">€49</span>
                        <span className="font-heading text-3xl font-bold text-white">€29</span>
                      </div>
                      <p className="text-xs text-white/60">per person</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      <span className="text-xs font-semibold text-white">40% OFF</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Pricing tiers */}
                  <div className="space-y-1.5">
                    {[
                      { label: 'Adult', price: '€29', highlight: true },
                      { label: 'Student (valid ID)', price: '€24', highlight: false },
                      { label: 'Group (8+)', price: '€22 pp', highlight: false },
                    ].map((tier) => (
                      <div
                        key={tier.label}
                        className={`flex items-center justify-between rounded-lg px-4 py-2.5 ${
                          tier.highlight ? 'bg-accent/8 border border-accent/20' : 'bg-secondary'
                        }`}
                      >
                        <span className="text-sm text-text">{tier.label}</span>
                        <span className={`font-heading text-sm font-bold ${tier.highlight ? 'text-accent' : 'text-text'}`}>
                          {tier.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tour details inline */}
                  <div className="space-y-2.5 border-t border-border pt-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 shrink-0 text-accent" />
                      <div className="text-sm"><span className="font-semibold">Daily 10:00 AM</span> · 6-hour round trip</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-accent" />
                      <div className="text-sm"><span className="font-semibold">Berlin Alexanderplatz</span> · Generator Hostel</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 shrink-0 text-accent" />
                      <div className="text-sm"><span className="font-semibold">Max 20 people</span> · small group</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="/book#booking"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-heading text-base font-bold text-white shadow-md transition-all hover:bg-accent-hover hover:shadow-lg active:scale-[0.98]"
                  >
                    <CalendarCheck className="h-5 w-5" />
                    Book Now — Choose Date
                  </a>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border py-2.5 text-sm font-medium text-text transition-colors hover:bg-secondary"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    Ask a Question on WhatsApp
                  </a>

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-4 border-t border-border pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                      Free cancellation
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <CalendarCheck className="h-3.5 w-3.5 text-accent" />
                      Instant confirmation
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════ 2. OVERVIEW / HIGHLIGHTS ═══════════════ */}
      <Section id="tour-details" spacing="lg">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Sachsenhausen Concentration Camp Memorial Tour
            </h2>
            <p className="mt-4 mx-auto max-w-3xl text-text-muted leading-relaxed">
              Take a guided tour of the <strong>Sachsenhausen Concentration Camp</strong> memorial with expert historians.
              Discover the brutal history of the facility that served as a model for the entire Nazi camp system and as
              an administrative centre for camps across Europe.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card padding="lg">
              <h3 className="font-heading text-xl font-bold mb-5">Quick Overview</h3>
              <div className="space-y-4">
                {[
                  { label: 'Duration', value: '6 Hours' },
                  { label: 'Language', value: 'English' },
                  { label: 'Group Size', value: 'Max 20 people' },
                  { label: 'Cancellation', value: 'Free up to 24 hours' },
                  { label: 'Certifications', value: '#1 Rated in Berlin' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-sm font-bold text-text">{item.label}</p>
                    <p className="text-sm text-text-muted">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card padding="lg" className="border-accent/30 bg-accent/5">
              <h3 className="font-heading text-xl font-bold mb-5">Tour Highlights</h3>
              <div className="space-y-3">
                {quickHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm text-text">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* ═══════════════ 3. IMAGE GALLERY ═══════════════ */}
      <GallerySlider
        images={galleryImages}
        heading="Tour Gallery"
        subheading="A glimpse into the Sachsenhausen Memorial experience — through the lens of our guided tours."
      />

      {/* ═══════════════ 4. OPENING HOURS, ADMISSION & DIRECTIONS ═══════════════ */}
      <VisitorInfo />

      {/* ═══════════════ 5. ITINERARY ═══════════════ */}
      <Section background="secondary" spacing="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl mb-10">{c.timeline.heading}</h2>
          {c.timeline.stops.map((stop, i) => (
            <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                  {i + 1}
                </div>
                {i < c.timeline.stops.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-2">
                <h3 className="font-heading text-lg font-bold">{stop.title}</h3>
                <p className="mt-1 text-sm text-text-muted leading-relaxed">{stop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════ PHOTO BREAK ═══════════════ */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-xl">
            <Image
              src="/images/gallery/DSCF5936-min-scaled.jpg"
              alt="Sachsenhausen concentration camp barracks"
              width={600}
              height={400}
              className="h-64 w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-xl">
            <Image
              src="/images/gallery/DSCF5969-min-scaled.jpg"
              alt="Memorial site at Sachsenhausen"
              width={600}
              height={400}
              className="h-64 w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════ 6. WHY VISIT SACHSENHAUSEN ═══════════════ */}
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl">{c.whyVisit.heading}</h2>
          <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
            {c.whyVisit.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════ 7. WHY CHOOSE OUR TOUR ═══════════════ */}
      <Section background="secondary" spacing="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl mb-8">{c.whyBook.heading}</h2>
          <div className="space-y-4">
            {c.whyBook.differentiators.map((d, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <Check className="h-3.5 w-3.5 text-accent" />
                </div>
                <p className="text-text leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════ 8. MEET YOUR GUIDE ═══════════════ */}
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl mb-8">{c.meetGuide.heading}</h2>
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl sm:h-56 sm:w-44">
                <Image
                  src={c.meetGuide.image!}
                  alt={c.meetGuide.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">{c.meetGuide.name}</h3>
                <div className="mt-1 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-text-muted" />
                  <p className="text-xs text-text-muted">{c.meetGuide.credentials}</p>
                </div>
                <div className="mt-3 space-y-2">
                  {c.meetGuide.bio.map((p, i) => (
                    <p key={i} className="text-sm text-text-muted leading-relaxed">{p}</p>
                  ))}
                </div>
                <blockquote className="mt-4 border-l-2 border-accent pl-4 text-sm italic text-text-muted">
                  &ldquo;{c.meetGuide.quote}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════ 9. WHAT'S INCLUDED ═══════════════ */}
      <Section background="secondary" spacing="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl mb-8">{c.whatsIncluded.heading}</h2>
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-green-700 mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-3 w-3" />
                  </span>
                  Included
                </p>
                <div className="space-y-2">
                  {c.whatsIncluded.items.filter((i) => i.included).map((item) => (
                    <div key={item.text} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-sm text-text">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-red-700 mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                    <X className="h-3 w-3" />
                  </span>
                  Not Included
                </p>
                <div className="space-y-2">
                  {c.whatsIncluded.items.filter((i) => !i.included).map((item) => (
                    <div key={item.text} className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      <span className="text-sm text-text">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Point */}
          <div className="mt-6 rounded-xl border-2 border-accent/20 bg-accent/5 p-6">
            <h3 className="font-heading text-xl font-bold">Meeting Point</h3>
            <div className="mt-3 flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm text-text">
                Look for the guide in front of <strong>Generator Berlin Alexanderplatz</strong>,
                Otto-Braun-Straße 65, 10178 Berlin. Please be on time as we need to catch the train.
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Generator+Berlin+Alexanderplatz"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-border bg-white py-2.5 text-sm font-medium text-accent hover:bg-white/80 transition-colors"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </Section>

      {/* ═══════════════ 10. THINGS TO KNOW ═══════════════ */}
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl mb-8">Things to Know Before You Go</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-bold text-text mb-3">What to bring</p>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />Comfortable walking shoes</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />Weather-appropriate clothing</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />Water and a snack</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />Valid ABC zone transit ticket</li>
              </ul>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-sm font-bold text-text mb-3">Know before you go</p>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />A €3 memorial donation is collected on-site</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />Most of the tour is outdoors</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />Recommended for ages 14+</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />Tour runs rain or shine</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════ REVIEWS ═══════════════ */}
      <ReviewSlider
        heading="What Our Visitors Say"
        subheading="Verified reviews from guests on Google."
        reviews={reviewsData as Review[]}
        avgRating="4.8"
        totalReviews="320+"
      />

      {/* ═══════════════ 11. FAQs ═══════════════ */}
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl mb-8">{c.faq.heading}</h2>
          {c.faq.items.map((faq) => (
            <Accordion key={faq.question} title={faq.question}>
              {faq.answer}
            </Accordion>
          ))}
        </div>
      </Section>

      {/* ═══════════════ 12. FINAL CTA ═══════════════ */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            {c.finalCta.heading}
          </h2>
          <p className="mt-3 text-white/70">{c.finalCta.subheading}</p>
          <div className="mt-8">
            <Button href="/book#booking" size="lg">Book Your Tour Now</Button>
          </div>
          <p className="mt-4 text-sm text-white/50 italic">{c.finalCta.urgencyNote}</p>
        </div>
      </section>

      {/* Structured Data */}
      <FAQSchema items={c.faq.items} />

      {/* Sticky mobile booking bar */}
      <MobileBookingBar />
    </>
  )
}
