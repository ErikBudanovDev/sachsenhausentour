import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Imprint & Legal Notice — Sachsenhausen Tour Berlin',
  description:
    'Legal notice and imprint for Sachsenhausen Tour Berlin, operated by Be Original Tours. Company registration, contact details, and disclaimer.',
  alternates: { canonical: '/imprint' },
}

export default function ImprintPage() {
  return (
    <>
      <Section spacing="xl" className="pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-4xl font-bold">
            Imprint / Legal Notice
          </h1>

          <dl className="mt-8 space-y-3 text-text-muted">
            <div>
              <dt className="font-semibold text-text">Name / Company:</dt>
              <dd>Be Original Tours</dd>
            </div>
            <div>
              <dt className="font-semibold text-text">Registered Address:</dt>
              <dd>Suite C, Level 7, World Trust Tower, 50 Stanley Street, Central, Hong Kong</dd>
            </div>
            <div>
              <dt className="font-semibold text-text">Email:</dt>
              <dd>
                <a href="mailto:service@beoriginaltours.com" className="text-accent hover:underline">
                  service@beoriginaltours.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-text">Company Registration Number:</dt>
              <dd>76670568</dd>
            </div>
          </dl>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="mx-auto max-w-3xl space-y-10">
          {/* Disclaimer */}
          <div>
            <h2 className="font-heading text-2xl font-bold">Disclaimer</h2>

            <div className="mt-6 space-y-6 text-text-muted leading-relaxed">
              <div>
                <h3 className="font-semibold text-text">Liability for Content</h3>
                <p className="mt-2">
                  The contents of our pages were created with great care. However, we cannot guarantee that the
                  content is correct, complete and up to date. As a service provider, we are responsible for our own
                  content on these pages. We as a service provider are not obliged to monitor transmitted or stored
                  third-party information or to research circumstances that indicate illegal activity. Obligations to
                  remove or block the use of information according to general laws remain unaffected. However,
                  liability in this regard is only possible from the time we become aware of a specific legal
                  violation. As soon as we become aware of such violations, we will remove this content immediately.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text">Liability for Links</h3>
                <p className="mt-2">
                  Our offer contains links to external third party websites, the content of which we have no
                  influence on. For this reason, we cannot accept any liability for this external content. The
                  respective provider or operator is always responsible for the content of the linked pages. The
                  linked pages were checked for possible legal violations at the time the link was created. No
                  illegal content was discernible at the time the link was created. A permanent control of the
                  content of the linked pages is not reasonable without concrete evidence of an infringement. As
                  soon as we become aware of legal violations, we will remove such links immediately.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text">Copyright</h3>
                <p className="mt-2">
                  The content and works on these pages created by the site operator are subject to German copyright
                  law. The duplication, processing, distribution and any kind of use beyond the limits of copyright
                  law require the written consent of the respective author or creator. Downloads and copies of this
                  page are only permitted for private, non-commercial use. As far as the content on this page was
                  not created by the operator, the copyrights of third parties are respected. In particular contents
                  of third parties are marked as such. Should you nevertheless become aware of a copyright
                  infringement, please let us know. As soon as we become aware of legal violations, we will remove
                  such content immediately.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text">Data Protection</h3>
                <p className="mt-2">
                  Our website can generally be used without providing personal data. Insofar as personal data (e.g.
                  name, address or email address) is collected on our website, this is always done on a voluntary
                  basis as far as possible. This data will not be passed on to third parties without your express
                  consent.
                </p>
                <p className="mt-2">
                  We would like to point out that data transmission over the Internet (e.g. when communicating by
                  email) can have security gaps. It is not possible to completely protect data from third-party
                  access.
                </p>
                <p className="mt-2">
                  We hereby expressly object to the use of contact data published within the framework of the legal
                  notice obligation by third parties for sending unsolicited advertising and information material.
                  The operators of the pages expressly reserve the right to take legal action in the event of
                  unsolicited sending of advertising information, such as spam emails.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text">Google Analytics</h3>
                <p className="mt-2">
                  This website uses Google Analytics, a web analytics service provided by Google Inc. (&ldquo;Google&rdquo;).
                  Google Analytics uses so-called &ldquo;cookies&rdquo;, text files that are stored on your computer and that
                  enable an analysis of your use of the website. The information generated by the cookie about your
                  use of this website (including your IP address) is transmitted to a Google server in the USA and
                  stored there. Google will use this information to evaluate your use of the website, to compile
                  reports on website activity for website operators and to provide other services related to website
                  activity and internet usage. Google may also transfer this information to third parties if this is
                  required by law or if third parties process this data on behalf of Google. Under no circumstances
                  will Google link your IP address with other Google data. You can prevent the installation of
                  cookies by setting your browser software accordingly; however, please note that if you do this you
                  may not be able to use the full functionality of this website. By using this website, you consent
                  to the processing of data about you by Google in the manner and for the purposes set out above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
