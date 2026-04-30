import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

/** PATCH update user (admin only) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const { id } = await params
  const body = await request.json()

  // Don't allow password updates through this route
  const { role, name, active } = body
  const update: Record<string, unknown> = {}
  if (role !== undefined) update.role = role
  if (name !== undefined) update.name = name
  if (active !== undefined) update.active = active

  const user = await User.findByIdAndUpdate(id, update, { new: true })
    .select('-password')
    .lean()

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
}
