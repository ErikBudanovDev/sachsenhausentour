import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Clock,
  MapPin,
  Users,
  Calendar,
  Euro,
  Train,
  MessageCircle,
  Mail,
  CheckCircle,
  ChevronRight,
} from 'lucide-react'
import { Section, Button } from '@/components/ui'
import { BookingWidget } from '@/components/booking'
import { siteConfig } from '@/config/site'
import { bookContent } from '@/content/en/book'

export const metadata: Metadata = {
  title: 'Book Your Tour',
  description:
    'Reserve your guided Sachsenhausen Memorial tour from Berlin. €29 per person. Daily at 10 AM. Free cancellation.',
}

const iconMap = {
  clock: Clock,
  'map-pin': MapPin,
  users: Users,
  calendar: Calendar,
  euro: Euro,
  train: Train,
}

export default function BookPage() {
  const { hero, highlights, description, itinerary, siteHighlights, whatToBring, bookingCta, contact, bookingWidget } = bookContent
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent("Hi! I'd like to book the Sachsenhausen Tour.")}`

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <Image
          src={hero.backgroundImage!}
          alt="Sachsenhausen Memorial"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-4 text-lg text-text-muted sm:text-xl">
            {hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="#booking" size="lg">
              {hero.cta}
            </Button>
            {hero.ctaSecondary && (
              <Button href={hero.ctaSecondaryHref} variant="secondary" size="lg">
                {hero.ctaSecondary}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Quick highlights strip */}
      <Section background="secondary" spacing="md">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-sm bg-surface/50 p-4">
                <Icon className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-accent">{item.label}</p>
                  <p className="text-sm text-text">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Description */}
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold">{description.heading}</h2>
          <div className="mt-6 space-y-4">
            {description.paragraphs.map((p, i) => (
              <p key={i} className="text-text-muted leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* Itinerary */}
      <Section background="surface" spacing="lg">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold">{itinerary.heading}</h2>
        <div className="mx-auto max-w-2xl">
          {itinerary.stops.map((stop, i) => (
            <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary text-xs font-bold">
                  {i + 1}
                </div>
                {i < itinerary.stops.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-accent/20" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-xs font-medium uppercase tracking-widest text-accent">{stop.time}</p>
                <h3 className="mt-1 font-heading text-lg font-semibold">{stop.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{stop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* What you'll see + What to bring */}
      <Section spacing="lg">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold">{siteHighlights.heading}</h2>
            <ul className="mt-6 space-y-3">
              {siteHighlights.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold">{whatToBring.heading}</h2>
            <ul className="mt-6 space-y-4">
              {whatToBring.items.map((item) => (
                <li key={item.item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-semibold text-text">{item.item}</p>
                    <p className="text-sm text-text-muted">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Booking Widget */}
      <Section background="surface" spacing="xl" id="booking">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">{bookingCta.heading}</h2>
          <p className="mt-3 text-text-muted">{bookingCta.subheading}</p>
        </div>
        <BookingWidget
          price={siteConfig.booking.price}
          defaultSlots={bookingWidget.slots}
          blackoutDates={bookingWidget.blackoutDates}
          minAdvanceDays={bookingWidget.minAdvanceDays}
          checkoutUrl={bookingCta.buttonHref}
          reassurance={bookingCta.reassurance}
        />
      </Section>

      {/* Contact strip */}
      <Section spacing="md">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-heading text-2xl font-bold">{contact.heading}</h2>
          <p className="mt-2 text-text-muted">{contact.subheading}</p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href={whatsappHref} variant="primary" size="md">
              <MessageCircle className="mr-2 h-5 w-5" />
              {contact.whatsappText}
            </Button>
            <Button href={`mailto:${siteConfig.email}`} variant="secondary" size="md">
              <Mail className="mr-2 h-5 w-5" />
              {contact.emailText}
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
