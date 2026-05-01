import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { getActiveTourConfig } from '@/lib/tour-config'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getActiveTourConfig()

  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <OrganizationSchema priceInCents={config.pricePerPerson} currency={config.currency} />
    </>
  )
}
