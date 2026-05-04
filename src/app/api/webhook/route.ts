import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import Stripe from 'stripe'
import { getStripeSecretKey } from '@/lib/stripe'
import { connectDB } from '@/lib/mongodb'
import { Booking, generateBookingRef } from '@/models/Booking'

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2026-04-22.dahlia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function esc(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

/**
 * Send confirmation emails (customer + admin) as a fallback
 * when the client-side confirm call didn't fire.
 */
async function sendBookingEmails(booking: {
  bookingRef: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  totalCents: number
  paymentId: string
}) {
  const transporter = getTransporter()
  const totalDisplay = `€${(booking.totalCents / 100).toFixed(2)}`

  // Customer email
  await transporter.sendMail({
    from: `"Sachsenhausen Tour" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: `Booking ${booking.bookingRef} Confirmed — Sachsenhausen Tour on ${esc(booking.date)}`,
    html: buildCustomerEmailCompact({
      bookingRef: booking.bookingRef,
      name: esc(booking.name),
      date: esc(booking.date),
      time: esc(booking.time),
      guests: booking.guests,
      total: totalDisplay,
    }),
  })

  // Admin email
  await transporter.sendMail({
    from: `"Booking System" <${process.env.SMTP_USER}>`,
    to: 'booking@original-europe-tours.com',
    subject: `[${booking.bookingRef}] New Booking: ${esc(booking.name)} — ${booking.guests} guests on ${esc(booking.date)}`,
    text: `New booking received!\n\nBooking Ref: ${booking.bookingRef}\n\nTour: Sachsenhausen Memorial Tour\nDate: ${booking.date}\nTime: ${booking.time}\nGuests: ${booking.guests}\nTotal: ${totalDisplay}\n\nCustomer: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone || 'Not provided'}\n\nStripe Payment: ${booking.paymentId}\n`,
  })
}

function buildCustomerEmailCompact(b: {
  bookingRef: string; name: string; date: string; time: string; guests: number; total: string
}) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F7F5;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#FFF;border-radius:8px;overflow:hidden;">
<div style="background:#1B1B1B;padding:32px 24px;text-align:center;">
<h1 style="margin:0;color:#FFF;font-size:22px;letter-spacing:2px;">SACHSENHAUSEN TOUR</h1>
<p style="margin:8px 0 0;color:#0F8B6E;font-size:14px;">Booking Confirmation</p></div>
<div style="padding:32px 24px;">
<p style="margin:0 0 16px;color:#1B1B1B;font-size:16px;">Hi ${b.name},</p>
<p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6;">Thank you for booking the Sachsenhausen Memorial Tour.</p>
<div style="background:#0F8B6E;border-radius:6px;padding:16px;margin-bottom:16px;text-align:center;">
<p style="margin:0 0 4px;color:rgba(255,255,255,0.8);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
<p style="margin:0;color:#FFF;font-size:20px;font-weight:bold;letter-spacing:2px;">${b.bookingRef}</p></div>
<div style="background:#F7F7F5;border-radius:6px;padding:20px;margin-bottom:24px;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#555;font-size:13px;">Date</td><td style="padding:8px 0;color:#1B1B1B;font-size:13px;font-weight:bold;text-align:right;">${b.date}</td></tr>
<tr><td style="padding:8px 0;color:#555;font-size:13px;">Time</td><td style="padding:8px 0;color:#1B1B1B;font-size:13px;font-weight:bold;text-align:right;">${b.time}</td></tr>
<tr><td style="padding:8px 0;color:#555;font-size:13px;">Guests</td><td style="padding:8px 0;color:#1B1B1B;font-size:13px;font-weight:bold;text-align:right;">${b.guests}</td></tr>
<tr style="border-top:1px solid #D9D9D4;"><td style="padding:12px 0 0;color:#555;font-size:14px;font-weight:bold;">Total paid</td><td style="padding:12px 0 0;color:#0F8B6E;font-size:18px;font-weight:bold;text-align:right;">${b.total}</td></tr>
</table></div>
<div style="background:#F7F7F5;border-left:3px solid #0F8B6E;padding:16px;border-radius:0 6px 6px 0;margin-bottom:24px;">
<p style="margin:0 0 4px;color:#1B1B1B;font-size:13px;font-weight:bold;">Meeting Point</p>
<p style="margin:0;color:#555;font-size:13px;line-height:1.5;">Generator Berlin Alexanderplatz<br>Otto-Braun-Stra&szlig;e 65, 10178 Berlin<br>Please arrive 5&ndash;10 minutes early.</p></div>
<p style="margin:0 0 8px;color:#555;font-size:13px;line-height:1.6;">Questions? Reply to this email or WhatsApp us at +49 157 83893416.</p>
<p style="margin:24px 0 0;color:#555;font-size:13px;">See you in Berlin!<br><strong>Sachsenhausen Tour Team</strong></p></div>
<div style="background:#F7F7F5;padding:16px 24px;text-align:center;border-top:1px solid #D9D9D4;">
<p style="margin:0;color:#999;font-size:11px;">Sachsenhausen Tour &mdash; A Be Original Tours Experience<br><a href="https://sachsenhausentour.de" style="color:#0F8B6E;text-decoration:none;">sachsenhausentour.de</a></p></div></div></body></html>`
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  await connectDB()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const meta = pi.metadata

      // Avoid duplicates — only create + email if confirm route didn't already handle it
      const exists = await Booking.findOne({ stripePaymentId: pi.id })
      if (!exists) {
        const bookingRef = generateBookingRef()
        const guests = parseInt(meta.guests || '1', 10)
        const email = meta.email || pi.receipt_email || ''

        await Booking.create({
          bookingRef,
          stripePaymentId: pi.id,
          customerName: meta.name || 'Unknown',
          customerEmail: email,
          customerPhone: meta.phone || undefined,
          tourDate: meta.date || '',
          tourTime: meta.time || '',
          guests,
          pricePerPerson: pi.amount / guests,
          totalPaid: pi.amount,
          currency: pi.currency,
          status: 'confirmed',
        })

        // Send confirmation emails as fallback
        if (email) {
          try {
            await sendBookingEmails({
              bookingRef,
              name: meta.name || 'Guest',
              email,
              phone: meta.phone || '',
              date: meta.date || '',
              time: meta.time || '',
              guests,
              totalCents: pi.amount,
              paymentId: pi.id,
            })
          } catch (emailErr) {
            console.error('Webhook email error (non-fatal):', emailErr)
          }
        }
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent as string
      if (paymentIntentId) {
        await Booking.findOneAndUpdate(
          { stripePaymentId: paymentIntentId },
          {
            status: charge.amount_refunded === charge.amount ? 'refunded' : 'confirmed',
            refundedAt: new Date(),
          }
        )
      }
      break
    }

    default:
      // Unhandled event type — ignore
      break
  }

  return NextResponse.json({ received: true })
}
