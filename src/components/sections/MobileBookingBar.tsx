'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'

const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('Hi! I would like to book the Sachsenhausen Tour.')}`

export function MobileBookingBar() {
  const [visible, setVisible] = useState(false)

  /* Show bar after scrolling past the hero (≈ 400px) */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll() // check on mount
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-border">
        {/* Statement */}
        <div className="min-w-0 flex-shrink">
          <p className="font-heading text-base font-bold text-accent leading-tight">
            From €29
          </p>
          <p className="text-[11px] text-text-muted leading-tight">
            FREE cancellation
          </p>
        </div>

        {/* WhatsApp icon button */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform active:scale-95"
          aria-label="Contact via WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </a>

        {/* Book Now button */}
        <a
          href="/book"
          className="shrink-0 rounded-md bg-accent px-5 py-2.5 font-heading text-sm font-bold text-white shadow-md transition-all active:scale-95 hover:bg-accent-hover"
        >
          Book Now!
        </a>
      </div>
    </div>
  )
}
