import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Clock,
  MapPin,
  Users,
  Euro,
  Check,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { Section, Button, Card, Accordion } from '@/components/ui'
import { ReviewSlider } from '@/components/sections/ReviewSlider'
import type { Review } from '@/components/sections/ReviewSlider'
import reviewsData from '@/content/reviews.json'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { MobileBookingBar } from '@/components/sections/MobileBookingBar'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Campo de Concentración de Sachsenhausen – Tour Guiado desde Berlín | €29',
  description:
    'Visita guiada al campo de concentración de Sachsenhausen desde Berlín. Guías historiadores expertos, grupos pequeños, cancelación gratuita. Reserva por €29.',
  alternates: {
    canonical: '/es',
    languages: {
      en: '/',
      es: '/es',
    },
  },
}

const highlights = [
  { icon: Clock, label: 'Duración', value: '6 horas (ida y vuelta)' },
  { icon: MapPin, label: 'Punto de encuentro', value: 'Berlín Alexanderplatz' },
  { icon: Users, label: 'Grupo', value: 'Máximo 20 personas' },
  { icon: Euro, label: 'Precio', value: 'Desde €29 por persona' },
]

const whyChoose = [
  'Guías historiadores especializados en educación sobre el Holocausto',
  'Grupos pequeños para una experiencia personal y respetuosa',
  'Narración ética centrada en las experiencias de los prisioneros',
  'Precios transparentes — descuentos para estudiantes y grupos',
  'Cancelación gratuita hasta 24 horas antes de la salida',
]

const itinerary = [
  { title: 'Salida desde Berlín', desc: 'Nos encontramos en Generator Berlin Alexanderplatz a las 10:00. Durante el viaje en tren, tu guía introduce el contexto histórico.' },
  { title: 'Llegada y Entrada', desc: 'Caminamos por Oranienburg y llegamos a la puerta inscrita con "Arbeit Macht Frei". Tu guía explica el significado detrás del lema.' },
  { title: 'Barracones y Vida Diaria', desc: 'Exploramos los barracones reconstruidos, la jerarquía de prisioneros y las historias individuales de supervivencia.' },
  { title: 'Celdas de Castigo y Estación Z', desc: 'Las celdas de aislamiento y el antiguo lugar de ejecución — un momento para la reflexión y la contemplación.' },
  { title: 'Memorial y Regreso', desc: 'Concluimos en el memorial soviético, discutiendo la liberación y el significado del sitio hoy. Regreso a Berlín hacia las 16:00.' },
]

const faqs = [
  {
    question: '¿Se necesitan entradas para Sachsenhausen?',
    answer: 'La entrada al Memorial de Sachsenhausen es gratuita. Sin embargo, los tours guiados con historiadores expertos están disponibles desde €29 por persona y proporcionan un contexto histórico esencial.',
  },
  {
    question: '¿Cuánto dura el tour desde Berlín?',
    answer: 'La experiencia completa dura aproximadamente 6 horas, incluyendo el viaje en tren desde Berlín Alexanderplatz hasta Oranienburg y de vuelta. Pasarás unas 3,5 horas en el memorial.',
  },
  {
    question: '¿Cómo llegar al campo de concentración desde Berlín?',
    answer: 'Viajamos juntos en S-Bahn (línea S1) desde el centro de Berlín. El viaje dura unos 50 minutos. Tu guía proporciona contexto histórico durante el trayecto.',
  },
  {
    question: '¿El tour es adecuado para niños?',
    answer: 'El tour es educativo y respetuoso. Lo recomendamos para visitantes de 14 años en adelante. Los niños más pequeños pueden asistir a discreción de sus tutores.',
  },
  {
    question: '¿Cuál es la política de cancelación?',
    answer: 'Cancelación gratuita hasta 24 horas antes de la hora de salida del tour. Sin preguntas — recibirás un reembolso completo.',
  },
  {
    question: '¿Es Auschwitz accesible desde Berlín?',
    answer: 'Auschwitz está a más de 530 km de Berlín (unas 5,5 horas en tren). Para una excursión de un día desde Berlín, Sachsenhausen es la opción recomendada — a solo 35 km de distancia.',
  },
]

