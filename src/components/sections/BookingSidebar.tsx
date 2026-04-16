'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { siteConfig } from '@/config/site'
import type { Review } from './ReviewSlider'

interface BookingSidebarProps {
  reviews: Review[]
}

/* ─── Google Icon ─── */
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

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

/* ─── Mini Review Card for sidebar ─── */
function MiniReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-md border border-border bg-white p-4">
      <div className="flex items-center gap-2.5">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image src={review.photo} alt={review.name} fill className="object-cover" sizes="32px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text">{review.name}</p>
          <p className="text-xs text-text-muted">{formatDate(review.date)}</p>
        </div>
        <GoogleIcon className="h-4 w-4 shrink-0 opacity-60" />
      </div>
      <div className="mt-2 flex gap-0.5">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-[#FBBC05] text-[#FBBC05]" />
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-text-muted line-clamp-3">{review.text}</p>
      {review.url && (
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-accent hover:underline"
        >
          Read on Google <ExternalLink className="h-2.5 w-2.5" />
        </a>
      )}
    </div>
  )
}

/* ─── Main Sidebar ─── */
export function BookingSidebar({ reviews }: BookingSidebarProps) {
  const [reviewIdx, setReviewIdx] = useState(0)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Auto-advance reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIdx((i) => (i < reviews.length - 1 ? i + 1 : 0))
    }, 5000)
    return () => clearInterval(timer)
  }, [reviews.length])

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('Hi! I would like to book the Sachsenhausen Tour.')}`

  return (
    <div ref={sidebarRef} className="lg:sticky lg:top-24 space-y-5">
      {/* Booking Card */}
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-text-muted line-through">€49</span>
          <span className="font-heading text-4xl font-bold text-accent">€29</span>
        </div>
        <p className="text-sm text-text-muted">per person</p>

        {/* Pricing tiers */}
        <div className="mt-4 space-y-2">
          {[
            { label: 'Adult', price: '€29' },
            { label: 'Student', price: '€24' },
            { label: 'Group (8+)', price: '€22' },
          ].map((tier) => (
            <div key={tier.label} className="flex items-center justify-between rounded bg-secondary px-3 py-2">
              <span className="text-sm text-text">{tier.label}</span>
              <span className="font-heading text-sm font-bold">{tier.price}</span>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <Button href="/book#booking" size="lg" className="w-full">
            Book Now!
          </Button>
        </div>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-medium text-text hover:bg-secondary transition-colors"
        >
          <MessageCircle className="h-4 w-4 text-[#25D366]" />
          WhatsApp
        </a>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          Free cancellation up to 24 hours
        </div>
      </div>

      {/* Quick Info */}
      <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">When</p>
              <p className="text-sm text-text">Every day at 10:00 AM</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Where</p>
              <p className="text-sm text-text">Generator Berlin Alexanderplatz</p>
              <p className="text-xs text-text-muted">Otto-Braun-Str. 65, 10178 Berlin</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Group</p>
              <p className="text-sm text-text">Max 20 people</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Widget */}
      <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <GoogleIcon className="h-5 w-5" />
          <span className="text-sm font-semibold">Google Reviews</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-heading text-2xl font-bold">4.8</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-[#FBBC05] text-[#FBBC05]" />
            ))}
          </div>
          <span className="text-xs text-text-muted">320+ reviews</span>
        </div>

        {/* Single review with navigation */}
        {reviews.length > 0 && (
          <div className="relative">
            <MiniReviewCard review={reviews[reviewIdx]} />
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => setReviewIdx((i) => (i > 0 ? i - 1 : reviews.length - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted hover:text-accent transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-text-muted">
                {reviewIdx + 1} / {reviews.length}
              </span>
              <button
                onClick={() => setReviewIdx((i) => (i < reviews.length - 1 ? i + 1 : 0))}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted hover:text-accent transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
