'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  XCircle,
  Eye,
  X,
} from 'lucide-react'

interface Booking {
  _id: string
  stripePaymentId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  tourDate: string
  tourTime: string
  guests: number
  totalPaid: number
  status: string
  notes?: string
  assignedGuide?: string
  createdAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, limit: 20, total: 0, totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<Booking | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchBookings = useCallback(
    async (page = 1) => {
      setLoading(true)
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/admin/bookings?${params}`)
      const data = await res.json()
      setBookings(data.bookings)
      setPagination(data.pagination)
      setLoading(false)
    },
    [search, statusFilter]
  )

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  async function handleCancel(id: string) {
    if (!confirm('Cancel this booking and issue a full refund via Stripe?')) return
    setActionLoading(true)
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    })
    setActionLoading(false)
    setSelected(null)
    fetchBookings(pagination.page)
  }

  async function handleSaveNotes(id: string, notes: string, guide: string) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, assignedGuide: guide }),
    })
    fetchBookings(pagination.page)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1B1B]">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            {pagination.total} total bookings
          </p>
        </div>
        <button
          onClick={() => fetchBookings(pagination.page)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
            placeholder="Search name, email, or payment ID…"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm focus:border-[#0F8B6E] focus:outline-none focus:ring-1 focus:ring-[#0F8B6E]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 focus:border-[#0F8B6E] focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white overflow-x-auto">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            No bookings found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-400">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Tour Date</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1B1B1B]">{b.customerName}</p>
                    <p className="text-xs text-gray-400">{b.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.tourDate} · {b.tourTime}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.guests}</td>
                  <td className="px-4 py-3 font-medium">€{(b.totalPaid / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      b.status === 'confirmed' ? 'bg-green-50 text-green-700'
                        : b.status === 'refunded' ? 'bg-red-50 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelected(b)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(b._id)}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="Cancel & refund"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchBookings(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => fetchBookings(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <BookingDetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onCancel={() => handleCancel(selected._id)}
          onSave={(notes, guide) =>
            handleSaveNotes(selected._id, notes, guide)
          }
          actionLoading={actionLoading}
        />
      )}
    </div>
  )
}

function BookingDetailModal({
  booking,
  onClose,
  onCancel,
  onSave,
  actionLoading,
}: {
  booking: Booking
  onClose: () => void
  onCancel: () => void
  onSave: (notes: string, guide: string) => void
  actionLoading: boolean
}) {
  const [notes, setNotes] = useState(booking.notes || '')
  const [guide, setGuide] = useState(booking.assignedGuide || '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-[#1B1B1B]">Booking Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Customer</p>
              <p className="mt-1 text-sm font-medium">{booking.customerName}</p>
              <p className="text-xs text-gray-500">{booking.customerEmail}</p>
              {booking.customerPhone && (
                <p className="text-xs text-gray-500">{booking.customerPhone}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Tour</p>
              <p className="mt-1 text-sm font-medium">
                {booking.tourDate} at {booking.tourTime}
              </p>
              <p className="text-xs text-gray-500">
                {booking.guests} guest{booking.guests > 1 ? 's' : ''} ·
                €{(booking.totalPaid / 100).toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Stripe Payment ID</p>
            <p className="mt-1 font-mono text-xs text-gray-500">{booking.stripePaymentId}</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-gray-400">
              Assigned Guide
            </label>
            <input
              type="text"
              value={guide}
              onChange={(e) => setGuide(e.target.value)}
              placeholder="e.g. Maria K."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-gray-400">
              Internal Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about this booking…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          {booking.status === 'confirmed' ? (
            <button
              onClick={onCancel}
              disabled={actionLoading}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
              Cancel & Refund
            </button>
          ) : (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              booking.status === 'refunded' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {booking.status}
            </span>
          )}
          <button
            onClick={() => {
              onSave(notes, guide)
              onClose()
            }}
            className="rounded-lg bg-[#0F8B6E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d7a5f]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
