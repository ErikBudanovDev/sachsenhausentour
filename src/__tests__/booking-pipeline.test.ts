/**
 * Booking Pipeline Tests
 *
 * Tests the full flow: TourConfig → Checkout → Confirm/Save → Webhook → Admin API
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
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
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

// Mock TourConfig model
const DEFAULT_TOUR_CONFIG = {
  slug: 'sachsenhausen-tour',
  name: 'Sachsenhausen Memorial Tour',
  pricePerPerson: 5900,
  currency: 'eur',
  timeSlots: [
    { id: 'morning-10', time: '10:00 AM', label: 'Morning Tour' },
    { id: 'morning-1030', time: '10:30 AM', label: 'Late Morning Tour' },
  ],
  maxGuestsPerSlot: 20,
  blackoutDates: ['2026-12-25', '2027-01-01'],
  minAdvanceDays: 1,
  duration: '6 hours',
  meetingPoint: 'Generator Berlin Alexanderplatz',
  active: true,
}

const mockTourConfig = {
  findOne: vi.fn().mockReturnValue({
    lean: vi.fn().mockResolvedValue({ ...DEFAULT_TOUR_CONFIG }),
  }),
  findOneAndUpdate: vi.fn(),
}

vi.mock('@/models/TourConfig', () => ({
  TourConfig: mockTourConfig,
}))

// Mock Stripe
const mockPaymentIntentsCreate = vi.fn()
const mockPaymentIntentsRetrieve = vi.fn()
const mockRefundsCreate = vi.fn()
const mockWebhooksConstructEvent = vi.fn()

vi.mock('stripe', () => {
  const StripeMock = function () {
    return {
      paymentIntents: {
        create: mockPaymentIntentsCreate,
        retrieve: mockPaymentIntentsRetrieve,
      },
      refunds: { create: mockRefundsCreate },
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

// Mock NextAuth — importable so we can override per-test
const mockAuth = vi.fn().mockResolvedValue({
  user: { id: '1', email: 'admin@sachsenhausentour.de', role: 'admin' },
})

vi.mock('@/lib/auth', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}))

// ─── Helpers ─────────────────────────────────────────────────

function makeRequest(body: object, method = 'POST', url = 'http://localhost:3001/api/test') {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/** Reset TourConfig mock to return default config */
function resetTourConfigMock(overrides: Record<string, unknown> = {}) {
  mockTourConfig.findOne.mockReturnValue({
    lean: vi.fn().mockResolvedValue({ ...DEFAULT_TOUR_CONFIG, ...overrides }),
  })
}

/** Create a mock verified PaymentIntent for confirm tests */
function mockVerifiedPayment(overrides: Record<string, unknown> = {}) {
  const pi = {
    id: 'pi_test_123',
    status: 'succeeded',
    amount: 17700,
    currency: 'eur',
    metadata: {
      name: 'Erik Budanov',
      email: 'erik@test.com',
      phone: '+491234567',
      date: '2026-06-15',
      time: '10:00 AM',
      guests: '3',
    },
    ...overrides,
  }
  mockPaymentIntentsRetrieve.mockResolvedValue(pi)
  return pi
}

/** Reset Booking mocks including find chains */
function resetBookingFindMock() {
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
}

// ─── 1. Public Tour Config API ──────────────────────────────

