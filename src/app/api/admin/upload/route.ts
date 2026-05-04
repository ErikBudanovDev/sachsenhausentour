import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const GITHUB_OWNER = 'ErikBudanovDev'
const GITHUB_REPO = 'sachsenhausentour'
const GITHUB_BRANCH = 'main'
const UPLOAD_DIR = 'public/images/uploads'

/**
 * POST /api/admin/upload
 * Accepts a file upload, commits it to GitHub via the Contents API,
 * and returns the public URL path.
 *
 * Body: FormData with a "file" field
 * Returns: { url: "/images/uploads/filename.jpg", sha: "..." }
 */
export async function POST(request: NextRequest) {
  // Auth check
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN not configured' },
      { status: 500 }
    )
  }

  // Parse form data
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
  ]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: `File type ${file.type} not allowed. Accepted: jpg, png, webp, gif, svg, mp4` },
      { status: 400 }
    )
  }

  // Max 10MB
  const MAX_SIZE = 10 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 10MB.' },
      { status: 400 }
    )
  }

  // Generate a unique filename to avoid collisions
  const ext = file.name.split('.').pop() || 'jpg'
  const baseName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .toLowerCase()
    .slice(0, 60)
  const timestamp = Date.now()
  const filename = `${baseName}-${timestamp}.${ext}`
  const filePath = `${UPLOAD_DIR}/${filename}`

  // Convert file to base64
  const arrayBuffer = await file.arrayBuffer()
  const base64Content = Buffer.from(arrayBuffer).toString('base64')

  // Check if file already exists (to get sha for update)
  let existingSha: string | undefined
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )
    if (checkRes.ok) {
      const existing = await checkRes.json()
      existingSha = existing.sha
    }
  } catch {
    // File doesn't exist, that's fine
  }

  // Commit file to GitHub
  const commitBody: Record<string, unknown> = {
    message: `Upload ${filename} via admin panel`,
    content: base64Content,
    branch: GITHUB_BRANCH,
  }
  if (existingSha) {
    commitBody.sha = existingSha
  }

  const ghRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commitBody),
    }
  )

  if (!ghRes.ok) {
    const err = await ghRes.json().catch(() => ({}))
    console.error('GitHub API error:', err)
    return NextResponse.json(
      { error: 'Failed to upload to GitHub', details: (err as { message?: string }).message },
      { status: 500 }
    )
  }

  const result = await ghRes.json()

  // Return the public URL path (relative, for use in <img src="...">)
  const publicUrl = `/images/uploads/${filename}`

  return NextResponse.json({
    url: publicUrl,
    sha: result.content?.sha,
    filename,
    size: file.size,
  })
}
