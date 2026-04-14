import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { footerNav } from '@/config/navigation'
import { Container } from '@/components/ui'

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <Container className="py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-heading text-lg font-bold tracking-wide text-white">
              {siteConfig.name.toUpperCase()}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              A respectful, educational journey through one of history&apos;s most significant memorial sites.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Explore
            </h3>
            <ul className="space-y-2">
              {footerNav.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}`}
                  className="transition-colors hover:text-accent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerNav.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} {siteConfig.name} &mdash; A Be Original Tours Experience
        </div>
      </Container>
    </footer>
  )
}
