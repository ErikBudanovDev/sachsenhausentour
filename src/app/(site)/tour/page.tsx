import type { Metadata } from 'next'
import Image from 'next/image'
import { Section, Accordion, Button } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Tour Details',
  description:
    'Everything you need to know about our guided Sachsenhausen Memorial tour from Berlin.',
}

export default function TourPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/gallery/DSCF5939-min-scaled.jpg"
          alt="Sachsenhausen Memorial pathway"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy/65" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">Tour Details</h1>
          <p className="mt-4 text-lg text-white/70">
            A full-day guided memorial experience from Berlin
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
                ['Price', '\u20AC29 per person'],
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
            <Button href="/book" size="lg">Book Your Tour</Button>
          </div>
        </div>
      </Section>
    </>
  )
}
