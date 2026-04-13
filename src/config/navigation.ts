export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

export const mainNav: NavItem[] = [
  { label: 'Tour', href: '/tour' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

export const footerNav = {
  quickLinks: [
    { label: 'Tour Details', href: '/tour' },
    { label: 'Photo Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'About Us', href: '/about' },
    { label: 'Book Your Tour', href: '/book' },
    { label: 'Contact', href: '/contact' },
  ] satisfies NavItem[],
  legal: [
    { label: 'Imprint', href: '/imprint' },
    { label: 'Privacy Policy', href: '/privacy' },
  ] satisfies NavItem[],
}
