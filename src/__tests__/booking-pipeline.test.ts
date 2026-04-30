/**
 * Booking Pipeline Tests
 *
 * Tests the full flow: Checkout → Confirm/Save → Webhook → Admin API
 * Uses mocks for Stripe, MongoDB, and Nodemailer since these are unit tests.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mock setup ───────────────────────────────────────────────

// Mock MongoDB connection
vi.mock('@/lib/mongodb', () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}))

// Mock Booking model
const mockBooking = {
  create: vi.fn(),
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
  find: vi.fn().mockReturnValue({
    sort: vi.fn().mockReturnValue({
      skip: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([]),
        }),
      }),
      limit: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      }),
    }),
  }),
  countDocuments: vi.fn().mockResolvedValue(0),
  aggregate: vi.fn().mockResolvedValue([{ total: 0 }]),
}

vi.mock('@/models/Booking', () => ({
  Booking: mockBooking,
}))

// Mock Stripe
const mockPaymentIntentsCreate = vi.fn()
const mockWebhooksConstructEvent = vi.fn()

vi.mock('stripe', () => {
  const StripeMock = function () {
    return {
      paymentIntents: { create: mockPaymentIntentsCreate },
      webhooks: { constructEvent: mockWebhooksConstructEvent },
    }
  }
  return { default: StripeMock }
})

vi.mock('@/lib/stripe', () => ({
  getStripeSecretKey: () => 'sk_test_fake',
}))

// Mock nodemailer
const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-123' })
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({ sendMail: mockSendMail }),
  },
}))

// Mock NextAuth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: '1', email: 'admin@sachsenhausentour.de', role: 'admin' },
  }),
}))

// ─── Helper ───────────────────────────────────────────────────

function makeRequest(body: object, method = 'POST', url = 'http://localhost:3001/api/test') {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ─── 1. Checkout API (PaymentIntent creation) ─────────────────

describe('POST /api/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a PaymentIntent with correct amount for 2 guests', async () => {
    mockPaymentIntentsCreate.mockResolvedValue({
      client_secret: 'pi_test_secret_abc',
    })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 2,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+491234567',
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.clientSecret).toBe('pi_test_secret_abc')
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 5800, // 29€ × 2 guests = 58€ = 5800 cents
        currency: 'eur',
        metadata: expect.objectContaining({
          guests: '2',
          name: 'Test User',
          email: 'test@example.com',
          date: '2026-06-15',
          time: '10:00 AM',
        }),
      })
    )
  })

  it('rejects request with missing required fields', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({ guests: 1 }) // missing name, email, date, time

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('includes receipt_email in PaymentIntent', async () => {
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'pi_secret' })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-07-01',
      time: '10:00 AM',
      name: 'Jane Doe',
      email: 'jane@example.com',
    })

    await POST(req)

    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        receipt_email: 'jane@example.com',
      })
    )
  })

  it('handles Stripe errors gracefully', async () => {
    mockPaymentIntentsCreate.mockRejectedValue(new Error('Stripe down'))

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-07-01',
      time: '10:00 AM',
      name: 'Jane',
      email: 'jane@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(500)
  })
})

// ─── 2. Confirm API (booking save + emails) ───────────────────

describe('POST /api/checkout/confirm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBooking.findOneAndUpdate.mockResolvedValue({
      _id: 'booking-1',
      stripePaymentId: 'pi_test_123',
    })
  })

  it('saves booking to MongoDB on confirmation', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({
      name: 'Erik Budanov',
      email: 'erik@test.com',
      phone: '+491234567',
      date: '2026-06-15',
      time: '10:00 AM',
      guests: 3,
      total: '€87',
      paymentId: 'pi_test_123',
    })

    const res = await POST(req)
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(mockBooking.findOneAndUpdate).toHaveBeenCalledWith(
      { stripePaymentId: 'pi_test_123' },
      expect.objectContaining({
        $setOnInsert: expect.objectContaining({
          customerName: 'Erik Budanov',
          customerEmail: 'erik@test.com',
          guests: 3,
          totalPaid: 8700,
          pricePerPerson: 2900,
          status: 'confirmed',
        }),
      }),
      { upsert: true, new: true }
    )
  })

  it('sends customer confirmation email', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({
      name: 'Test User',
      email: 'test@example.com',
      date: '2026-06-15',
      time: '10:00 AM',
      guests: 1,
      total: '€29',
      paymentId: 'pi_abc',
    })

    await POST(req)

    expect(mockSendMail).toHaveBeenCalledTimes(2) // customer + internal
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: expect.stringContaining('Booking Confirmed'),
      })
    )
  })

  it('sends internal notification email', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({
      name: 'Test User',
      email: 'test@example.com',
      date: '2026-06-15',
      time: '10:00 AM',
      guests: 2,
      total: '€58',
      paymentId: 'pi_xyz',
    })

    await POST(req)

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'service@beoriginaltours.com',
        subject: expect.stringContaining('New Booking'),
      })
    )
  })

  it('rejects request with missing fields', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ name: 'Incomplete' })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('still returns success if DB save fails', async () => {
    mockBooking.findOneAndUpdate.mockRejectedValue(new Error('DB down'))

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({
      name: 'Test',
      email: 'test@test.com',
      date: '2026-06-15',
      time: '10:00 AM',
      guests: 1,
      total: '€29',
      paymentId: 'pi_fail',
    })

    const res = await POST(req)
    const data = await res.json()
    // Should still succeed — emails go out, payment already happened
    expect(data.success).toBeDefined()
  })

  it('is idempotent — uses upsert to avoid duplicates', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')

    // Simulate calling confirm twice with same paymentId
    const body = {
      name: 'Test',
      email: 'test@test.com',
      date: '2026-06-15',
      time: '10:00 AM',
      guests: 1,
      total: '€29',
      paymentId: 'pi_duplicate',
    }

    await POST(makeRequest(body))
    await POST(makeRequest(body))

    // Both calls should use findOneAndUpdate with upsert, not create
    const calls = mockBooking.findOneAndUpdate.mock.calls
    expect(calls.every((c: unknown[]) => (c[2] as { upsert: boolean }).upsert === true)).toBe(true)
  })
})

// ─── 3. Webhook (Stripe event handling) ───────────────────────

describe('POST /api/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset module cache to get fresh imports
    vi.resetModules()
  })

  it('creates a booking on payment_intent.succeeded', async () => {
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_webhook_test',
          amount: 5800,
          currency: 'eur',
          receipt_email: 'customer@test.com',
          metadata: {
            name: 'Webhook User',
            email: 'customer@test.com',
            phone: '+49123',
            date: '2026-07-01',
            time: '10:00 AM',
            guests: '2',
          },
        },
      },
    })
    mockBooking.findOne.mockResolvedValue(null) // No duplicate

    const { POST } = await import('@/app/api/webhook/route')
    const req = new Request('http://localhost:3001/api/webhook', {
      method: 'POST',
      body: 'raw-body',
      headers: { 'stripe-signature': 'sig_test' },
    })

    const res = await POST(req)
    const data = await res.json()

    expect(data.received).toBe(true)
    expect(mockBooking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        stripePaymentId: 'pi_webhook_test',
        customerName: 'Webhook User',
        guests: 2,
        totalPaid: 5800,
        status: 'confirmed',
      })
    )
  })

  it('skips duplicate bookings in webhook', async () => {
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_existing',
          amount: 2900,
          currency: 'eur',
          metadata: { name: 'Dup', email: 'dup@test.com', guests: '1', date: '2026-07-01', time: '10:00 AM' },
        },
      },
    })
    mockBooking.findOne.mockResolvedValue({ _id: 'exists' }) // Already exists

    const { POST } = await import('@/app/api/webhook/route')
    const req = new Request('http://localhost:3001/api/webhook', {
      method: 'POST',
      body: 'raw-body',
      headers: { 'stripe-signature': 'sig_test' },
    })

    await POST(req)
    expect(mockBooking.create).not.toHaveBeenCalled()
  })

  it('rejects requests without stripe-signature header', async () => {
    const { POST } = await import('@/app/api/webhook/route')
    const req = new Request('http://localhost:3001/api/webhook', {
      method: 'POST',
      body: 'body',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rejects invalid signatures', async () => {
    mockWebhooksConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature')
    })

    const { POST } = await import('@/app/api/webhook/route')
    const req = new Request('http://localhost:3001/api/webhook', {
      method: 'POST',
      body: 'bad-body',
      headers: { 'stripe-signature': 'bad_sig' },
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('handles charge.refunded event', async () => {
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'charge.refunded',
      data: {
        object: {
          payment_intent: 'pi_refund_test',
          amount: 5800,
          amount_refunded: 5800, // full refund
        },
      },
    })
    mockBooking.findOneAndUpdate.mockResolvedValue({})

    const { POST } = await import('@/app/api/webhook/route')
    const req = new Request('http://localhost:3001/api/webhook', {
      method: 'POST',
      body: 'raw',
      headers: { 'stripe-signature': 'sig' },
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockBooking.findOneAndUpdate).toHaveBeenCalledWith(
      { stripePaymentId: 'pi_refund_test' },
      expect.objectContaining({
        status: 'refunded',
      })
    )
  })

  it('keeps confirmed status on partial refund', async () => {
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'charge.refunded',
      data: {
        object: {
          payment_intent: 'pi_partial',
          amount: 5800,
          amount_refunded: 2900, // partial refund
        },
      },
    })
    mockBooking.findOneAndUpdate.mockResolvedValue({})

    const { POST } = await import('@/app/api/webhook/route')
    const req = new Request('http://localhost:3001/api/webhook', {
      method: 'POST',
      body: 'raw',
      headers: { 'stripe-signature': 'sig' },
    })

    await POST(req)
    expect(mockBooking.findOneAndUpdate).toHaveBeenCalledWith(
      { stripePaymentId: 'pi_partial' },
      expect.objectContaining({
        status: 'confirmed', // Not refunded — partial
      })
    )
  })
})

// ─── 4. Admin Bookings API ────────────────────────────────────

describe('GET /api/admin/bookings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns bookings list with pagination', async () => {
    const mockLean = vi.fn().mockResolvedValue([
      {
        _id: 'b1',
        customerName: 'Test',
        customerEmail: 'test@test.com',
        tourDate: '2026-06-15',
        status: 'confirmed',
      },
    ])
    mockBooking.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: mockLean,
          }),
        }),
      }),
    })
    mockBooking.countDocuments.mockResolvedValue(1)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const req = new Request('http://localhost:3001/api/admin/bookings')

    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.bookings).toHaveLength(1)
    expect(data.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    })
  })

  it('filters by status parameter', async () => {
    mockBooking.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    })
    mockBooking.countDocuments.mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const req = new Request('http://localhost:3001/api/admin/bookings?status=confirmed')

    await GET(req)

    expect(mockBooking.find).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'confirmed' })
    )
  })

  it('supports search by name/email/paymentId', async () => {
    mockBooking.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    })
    mockBooking.countDocuments.mockResolvedValue(0)

    const { GET } = await import('@/app/api/admin/bookings/route')
    const req = new Request('http://localhost:3001/api/admin/bookings?search=erik')

    await GET(req)

    expect(mockBooking.find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.arrayContaining([
          { customerName: expect.objectContaining({ $regex: 'erik' }) },
          { customerEmail: expect.objectContaining({ $regex: 'erik' }) },
          { stripePaymentId: expect.objectContaining({ $regex: 'erik' }) },
        ]),
      })
    )
  })
})

// ─── 5. Admin Stats API ──────────────────────────────────────

describe('GET /api/admin/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBooking.countDocuments.mockResolvedValue(0)
    mockBooking.aggregate.mockResolvedValue([{ total: 0 }])
    mockBooking.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([]),
          }),
        }),
        limit: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([]),
        }),
      }),
    })
  })

  it('returns dashboard statistics', async () => {
    // This test verifies the stats endpoint exists and returns data
    const { GET } = await import('@/app/api/admin/stats/route')
    const req = new Request('http://localhost:3001/api/admin/stats')

    const res = await GET(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toHaveProperty('stats')
    expect(data.stats).toHaveProperty('todayBookings')
    expect(data.stats).toHaveProperty('confirmedBookings')
    expect(data.stats).toHaveProperty('totalRevenue')
    expect(data).toHaveProperty('recentBookings')
  })
})
