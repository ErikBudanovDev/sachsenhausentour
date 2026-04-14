import type { Metadata } from 'next'
import Image from 'next/image'
import { Section, Button } from '@/components/ui'
import { FAQSchema } from '@/components/seo/FAQSchema'

export const metadata: Metadata = {
  title: 'Concentration Camp Near Berlin – Sachsenhausen Memorial Guide',
  description:
    'Sachsenhausen is the most significant concentration camp near Berlin, just 35 km north. Learn about its history, how to visit, and why a guided tour makes the difference.',
  alternates: {
    canonical: '/blog/concentration-camp-berlin',
  },
}

const articleFAQs = [
  {
    question: 'Which concentration camp is closest to Berlin?',
    answer: 'Sachsenhausen concentration camp is the closest major memorial to Berlin, located just 35 km north in Oranienburg. It is reachable by S-Bahn in about 50 minutes from central Berlin.',
  },
  {
    question: 'Can you visit a concentration camp from Berlin as a day trip?',
    answer: 'Yes. Sachsenhausen Memorial is the most accessible concentration camp from Berlin and can easily be visited as a day trip. Guided tours depart daily from Berlin Alexanderplatz and take approximately 6 hours round-trip.',
  },
  {
    question: 'Is Auschwitz close to Berlin?',
    answer: 'No. Auschwitz is located in Oświęcim, Poland — approximately 530 km from Berlin (about 5.5 hours by train). For a day trip from Berlin, Sachsenhausen Memorial is the recommended choice at just 35 km away.',
  },
  {
    question: 'Do you need tickets for Sachsenhausen?',
    answer: 'Entry to the Sachsenhausen Memorial is free. However, guided tours with expert historians are available from €29 per person and provide essential historical context that is difficult to get on a self-guided visit.',
  },
]

export default function ConcentrationCampBerlinPost() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/gallery/DSCF5939-min-scaled.jpg"
          alt="Sachsenhausen Memorial entrance — concentration camp near Berlin"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">Memorial Guide</p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Concentration Camp Near Berlin: Visiting Sachsenhausen Memorial
          </h1>
          <p className="mt-4 text-white/80">
            The most important Holocaust memorial site accessible as a day trip from the German capital.
          </p>
        </div>
      </section>

      {/* Article Body */}
      <Section spacing="lg">
        <article className="prose-custom mx-auto max-w-3xl">
          <p className="text-lg text-text-muted leading-relaxed">
            Visitors to Berlin often search for concentration camps near the city, wanting to understand the
            history of the Holocaust first-hand. The most significant and accessible memorial is{' '}
            <strong>Sachsenhausen concentration camp</strong>, located just 35 kilometres north of Berlin
            in the town of Oranienburg.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Sachsenhausen: The Concentration Camp Near Berlin</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Sachsenhausen was established in 1936 as one of the first major concentration camps built by the Nazi
            regime. Unlike many camps, it was designed to serve as a <strong>model camp</strong> — a template for
            the entire concentration camp system. SS officers were trained here before being deployed to run camps
            across occupied Europe, including Auschwitz.
          </p>
          <p className="mt-4 text-text-muted leading-relaxed">
            Over 200,000 people were imprisoned at Sachsenhausen between 1936 and 1945, including political
            prisoners, Jews, Roma and Sinti, homosexuals, Jehovah&apos;s Witnesses, and prisoners of war from
            across Europe. Tens of thousands died from forced labour, execution, medical experiments, and the
            brutal conditions of daily life.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">How to Get to Sachsenhausen from Berlin</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Sachsenhausen is remarkably easy to reach from central Berlin. The S1 S-Bahn line runs directly from
            Friedrichstraße station to Oranienburg, taking approximately 50 minutes. From Oranienburg station,
            it is a 20-minute walk to the memorial entrance.
          </p>
          <p className="mt-4 text-text-muted leading-relaxed">
            You will need a Berlin ABC zone ticket for the journey. Alternatively, guided tours depart daily from
            Berlin Alexanderplatz and handle all logistics, providing historical commentary during the train
            journey itself.
          </p>

          <div className="my-8 rounded-md bg-secondary p-6">
            <h3 className="font-heading text-lg font-bold">Quick Facts</h3>
            <ul className="mt-3 space-y-2 text-text-muted">
              <li><strong>Distance from Berlin:</strong> 35 km (Oranienburg)</li>
              <li><strong>Travel time:</strong> ~50 minutes by S-Bahn</li>
              <li><strong>Entry fee:</strong> Free (guided tours from &euro;29)</li>
              <li><strong>Opening hours:</strong> Daily, 8:30 AM – 6:00 PM (summer)</li>
              <li><strong>Recommended visit duration:</strong> 3–4 hours on-site</li>
            </ul>
          </div>

          <h2 className="mt-12 font-heading text-2xl font-bold">Other Concentration Camps Near Berlin</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            While Sachsenhausen is the closest major camp to Berlin, visitors sometimes ask about other
            memorial sites in the region:
          </p>
          <ul className="mt-4 space-y-3 text-text-muted">
            <li>
              <strong>Ravensbrück</strong> — Located about 80 km north of Berlin, this was the largest
              concentration camp built primarily for women. Reachable by regional train in about 1.5 hours.
            </li>
            <li>
              <strong>Bergen-Belsen</strong> — Located near Hanover (~280 km from Berlin), this is where
              Anne Frank died in 1945. A full-day trip from Berlin.
            </li>
            <li>
              <strong>Auschwitz-Birkenau</strong> — Located in Oświęcim, Poland (~530 km from Berlin).
              Not feasible as a day trip — requires at least an overnight stay. Many visitors searching
              for &ldquo;Berlin to Auschwitz&rdquo; are better served visiting Sachsenhausen, which offers
              an equally profound and historically significant experience.
            </li>
          </ul>

          <h2 className="mt-12 font-heading text-2xl font-bold">Why a Guided Tour Makes the Difference</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Sachsenhausen Memorial can be visited independently, but the experience is fundamentally different
            with a trained historian as your guide. The physical remains of the camp — the gate, the roll call
            area, the barracks foundations — reveal their full significance only with expert context.
          </p>
          <p className="mt-4 text-text-muted leading-relaxed">
            A guided tour provides the individual stories of prisoners and survivors, explains the political
            context of 1930s Germany, and helps visitors understand not just what happened at Sachsenhausen,
            but <em>why</em> it matters today. This is especially important for first-time visitors to a
            Holocaust memorial site.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold">Berlin to Auschwitz: Is It Worth the Trip?</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Many visitors to Berlin search for &ldquo;Berlin to Auschwitz&rdquo; or &ldquo;Auschwitz from Berlin.&rdquo;
            While Auschwitz is undoubtedly one of the most important Holocaust memorial sites in the world, it is
            located over 500 km away in Poland and requires a full day of travel each way.
          </p>
          <p className="mt-4 text-text-muted leading-relaxed">
            Sachsenhausen offers a comparable depth of historical experience as a half-day trip from Berlin.
            It was the administrative headquarters of the entire concentration camp system and played a central
            role in the Holocaust. For visitors with limited time in Berlin, Sachsenhausen is the recommended
            choice — accessible, profound, and historically essential.
          </p>

          {/* CTA */}
          <div className="mt-12 rounded-md bg-navy p-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-white">
              Visit Sachsenhausen with an Expert Guide
            </h2>
            <p className="mt-3 text-white/80">
              Daily departures from Berlin. 6-hour guided experience. &euro;29 per person.
            </p>
            <div className="mt-6">
              <Button href="/book" size="lg">Book Your Tour</Button>
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
    </>
  )
}
