import type { Metadata } from 'next'
import Image from 'next/image'
import { Section, Button } from '@/components/ui'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { AuthorCard, AuthorSchema } from '@/components/seo/AuthorCard'
import { teamMembers } from '@/content/en/team'

export const metadata: Metadata = {
  title: 'Sachsenhausen Tour Berlin — A Journey Through History and Memory',
  description:
    'Plan your Sachsenhausen Tour Berlin with this complete guide. Learn what to see at the concentration camp memorial, how long the tour takes, and practical tips before you go.',
  alternates: {
    canonical: '/blog/sachsenhausen-tour-berlin-journey',
  },
  keywords: [
    'sachsenhausen tour berlin',
    'sachsenhausen concentration camp tour',
    'sachsenhausen memorial visit',
    'concentration camp near berlin germany',
    'berlin concentration camp tour',
    'visit sachsenhausen from berlin',
  ],
}

const articleFAQs = [
  {
    question: 'How long does a Sachsenhausen Tour Berlin take?',
    answer: 'A Sachsenhausen Tour Berlin usually takes 5 to 6 hours, including travel from Berlin. The guided portion at the memorial site itself takes about 2.5 to 3 hours. You can also stay longer after the tour to revisit areas on your own.',
  },
  {
    question: 'What will I see on a Sachsenhausen concentration camp tour?',
    answer: 'The tour covers the Entrance Tower (Tower A), the Roll-Call Yard, the Barracks Area, the Prison Building (Cell Block), and the Execution Trench and Crematorium. Each area reveals a different aspect of camp life and operations.',
  },
  {
    question: 'Do I need to book a guided tour to visit Sachsenhausen?',
    answer: 'Entry to the Sachsenhausen Memorial is free for self-guided visits. However, a guided Sachsenhausen Tour Berlin from €29 per person provides essential historical context, structured navigation, and personal accounts that signs alone cannot convey.',
  },
  {
    question: 'How should I prepare for a visit to Sachsenhausen?',
    answer: 'Wear comfortable walking shoes and weather-appropriate layers. Plan your transport route in advance (S1 S-Bahn to Oranienburg). Be mentally prepared for emotionally challenging content, and allow time after the tour for reflection.',
  },
]

const author = teamMembers.find((m) => m.slug === 'miguel-ribeiro')!

