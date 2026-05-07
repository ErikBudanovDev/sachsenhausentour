export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import { Section } from '@/components/ui'
import { getPageContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'Sachsenhausen Camp Berlin — Tour Photos & Memorial Gallery',
  description:
    'Photos from our Sachsenhausen tour Berlin. See images of the Sachsenhausen concentration camp memorial, guided tour groups, and the historical site near Berlin Germany.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Sachsenhausen Tour Photos & Memorial Gallery',
    description: 'Photos from our Sachsenhausen tour Berlin — the memorial, guided groups, and the historical site.',
    url: '/gallery',
  },
}

const defaultGalleryImages = [
  { src: '/images/gallery/DSCF5931-min-scaled.jpg', alt: 'The Roll-Call Square at the Sachsenhausen Concentration Camp Memorial', caption: 'The Roll-Call Square — a vast open space where prisoners were forced to line up, often standing for hours in harsh weather. This area was central to camp discipline, where punishments were sometimes carried out in front of thousands.' },
  { src: '/images/gallery/DSCF5936-min-scaled.jpg', alt: 'Museum exhibit at Sachsenhausen showing historical writings on the wall', caption: 'Museum Exhibit — historical writings, prisoner accounts, and official camp records displayed inside the museum. These texts provide insight into the daily horrors of camp life, from SS orders to survivor testimonies.' },
  { src: '/images/gallery/DSCF5939-min-scaled.jpg', alt: 'The entrance gate of Sachsenhausen bearing the inscription Arbeit Macht Frei', caption: 'Entrance Gate — the iron gate bearing the infamous phrase "Arbeit Macht Frei" (Work Sets You Free). This deceptive slogan was meant to give the illusion of purpose but instead symbolised the forced labour and suffering endured by prisoners.' },
  { src: '/images/gallery/DSCF5947-min-1-scaled.jpg', alt: 'The entrance gate and guard tower at Sachsenhausen Memorial', caption: 'The Guard Tower — standing tall above the camp’s main entrance, this observation post was a symbol of the oppressive surveillance that dominated life in Sachsenhausen. From here, guards watched over every movement within the camp.' },
  { src: '/images/gallery/DSCF5948-min-scaled.jpg', alt: 'Watchtower and barbed-wire perimeter fence at Sachsenhausen', caption: 'Watchtowers and Perimeter Fence — a constant reminder of the deadly barriers that confined prisoners. Guard posts and searchlights ensured that escape was nearly impossible.' },
  { src: '/images/gallery/DSCF5956-min-scaled.jpg', alt: 'The washing area inside a prisoners barrack at Sachsenhausen', caption: 'The Washing Area — concrete basins where prisoners were forced to wash under strict and degrading conditions. Guards would force prisoners to wash in freezing temperatures, leading to illness and suffering.' },
  { src: '/images/gallery/DSCF5958-min-scaled.jpg', alt: 'The latrines inside a prisoners barrack at Sachsenhausen Concentration Camp', caption: 'The Camp Latrines — primitive communal facilities under constant surveillance. The complete lack of privacy and unhygienic conditions caused disease to spread rapidly, adding another layer of suffering to daily life.' },
  { src: '/images/gallery/DSCF5967-min-scaled.jpg', alt: 'Wooden bunk beds and lockers inside Sachsenhausen Memorial barracks', caption: 'Inside a Prisoner Barrack — stark, dimly lit rooms filled with wooden bunk beds, where prisoners were crammed together in overcrowded and unsanitary conditions. The worn wooden floors and bare walls serve as a haunting reminder of the suffering endured here.' },
  { src: '/images/gallery/DSCF5969-min-scaled.jpg', alt: 'The hallway with multiple doors at Sachsenhausen Memorial infirmary', caption: 'The Camp Infirmary — a chilling space that once served as the camp infirmary, where prisoners were subjected to inhumane medical experiments. Historical photographs inside provide insight into the suffering that took place under the guise of "scientific research."' },
  { src: '/images/gallery/DSCF5971-min-scaled.jpg', alt: 'Barrack 38 at the Sachsenhausen Concentration Camp Memorial and Museum', caption: 'The Camp Barracks — reconstructed and preserved barracks where prisoners were housed in overcrowded and unsanitary conditions. Inside, the wooden bunks and sparse furnishings highlight the extreme deprivation inmates faced daily.' },
  { src: '/images/gallery/DSCF6098-scaled.jpg', alt: 'Guided tour group at Sachsenhausen Memorial', caption: 'Our guides provide expert historical context, transforming a visit into a deep, meaningful understanding of history.' },
]

export default async function GalleryPage() {
  const { sections: p } = await getPageContent('gallery')
  const hero = p.hero as { title?: string; subtitle?: string } | undefined
  const galleryImages = (p.images as typeof defaultGalleryImages) || defaultGalleryImages

  return (
    <>
      <Section spacing="xl" className="pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">{hero?.title || 'Gallery'}</h1>
          <p className="mt-4 font-accent text-lg italic text-text-muted">
            {hero?.subtitle || 'These are not just places — they are stories.'}
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
