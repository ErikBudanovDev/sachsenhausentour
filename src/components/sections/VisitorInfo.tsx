import {
  Clock,
  Euro,
  Train,
  MapPin,
  Sun,
  Snowflake,
  Info,
  ExternalLink,
} from 'lucide-react'

export function VisitorInfo() {
  return (
    <section className="bg-primary py-16 md:py-24" id="visitor-info">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 mb-4">
            <Info className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Plan Your Visit
            </span>
          </div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Opening Hours, Admission & Directions
          </h2>
          <p className="mt-3 text-text-muted">
            Everything you need to know before visiting the Sachsenhausen Memorial.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Opening Hours */}
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-heading text-xl font-bold">Opening Hours</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-md bg-secondary p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-semibold">Summer Season</p>
                </div>
                <p className="text-xs text-text-muted mb-1">15 March – 14 October</p>
                <p className="text-sm font-medium">8:30 AM – 6:00 PM daily</p>
              </div>

              <div className="rounded-md bg-secondary p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Snowflake className="h-4 w-4 text-blue-400" />
                  <p className="text-sm font-semibold">Winter Season</p>
                </div>
                <p className="text-xs text-text-muted mb-1">15 October – 14 March</p>
                <p className="text-sm font-medium">8:30 AM – 4:30 PM daily</p>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                The Visitor Information Centre is open daily from 8:30 AM to 5:00 PM. Some indoor exhibitions may close 30 minutes before the grounds. The memorial is closed on 24 &amp; 31 December.
              </p>
            </div>
          </div>

          {/* Admission & Pricing */}
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <Euro className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-heading text-xl font-bold">Admission & Pricing</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-md bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-bold text-green-800">Free Admission</p>
                <p className="text-xs text-green-700 mt-1">
                  Entry to the memorial grounds and all exhibitions is completely free of charge.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Guided Tour Prices</p>
                <div className="space-y-2">
                  {[
                    { label: 'Adult', price: '€29' },
                    { label: 'Student (valid ID)', price: '€24' },
                    { label: 'Group (8+)', price: '€22 / person' },
                  ].map((tier) => (
                    <div
                      key={tier.label}
                      className="flex items-center justify-between rounded bg-secondary px-3 py-2"
                    >
                      <span className="text-sm text-text">{tier.label}</span>
                      <span className="font-heading text-sm font-bold">{tier.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                Our guided tour price includes the round-trip S-Bahn journey from Berlin, a licensed historian guide, and a 3.5-hour walking tour of the memorial.
              </p>
            </div>
          </div>

          {/* Directions */}
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <Train className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-heading text-xl font-bold">Getting There</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-md bg-secondary p-4">
                <p className="text-sm font-semibold mb-1">S-Bahn (Line S1)</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Take the S1 from Berlin Friedrichstraße to Oranienburg. The journey takes approximately 45 minutes. From Oranienburg station, it is a 20-minute walk to the memorial entrance.
                </p>
              </div>

              <div className="rounded-md bg-secondary p-4">
                <p className="text-sm font-semibold mb-1">Regional Train</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  RE5 or RB12 from Berlin Hauptbahnhof to Oranienburg — around 25 minutes. Faster than the S-Bahn, same walking distance from the station.
                </p>
              </div>

              <div className="rounded-md bg-secondary p-4">
                <p className="text-sm font-semibold mb-1">Bus from Oranienburg Station</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Bus lines 804 and 821 stop directly at &ldquo;Gedenkstätte&rdquo; — saving the 20-minute walk.
                </p>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                <div>
                  <p className="text-xs font-semibold">Memorial Address</p>
                  <p className="text-xs text-text-muted">Straße der Nationen 22, 16515 Oranienburg</p>
                  <a
                    href="https://maps.google.com/?q=Sachsenhausen+Memorial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1"
                  >
                    Open in Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 mx-auto max-w-2xl rounded-md border border-accent/20 bg-accent/5 p-4 text-center">
          <p className="text-sm text-text-muted">
            <span className="font-semibold text-text">With our guided tour</span>, you don&apos;t need to worry about transport or navigation. We travel together from Berlin Alexanderplatz and your guide handles everything.
          </p>
        </div>
      </div>
    </section>
  )
}
