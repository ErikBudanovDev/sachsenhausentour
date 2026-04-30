import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function buildCustomerEmail(booking: {
  name: string
  date: string
  time: string
  guests: number
  total: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F7F5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#FFFFFF;border-radius:8px;overflow:hidden;">
    <!-- Header -->
    <div style="background:#1B1B1B;padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#FFFFFF;font-size:22px;letter-spacing:2px;">SACHSENHAUSEN TOUR</h1>
      <p style="margin:8px 0 0;color:#0F8B6E;font-size:14px;">Booking Confirmation</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 24px;">
      <p style="margin:0 0 16px;color:#1B1B1B;font-size:16px;">Hi ${booking.name},</p>
      <p style="margin:0 0 24px;color:#555555;font-size:14px;line-height:1.6;">
        Thank you for booking the Sachsenhausen Memorial Tour. Here are your booking details:
      </p>

      <!-- Details card -->
      <div style="background:#F7F7F5;border-radius:6px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#555555;font-size:13px;">Tour</td>
            <td style="padding:8px 0;color:#1B1B1B;font-size:13px;font-weight:bold;text-align:right;">Sachsenhausen Memorial Tour</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#555555;font-size:13px;">Date</td>
            <td style="padding:8px 0;color:#1B1B1B;font-size:13px;font-weight:bold;text-align:right;">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#555555;font-size:13px;">Time</td>
            <td style="padding:8px 0;color:#1B1B1B;font-size:13px;font-weight:bold;text-align:right;">${booking.time}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#555555;font-size:13px;">Guests</td>
            <td style="padding:8px 0;color:#1B1B1B;font-size:13px;font-weight:bold;text-align:right;">${booking.guests}</td>
          </tr>
          <tr style="border-top:1px solid #D9D9D4;">
            <td style="padding:12px 0 0;color:#555555;font-size:14px;font-weight:bold;">Total paid</td>
            <td style="padding:12px 0 0;color:#0F8B6E;font-size:18px;font-weight:bold;text-align:right;">${booking.total}</td>
          </tr>
        </table>
      </div>

      <!-- Meeting point -->
      <div style="background:#F7F7F5;border-left:3px solid #0F8B6E;padding:16px;border-radius:0 6px 6px 0;margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#1B1B1B;font-size:13px;font-weight:bold;">Meeting Point</p>
        <p style="margin:0;color:#555555;font-size:13px;line-height:1.5;">
          Generator Berlin Alexanderplatz<br>
          Otto-Braun-Stra&szlig;e 65, 10178 Berlin<br>
          Please arrive 5&ndash;10 minutes before the tour start time.
        </p>
      </div>

      <p style="margin:0 0 8px;color:#555555;font-size:13px;line-height:1.6;">
        If you have any questions, reply to this email or reach us on WhatsApp at +49 157 83893416.
      </p>
      <p style="margin:24px 0 0;color:#555555;font-size:13px;">
        See you in Berlin!<br>
        <strong>Sachsenhausen Tour Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#F7F7F5;padding:16px 24px;text-align:center;border-top:1px solid #D9D9D4;">
      <p style="margin:0;color:#999999;font-size:11px;">
        Sachsenhausen Tour &mdash; A Be Original Tours Experience<br>
        <a href="https://sachsenhausentour.de" style="color:#0F8B6E;text-decoration:none;">sachsenhausentour.de</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

function buildInternalEmail(booking: {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  total: string
  paymentId: string
}) {
  return `New booking received!

Tour: Sachsenhausen Memorial Tour
Date: ${booking.date}
Time: ${booking.time}
Guests: ${booking.guests}
Total: ${booking.total}

Customer: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone || 'Not provided'}

Stripe Payment: ${booking.paymentId}
`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, date, time, guests, total, paymentId } = body

    if (!name || !email || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send customer confirmation
    await transporter.sendMail({
      from: `"Sachsenhausen Tour" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Booking Confirmed — Sachsenhausen Tour on ${date}`,
      html: buildCustomerEmail({ name, date, time, guests, total }),
    })

    // Send internal notification
    await transporter.sendMail({
      from: `"Booking System" <${process.env.SMTP_USER}>`,
      to: 'service@beoriginaltours.com',
      subject: `New Booking: ${name} — ${guests} guests on ${date}`,
      text: buildInternalEmail({ name, email, phone, date, time, guests, total, paymentId }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    // Don't fail the booking if email fails — payment already went through
    return NextResponse.json({ success: false, error: 'Email sending failed' })
  }
}