describe('GET /api/tour-config', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTourConfigMock()
  })

  it('returns active tour configuration', async () => {
    const { GET } = await import('@/app/api/tour-config/route')
    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.pricePerPerson).toBe(5900)
    expect(data.timeSlots).toHaveLength(2)
    expect(data.blackoutDates).toContain('2026-12-25')
    expect(data.maxGuestsPerSlot).toBe(20)
    expect(data.minAdvanceDays).toBe(1)
    expect(data.meetingPoint).toBe('Generator Berlin Alexanderplatz')
  })

  it('returns updated config when admin changes price', async () => {
    resetTourConfigMock({ pricePerPerson: 3500 })

    const { GET } = await import('@/app/api/tour-config/route')
    const res = await GET()
    const data = await res.json()

    expect(data.pricePerPerson).toBe(3500)
  })

  it('returns updated config when admin adds time slots', async () => {
    resetTourConfigMock({
      timeSlots: [
        { id: 'morning-10', time: '10:00 AM', label: 'Morning Tour' },
        { id: 'afternoon-2', time: '2:00 PM', label: 'Afternoon Tour' },
        { id: 'evening-5', time: '5:00 PM', label: 'Evening Tour' },
      ],
    })

    const { GET } = await import('@/app/api/tour-config/route')
    const res = await GET()
    const data = await res.json()

    expect(data.timeSlots).toHaveLength(3)
    expect(data.timeSlots[2].time).toBe('5:00 PM')
  })

  it('returns updated config when admin changes blackout dates', async () => {
    resetTourConfigMock({
      blackoutDates: ['2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01'],
    })

    const { GET } = await import('@/app/api/tour-config/route')
    const res = await GET()
    const data = await res.json()

    expect(data.blackoutDates).toHaveLength(4)
    expect(data.blackoutDates).toContain('2026-12-24')
  })

  it('returns fallback when no active config exists', async () => {
    mockTourConfig.findOne.mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    })

    const { GET } = await import('@/app/api/tour-config/route')
    const res = await GET()
    const data = await res.json()

    // Should return fallback defaults
    expect(res.status).toBe(200)
    expect(data.pricePerPerson).toBeDefined()
    expect(data.timeSlots.length).toBeGreaterThan(0)
  })
})

// ─── 2. Checkout API (uses DB price + validates config) ──────

describe('POST /api/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTourConfigMock()
    mockBooking.aggregate.mockResolvedValue([]) // No existing bookings
  })

  it('creates PaymentIntent using price from TourConfig', async () => {
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
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.clientSecret).toBe('pi_test_secret_abc')
    // Price is 5900 (from TourConfig) × 2 guests = 11800
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 11800,
        currency: 'eur',
      })
    )
  })

  it('uses updated price when admin changes it', async () => {
    resetTourConfigMock({ pricePerPerson: 3500 })
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'pi_secret' })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 3,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    // 3500 × 3 = 10500
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 10500 })
    )
  })

  it('rejects request with missing required fields', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({ guests: 1 })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rejects booking on a blackout date', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 2,
      date: '2026-12-25', // Christmas — blackout
      time: '10:00 AM',
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toMatch(/not available/i)
  })

  it('rejects booking with invalid time slot', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-06-15',
      time: '3:00 PM', // Not in config
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toMatch(/invalid time slot/i)
  })

  it('rejects booking exceeding max guests per slot', async () => {
    resetTourConfigMock({ maxGuestsPerSlot: 5 })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 6,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toMatch(/guest count/i)
  })

  it('rejects booking when slot capacity is full', async () => {
    resetTourConfigMock({ maxGuestsPerSlot: 10 })
    // 8 guests already booked for this slot
    mockBooking.aggregate.mockResolvedValue([{ total: 8 }])

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 3, // Would exceed capacity (8 + 3 > 10)
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toMatch(/spot|remaining|fully booked/i)
  })

  it('allows booking when slot has remaining capacity', async () => {
    resetTourConfigMock({ maxGuestsPerSlot: 10 })
    mockBooking.aggregate.mockResolvedValue([{ total: 7 }])
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'pi_ok' })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 3, // 7 + 3 = 10, exactly at capacity
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
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

  it('returns 404 when no active tour config exists', async () => {
    mockTourConfig.findOne.mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-07-01',
      time: '10:00 AM',
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(404)
  })
})

// ─── 3. Confirm API (Stripe-verified booking save + emails) ──

