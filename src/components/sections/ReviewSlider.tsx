'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Section } from '@/components/ui'

/* ─── Types ─── */

export interface Review {
  name: string
  photo: string
  rating: number
  text: string
  date: string        // ISO date string
  url: string         // link to original review
  platform: 'google' | 'tripadvisor'
}

interface ReviewSliderProps {
  heading: string
  subheading?: string
  reviews: Review[]
  avgRating?: string
  totalReviews?: string
}

/* ─── Platform Icons ─── */

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

/* ─── Helpers ─── */

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-[#FBBC05] text-[#FBBC05]" />
      ))}
    </div>
  )
}

/* ─── Summary Bar ─── */

function SummaryBar({ avgRating, totalReviews }: { avgRating: string; totalReviews: string }) {
  return (
    <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
      <div className="flex items-center gap-2">
        <GoogleIcon className="h-6 w-6" />
        <span className="font-heading text-lg font-bold">Google Reviews</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-heading text-2xl font-bold text-accent">{avgRating}</span>
        <Stars count={5} />
      </div>
      <span className="text-sm text-text-muted">Based on {totalReviews} reviews</span>
    </div>
  )
}

/* ─── Review Card ─── */

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col rounded-md border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header: avatar + name + date */}
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={review.photo}
            alt={review.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-text">{review.name}</p>
          <p className="text-xs text-text-muted">{formatDate(review.date)}</p>
        </div>
        <GoogleIcon className="h-5 w-5 shrink-0 opacity-60" />
      </div>

      {/* Stars */}
      <div className="mt-3">
        <Stars count={review.rating} />
      </div>

      {/* Review text */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted line-clamp-5">
        {review.text}
      </p>

      {/* Read more link */}
      {review.url && (
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          Read on Google <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  )
}

/* ─── Main Slider Component ─── */

export function ReviewSlider({
  heading,
  subheading,
  reviews,
  avgRating = '4.8',
  totalReviews = '320+',
}: ReviewSliderProps) {
  const [page, setPage] = useState(0)
  const [cardsPerPage, setCardsPerPage] = useState(3)
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive cards per page
  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth
      if (w < 640) setCardsPerPage(1)
      else if (w < 1024) setCardsPerPage(2)
      else setCardsPerPage(3)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalPages = Math.ceil(reviews.length / cardsPerPage)

  // Reset page when cardsPerPage changes
  useEffect(() => {
    setPage(0)
  }, [cardsPerPage])

  const prev = useCallback(() => {
    setPage((p) => (p > 0 ? p - 1 : totalPages - 1))
  }, [totalPages])

  const next = useCallback(() => {
    setPage((p) => (p < totalPages - 1 ? p + 1 : 0))
  }, [totalPages])

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  const visibleReviews = reviews.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage,
  )

  return (
    <Section background="surface" spacing="lg">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">{heading}</h2>
        {subheading && (
          <p className="mt-3 text-text-muted">{subheading}</p>
        )}
      </div>

      <div className="mt-8">
        <SummaryBar avgRating={avgRating} totalReviews={totalReviews} />
      </div>

      {/* Slider */}
      <div ref={containerRef} className="relative">
        {/* Navigation arrows */}
        <button
          onClick={prev}
          aria-label="Previous reviews"
          className="absolute -left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md border border-border text-text-muted hover:text-accent transition-colors sm:-left-5"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next reviews"
          className="absolute -right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md border border-border text-text-muted hover:text-accent transition-colors sm:-right-5"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Cards grid */}
        <div
          className="grid gap-5 px-6 sm:px-8"
          style={{ gridTemplateColumns: `repeat(${cardsPerPage}, minmax(0, 1fr))` }}
        >
          {visibleReviews.map((review) => (
            <ReviewCard key={review.url || review.name + review.date} review={review} />
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="mt-6 flex justify-center gap-1.5">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`Go to page ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === page ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-text-muted'
            }`}
          />
        ))}
      </div>

      {/* Powered by line */}
      <p className="mt-6 text-center text-xs text-text-muted">
        Verified reviews from{' '}
        <a
          href="https://www.google.com/maps/place/Sachsenhausen+Tour+Berlin+-+Be+Original+Tours/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent hover:underline"
        >
          Google Maps
        </a>
      </p>
    </Section>
  )
}