const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('¡Hola! Me gustaría reservar el tour de Sachsenhausen.')}`

export default function SpanishLandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/gallery/DSCF5931-min-scaled.jpg"
          alt="Campo de concentración de Sachsenhausen — tour guiado desde Berlín"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Campo de Concentración de Sachsenhausen — Tour Guiado desde Berlín
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            Únete a un recorrido de 6 horas dirigido por historiadores desde Berlín al Memorial de Sachsenhausen. Grupos pequeños, contexto profundo y un enfoque respetuoso.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="/book" size="lg">Reservar Tour — €29</Button>
            <Button href={whatsappHref} variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/60 italic">Cancelación gratuita hasta 24 horas antes.</p>
        </div>
      </section>

      {/* Highlights strip */}
      <Section background="secondary" spacing="md">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-md bg-surface/50 p-4">
              <Icon className="h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-accent">{label}</p>
                <p className="text-sm text-text">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Trust stats */}
      <Section background="surface" spacing="lg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Tour de Confianza en Sachsenhausen</h2>
          <p className="mt-3 text-text-muted">Números que reflejan nuestro compromiso con la calidad y la educación.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: '4.8★', label: 'Valoración media' },
            { value: '15,000+', label: 'Visitantes guiados' },
            { value: '10+', label: 'Años de experiencia' },
            { value: '320+', label: 'Reseñas verificadas' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-4xl font-bold text-accent">{stat.value}</p>
              <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why visit */}
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">¿Por Qué Visitar Sachsenhausen desde Berlín?</h2>
          <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
            <p>
              El campo de concentración de Sachsenhausen, situado a solo 35 kilómetros al norte de Berlín en Oranienburg, fue uno de los primeros grandes campos establecidos por el régimen nazi en 1936. Sirvió como &ldquo;campo modelo&rdquo; para todo el sistema de campos de concentración.
            </p>
            <p>
              Más de 200.000 personas fueron encarceladas aquí entre 1936 y 1945. Visitar Sachsenhausen no es solo ver un sitio histórico — es comprender los mecanismos del terror organizado por el estado y las lecciones que siguen siendo vitales para nuestro mundo hoy.
            </p>
            <p>
              Como excursión de un día desde Berlín, Sachsenhausen ofrece una experiencia accesible pero profundamente impactante — especialmente con la guía de un historiador experto.
            </p>
          </div>
        </div>
      </Section>

      {/* Why choose our tour */}
      <Section background="surface" spacing="lg">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl">¿Por Qué Elegir Nuestro Tour?</h2>
        <div className="mx-auto max-w-2xl space-y-5">
          {whyChoose.map((text) => (
            <div key={text} className="flex items-start gap-4">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20">
                <Check className="h-4 w-4 text-accent" />
              </div>
              <p className="text-text leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Itinerary */}
      <Section spacing="lg">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl">Itinerario del Tour</h2>
        <div className="mx-auto max-w-2xl">
          {itinerary.map((stop, i) => (
            <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                  {i + 1}
                </div>
                {i < itinerary.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-2">
                <h3 className="font-heading text-lg font-bold">{stop.title}</h3>
                <p className="mt-1 text-sm text-text-muted leading-relaxed">{stop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section background="surface" spacing="lg" id="precio">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold sm:text-4xl">Precios y Reserva</h2>
        <div className="mx-auto max-w-md">
          <Card padding="lg" className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Por Persona</p>
            <p className="mt-2 font-heading text-5xl font-bold text-navy">€29</p>
            <div className="mt-6 space-y-2">
              {[
                { label: 'Adulto', price: '€29' },
                { label: 'Estudiante', price: '€24' },
                { label: 'Grupo (8+)', price: '€22' },
              ].map((tier) => (
                <div key={tier.label} className="flex items-center justify-between rounded-md bg-secondary px-4 py-2.5">
                  <span className="font-medium text-text">{tier.label}</span>
                  <span className="font-heading text-lg font-bold text-navy">{tier.price}</span>
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-2 text-left text-sm">
              {['Guía historiador experto', 'Grupos pequeños (máx. 20)', 'Cancelación gratuita — 24h', 'Salida diaria a las 10:00'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  <span className="text-text">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button href="/book" size="lg" className="w-full">Reservar Ahora</Button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-text-muted">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Cancelación gratuita hasta 24 horas antes</span>
            </div>
          </Card>
        </div>
      </Section>

      {/* Reviews — real Google reviews from MongoDB */}
      <ReviewSlider
        heading="Lo Que Dicen Nuestros Visitantes"
        subheading="Reseñas verificadas de visitantes en Google."
        reviews={reviewsData as Review[]}
        avgRating="4.8"
        totalReviews="320+"
      />

      {/* FAQ */}
      <Section background="surface" spacing="lg">
        <h2 className="mb-8 text-center font-heading text-3xl font-bold sm:text-4xl">Preguntas Frecuentes</h2>
        <div className="mx-auto max-w-2xl">
          {faqs.map((faq) => (
            <Accordion key={faq.question} title={faq.question}>
              {faq.answer}
            </Accordion>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="bg-navy py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            ¿Listo Para Vivir la Historia?
          </h2>
          <p className="mt-4 text-white/70">
            Salidas diarias desde Berlín. Grupos pequeños. Historiadores expertos. €29 por persona.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="/book" size="lg">Reservar Tour</Button>
            <Button href={whatsappHref} variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
              <MessageCircle className="mr-2 h-5 w-5" />
              Preguntar por WhatsApp
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/50 italic">
            Los tours se llenan rápidamente en temporada alta — reserva tu plaza hoy.
          </p>
        </div>
      </section>

      {/* Structured Data */}
      <FAQSchema items={faqs} />

      {/* Sticky mobile booking bar */}
      <MobileBookingBar />
    </>
  )
}
