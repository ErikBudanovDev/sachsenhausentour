'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import type { WithClassName } from '@/types'

export interface WhatsAppButtonProps extends WithClassName {
  message?: string
}

export function WhatsAppButton({
  message = "Hi! I'd like to book the Sachsenhausen Tour.",
  className,
}: WhatsAppButtonProps) {
  const phone = siteConfig.whatsapp.replace(/\+/g, '')
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        'fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center',
        'rounded-full bg-[#25D366] text-white shadow-lg',
        'transition-transform duration-200 hover:scale-110 active:scale-95',
        'lg:flex lg:bottom-8 lg:right-8',
        className
      )}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
