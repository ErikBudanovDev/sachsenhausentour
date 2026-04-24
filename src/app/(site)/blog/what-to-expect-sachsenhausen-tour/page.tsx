import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Section, Button } from '@/components/ui'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { AuthorCard, AuthorSchema } from '@/components/seo/AuthorCard'
import { teamMembers } from '@/content/en/team'

const DRAFT = true

export const metadata: Metadata = {
  title: 'What to Expect from a Sachsenhausen Tour Berlin — History, Routes & Insights',
  description:
    'A complete guide to what you will experience on a Sachsenhausen Tour Berlin. Learn about the camp layout, key stops from Tower A to the memorial zones, and why a guided tour makes the difference.',
  alternates: {
    canonical: '/blog/what-to-expect-sachsenhausen-tour',
  },
  keywords: [
    'sachsenhausen tour berlin',
    'what to expect sachsenhausen tour',
    'sachsenhausen concentration camp visit',
    'concentration camp berlin tour',
    'sachsenhausen memorial guide',
    'guided tour sachsenhausen',
  ],
}

const articleFAQs = [
  {
    question: 'What does a Sachsenhausen Tour Berlin include?',
    answer: 'A Sachsenhausen Tour Berlin covers the full memorial site including the Tower A entrance, Roll Call Square, reconstructed barracks, detention areas, memorial zones, and exhibition halls. Expert guides provide historical context at every stop.',
  },
  {
    question: 'How does the Sachsenhausen tour start?',
    answer: 'Most tours start from Berlin, where you meet your guide and travel to Oranienburg by public transport. The journey includes a historical introduction so you arrive at the site with context already in place.',
  },
  {
    question: 'Is a guided tour necessary at Sachsenhausen?',
    answer: 'While the memorial can be visited independently for free, a guided tour provides structured navigation, in-depth contextual information, and connected understanding between different areas of the site that signs alone cannot convey.',
  },
  {
    question: 'How long should I plan for the Sachsenhausen tour?',
    answer: 'Plan for approximately 6 hours total, including travel from Berlin. The on-site guided portion takes about 2.5 to 3 hours. Comfortable shoes and weather-appropriate clothing are recommended as most areas are outdoors.',
  },
]

const author = teamMembers.find((m) => m.slug === 'georgia-hartmann')!

