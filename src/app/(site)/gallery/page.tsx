import type { Metadata } from 'next'
import Image from 'next/image'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Sachsenhausen Camp Berlin — Tour Photos & Memorial Gallery',
  description:
    'Photos from our Sachsenhausen tour Berlin. See images of the Sachsenhausen concentration camp memorial, guided tour groups, and the historical site near Berlin Germany.',
}

const galleryImages = [
  { src: '/images/gallery/DSCF5931-min-scaled.jpg', alt: 'Sachsenhausen Memorial entrance and grounds', caption: 'The memorial grounds — a place of remembrance and reflection.' },
  { src: '/images/gallery/DSCF5936-min-scaled.jpg', alt: 'Historical structures at the memorial site', caption: 'Preserved structures that bear witness to the camp\'s history.' },
  { src: '/images/gallery/DSCF5939-min-scaled.jpg', alt: 'Memorial pathway through the camp', caption: 'Walking the paths once walked by thousands of prisoners.' },
  { src: '/images/gallery/DSCF5947-min-1-scaled.jpg', alt: 'Guard tower and perimeter at Sachsenhausen', caption: 'The watchtowers that once overlooked the entire camp complex.' },
  { src: '/images/gallery/DSCF5948-min-scaled.jpg', alt: 'Interior view of the memorial museum', caption: 'Inside the memorial — documenting stories that must not be forgotten.' },
  { src: '/images/gallery/DSCF5956-min-scaled.jpg', alt: 'Visitors exploring the Sachsenhausen memorial', caption: 'Visitors from around the world come to learn and reflect.' },
  { src: '/images/gallery/DSCF5958-min-scaled.jpg', alt: 'Historical remnants at the memorial', caption: 'The physical remnants that connect us to the past.' },
  { src: '/images/gallery/DSCF5967-min-scaled.jpg', alt: 'View across the memorial grounds', caption: 'The vast expanse of the camp — scale that defies comprehension.' },
  { src: '/images/gallery/DSCF5969-min-scaled.jpg', alt: 'Memorial monument at Sachsenhausen', caption: 'Monuments erected to honor the memory of those who suffered here.' },
  { src: '/images/gallery/DSCF5971-min-scaled.jpg', alt: 'Detailed view of memorial structures', caption: 'Every structure tells a story of resilience and loss.' },
  { src: '/images/gallery/DSCF6098-scaled.jpg', alt: 'Guided tour group at Sachsenhausen', caption: 'Our guides provide context that transforms a visit into understanding.' },
]

export default function GalleryPage() {
  return (
    <>
      <Section spacing="xl" className="pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">Gallery</h1>
          <p className="mt-4 font-accent text-lg italic text-text-muted">
            These are not just places — they are stories.
          </p>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {galleryImages.map((img) => (
            <figure key={img.src} className="mb-4 break-inside-avoid">
              <div className="overflow-hidden rounded-sm">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  className="w-full object-cover transition-transform duration-[var(--transition-slow)] hover:scale-105"
                />
              </div>
              <figcaption className="mt-2 text-sm text-text-muted">
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section background="surface" spacing="lg">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold">
            Experience This In Person
          </h2>
          <p className="mt-2 text-text-muted">
            Join our guided tour and walk through these grounds with expert context.
          </p>
          <a
            href="/book#booking"
            className="mt-6 inline-flex items-center justify-center rounded-sm bg-accent px-8 py-4 text-lg font-semibold text-primary transition-all hover:bg-accent-hover"
          >
            Book Your Tour
          </a>
        </div>
      </Section>
    </>
  )
}
