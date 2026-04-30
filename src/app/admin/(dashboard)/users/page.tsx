'use client'

import { useEffect, useState } from 'react'
import { Loader2, Plus, Shield, User as UserIcon, X } from 'lucide-react'

interface AdminUser {
  _id: string
  email: string
  name: string
  role: string
  active: boolean
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  async function fetchUsers() {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data.users)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    fetchUsers()
  }

  async function changeRole(id: string, role: string) {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    fetchUsers()
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1B1B]">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage dashboard access</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-[#0F8B6E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d7a5f]"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                user.role === 'admin' ? 'bg-purple-50' : 'bg-gray-100'
              }`}>
                {user.role === 'admin' ? (
                  <Shield className="h-5 w-5 text-purple-600" />
                ) : (
                  <UserIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-[#1B1B1B]">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={user.role}
                onChange={(e) => changeRole(user._id, e.target.value)}
                className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-[#0F8B6E] focus:outline-none"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>

              <button
                onClick={() => toggleActive(user._id, user.active)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  user.active
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                {user.active ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add user modal */}
      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false)
            fetchUsers()
          }}
        />
      )}
    </div>
  )
}

function AddUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    })

    if (res.ok) {
      onCreated()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to create user')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-[#1B1B1B]">Add New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0F8B6E] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0F8B6E] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0F8B6E] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0F8B6E] focus:outline-none"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F8B6E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d7a5f] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create User
          </button>
        </form>
      </div>
    </div>
  )
}
