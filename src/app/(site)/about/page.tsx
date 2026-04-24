import type { Metadata } from 'next'
import Image from 'next/image'
import { ExternalLink, Award, BookOpen, Heart, GraduationCap, Globe } from 'lucide-react'
import { Section, Button, Card } from '@/components/ui'
import { teamMembers, companyHistory, achievements } from '@/content/en/team'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'About Us — The Historians Behind the Best Berlin Concentration Camp Tour',
  description:
    'Meet the team behind the #1 rated Sachsenhausen tour Berlin. Our historians lead guided concentration camp tours from Berlin to one of the most important historical places to visit in Berlin.',
}

const values = [
  {
    icon: BookOpen,
    title: 'Education First',
    text: 'Every tour is built on rigorous historical research. Our guides hold degrees in history, Holocaust studies, and political science from leading European universities.',
  },
  {
    icon: Heart,
    title: 'Respect & Sensitivity',
    text: 'We centre the experiences of prisoners and survivors, approaching every memorial site with the dignity and solemnity it deserves. We never sensationalise.',
  },
  {
    icon: Award,
    title: 'Ethical Storytelling',
    text: 'We believe how a story is told matters as much as the story itself. Our narrative approach prioritises understanding over shock, context over spectacle.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    text: 'History belongs to everyone. We offer tours in multiple languages, student discounts, and transparent pricing to make this experience accessible to all visitors.',
  },
]

function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Sachsenhausen Tour — Be Original Tours',
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo/Logo-2-cropped.png`,
    description: siteConfig.description,
    foundingDate: '2015',
    foundingLocation: {
      '@type': 'Place',
      name: 'Berlin, Germany',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressCountry: 'DE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.email,
      telephone: siteConfig.whatsapp,
      contactType: 'customer service',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '320',
      bestRating: '5',
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
    ],
    employee: teamMembers.map((m) => ({
      '@type': 'Person',
      name: m.name,
      jobTitle: m.role,
      description: m.bio,
      sameAs: m.linkedin ? [m.linkedin] : [],
      knowsAbout: m.expertise,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/gallery/DSCF6098-scaled.jpg"
          alt="Sachsenhausen Tour guide team leading a group at the memorial"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">About Sachsenhausen Tour</h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Berlin-based historians dedicated to preserving memory through education since 2015.
          </p>
        </div>
      </section>

      {/* Achievements strip */}
      <Section background="secondary" spacing="md">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a) => (
            <div key={a.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-accent">{a.value}</p>
              <p className="mt-1 text-sm text-text-muted">{a.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Our Story */}
      <Section spacing="lg">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 items-start">
          <div>
            <h2 className="font-heading text-3xl font-bold">Our Story</h2>
            <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
              <p>
                Sachsenhausen Tour was founded in 2015 as part of Be Original Tours, a Berlin-based tour company
                created by a team of historians who believed that memorial visits deserve more than surface-level
                sightseeing.
              </p>
              <p>
                What started as a single weekly tour has grown into a daily operation that has guided over 15,000
                visitors through Sachsenhausen Memorial — from students and educators to families and solo travellers
                from more than 60 countries.
              </p>
              <p>
                Our guides are not generalists. Every member of our team holds an academic degree in history, Holocaust
                studies, or a related field, and has undergone specialist training in memorial pedagogy. We invest in
                ongoing education because the responsibility of telling these stories demands nothing less.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-md">
            <Image
              src="/images/gallery/DSCF5967-min-scaled.jpg"
              alt="View across the Sachsenhausen memorial grounds with visitors"
              width={600}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Mission & Values */}
      <Section background="surface" spacing="lg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold">Our Mission & Values</h2>
          <p className="mt-4 font-accent text-xl italic text-text leading-relaxed">
            &ldquo;To preserve memory through education — helping visitors understand not just what happened
            at Sachsenhausen, but why it matters today.&rdquo;
          </p>
        </div>
        <div className="mt-12 mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
          {values.map((v) => {
            const Icon = v.icon
            return (
              <div key={v.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold">{v.title}</h3>
                  <p className="mt-1 text-sm text-text-muted leading-relaxed">{v.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Meet the Team */}
      <Section spacing="lg" id="team">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold">Meet Your Guides</h2>
          <p className="mt-3 text-text-muted">
            Every guide on our team is a qualified historian with specialist training in Holocaust education.
          </p>
        </div>
        <div className="mt-12 mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.slug} padding="lg" hoverable className="flex flex-col">
              <div className="relative h-56 -mx-6 -mt-6 mb-5 overflow-hidden rounded-t-md">
                <Image
                  src={member.image}
                  alt={`${member.name} — ${member.role} at Sachsenhausen Tour`}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-heading text-xl font-bold">{member.name}</h3>
              <p className="text-sm font-medium text-accent">{member.role}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-text-muted" />
                <p className="text-xs text-text-muted">{member.credentials}</p>
              </div>
              <p className="mt-3 text-sm text-text-muted leading-relaxed flex-1">{member.bio}</p>
              <div className="mt-4 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {member.expertise.map((e) => (
                    <span key={e} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-text-muted">{e}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{member.languages.join(', ')}</span>
                  <span>&middot;</span>
                  <span>Since {member.yearJoined}</span>
                </div>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    LinkedIn Profile <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Company Timeline */}
      <Section background="surface" spacing="lg">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold">Our Journey</h2>
        <div className="mx-auto max-w-2xl">
          {companyHistory.map((event, i) => (
            <div key={event.year} className="relative flex gap-4 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                  {event.year.slice(-2)}
                </div>
                {i < companyHistory.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-2">
                <p className="text-xs font-medium uppercase tracking-widest text-accent">{event.year}</p>
                <p className="mt-1 text-text-muted leading-relaxed">{event.event}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Parent brand */}
      <Section spacing="lg">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 items-center">
          <div>
            <Image
              src="/images/logo/Logo-2-cropped.png"
              alt="Be Original Tours — parent company of Sachsenhausen Tour"
              width={200}
              height={50}
              className="mb-4"
            />
            <h2 className="font-heading text-2xl font-bold">Part of Be Original Tours</h2>
            <p className="mt-4 text-text-muted leading-relaxed">
              Sachsenhausen Tour is operated by Be Original Tours, a Berlin-based tour company committed to
              delivering thoughtful, historically grounded experiences across the city and beyond. Founded in 2015,
              we have grown from a small team of passionate historians into one of Berlin&apos;s most trusted
              providers of memorial and cultural tours.
            </p>
            <div className="mt-6 flex gap-4">
              <Button href="/contact" variant="secondary">Get in Touch</Button>
              <Button href="/book#booking" variant="primary">Book a Tour</Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-md">
            <Image
              src="/images/gallery/DSCF5971-min-scaled.jpg"
              alt="Be Original Tours guide with visitors at a Berlin historical site"
              width={600}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Structured Data */}
      <OrganizationSchema />
    </>
  )
}
