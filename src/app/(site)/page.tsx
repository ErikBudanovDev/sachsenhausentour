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
} from 'lucide-react'
import { homeContent } from '@/content/en/home'
import { Section, Button, Card, Accordion } from '@/components/ui'
import { BookingSidebar } from '@/components/sections/BookingSidebar'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { MobileBookingBar } from '@/components/sections/MobileBookingBar'
import type { Review } from '@/components/sections/ReviewSlider'
import reviewsData from '@/content/reviews.json'

export const metadata: Metadata = {
  title: 'Sachsenhausen Tour from Berlin – Expert Guided Memorial Visit | €29',
  description:
    'Join a historian-led 6-hour guided tour from Berlin to Sachsenhausen Memorial. Small groups, expert context, free cancellation. Book online for €29.',
}

const highlights = [
  { icon: Clock, label: 'Duration', value: '6 hours (round-trip)' },
  { icon: MapPin, label: 'Meeting Point', value: 'Berlin Alexanderplatz' },
  { icon: Users, label: 'Group Size', value: 'Max 20 people' },
  { icon: Euro, label: 'Price', value: 'From €29 per person' },
]

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
  { src: '/images/gallery/DSCF5967-min-scaled.jpg', alt: 'Sachsenhausen camp grounds with visitors' },
  { src: '/images/gallery/DSCF5971-min-scaled.jpg', alt: 'Guide leading group at Sachsenhausen' },
]

