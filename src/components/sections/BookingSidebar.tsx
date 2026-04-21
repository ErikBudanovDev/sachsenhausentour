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
  CalendarCheck,
  Sparkles,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import type { Review } from './ReviewSlider'

interface BookingSidebarProps {
  reviews: Review[]
}

/* ─── Icons ─── */
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 175.216 175.552" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wa-sb" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#57d163" />
          <stop offset="1" stopColor="#23b33a" />
        </linearGradient>
      </defs>
      <path d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324a60.954 60.954 0 0 0 31.29 8.57c33.734 0 61.178-27.423 61.178-61.159a60.773 60.773 0 0 0-17.922-43.282 60.72 60.72 0 0 0-43.374-17.92z" fill="url(#wa-sb)" />
      <path d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043a6.76 6.76 0 0 0-4.894 2.3c-1.682 1.838-6.423 6.272-6.423 15.298 0 9.025 6.578 17.743 7.495 18.97.918 1.226 12.683 20.3 31.405 27.633 15.573 6.096 18.75 4.885 22.128 4.58 3.378-.306 10.893-4.452 12.426-8.753 1.534-4.3 1.534-7.993 1.073-8.762-.46-.769-1.685-1.226-3.525-2.146-1.838-.918-10.893-5.377-12.576-5.99-1.685-.612-2.91-.918-4.137.92-1.226 1.837-4.752 5.989-5.824 7.216-1.073 1.227-2.146 1.381-3.984.462-1.838-.918-7.764-2.862-14.784-9.124-5.465-4.873-9.154-10.891-10.228-12.73-1.072-1.837-.114-2.83.808-3.745.828-.825 1.838-2.147 2.759-3.22.918-1.074 1.226-1.838 1.838-3.066.613-1.226.307-2.3-.153-3.22-.46-.918-4.05-10.005-5.744-13.604z" fill="#fff" fillRule="evenodd" />
    </svg>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

/* ─── Mini Review Card ─── */
function MiniReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-lg bg-secondary/80 p-3.5">
      <div className="flex items-center gap-2.5">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
          <Image src={review.photo} alt={review.name} fill className="object-cover" sizes="32px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text">{review.name}</p>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-2.5 w-2.5 fill-[#FBBC05] text-[#FBBC05]" />
              ))}
            </div>
            <span className="text-[10px] text-text-muted">{formatDate(review.date)}</span>
          </div>
        </div>
        <GoogleIcon className="h-4 w-4 shrink-0 opacity-50" />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-text-muted line-clamp-2">{review.text}</p>
    </div>
  )
}

/* ─── Main Sidebar ─── */
export function BookingSidebar({ reviews }: BookingSidebarProps) {
  const [reviewIdx, setReviewIdx] = useState(0)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIdx((i) => (i < reviews.length - 1 ? i + 1 : 0))
    }, 5000)
    return () => clearInterval(timer)
  }, [reviews.length])

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('Hi! I would like to book the Sachsenhausen Tour.')}`

  return (
    <div ref={sidebarRef} className="lg:sticky lg:top-24 space-y-4">

      {/* ── Primary Booking Card ── */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-lg">

        {/* Header band */}
        <div className="bg-navy px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-white/50 line-through">€49</span>
                <span className="font-heading text-3xl font-bold text-white">€29</span>
              </div>
              <p className="text-xs text-white/60">per person</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-xs font-semibold text-white">40% OFF</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Pricing tiers */}
          <div className="space-y-1.5">
            {[
              { label: 'Adult', price: '€29', highlight: true },
              { label: 'Student (valid ID)', price: '€24', highlight: false },
              { label: 'Group (8+)', price: '€22 pp', highlight: false },
            ].map((tier) => (
              <div
                key={tier.label}
                className={`flex items-center justify-between rounded-lg px-4 py-2.5 ${
                  tier.highlight ? 'bg-accent/8 border border-accent/20' : 'bg-secondary'
                }`}
              >
                <span className="text-sm text-text">{tier.label}</span>
                <span className={`font-heading text-sm font-bold ${tier.highlight ? 'text-accent' : 'text-text'}`}>
                  {tier.price}
                </span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <a
            href="/book#booking"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-heading text-base font-bold text-white shadow-md transition-all hover:bg-accent-hover hover:shadow-lg active:scale-[0.98]"
          >
            <CalendarCheck className="h-5 w-5" />
            Book Now — Choose Date
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 flex w-full items-center justify-center gap-2.5 rounded-lg border border-border py-3 text-sm font-medium text-text transition-colors hover:bg-secondary"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Ask a Question on WhatsApp
          </a>

          {/* Trust signals row */}
          <div className="mt-4 flex items-center justify-center gap-4 border-t border-border pt-4">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              <span>Free cancellation</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <CalendarCheck className="h-3.5 w-3.5 text-accent" />
              <span>Instant confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tour Details Card ── */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Tour Details</h4>
        <div className="space-y-4">
          {[
            {
              icon: Clock,
              label: 'Departure',
              value: 'Every day at 10:00 AM',
              sub: '6-hour round trip',
            },
            {
              icon: MapPin,
              label: 'Meeting Point',
              value: 'Generator Berlin Alexanderplatz',
              sub: 'Otto-Braun-Str. 65, 10178 Berlin',
            },
            {
              icon: Users,
              label: 'Group Size',
              value: 'Max 20 people',
              sub: 'Small group, personal experience',
            },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-muted">{label}</p>
                <p className="text-sm font-semibold text-text">{value}</p>
                <p className="text-xs text-text-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Reviews Card ── */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        {/* Rating summary */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
            <span className="font-heading text-lg font-bold text-accent">4.8</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FBBC05] text-[#FBBC05]" />
                ))}
              </div>
              <GoogleIcon className="h-4 w-4 ml-1" />
            </div>
            <p className="text-xs text-text-muted mt-0.5">Based on 320+ verified reviews</p>
          </div>
        </div>

        {/* Review carousel */}
        {reviews.length > 0 && (
          <div>
            <MiniReviewCard review={reviews[reviewIdx]} />
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => setReviewIdx((i) => (i > 0 ? i - 1 : reviews.length - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-text-muted hover:text-accent transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1">
                {reviews.slice(0, 6).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === reviewIdx ? 'w-4 bg-accent' : 'w-1.5 bg-border hover:bg-text-muted'
                    }`}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setReviewIdx((i) => (i < reviews.length - 1 ? i + 1 : 0))}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-text-muted hover:text-accent transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <a
          href="https://www.google.com/search?q=sachsenhausen+tour+reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-accent hover:underline"
        >
          See all reviews on Google <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
