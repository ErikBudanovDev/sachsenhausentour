import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <OrganizationSchema />
    </>
  )
}
