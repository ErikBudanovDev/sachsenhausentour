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

// ─── 3. Confirm API (booking save + emails) ──────────────────

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
      total: '€177',
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
          totalPaid: 17700,
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
      total: '€59',
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
      total: '€118',
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
      total: '€59',
      paymentId: 'pi_fail',
    })

    const res = await POST(req)
    const data = await res.json()
    expect(data.success).toBeDefined()
  })

  it('is idempotent — uses upsert to avoid duplicates', async () => {
    const { POST } = await import('@/app/api/checkout/confirm/route')

    const body = {
      name: 'Test',
      email: 'test@test.com',
      date: '2026-06-15',
      time: '10:00 AM',
      guests: 1,
      total: '€59',
      paymentId: 'pi_duplicate',
    }

    await POST(makeRequest(body))
    await POST(makeRequest(body))

    const calls = mockBooking.findOneAndUpdate.mock.calls
    expect(calls.every((c: unknown[]) => (c[2] as { upsert: boolean }).upsert === true)).toBe(true)
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