export default function WhatToExpectSachsenhausenTourPost() {
  if (DRAFT) notFound()

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/gallery/DSCF5931-min-scaled.jpg"
          alt="Sachsenhausen Memorial entrance — what to expect on a guided tour from Berlin"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">Tour Guide</p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            What to Expect from a Sachsenhausen Tour Berlin: History, Routes, and Insights
          </h1>
          <p className="mt-4 text-white/80">
            A step-by-step guide to every area you will visit on the Sachsenhausen concentration camp memorial tour from Berlin.
          </p>
        </div>
      </section>

      {/* Author */}
      <Section spacing="md">
        <div className="mx-auto max-w-3xl">
          <AuthorCard author={author} publishedDate="2025-04-21" updatedDate="2025-06-01" />
        </div>
      </Section>

      {/* Article Body */}
      <Section spacing="lg">
        <article className="prose-custom mx-auto max-w-3xl">
          <p className="text-lg text-text-muted leading-relaxed">
            A trip to the Sachsenhausen Concentration Camp is not a common excursion. When you plan a <strong>Sachsenhausen Tour Berlin</strong>, you visit places that reflect some of the most challenging chapters of the 20th century. Located in Oranienburg near Berlin, this former concentration camp is now a memorial where visitors can observe, learn, and reflect in a structured, guided environment.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Historical Context of Sachsenhausen</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Walking the grounds of Sachsenhausen, you encounter reconstructed and preserved structures that bear witness to the experiences of the thousands of people imprisoned here under extreme conditions. The site serves multiple historical roles: it was a key element in the Nazi regime&apos;s camp system design, a training hub for camp administration across occupied Europe, and a place where prisoner life conditions were documented in brutal detail. Today, the memorial preserves this history so that future generations can understand and learn from it.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">How a Sachsenhausen Tour in Berlin Begins</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Most tours depart from central Berlin, where you meet your guide before travelling to Oranienburg by public transport. The journey itself is designed as part of the experience — your guide provides a historical introduction during the trip, setting the context before you even arrive at the memorial grounds. This structured approach ensures you understand the layout and significance of the site from the moment you step through the gates.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Entry Point and Camp Layout</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Your visit typically begins at Tower A, the main entry point to the camp and the first area prisoners encountered upon arrival. The triangular design of the camp was deliberate — built for centralised surveillance, structured prisoner processing, and administrative control. Understanding this layout helps you grasp how the camp functioned as an environment engineered for authority and efficiency.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">The Role of the Roll Call Square</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Standing in the Roll Call Square, you begin to comprehend the scale of daily operations at Sachsenhausen. This large open ground was where prisoners assembled multiple times each day, enforced by strict discipline regardless of weather conditions. The experience of being in this space — vast, exposed, and inescapable — provides a visceral understanding of the daily routines and hostile environment that defined life in the camp.
          </p>

          <div className="my-8 rounded-md bg-secondary p-6">
            <h3 className="font-heading text-lg font-bold">Key Tour Stops</h3>
            <ul className="mt-3 space-y-2 text-text-muted">
              <li><strong>Tower A Entrance:</strong> The main gate and surveillance point</li>
              <li><strong>Roll Call Square:</strong> Daily assembly and discipline area</li>
              <li><strong>Barracks:</strong> Reconstructed prisoner living quarters</li>
              <li><strong>Detention Areas:</strong> Punishment and control structures</li>
              <li><strong>Memorial Zones:</strong> Spaces for remembrance and reflection</li>
              <li><strong>Exhibition Halls:</strong> Documents, photographs, and personal stories</li>
            </ul>
          </div>

          <h2 className="mt-12 font-heading text-2xl font-bold">Barracks and Living Conditions</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            The tour continues through the barracks, where some buildings have been reconstructed to show how prisoners lived. These structures reveal the reality of overcrowded sleeping areas, restricted resources, and the basic daily necessities that were consistently inadequate. Walking through these spaces, your guide connects the physical structures to the actual experiences of the people who were confined here — making the history immediate and tangible.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Detention Areas and Control Mechanisms</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            A separate section of the tour covers the punishment and detention areas — spaces used to enforce camp rules and maintain order through fear. Your guide explains how these enforcement structures functioned within the broader system of authority, from isolation cells and restricted movement zones to the disciplinary methods that kept prisoners under constant control.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Memorial Zones and Reflection Spaces</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            In the final stages of the tour, you visit the memorials dedicated to those who suffered and perished at Sachsenhausen. These zones are peaceful and designed for contemplation — a deliberate shift from observation to reflection. Visitors are invited to pause and consider the weight of what happened here, honouring the memory of the victims in quiet, respectful surroundings.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Exhibitions and Informational Displays</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            The site&apos;s exhibitions offer additional depth through historical documents, personal stories, and informational panels that connect individual experiences to the broader historical events. These displays support self-paced exploration and contextual learning, allowing you to spend as much time as you need with the material that resonates most.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Duration and Practical Considerations</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            The trip involves substantial walking across outdoor terrain, so preparation matters. Wear comfortable shoes and dress appropriately for the weather. The full experience — including travel from Berlin — takes approximately 6 hours, with the guided on-site portion lasting 2.5 to 3 hours. The measured pace allows you to absorb details and gain a deeper understanding of the site at each stop.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Why a Guided Sachsenhausen Tour Makes the Difference</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            A guide on the Sachsenhausen Tour Berlin provides clarity and structure that transforms your visit. An experienced historian connects the various areas of the site, explains their significance, and provides the in-depth contextual information that self-guided visits cannot offer. The structured tour route, combined with navigation support and expert commentary, creates an enhanced learning experience that stays with you long after you leave.
          </p>

          {/* CTA */}
          <div className="mt-12 rounded-md border border-border bg-secondary p-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-text">
              Experience Sachsenhausen with Expert Guidance
            </h2>
            <p className="mt-3 text-text-muted">
              Professional historians. Structured routes. Daily departures from Berlin. &euro;29 per person.
            </p>
            <div className="mt-6">
              <Button href="/book#booking" size="lg">Book Your Tour</Button>
            </div>
          </div>

          <h2 className="mt-12 font-heading text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6">
            {articleFAQs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-heading text-lg font-bold">{faq.question}</h3>
                <p className="mt-2 text-text-muted leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </article>
      </Section>

      {/* Structured Data */}
      <FAQSchema items={articleFAQs} />
      <AuthorSchema author={author} publishedDate="2025-04-21" updatedDate="2025-06-01" />
    </>
  )
}
