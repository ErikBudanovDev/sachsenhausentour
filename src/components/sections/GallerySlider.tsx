'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { Button } from '@/components/ui'

interface GalleryImage {
  src: string
  alt: string
}

interface GallerySliderProps {
  images: GalleryImage[]
  heading?: string
  subheading?: string
}

export function GallerySlider({
  images,
  heading = 'Tour Gallery',
  subheading = 'A glimpse into the Sachsenhausen Memorial experience.',
}: GallerySliderProps) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(
    () => setCurrent((i) => (i < images.length - 1 ? i + 1 : 0)),
    [images.length]
  )
  const prev = useCallback(
    () => setCurrent((i) => (i > 0 ? i - 1 : images.length - 1)),
    [images.length]
  )

  /* Auto-advance every 5s */
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 mb-4">
            <Camera className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Gallery</span>
          </div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
          <p className="mt-3 text-text-muted">{subheading}</p>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Main image */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-lg">
            {images.map((img, i) => (
              <div
                key={img.src}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1152px"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-5 pt-12">
              <p className="text-sm text-white/90">{images[current].alt}</p>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-text shadow-md transition-all hover:bg-white active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-text shadow-md transition-all hover:bg-white active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={img.src}
                onClick={() => setCurrent(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded transition-all ${
                  i === current
                    ? 'ring-2 ring-accent ring-offset-2'
                    : 'opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button href="/gallery" variant="secondary" size="md">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  )
}