describe('POST /api/checkout/confirm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBooking.findOneAndUpdate.mockResolvedValue({
      _id: 'booking-1',
      stripePaymentId: 'pi_test_123',
    })
    mockVerifiedPayment()
  })

  it('verifies payment with Stripe before saving', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_test_123' })

    const res = await POST(req)
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(mockPaymentIntentsRetrieve).toHaveBeenCalledWith('pi_test_123')
  })

  it('saves booking using Stripe-verified data, not client data', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({
      paymentId: 'pi_test_123',
      // Client sends different values — these should be ignored
      name: 'FAKE NAME',
      email: 'fake@evil.com',
      guests: 999,
      total: '€0.01',
    })

    const res = await POST(req)
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(mockBooking.findOneAndUpdate).toHaveBeenCalledWith(
      { stripePaymentId: 'pi_test_123' },
      expect.objectContaining({
        $setOnInsert: expect.objectContaining({
          customerName: 'Erik Budanov', // From Stripe metadata, not client
          customerEmail: 'erik@test.com',
          guests: 3,
          totalPaid: 17700, // From pi.amount, not client
          status: 'confirmed',
        }),
      }),
      { upsert: true, new: true }
    )
  })

  it('rejects when payment has not succeeded', async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({
      id: 'pi_pending',
      status: 'requires_payment_method',
      amount: 5900,
      currency: 'eur',
      metadata: {},
    })

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_pending' })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/not verified/i)
  })

  it('rejects invalid payment ID', async () => {
    mockPaymentIntentsRetrieve.mockRejectedValue(new Error('No such payment_intent'))

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_nonexistent' })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/invalid payment/i)
  })

  it('rejects request without paymentId', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ name: 'No Payment' })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/missing payment/i)
  })

  it('sends customer confirmation email with verified data', async () => {
    mockVerifiedPayment({
      metadata: {
        name: 'Test User',
        email: 'test@example.com',
        date: '2026-06-15',
        time: '10:00 AM',
        guests: '1',
      },
    })

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_test_123' })

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
    const req = makeRequest({ paymentId: 'pi_test_123' })

    await POST(req)

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'service@beoriginaltours.com',
        subject: expect.stringContaining('New Booking'),
      })
    )
  })

  it('still returns success if DB save fails', async () => {
    mockBooking.findOneAndUpdate.mockRejectedValue(new Error('DB down'))

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_test_123' })

    const res = await POST(req)
    const data = await res.json()
    expect(data.success).toBeDefined()
  })

  it('is idempotent — uses upsert to avoid duplicates', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')

    await POST(makeRequest({ paymentId: 'pi_test_123' }))
    await POST(makeRequest({ paymentId: 'pi_test_123' }))

    const calls = mockBooking.findOneAndUpdate.mock.calls
    expect(calls.every((c: unknown[]) => (c[2] as { upsert: boolean }).upsert === true)).toBe(true)
  })

  it('uses pi.amount and pi.currency instead of client total', async () => {
    mockVerifiedPayment({ amount: 23600, currency: 'usd' })

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_test_123', total: '€0.01' })

    await POST(req)

    expect(mockBooking.findOneAndUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        $setOnInsert: expect.objectContaining({
          totalPaid: 23600,
          currency: 'usd',
        }),
      }),
      expect.anything()
    )
  })
})

// ─── 4. Webhook (Stripe event handling) ──────────────────────

describe('POST /api/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('creates a booking on payment_intent.succeeded', async () => {
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_webhook_test',
          amount: 11800,
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
    mockBooking.findOne.mockResolvedValue(null)

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
        totalPaid: 11800,
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
          amount: 5900,
          currency: 'eur',
          metadata: { name: 'Dup', email: 'dup@test.com', guests: '1', date: '2026-07-01', time: '10:00 AM' },
        },
      },
    })
    mockBooking.findOne.mockResolvedValue({ _id: 'exists' })

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
          amount: 11800,
          amount_refunded: 11800,
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
      expect.objectContaining({ status: 'refunded' })
    )
  })

  it('keeps confirmed status on partial refund', async () => {
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'charge.refunded',
      data: {
        object: {
          payment_intent: 'pi_partial',
          amount: 11800,
          amount_refunded: 5900,
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
      expect.objectContaining({ status: 'confirmed' })
    )
  })
})

// ─── 5. Admin Bookings API ──────────────────────────────────

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

// ─── 6. Admin Stats API ─────────────────────────────────────

describe('GET /api/admin/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBooking.countDocuments.mockResolvedValue(0)
    mockBooking.aggregate.mockResolvedValue([{ total: 0 }])
    resetBookingFindMock()
  })

  it('returns dashboard statistics', async () => {
    const { GET } = await import('@/app/api/admin/stats/route')
    const req = new Request('http://localhost:3001/api/admin/stats')

    const res = await GET()
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toHaveProperty('stats')
    expect(data.stats).toHaveProperty('todayBookings')
    expect(data.stats).toHaveProperty('confirmedBookings')
    expect(data.stats).toHaveProperty('totalRevenue')
    expect(data).toHaveProperty('recentBookings')
  })
})

