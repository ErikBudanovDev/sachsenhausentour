import type { Metadata } from 'next'
import Image from 'next/image'
import { Section, Button } from '@/components/ui'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet the historians behind Sachsenhausen Tour and learn why we do this work.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/gallery/DSCF6098-scaled.jpg"
          alt="Tour guide at Sachsenhausen Memorial"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">About Us</h1>
          <p className="mt-4 text-lg text-text-muted">
            Historians dedicated to preserving memory through education
          </p>
        </div>
      </section>

      {/* Mission */}
      <Section spacing="lg">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-heading text-3xl font-bold">Our Mission</h2>
            <p className="mt-4 text-text-muted leading-relaxed">
              We believe that understanding history is not just about visiting places — it is about grasping the human stories behind them. Our tours are designed to provide the context, depth, and sensitivity that these stories deserve.
            </p>
            <p className="mt-4 text-text-muted leading-relaxed">
              Every guide on our team is a trained historian with a specialization in Holocaust education. We do not rush. We do not sensationalize. We help visitors understand.
            </p>
          </div>
          <div className="overflow-hidden rounded-sm">
            <Image
              src="/images/gallery/DSCF5967-min-scaled.jpg"
              alt="View across the Sachsenhausen memorial grounds"
              width={600}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section background="surface" spacing="lg">
        <h2 className="text-center font-heading text-3xl font-bold">What We Stand For</h2>
        <div className="mt-10 mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {[
            { title: 'Education', text: 'Every tour is built on rigorous historical research and a commitment to accuracy.' },
            { title: 'Respect', text: 'We approach every memorial site with the dignity and solemnity it deserves.' },
            { title: 'Understanding', text: 'We go beyond facts to help visitors grasp the human impact of what happened here.' },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <h3 className="font-heading text-xl font-bold text-accent">{v.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Parent brand */}
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Image
            src="/images/logo/Logo-2-cropped.png"
            alt="Be Original Tours logo"
            width={200}
            height={50}
            className="mx-auto mb-6"
          />
          <p className="text-text-muted leading-relaxed">
            Sachsenhausen Tour is part of the Be Original Tours family — a Berlin-based tour company committed to delivering thoughtful, historically grounded experiences across the city and beyond.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="secondary">Get in Touch</Button>
          </div>
        </div>
      </Section>
    </>
  )
}
