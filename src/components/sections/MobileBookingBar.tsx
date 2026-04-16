'use client'

import { useState, useEffect } from 'react'
import { siteConfig } from '@/config/site'

const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('Hi! I would like to book the Sachsenhausen Tour.')}`

/* Official WhatsApp logo SVG */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 175.216 175.552" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wa-b" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#57d163" />
          <stop offset="1" stopColor="#23b33a" />
        </linearGradient>
      </defs>
      <path d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324a60.954 60.954 0 0 0 31.29 8.57c33.734 0 61.178-27.423 61.178-61.159a60.773 60.773 0 0 0-17.922-43.282 60.72 60.72 0 0 0-43.374-17.92z" fill="url(#wa-b)" />
      <path d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043a6.76 6.76 0 0 0-4.894 2.3c-1.682 1.838-6.423 6.272-6.423 15.298 0 9.025 6.578 17.743 7.495 18.97.918 1.226 12.683 20.3 31.405 27.633 15.573 6.096 18.75 4.885 22.128 4.58 3.378-.306 10.893-4.452 12.426-8.753 1.534-4.3 1.534-7.993 1.073-8.762-.46-.769-1.685-1.226-3.525-2.146-1.838-.918-10.893-5.377-12.576-5.99-1.685-.612-2.91-.918-4.137.92-1.226 1.837-4.752 5.989-5.824 7.216-1.073 1.227-2.146 1.381-3.984.462-1.838-.918-7.764-2.862-14.784-9.124-5.465-4.873-9.154-10.891-10.228-12.73-1.072-1.837-.114-2.83.808-3.745.828-.825 1.838-2.147 2.759-3.22.918-1.074 1.226-1.838 1.838-3.066.613-1.226.307-2.3-.153-3.22-.46-.918-4.05-10.005-5.744-13.604z" fill="#fff" fillRule="evenodd" />
    </svg>
  )
}

export function MobileBookingBar() {
  const [visible, setVisible] = useState(false)

  /* Show bar after scrolling past the hero (≈ 400px) */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-border">
        {/* Statement */}
        <div className="min-w-0 flex-shrink">
          <p className="font-heading text-base font-bold text-accent leading-tight">
            From €29
          </p>
          <p className="text-[11px] text-text-muted leading-tight">
            FREE cancellation
          </p>
        </div>

        {/* CTA group — WhatsApp + Book Now side by side */}
        <div className="flex items-center gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
            aria-label="Contact via WhatsApp"
          >
            <WhatsAppIcon className="h-10 w-10" />
          </a>

          <a
            href="/book#booking"
            className="shrink-0 rounded-md bg-accent px-5 py-2.5 font-heading text-sm font-bold text-white shadow-md transition-all active:scale-95 hover:bg-accent-hover"
          >
            Book Now!
          </a>
        </div>
      </div>
    </div>
  )
}
