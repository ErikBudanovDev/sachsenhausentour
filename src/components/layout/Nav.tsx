'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mainNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}`

  return (
    <>
      {/* Top Contact Bar */}
      <div className="hidden md:block bg-navy text-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-accent"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
              Write us on WhatsApp
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-accent"
            >
              <Mail className="h-3.5 w-3.5" />
              {siteConfig.email}
            </a>
          </div>
          <a
            href={`tel:${siteConfig.whatsapp}`}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-accent"
          >
            <Phone className="h-3.5 w-3.5" />
            {siteConfig.whatsapp}
          </a>
        </div>
      </div>

      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-[var(--transition-medium)]',
          scrolled
            ? 'bg-surface/95 backdrop-blur-sm shadow-sm border-b border-border md:top-0'
            : 'bg-surface/90 backdrop-blur-sm md:top-[34px]'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-wide text-navy transition-colors"
          >
            {siteConfig.name.toUpperCase()}
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-text transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/book#booking" size="md">
              Book Now
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-navy transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-surface flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-4 right-4 text-navy"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-8 w-8" />
          </button>
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-heading text-2xl text-navy transition-colors hover:text-accent"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button href="/book#booking" size="lg" onClick={() => setMobileOpen(false)}>
            Book Now
          </Button>

          {/* Mobile contact info */}
          <div className="mt-4 flex flex-col items-center gap-3 text-sm text-text-muted">
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-accent">
              <Mail className="h-4 w-4" /> {siteConfig.email}
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  )
}
