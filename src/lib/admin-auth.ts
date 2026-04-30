import { auth } from '@/lib/auth'

/** Get the current admin session, or throw 401 */
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return session
}

/** Get the current admin session and verify admin role */
export async function requireAdminRole() {
  const session = await requireAdmin()
  if (session.user.role !== 'admin') {
    throw new Response(JSON.stringify({ error: 'Forbidden — admin only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return session
}