export default function SachsenhausenTourBerlinJourneyPost() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/gallery/DSCF5947-min-1-scaled.jpg"
          alt="Sachsenhausen Tour Berlin — memorial grounds and watchtower"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">Tour Guide</p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Sachsenhausen Tour Berlin: A Journey Through History and Memory
          </h1>
          <p className="mt-4 text-white/80">
            Everything you need to know before visiting the Sachsenhausen concentration camp memorial from Berlin — what to see, how long it takes, and tips for a meaningful visit.
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
            A visit to Sachsenhausen Concentration Camp Memorial offers a clear, grounded look at one of the most significant sites from World War II. Located just outside Berlin in Oranienburg, the site now serves as a place of memory and learning, with preserved areas and detailed records. A <strong>Sachsenhausen Tour Berlin</strong> helps you follow events step by step — walking through the grounds, hearing real accounts, and connecting facts to the spaces where history unfolded.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">What Is Sachsenhausen?</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Sachsenhausen was built in 1936 by the Nazi regime. It held political prisoners, Jews, and many other groups targeted by the Third Reich. The camp also served as a training centre for SS officers, giving it a broader role within the entire concentration camp system.
          </p>
          <p className="mt-4 text-text-muted leading-relaxed">
            Today, it is a memorial and museum. Visitors can see preserved buildings and read real records from the period. The site includes exhibitions that explain daily life inside the camp, personal accounts showing how people lived and suffered here, and a layout that still reflects the original design — making it easier to understand how the camp operated as a system of control.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Why Take a Sachsenhausen Tour Berlin?</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            A guided tour gives you clear direction through a site that is large and can feel overwhelming at first. Each section of the memorial has a purpose, and a professional guide helps you move through it in the right order — filling the gaps that signs alone cannot explain.
          </p>
          <p className="mt-4 text-text-muted leading-relaxed">
            With a <strong>Berlin concentration camp tour</strong>, you receive structured historical context from 1936 to 1945, real accounts from prisoners and guards, and coverage of every key area so nothing important is missed. After the tour, the site makes more sense — you remember what you saw because it was explained clearly, and it helps you think about how history still matters today.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Top 5 Things You Will See During the Tour</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            The memorial covers a large space, with each area showing a different part of camp life. A Sachsenhausen Tour Berlin follows a clear path so you never feel lost, and each stop builds your understanding of what happened here.
          </p>

          <h3 className="mt-8 font-heading text-xl font-bold">1. Entrance Tower (Tower A)</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            You enter the camp through the main gate that controlled all movement in and out. The design itself conveys the power and order that defined this place. The gate bears the infamous inscription and served as the divide between freedom and captivity. After walking through, you reach the vast open yard — a shift in space that immediately communicates the scale and control of the camp.
          </p>

          <h3 className="mt-8 font-heading text-xl font-bold">2. Roll-Call Yard</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            This open area was used for daily prisoner counts. Prisoners stood here for long hours in all weather conditions — a routine that enforced strict discipline and collective punishment. Standing in this space, you grasp the scale of how many people were held here and how rigid daily life was.
          </p>

          <h3 className="mt-8 font-heading text-xl font-bold">3. Barracks Area</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            Some buildings have been rebuilt to show the original layout where prisoners lived. Walking through the small, tightly packed spaces reveals how limited comfort was — rooms held many people, beds were shared or packed closely, and basic needs were rarely met. Seeing these rooms makes the conditions feel immediate and real.
          </p>

          <h3 className="mt-8 font-heading text-xl font-bold">4. Prison Building (Cell Block)</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            This building held special prisoners, including political figures and others considered significant by the regime. The space feels closed and controlled — isolation cells were used for punishment, interrogations took place here, and the atmosphere shows another dimension of how power operated inside the camp.
          </p>

          <h3 className="mt-8 font-heading text-xl font-bold">5. Execution Trench and Crematorium</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            This area shows the reality of systematic killing at Sachsenhausen. It is one of the most difficult parts of the tour and is maintained as a place of respect. The space is quiet and direct, and many visitors pause here for reflection. This part often stays with you long after the visit — a reminder of why the site matters and why we must remember.
          </p>

          <div className="my-8 rounded-md bg-secondary p-6">
            <h3 className="font-heading text-lg font-bold">Tour at a Glance</h3>
            <ul className="mt-3 space-y-2 text-text-muted">
              <li><strong>Total duration:</strong> 5–6 hours (including travel from Berlin)</li>
              <li><strong>Guided portion:</strong> 2.5–3 hours on-site</li>
              <li><strong>Departure:</strong> Berlin Alexanderplatz, daily at 10:00 AM</li>
              <li><strong>Price:</strong> From &euro;29 per person</li>
              <li><strong>Free time:</strong> Stay after the tour to revisit areas at your own pace</li>
            </ul>
          </div>

          <h2 className="mt-12 font-heading text-2xl font-bold">5 Tips Before You Go</h2>

          <h3 className="mt-8 font-heading text-xl font-bold">1. Plan Your Route in Advance</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            Getting to the memorial from Berlin requires either the S1 S-Bahn to Oranienburg or joining a guided tour that handles logistics. Check train and bus times early, allow extra time for transfers, and save directions on your phone. When you know your route, you arrive relaxed and focused.
          </p>

          <h3 className="mt-8 font-heading text-xl font-bold">2. Dress for Comfort and Weather</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            You will walk extensively during the visit, and most areas are outdoors. Weather can change throughout the day, so wear layers you can adjust, carry a light jacket, and choose comfortable walking shoes. Staying comfortable helps you stay present and engaged.
          </p>

          <h3 className="mt-8 font-heading text-xl font-bold">3. Be Mentally Prepared</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            This site reflects deeply difficult history. Expect a quiet, serious setting and be ready for challenging information. Taking short pauses is normal and helps you process what you see without feeling overwhelmed.
          </p>

          <h3 className="mt-8 font-heading text-xl font-bold">4. Respect the Environment</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            The memorial is a place of remembrance. Keep your voice low, do not touch restricted areas, and follow posted rules. Respectful behaviour helps everyone focus and honours those connected to this place.
          </p>

          <h3 className="mt-8 font-heading text-xl font-bold">5. Manage Your Time Wisely</h3>
          <p className="mt-3 text-text-muted leading-relaxed">
            Arrive early before the tour starts and leave extra time after the tour for personal reflection. The visit covers many areas, and good time management helps you move at a steady pace without feeling rushed.
          </p>

          {/* CTA */}
          <div className="mt-12 rounded-md border border-border bg-secondary p-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-text">
              Book Your Sachsenhausen Tour Berlin
            </h2>
            <p className="mt-3 text-text-muted">
              Daily departures from Berlin Alexanderplatz. 6-hour guided experience. &euro;29 per person.
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