// ─── 7. Admin Config → Frontend → Payment integration ───────

describe('Admin config changes propagate to booking flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBooking.aggregate.mockResolvedValue([]) // No existing bookings
  })

  it('price change in admin reflects in checkout amount', async () => {
    // Admin sets price to €35
    resetTourConfigMock({ pricePerPerson: 3500 })
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'pi_35' })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 4,
      date: '2026-08-01',
      time: '10:00 AM',
      name: 'Price Test',
      email: 'price@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 14000 }) // 3500 × 4
    )
  })

  it('new blackout date in admin blocks checkout', async () => {
    // Admin adds July 4th as blackout
    resetTourConfigMock({
      blackoutDates: ['2026-12-25', '2027-01-01', '2026-07-04'],
    })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-07-04',
      time: '10:00 AM',
      name: 'Blocked',
      email: 'blocked@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/not available/i)
  })

  it('removed time slot in admin blocks checkout', async () => {
    // Admin removes the 10:30 AM slot, keeps only 10:00 AM
    resetTourConfigMock({
      timeSlots: [{ id: 'morning-10', time: '10:00 AM', label: 'Morning Tour' }],
    })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-06-15',
      time: '10:30 AM', // No longer valid
      name: 'Slot Test',
      email: 'slot@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/invalid time slot/i)
  })

  it('new time slot added in admin is accepted at checkout', async () => {
    resetTourConfigMock({
      timeSlots: [
        { id: 'morning-10', time: '10:00 AM', label: 'Morning Tour' },
        { id: 'afternoon-2', time: '2:00 PM', label: 'Afternoon Tour' },
      ],
    })
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'pi_new_slot' })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 2,
      date: '2026-06-15',
      time: '2:00 PM', // New slot
      name: 'New Slot',
      email: 'newslot@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('max guests change in admin enforces new limit', async () => {
    // Admin reduces max guests from 20 to 8
    resetTourConfigMock({ maxGuestsPerSlot: 8 })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 9,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Over Limit',
      email: 'over@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/guest count/i)
  })

  it('config and checkout use same currency', async () => {
    resetTourConfigMock({ currency: 'usd', pricePerPerson: 3200 })
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'pi_usd' })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'USD Test',
      email: 'usd@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ currency: 'usd', amount: 3200 })
    )
  })

  it('public API and checkout read from same config source', async () => {
    // Set a specific price
    resetTourConfigMock({ pricePerPerson: 4200 })
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'pi_sync' })

    // Check public API
    const tourConfigRoute = await import('@/app/api/tour-config/route')
    const configRes = await tourConfigRoute.GET()
    const configData = await configRes.json()

    // Check checkout uses same price
    const checkoutRoute = await import('@/app/api/checkout/route')
    const checkoutReq = makeRequest({
      guests: 1,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Sync Test',
      email: 'sync@test.com',
    })
    await checkoutRoute.POST(checkoutReq)

    // Both should use 4200
    expect(configData.pricePerPerson).toBe(4200)
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 4200 })
    )
  })
})

// ─── 8. Booking mutation role checks & status validation ─────

describe('PATCH /api/admin/bookings/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({
      user: { id: '1', email: 'admin@sachsenhausentour.de', role: 'admin' },
    })
    mockBooking.findOneAndUpdate.mockResolvedValue({ _id: 'b1', status: 'confirmed' })
    mockBooking.findByIdAndUpdate.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'b1', status: 'confirmed', notes: 'VIP guest' }),
    })
  })

  it('allows admin to update booking notes', async () => {
    mockBooking.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'b1', status: 'confirmed' }),
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ notes: 'VIP guest' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.booking).toBeDefined()
  })

  it('rejects non-admin users with 403', async () => {
    mockAuth.mockResolvedValue({
      user: { id: '2', email: 'staff@test.com', role: 'staff' },
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ notes: 'Should fail' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toMatch(/admin/i)
  })

  it('rejects unauthenticated users with 401', async () => {
    mockAuth.mockResolvedValue(null)

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ notes: 'No auth' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(401)
  })

  it('rejects invalid status values', async () => {
    mockBooking.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'b1', status: 'confirmed' }),
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ status: 'fake_status' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/invalid status/i)
  })

  it('rejects invalid status transition (confirmed → refunded)', async () => {
    mockBooking.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'b1', status: 'confirmed' }),
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ status: 'refunded' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/cannot transition/i)
  })

  it('allows valid status transition (confirmed → cancelled)', async () => {
    mockBooking.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'b1', status: 'confirmed' }),
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ status: 'cancelled' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(200)
  })

  it('admin can cancel and trigger Stripe refund', async () => {
    mockBooking.findById.mockResolvedValue({
      _id: 'b1',
      stripePaymentId: 'pi_to_refund',
      status: 'confirmed',
    })
    mockRefundsCreate.mockResolvedValue({ id: 'refund_1' })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ action: 'cancel' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(200)
    expect(mockRefundsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ payment_intent: 'pi_to_refund' })
    )
  })
})

