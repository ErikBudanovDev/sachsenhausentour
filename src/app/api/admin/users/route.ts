import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

/** GET all users (admin only) */
export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ users })
}

/** POST create new user (admin only) */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const body = await request.json()
  const { email, password, name, role } = body

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'Email, password, and name are required' },
      { status: 400 }
    )
  }

  const exists = await User.findOne({ email: email.toLowerCase() })
  if (exists) {
    return NextResponse.json(
      { error: 'A user with this email already exists' },
      { status: 409 }
    )
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await User.create({
    email: email.toLowerCase(),
    password: hashed,
    name,
    role: role || 'staff',
  })

  return NextResponse.json(
    {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    { status: 201 }
  )
}
