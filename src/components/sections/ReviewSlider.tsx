'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Section } from '@/components/ui'

/* ─── Types ─── */

export interface Review {
  name: string
  photo: string
  rating: number
  text: string
  date: string
  url: string
  platform: 'google' | 'tripadvisor'
  title?: string
}

interface ReviewSliderProps {
  heading: string
  subheading?: string
  reviews: Review[]
  avgRating?: string
  totalReviews?: string
  googleCount?: string
  tripadvisorCount?: string
}

type FilterTab = 'all' | 'google' | 'tripadvisor'

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

function TripAdvisorIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="12" fill="#34E0A1"/>
      <circle cx="8.5" cy="12.5" r="3.5" fill="white"/>
      <circle cx="15.5" cy="12.5" r="3.5" fill="white"/>
      <circle cx="8.5" cy="12.5" r="2" fill="#34E0A1"/>
      <circle cx="15.5" cy="12.5" r="2" fill="#34E0A1"/>
      <path d="M7 8.5C8.5 7 10.2 6.5 12 6.5s3.5.5 5 2" stroke="white" strokeWidth="1.2" fill="none"/>
    </svg>
  )
}

/* ─── Helpers ─── */

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function Stars({ count, color = '#FBBC05' }: { count: number; color?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5" style={{ fill: color, color }} />
      ))}
    </div>
  )
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const avatarColors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-600', 'bg-purple-500',
  'bg-orange-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500',
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

/* ─── Summary Bar ─── */

function SummaryBar({
  avgRating,
  totalReviews,
  googleCount,
  tripadvisorCount,
  activeTab,
  onTabChange,
}: {
  avgRating: string
  totalReviews: string
  googleCount?: string
  tripadvisorCount?: string
  activeTab: FilterTab
  onTabChange: (tab: FilterTab) => void
}) {
  return (
    <div className="mb-8">
      {/* Filter tabs */}
      <div className="mb-6 flex items-center justify-center gap-1 border-b border-border">
        <button
          onClick={() => onTabChange('all')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'all'
              ? 'border-navy text-text'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          All reviews
        </button>
        <button
          onClick={() => onTabChange('google')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'google'
              ? 'border-navy text-text'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          <GoogleIcon className="h-4 w-4" />
          Google {googleCount && `(${googleCount})`}
        </button>
        <button
          onClick={() => onTabChange('tripadvisor')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'tripadvisor'
              ? 'border-navy text-text'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          <TripAdvisorIcon className="h-4 w-4" />
          Tripadvisor {tripadvisorCount && `(${tripadvisorCount})`}
        </button>
      </div>

      {/* Rating summary */}
      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
        <span className="font-heading text-3xl font-bold text-text">{avgRating}</span>
        <div className="flex items-center gap-2">
          <Stars count={5} />
          <span className="text-sm font-medium text-text-muted">Excellent</span>
        </div>
        <span className="text-sm text-text-muted">| {totalReviews} reviews</span>
      </div>
    </div>
  )
}

/* ─── Avatar Component with Fallback ─── */

function Avatar({ name, photo }: { name: string; photo: string }) {
  const [imgError, setImgError] = useState(false)

  if (imgError || !photo) {
    return (
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${getAvatarColor(name)}`}>
        {getInitials(name)}
      </div>
    )
  }

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt={name}
        className="h-full w-full object-cover"
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

/* ─── Review Card ─── */

function ReviewCard({ review }: { review: Review }) {
  const isTripadvisor = review.platform === 'tripadvisor'
  const starColor = isTripadvisor ? '#34E0A1' : '#FBBC05'
  const PlatformIcon = isTripadvisor ? TripAdvisorIcon : GoogleIcon
  const platformLabel = isTripadvisor ? 'Tripadvisor' : 'Google'

  return (
    <div className="flex h-full flex-col rounded-md border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar name={review.name} photo={review.photo} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-text">{review.name}</p>
          <p className="text-xs text-text-muted">{formatDate(review.date)}</p>
        </div>
        <PlatformIcon className="h-5 w-5 shrink-0" />
      </div>

      {/* Stars */}
      <div className="mt-3">
        <Stars count={review.rating} color={starColor} />
      </div>

      {/* Title (TripAdvisor reviews often have titles) */}
      {review.title && (
        <p className="mt-2 text-sm font-bold text-text">{review.title}</p>
      )}

      {/* Review text */}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted line-clamp-5">
        {review.text}
      </p>

      {/* Read more */}
      {review.url && (
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          Read on {platformLabel} <ExternalLink className="h-3 w-3" />
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
  avgRating = '4.7',
  totalReviews = '4,363',
  googleCount = '1,667',
  tripadvisorCount = '2,696',
}: ReviewSliderProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [page, setPage] = useState(0)
  const [cardsPerPage, setCardsPerPage] = useState(3)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredReviews = activeTab === 'all'
    ? reviews
    : reviews.filter((r) => r.platform === activeTab)

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

  const totalPages = Math.ceil(filteredReviews.length / cardsPerPage)

  // Reset page when tab or cardsPerPage changes
  useEffect(() => {
    setPage(0)
  }, [cardsPerPage, activeTab])

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

  const visibleReviews = filteredReviews.slice(
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
        <SummaryBar
          avgRating={avgRating}
          totalReviews={totalReviews}
          googleCount={googleCount}
          tripadvisorCount={tripadvisorCount}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Slider */}
      <div ref={containerRef} className="relative">
        {totalPages > 1 && (
          <>
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
          </>
        )}

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
      {totalPages > 1 && (
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
      )}

      {/* Powered by */}
      <p className="mt-6 text-center text-xs text-text-muted">
        Verified reviews from guests on{' '}
        <a
          href="https://www.google.com/maps/place/Sachsenhausen+Tour+Berlin+-+Be+Original+Tours/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent hover:underline"
        >
          Google
        </a>
        {' & '}
        <a
          href="https://www.tripadvisor.com/Attraction_Review-g187323-d12160599-Reviews-Be_Original_Tours-Berlin.html"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent hover:underline"
        >
          Tripadvisor
        </a>
      </p>
    </Section>
  )
}