// ─── 9. Date format consistency ────────────────────────────────

describe('Date format consistency', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTourConfigMock()
    mockBooking.aggregate.mockResolvedValue([])
  })

  it('checkout accepts ISO dates matching blackout format', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-12-25', // ISO format — matches blackout
      time: '10:00 AM',
      name: 'ISO Test',
      email: 'iso@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400) // Should be blocked
    const data = await res.json()
    expect(data.error).toMatch(/not available/i)
  })

  it('checkout blocks ISO blackout dates correctly', async () => {
    resetTourConfigMock({
      blackoutDates: ['2026-07-04'],
    })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-07-04',
      time: '10:00 AM',
      name: 'July 4th',
      email: 'test@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('checkout allows non-blackout ISO dates', async () => {
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'pi_ok' })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 1,
      date: '2026-07-05', // Not a blackout
      time: '10:00 AM',
      name: 'Open Day',
      email: 'test@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
  })
})

// ─── 10. Security: confirm endpoint cannot be abused ──────────

describe('Confirm endpoint security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBooking.findOneAndUpdate.mockResolvedValue({ _id: 'b1' })
  })

  it('cannot create fake bookings without valid payment', async () => {
    mockPaymentIntentsRetrieve.mockRejectedValue(new Error('No such payment_intent'))

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({
      paymentId: 'pi_fake_12345',
      name: 'Hacker',
      email: 'hacker@evil.com',
      date: '2026-06-15',
      time: '10:00 AM',
      guests: 10,
      total: '€0.01',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(mockBooking.findOneAndUpdate).not.toHaveBeenCalled()
    expect(mockSendMail).not.toHaveBeenCalled()
  })

  it('cannot send spam emails without verified payment', async () => {
    mockPaymentIntentsRetrieve.mockResolvedValue({
      id: 'pi_processing',
      status: 'processing',
      amount: 100,
      currency: 'eur',
      metadata: {},
    })

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({
      paymentId: 'pi_processing',
      email: 'victim@example.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(mockSendMail).not.toHaveBeenCalled()
  })

  it('uses Stripe amount, ignoring client-supplied total', async () => {
    mockVerifiedPayment({ amount: 11800 })

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({
      paymentId: 'pi_test_123',
      total: '€0.01', // Attacker tries to record low amount
    })

    await POST(req)

    expect(mockBooking.findOneAndUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        $setOnInsert: expect.objectContaining({
          totalPaid: 11800, // From Stripe, not from client
        }),
      }),
      expect.anything()
    )
  })
})

// ─── 11. GET /api/admin/bookings/[id] — single booking ─────────

describe('GET /api/admin/bookings/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin' },
    })
  })

  it('returns a single booking by ID', async () => {
    mockBooking.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: 'b1',
        customerName: 'Jane',
        status: 'confirmed',
      }),
    })

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({})
    const res = await GET(req, { params: Promise.resolve({ id: 'b1' }) })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.booking.customerName).toBe('Jane')
  })

  it('returns 404 for non-existent booking', async () => {
    mockBooking.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    })

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({})
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
  })

  it('rejects unauthenticated requests', async () => {
    mockAuth.mockResolvedValue(null)

    const { GET } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({})
    const res = await GET(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(401)
  })
})

// ─── 12. Checkout input validation edge cases ──────────────────

