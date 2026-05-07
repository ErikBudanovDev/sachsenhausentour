export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import { Section, Accordion, Button } from '@/components/ui'
import { getActiveTourConfig } from '@/lib/tour-config'
import { getPageContent } from '@/lib/page-content'
import { formatPrice } from '@/lib/format-price'

export const metadata: Metadata = {
  title: 'Sachsenhausen Concentration Camp Memorial Tour — Tour Details & Itinerary',
  description:
    'Full details of our Sachsenhausen concentration camp memorial tour from Berlin. See the itinerary, what to expect on this guided tour of the Sachsenhausen concentration camp, tickets info, and meeting point.',
  alternates: { canonical: '/tour' },
  openGraph: {
    title: 'Sachsenhausen Memorial Tour — Details & Itinerary',
    description: 'Full details of our Sachsenhausen concentration camp memorial tour from Berlin. See the itinerary, what to expect, and meeting point.',
    url: '/tour',
  },
}

export default async function TourPage() {
  const config = await getActiveTourConfig()
  const { sections: p } = await getPageContent('tour')
  const hero = p.hero as { title?: string; subtitle?: string; backgroundImage?: string } | undefined

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <Image
          src={hero?.backgroundImage || '/images/gallery/DSCF5939-min-scaled.jpg'}
          alt="Sachsenhausen concentration camp memorial tour — pathway through the memorial grounds"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy/65" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">{hero?.title || 'Sachsenhausen Concentration Camp Memorial Tour'}</h1>
          <p className="mt-4 text-lg text-white/70">
            {hero?.subtitle || 'A full-day guided tour of the Sachsenhausen concentration camp from Berlin'}
          </p>
        </div>
      </section>

      {/* Key details */}
      <Section spacing="lg">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold">At a Glance</h2>
            <dl className="mt-6 space-y-4">
              {[
                ['Departure', 'Daily at 10:00 AM'],
                ['Duration', 'Approximately 6 hours'],
                ['Meeting Point', 'Generator Berlin Alexanderplatz'],
                ['Group Size', 'Small groups for a personal experience'],
                ['Languages', 'English (German and Spanish on select dates)'],
                ['Price', `${formatPrice(config.pricePerPerson, config.currency)} per person`],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-border pb-3">
                  <dt className="text-xs font-medium uppercase tracking-widest text-accent">{label}</dt>
                  <dd className="mt-1 text-text">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="overflow-hidden rounded-sm">
            <Image
              src="/images/gallery/DSCF5956-min-scaled.jpg"
              alt="Guided tour group at Sachsenhausen"
              width={600}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* What You'll See */}
      <Section background="surface" spacing="lg">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-2xl font-bold">What the Tour Includes</h2>
          <p className="mt-3 text-center text-text-muted">
            Your guide will take you through the key sites of the memorial, providing expert historical
            context at every stop.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              'The punishment cells',
              'Gas chambers and Station Z',
              'Guard Tower A and the camp perimeter',
              'The roll-call area (Appellplatz)',
              'Barracks 38 and 39 — prisoner living quarters',
              'The camp infirmary and medical experimentation rooms',
              'Detailed tour of the grounds with a licensed guide',
              'Stories of triumph and tragedy — everyday life in the camp',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-sm bg-background p-4">
                <span className="mt-0.5 text-accent">✓</span>
                <span className="text-sm text-text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Additional Information */}
      <Section spacing="lg">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-2xl font-bold">Additional Information</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-sm border border-border p-6">
              <p className="font-heading text-sm font-bold uppercase tracking-widest text-accent">Memorial Donation</p>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                A €3 per person donation is required when visiting the Memorial. This supports the memorial&apos;s
                maintenance and will be collected by the guide before entering the camp. Please have exact change ready.
              </p>
            </div>
            <div className="rounded-sm border border-border p-6">
              <p className="font-heading text-sm font-bold uppercase tracking-widest text-accent">Transit Ticket</p>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                Guests will need a valid ABC transit ticket for the S-Bahn journey from Berlin to Oranienburg and back.
                Your guide can help with ticket purchase if needed.
              </p>
            </div>
            <div className="rounded-sm border border-border p-6">
              <p className="font-heading text-sm font-bold uppercase tracking-widest text-accent">Food &amp; Drink</p>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                Bringing a snack and beverage is suggested as limited options are available at the memorial site.
                The tour lasts approximately 6 hours including travel.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section background="surface" spacing="lg">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-2xl">
          <Accordion title="What should I bring?">
            Comfortable walking shoes, weather-appropriate clothing, water, and a valid transit ticket (AB+C zones). We recommend bringing a small snack as there are limited food options at the memorial.
          </Accordion>
          <Accordion title="Is the tour suitable for children?">
            The tour is educational and respectful in tone. We recommend it for visitors aged 14 and above. Younger children may attend at the discretion of their guardians.
          </Accordion>
          <Accordion title="What is your cancellation policy?">
            Free cancellation up to 24 hours before departure. No questions asked, full refund.
          </Accordion>
          <Accordion title="Is the site accessible?">
            The memorial grounds are largely flat and accessible. Some original structures have uneven surfaces. Please contact us in advance if you have specific accessibility needs.
          </Accordion>
          <Accordion title="What happens if it rains?">
            The tour runs rain or shine. Much of the experience is outdoors, so we recommend dressing appropriately. Rain gear is advised during autumn and spring.
          </Accordion>
        </div>
      </Section>

      {/* CTA */}
      <Section spacing="lg">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold">Ready to Join?</h2>
          <p className="mt-2 text-text-muted">Reserve your spot for a meaningful journey through history.</p>
          <div className="mt-6">
            <Button href="/book#booking" size="lg">Book Your Tour</Button>
          </div>
        </div>
      </Section>
    </>
  )
}
