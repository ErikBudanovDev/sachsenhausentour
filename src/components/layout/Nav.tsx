'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mainNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-[var(--transition-medium)]',
          scrolled
            ? 'bg-surface/95 backdrop-blur-sm shadow-sm border-b border-border'
            : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className={cn(
              'font-heading text-xl font-bold tracking-wide transition-colors',
              scrolled ? 'text-navy' : 'text-white'
            )}
          >
            {siteConfig.name.toUpperCase()}
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent',
                  scrolled ? 'text-text-muted' : 'text-white/80 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button href="/book#booking" size="sm">
              Book Now
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className={cn('md:hidden transition-colors', scrolled ? 'text-navy' : 'text-white')}
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
        </div>
      )}
    </>
  )
}