describe('Checkout input validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTourConfigMock()
    mockBooking.aggregate.mockResolvedValue([])
  })

  it('rejects zero guests', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 0,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rejects negative guest count', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: -3,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rejects empty email', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 2,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Test',
      email: '',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rejects empty name', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 2,
      date: '2026-06-15',
      time: '10:00 AM',
      name: '',
      email: 'test@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rejects missing date field', async () => {
    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 2,
      time: '10:00 AM',
      name: 'Test',
      email: 'test@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('calculates correct amount for multiple guests', async () => {
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'pi_multi' })

    const { POST } = await import('@/app/api/checkout/route')
    const req = makeRequest({
      guests: 4,
      date: '2026-06-15',
      time: '10:00 AM',
      name: 'Group',
      email: 'group@test.com',
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 5900 * 4 }) // 4 guests × €59
    )
  })
})

// ─── 13. Confirm email content ─────────────────────────────────

describe('Confirm endpoint email content', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBooking.findOneAndUpdate.mockResolvedValue({ _id: 'b1' })
  })

  it('HTML-escapes customer name in email to prevent XSS', async () => {
    mockVerifiedPayment({
      metadata: {
        name: '<script>alert("xss")</script>',
        email: 'safe@test.com',
        date: '2026-06-15',
        time: '10:00 AM',
        guests: '1',
      },
    })

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_test_xss' })
    await POST(req)

    // Customer email should have escaped HTML
    const customerCall = mockSendMail.mock.calls[0]?.[0]
    expect(customerCall?.html).not.toContain('<script>')
    expect(customerCall?.html).toContain('&lt;script&gt;')
  })

  it('sends email to the correct customer address', async () => {
    mockVerifiedPayment({
      metadata: {
        name: 'Alice',
        email: 'alice@example.com',
        date: '2026-06-15',
        time: '10:00 AM',
        guests: '2',
      },
    })

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_test_email' })
    await POST(req)

    const customerCall = mockSendMail.mock.calls[0]?.[0]
    expect(customerCall?.to).toBe('alice@example.com')
  })

  it('formats total correctly in emails', async () => {
    mockVerifiedPayment({ amount: 5800 })

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_test_fmt' })
    await POST(req)

    const customerCall = mockSendMail.mock.calls[0]?.[0]
    expect(customerCall?.html).toContain('€58.00')
  })

  it('sends internal notification to service email', async () => {
    mockVerifiedPayment()

    const { POST } = await import('@/app/api/checkout/confirm/route')
    const req = makeRequest({ paymentId: 'pi_test_internal' })
    await POST(req)

    const internalCall = mockSendMail.mock.calls[1]?.[0]
    expect(internalCall?.to).toBe('service@beoriginaltours.com')
  })
})

// ─── 14. PATCH booking edge cases ──────────────────────────────

describe('PATCH booking edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin' },
    })
    mockBooking.findByIdAndUpdate.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'b1', status: 'confirmed' }),
    })
  })

  it('only allows whitelisted fields in update', async () => {
    mockBooking.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'b1', status: 'confirmed' }),
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({
      notes: 'ok',
      totalPaid: 0,         // should be ignored
      customerEmail: 'hack', // should be ignored
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(200)
    const updateArg = mockBooking.findByIdAndUpdate.mock.calls[0]?.[1]
    expect(updateArg).toHaveProperty('notes', 'ok')
    expect(updateArg).not.toHaveProperty('totalPaid')
    expect(updateArg).not.toHaveProperty('customerEmail')
  })

  it('prevents transition from refunded to any state', async () => {
    mockBooking.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'b1', status: 'refunded' }),
    })

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ status: 'confirmed' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/cannot transition/i)
  })

  it('returns 404 when cancelling non-existent booking', async () => {
    mockBooking.findById.mockResolvedValue(null)

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ action: 'cancel' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
  })

  it('returns 500 when Stripe refund fails', async () => {
    mockBooking.findById.mockResolvedValue({
      _id: 'b1',
      stripePaymentId: 'pi_fail',
      status: 'confirmed',
    })
    mockRefundsCreate.mockRejectedValue(new Error('Card declined'))

    const { PATCH } = await import('@/app/api/admin/bookings/[id]/route')
    const req = makeRequest({ action: 'cancel' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) })

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toMatch(/refund/i)
  })
})