export default function HomePage() {
  const c = homeContent

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        {/* Fallback image for SEO + no-JS */}
        <Image
          src="/images/gallery/DSCF5931-min-scaled.jpg"
          alt="Sachsenhausen Memorial — guided tour from Berlin"
          fill
          className="object-cover"
          priority
        />
        {/* Background video overlay */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/gallery/DSCF5931-min-scaled.jpg"
          className="absolute inset-0 z-[1] h-full w-full object-cover"
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[2] bg-navy/50" />
        <div className="relative z-[3] mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {c.hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">
            {c.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="/book#booking" size="lg">Book Your Tour — €29</Button>
            <Button href="#tour-details" variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
              See Tour Details
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/60 italic">
            Free cancellation up to 24 hours before departure.
          </p>
        </div>
      </section>

      {/* ═══════════════ HIGHLIGHT STRIP ═══════════════ */}
      <Section background="secondary" spacing="md">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-md bg-surface/50 p-4">
              <Icon className="h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-accent">{label}</p>
                <p className="text-sm text-text">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════ RATING BAR ═══════════════ */}
      <div className="border-b border-border bg-white py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-[#FBBC05] text-[#FBBC05]" />
            <span className="font-bold">4.8/5</span>
          </div>
          <span className="text-text-muted">(320+ reviews)</span>
          <span className="text-text-muted">&middot;</span>
          <span className="text-text-muted">Since 2015</span>
        </div>
      </div>

      {/* ═══════════════ TWO-COLUMN LAYOUT ═══════════════ */}
      <div id="tour-details" className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">

          {/* ─── LEFT: Tour Content ─── */}
          <div className="space-y-12">

            {/* Tour Title & Intro */}
            <div>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                Sachsenhausen Concentration Camp Memorial Tour from Berlin
              </h2>
              <p className="mt-4 text-text-muted leading-relaxed">
                Take a guided tour of the <strong>Sachsenhausen Concentration Camp</strong> memorial with expert historians.
                Discover the brutal history of the facility that served as a model for the entire Nazi camp system and as
                an administrative centre for camps across Europe.
              </p>
            </div>

            {/* Quick Overview + Quick Highlights */}
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
                <h3 className="font-heading text-xl font-bold mb-5">Quick Highlights</h3>
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

            {/* Photo Gallery */}
            <div>
              <div className="overflow-hidden rounded-md">
                <Image
                  src="/images/gallery/DSCF6098-scaled.jpg"
                  alt="Tour guide leading a group at Sachsenhausen Memorial"
                  width={800}
                  height={500}
                  className="w-full object-cover"
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {galleryImages.slice(0, 4).map((img) => (
                  <div key={img.src} className="overflow-hidden rounded">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={200}
                      height={140}
                      className="h-24 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Why Visit */}
            <div>
              <h2 className="font-heading text-2xl font-bold">{c.whyVisit.heading}</h2>
              <div className="mt-4 space-y-4 text-text-muted leading-relaxed">
                {c.whyVisit.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Photo break */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="overflow-hidden rounded-md">
                <Image
                  src="/images/gallery/DSCF5936-min-scaled.jpg"
                  alt="Sachsenhausen concentration camp barracks"
                  width={400}
                  height={280}
                  className="h-56 w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-md">
                <Image
                  src="/images/gallery/DSCF5969-min-scaled.jpg"
                  alt="Memorial site at Sachsenhausen"
                  width={400}
                  height={280}
                  className="h-56 w-full object-cover"
                />
              </div>
            </div>

            {/* Tour Itinerary */}
            <div>
              <h2 className="font-heading text-2xl font-bold">{c.timeline.heading}</h2>
              <div className="mt-6">
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
            </div>

            {/* Photo break */}
            <div className="overflow-hidden rounded-md">
              <Image
                src="/images/gallery/DSCF5956-min-scaled.jpg"
                alt="Visitors at Sachsenhausen memorial grounds"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>

            {/* Why Choose Our Tour */}
            <div>
              <h2 className="font-heading text-2xl font-bold">{c.whyBook.heading}</h2>
              <div className="mt-5 space-y-4">
                {c.whyBook.differentiators.map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <p className="text-text leading-relaxed">{d.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meet Your Guide */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="font-heading text-2xl font-bold">{c.meetGuide.heading}</h2>
              <div className="mt-5 flex flex-col gap-5 sm:flex-row">
                <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-md sm:h-56 sm:w-44">
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

            {/* What's Included / Not Included */}
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="font-heading text-2xl font-bold mb-5">{c.whatsIncluded.heading}</h2>
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
              <div className="mt-5 text-center">
                <Button href="/book#booking" size="lg">Book Now!</Button>
              </div>
            </div>

            {/* Meeting Point */}
            <div className="rounded-lg border-2 border-accent/20 bg-accent/5 p-6">
              <h2 className="font-heading text-xl font-bold">Meeting Point</h2>
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
                className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-border bg-white py-2.5 text-sm font-medium text-accent hover:bg-secondary transition-colors"
              >
                View on Google Maps
              </a>
            </div>

            {/* Things to Know */}
            <div>
              <h2 className="font-heading text-2xl font-bold">Things to Know Before You Go</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md bg-amber-50 p-4">
                  <p className="text-sm font-bold text-text mb-2">What to bring</p>
                  <ul className="space-y-1 text-sm text-text-muted">
                    <li>Comfortable walking shoes</li>
                    <li>Weather-appropriate clothing</li>
                    <li>Water and a snack</li>
                    <li>Valid ABC zone transit ticket</li>
                  </ul>
                </div>
                <div className="rounded-md bg-amber-50 p-4">
                  <p className="text-sm font-bold text-text mb-2">Know before you go</p>
                  <ul className="space-y-1 text-sm text-text-muted">
                    <li>A €3 memorial donation is collected on-site</li>
                    <li>Most of the tour is outdoors</li>
                    <li>Recommended for ages 14+</li>
                    <li>Tour runs rain or shine</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="font-heading text-2xl font-bold mb-6">{c.faq.heading}</h2>
              {c.faq.items.map((faq) => (
                <Accordion key={faq.question} title={faq.question}>
                  {faq.answer}
                </Accordion>
              ))}
            </div>

            {/* Mobile-only CTA (sidebar not visible) */}
            <div className="lg:hidden rounded-lg bg-navy p-8 text-center">
              <h2 className="font-heading text-2xl font-bold text-white">Ready to Book?</h2>
              <p className="mt-2 text-white/70 text-sm">
                Daily departures from Berlin. Expert historians. €29 per person.
              </p>
              <div className="mt-5">
                <Button href="/book#booking" size="lg">Book Your Tour Now</Button>
              </div>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/50">
                <ShieldCheck className="h-3.5 w-3.5" />
                Free cancellation up to 24 hours
              </p>
            </div>

          </div>

          {/* ─── RIGHT: Sticky Sidebar (desktop) ─── */}
          <aside className="hidden lg:block">
            <BookingSidebar reviews={reviewsData as Review[]} />
          </aside>

        </div>
      </div>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
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
