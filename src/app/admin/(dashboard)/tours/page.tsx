'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'

interface TimeSlot {
  id: string
  time: string
  label: string
}

interface TourConfig {
  _id: string
  slug: string
  name: string
  description: string
  pricePerPerson: number
  currency: string
  timeSlots: TimeSlot[]
  maxGuestsPerSlot: number
  blackoutDates: string[]
  minAdvanceDays: number
  duration: string
  meetingPoint: string
  active: boolean
}

export default function TourConfigPage() {
  const [tours, setTours] = useState<TourConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/tours')
      .then((r) => r.json())
      .then((data) => setTours(data.tours))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(tour: TourConfig) {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/api/admin/tours/${tour._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tour),
    })
    if (res.ok) {
      setMessage('Saved successfully')
      setTimeout(() => setMessage(''), 3000)
    }
    setSaving(false)
  }

  async function handleCreate() {
    const res = await fetch('/api/admin/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: 'sachsenhausen-tour',
        name: 'Sachsenhausen Memorial Tour',
        description: 'A full-day guided tour of the Sachsenhausen concentration camp from Berlin',
        pricePerPerson: 2900,
        timeSlots: [{ id: 'morning', time: '10:00 AM', label: 'Morning Tour' }],
        maxGuestsPerSlot: 20,
        blackoutDates: [],
        minAdvanceDays: 1,
        duration: '6 hours',
        meetingPoint: 'Generator Berlin Alexanderplatz',
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setTours([...tours, data.tour])
    }
  }

  function updateTour(index: number, field: keyof TourConfig, value: unknown) {
    const updated = [...tours]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(updated[index] as any)[field] = value
    setTours(updated)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-[#1B1B1B]">Tour Configuration</h1>
        <p className="mt-2 text-sm text-gray-500">No tours configured yet.</p>
        <button
          onClick={handleCreate}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0F8B6E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d7a5f]"
        >
          <Plus className="h-4 w-4" />
          Create Default Tour
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1B1B]">Tour Configuration</h1>
          <p className="mt-1 text-sm text-gray-500">Manage pricing, time slots, and availability</p>
        </div>
        {message && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
            {message}
          </span>
        )}
      </div>

      {tours.map((tour, i) => (
        <div key={tour._id} className="mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-[#1B1B1B]">{tour.name}</h2>
            <p className="text-xs text-gray-400">slug: {tour.slug}</p>
          </div>

          <div className="space-y-5 p-5">
            {/* Basic info */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-gray-400">
                  Price per person (cents)
                </label>
                <input
                  type="number"
                  value={tour.pricePerPerson}
                  onChange={(e) => updateTour(i, 'pricePerPerson', parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-400">
                  = €{(tour.pricePerPerson / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-gray-400">
                  Max guests per slot
                </label>
                <input
                  type="number"
                  value={tour.maxGuestsPerSlot}
                  onChange={(e) => updateTour(i, 'maxGuestsPerSlot', parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-gray-400">
                  Min advance days
                </label>
                <input
                  type="number"
                  value={tour.minAdvanceDays}
                  onChange={(e) => updateTour(i, 'minAdvanceDays', parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-gray-400">
                  Duration
                </label>
                <input
                  type="text"
                  value={tour.duration}
                  onChange={(e) => updateTour(i, 'duration', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-gray-400">
                  Meeting Point
                </label>
                <input
                  type="text"
                  value={tour.meetingPoint}
                  onChange={(e) => updateTour(i, 'meetingPoint', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
                />
              </div>
            </div>

            {/* Time slots */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase text-gray-400">
                Time Slots
              </label>
              <div className="space-y-2">
                {tour.timeSlots.map((slot, si) => (
                  <div key={slot.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={slot.time}
                      onChange={(e) => {
                        const slots = [...tour.timeSlots]
                        slots[si] = { ...slots[si], time: e.target.value }
                        updateTour(i, 'timeSlots', slots)
                      }}
                      placeholder="10:00 AM"
                      className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={slot.label}
                      onChange={(e) => {
                        const slots = [...tour.timeSlots]
                        slots[si] = { ...slots[si], label: e.target.value }
                        updateTour(i, 'timeSlots', slots)
                      }}
                      placeholder="Morning Tour"
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const slots = tour.timeSlots.filter((_, j) => j !== si)
                        updateTour(i, 'timeSlots', slots)
                      }}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const slots = [
                      ...tour.timeSlots,
                      { id: `slot-${Date.now()}`, time: '', label: '' },
                    ]
                    updateTour(i, 'timeSlots', slots)
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#0F8B6E] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add slot
                </button>
              </div>
            </div>

            {/* Blackout dates */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-gray-400">
                Blackout dates (comma-separated, DD/MM/YYYY)
              </label>
              <input
                type="text"
                value={tour.blackoutDates.join(', ')}
                onChange={(e) =>
                  updateTour(
                    i,
                    'blackoutDates',
                    e.target.value.split(',').map((d) => d.trim()).filter(Boolean)
                  )
                }
                placeholder="25/12/2026, 01/01/2027"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 px-5 py-4">
            <button
              onClick={() => handleSave(tour)}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#0F8B6E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d7a5f] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
