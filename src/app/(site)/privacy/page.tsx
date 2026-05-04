import type { Metadata } from 'next'
import { Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Privacy Policy — Sachsenhausen Tour Berlin',
  description:
    'Privacy policy for Sachsenhausen Tour Berlin. Learn how we collect, use, and protect your personal data when you visit our website or book a tour.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Section spacing="xl" className="pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-4xl font-bold">Privacy Policy</h1>

          {/* Who We Are */}
          <div className="mt-8">
            <h2 className="font-heading text-2xl font-bold">Who We Are</h2>
            <p className="mt-2 text-xs uppercase tracking-widest text-text-muted">
              Angaben gem&auml;&szlig; &sect; 5 TMG
            </p>

            <dl className="mt-4 space-y-3 text-text-muted">
              <div>
                <dt className="font-semibold text-text">Company:</dt>
                <dd>Original Budapest Tours Kft</dd>
                <dd>Pettenkoferstra&szlig;e 17A, 10247 Berlin</dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Contact:</dt>
                <dd>
                  Telefon:{' '}
                  <a href="tel:+4915783893416" className="text-accent hover:underline">
                    01578 3893416
                  </a>
                </dd>
                <dd>
                  E-Mail:{' '}
                  <a href="mailto:service@beoriginaltours.com" className="text-accent hover:underline">
                    service@beoriginaltours.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Registereintrag:</dt>
                <dd>Eintragung im Registergericht: Berlin Charlottenburg</dd>
                <dd>Registernummer: HRB 173118 B</dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Aufsichtsbeh&ouml;rde:</dt>
                <dd>Bezirksamts Lichtenberg</dd>
              </div>
              <div>
                <dt className="font-semibold text-text">Website:</dt>
                <dd>
                  <a href="https://sachsenhausentour.de/" className="text-accent hover:underline">
                    https://sachsenhausentour.de/
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="mx-auto max-w-3xl space-y-10 text-text-muted leading-relaxed">
          {/* General Info on Data */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-text">General Info on Data</h2>
            <p className="mt-4">
              By visiting our website certain information is transmitted to us, for example IP-address, type and
              version of your web-browser, operating system, the website you came from and the time of your visit.
              This data cannot be used by us to identify individual visitors. The data is exclusively used to
              improve the popularity, content, and functionality of our website. Whenever we collect personal or
              business data (e-mail address, name, address) this is provided by the visitor on a purely voluntary
              basis. The use of and payment for all services is &mdash; so long as technically possible and
              reasonable &mdash; also allowed anonymously or under a pseudonym.
            </p>
          </div>

          {/* What We Collect */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-text">
              What We Collect and Store &amp; How We Use Your Data
            </h2>
            <p className="mt-4 font-semibold text-text">While you visit our site, we&apos;ll track:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Products you&apos;ve viewed: we&apos;ll use this to, for example, show you products you&apos;ve recently viewed</li>
              <li>Location, IP address and browser type: we&apos;ll use this for purposes like estimating taxes and shipping</li>
            </ul>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="font-heading text-xl font-bold text-text">Cookies</h2>
            <p className="mt-4">
              We use cookies to remember who you are when browsing our site and to store the contents of your cart
              for the purpose of reminding you. These cookies will only be set when you consent to allowing
              additional cookies on our website.
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1 text-sm">
              <li>wp_automatewoo_visitor &mdash; Used to store a secure key that is unique to you &mdash; Expires after 2 years</li>
              <li>wp_automatewoo_session_started &mdash; Used to flag when you begin interacting with our website &mdash; Expires when you end the browser session</li>
              <li>automatewoo_do_cart_update &mdash; Used to store flag when your stored cart needs to be updated &mdash; Expires when you end the browser session</li>
            </ul>
            <p className="mt-2">
              We&apos;ll also use cookies to keep track of cart contents while you&apos;re browsing our site.
            </p>
          </div>

          {/* Google Analytics */}
          <div>
            <h2 className="font-heading text-xl font-bold text-text">Google Analytics</h2>
            <p className="mt-4">
              This website uses Google Analytics, a web analysis service of Google Inc. (&ldquo;Google&rdquo;).
              Google Analytics uses &lsquo;cookies&rsquo;, text data that are stored on your computer and allow an
              analysis of your use of the website. The information generated by cookies through your use of this
              website are normally transferred to Google&apos;s server in the USA and stored there. Through the
              activation of the IP-anonymisation on this website your IP-address will be abbreviated within the
              member states of the European Union or the European Economic Area. Only in exceptional cases will the
              full IP address be transferred to a Google server in the USA and abbreviated there.
            </p>
            <p className="mt-2">
              On behalf of the operator of this website, Google will use this information to evaluate your use of
              the website, to compile reports on the website activities and to provide other services related to the
              website usage and the internet usage against the website operator. The IP address transmitted by your
              browser as part of Google Analytics will not be merged with other Google data. You can prevent cookies
              from being saved by setting your browser software accordingly; however, we would like to point out
              that in this case you may not be able to fully utilize all the functions of this website.
            </p>
          </div>

          {/* When Booking */}
          <div>
            <h2 className="font-heading text-xl font-bold text-text">When Booking</h2>
            <p className="mt-4">
              We collect information about you during the checkout process on our store. When you book or purchase
              from us, we&apos;ll ask you to provide information including your name, billing address, email
              address, phone number, credit card/payment details, and travel accommodation. We&apos;ll use this
              information for purposes such as to:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Send you information about your account and order</li>
              <li>Respond to your requests, including refunds and complaints</li>
              <li>Process payments and prevent fraud</li>
              <li>Comply with any legal obligations we have, such as calculating taxes</li>
              <li>Improve our store offerings</li>
              <li>Send you marketing messages, if you choose to receive them</li>
            </ul>
            <p className="mt-2">
              We generally store information about you for as long as we need the information for the purposes for
              which we collect and use it, and we are not legally required to continue to keep it. For example, we
              will store order information for 5 years for tax and accounting purposes. This includes your name,
              email address and billing address.
            </p>
          </div>

          {/* When Making Payments */}
          <div>
            <h2 className="font-heading text-xl font-bold text-text">When Making Payments</h2>
            <p className="mt-4">
              We accept payments through Stripe. When processing payments, some of your data will be passed to
              Stripe, including information required to process or support the payment, such as the purchase total
              and billing information. Please see the{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Stripe Privacy Policy
              </a>{' '}
              for more details.
            </p>
          </div>

          {/* Communication Logs */}
          <div>
            <h2 className="font-heading text-xl font-bold text-text">Communication Logs</h2>
            <p className="mt-4">
              We keep a log of some of the communication that we have with you which may include marketing and
              transactional emails and/or SMS messages. These are kept for the purpose of improving our marketing
              and communication with you and other customers. These logs are retained until you request removal of
              your data.
            </p>
          </div>

          {/* Embedded Content */}
          <div>
            <h2 className="font-heading text-xl font-bold text-text">Embedded Content from Other Websites</h2>
            <p className="mt-4">
              Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded
              content from other websites behaves in the exact same way as if the visitor has visited the other
              website.
            </p>
            <p className="mt-2">
              These websites may collect data about you, use cookies, embed additional third-party tracking, and
              monitor your interaction with that embedded content, including tracing your interaction with the
              embedded content if you have an account and are logged in to that website.
            </p>
          </div>

          {/* What We Share */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-text">What We Share with Others</h2>
            <p className="mt-4">
              We share information with third parties who help us provide our orders and store services to you.
            </p>
          </div>

          {/* Data Retention */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-text">How Long We Retain Your Data</h2>
            <p className="mt-4">
              If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can
              recognize and approve any follow-up comments automatically instead of holding them in a moderation
              queue.
            </p>
            <p className="mt-2">
              For users that register on our website (if any), we also store the personal information they provide
              in their user profile. All users can see, edit, or delete their personal information at any time
              (except they cannot change their username). Website administrators can also see and edit that
              information.
            </p>
          </div>

          {/* Team Access */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-text">Who on Our Team Has Access</h2>
            <p className="mt-4">
              Members of our team have access to the information you provide us. For example, both Administrators
              and Shop Managers can access:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Order information like what was purchased, when it was purchased and where it should be sent</li>
              <li>Customer information like your name, email address, and billing and shipping information</li>
            </ul>
            <p className="mt-2">
              Our team members have access to this information to help fulfill orders, process refunds and support
              you.
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-text">What Rights You Have Over Your Data</h2>
            <p className="mt-4">
              If you have an account on this site, or have left comments, you can request to receive an exported
              file of the personal data we hold about you, including any data you have provided to us. You can also
              request that we erase any personal data we hold about you. This does not include any data we are
              obliged to keep for administrative, legal, or security purposes.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
