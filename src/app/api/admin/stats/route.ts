import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Booking } from '@/models/Booking'

/** GET dashboard stats */
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const [
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    todayBookings,
    revenueResult,
    recentBookings,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ status: { $in: ['cancelled', 'refunded'] } }),
    Booking.countDocuments({ tourDate: today, status: 'confirmed' }),
    Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPaid' } } },
    ]),
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ])

  const totalRevenue = revenueResult[0]?.total || 0

  return NextResponse.json({
    stats: {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      todayBookings,
      totalRevenue,
    },
    recentBookings,
  })
}
