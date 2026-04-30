import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { TourConfig } from '@/models/TourConfig'

/** GET all tour configs */
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const tours = await TourConfig.find().lean()
  return NextResponse.json({ tours })
}

/** POST create tour config */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const body = await request.json()
  const tour = await TourConfig.create(body)
  return NextResponse.json({ tour }, { status: 201 })
}
