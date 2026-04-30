'use client'

import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Euro,
  Users,
  XCircle,
  Loader2,
} from 'lucide-react'

interface Stats {
  totalBookings: number
  confirmedBookings: number
  cancelledBookings: number
  todayBookings: number
  totalRevenue: number
}

interface RecentBooking {
  _id: string
  customerName: string
  customerEmail: string
  tourDate: string
  tourTime: string
  guests: number
  totalPaid: number
  status: string
  createdAt: string
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats)
        setRecent(data.recentBookings)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  const statCards = [
    {
      label: "Today's Bookings",
      value: stats?.todayBookings ?? 0,
      icon: CalendarDays,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Confirmed',
      value: stats?.confirmedBookings ?? 0,
      icon: Users,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Cancelled / Refunded',
      value: stats?.cancelledBookings ?? 0,
      icon: XCircle,
      color: 'bg-red-50 text-red-600',
    },
    {
      label: 'Total Revenue',
      value: `€${((stats?.totalRevenue ?? 0) / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
      icon: Euro,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B1B1B]">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Overview of your tour operations</p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{card.label}</p>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#1B1B1B]">
                {card.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Recent bookings */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-[#1B1B1B]">Recent Bookings</h2>
        </div>
        {recent.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            No bookings yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-400">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Guests</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr
                    key={b._id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#1B1B1B]">
                        {b.customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {b.customerEmail}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {b.tourDate} · {b.tourTime}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{b.guests}</td>
                    <td className="px-5 py-3 font-medium text-[#1B1B1B]">
                      €{(b.totalPaid / 100).toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          b.status === 'confirmed'
                            ? 'bg-green-50 text-green-700'
                            : b.status === 'refunded'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
