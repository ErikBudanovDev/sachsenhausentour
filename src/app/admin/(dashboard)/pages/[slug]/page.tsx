'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Type,
  RotateCcw,
} from 'lucide-react'

type SectionData = Record<string, unknown>

export default function PageEditorPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [title, setTitle] = useState('')
  const [sections, setSections] = useState<SectionData>({})
  const [defaults, setDefaults] = useState<SectionData>({})
  const [seo, setSeo] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch(`/api/admin/pages/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title || '')
        setSections(data.sections || {})
        setDefaults(data.defaults || {})
        setSeo(data.seo || {})
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sections, seo }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }, [slug, title, sections, seo])

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const updateSection = (sectionKey: string, value: unknown) => {
    setSections((prev) => ({ ...prev, [sectionKey]: value }))
  }

  const resetSection = (sectionKey: string) => {
    if (defaults[sectionKey] !== undefined) {
      setSections((prev) => ({ ...prev, [sectionKey]: structuredClone(defaults[sectionKey]) }))
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-400">Loading page content…</div>
  }

  const sectionKeys = Object.keys(sections)

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/pages')}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-400">/{slug === 'home' ? '' : slug}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#0F8B6E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d7a60] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      {/* SEO Section */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white">
        <button
          onClick={() => toggleSection('__seo')}
          className="flex w-full items-center justify-between p-4"
        >
          <span className="text-sm font-semibold text-gray-700">SEO & Metadata</span>
          {collapsedSections.has('__seo') ? (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {!collapsedSections.has('__seo') && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            {['title', 'description', 'ogTitle', 'ogDescription', 'ogImage'].map((field) => (
              <div key={field}>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  {field === 'ogImage' ? 'OG Image URL' : field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                </label>
                <input
                  type="text"
                  value={seo[field] || ''}
                  onChange={(e) => setSeo((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder={`Leave blank to use default`}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none focus:ring-1 focus:ring-[#0F8B6E]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {sectionKeys.map((sectionKey) => {
          const value = sections[sectionKey]
          const isCollapsed = collapsedSections.has(sectionKey)
          const hasDefault = defaults[sectionKey] !== undefined

          return (
            <div key={sectionKey} className="rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                  {formatSectionName(sectionKey)}
                </button>
                {hasDefault && (
                  <button
                    onClick={() => resetSection(sectionKey)}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title="Reset to default"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>
              {!isCollapsed && (
                <div className="border-t border-gray-100 p-4">
                  <FieldEditor
                    value={value}
                    onChange={(v) => updateSection(sectionKey, v)}
                    path={sectionKey}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom save */}
      <div className="mt-8 flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#0F8B6E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d7a60] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

/* ─── Field Editor ─── */

function FieldEditor({
  value,
  onChange,
  path,
}: {
  value: unknown
  onChange: (v: unknown) => void
  path: string
}) {
  if (value === null || value === undefined) return null

  // String
  if (typeof value === 'string') {
    const isLong = value.length > 100
    const isImage = isImageField(path, value)

    return (
      <div className="space-y-1">
        {isImage && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <ImageIcon className="h-3 w-3" /> Image URL
          </div>
        )}
        {isLong ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none focus:ring-1 focus:ring-[#0F8B6E]"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none focus:ring-1 focus:ring-[#0F8B6E]"
          />
        )}
        {isImage && value && (
          <div className="mt-1 overflow-hidden rounded border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="h-24 w-auto object-cover" />
          </div>
        )}
      </div>
    )
  }

  // Number
  if (typeof value === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none focus:ring-1 focus:ring-[#0F8B6E]"
      />
    )
  }

  // Boolean
  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300 text-[#0F8B6E] focus:ring-[#0F8B6E]"
        />
        <span className="text-gray-600">{value ? 'Yes' : 'No'}</span>
      </label>
    )
  }

  // Array
  if (Array.isArray(value)) {
    return (
      <ArrayEditor
        items={value}
        onChange={onChange}
        path={path}
      />
    )
  }

  // Object
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    return (
      <div className="space-y-3">
        {Object.entries(obj).map(([key, val]) => (
          <div key={key}>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              {isImageField(key, val) ? (
                <ImageIcon className="h-3 w-3" />
              ) : (
                <Type className="h-3 w-3" />
              )}
              {formatFieldName(key)}
            </label>
            <FieldEditor
              value={val}
              onChange={(v) =>
                onChange({ ...obj, [key]: v })
              }
              path={`${path}.${key}`}
            />
          </div>
        ))}
      </div>
    )
  }

  return <span className="text-xs text-gray-400">Unsupported field type</span>
}

/* ─── Array Editor ─── */

function ArrayEditor({
  items,
  onChange,
  path,
}: {
  items: unknown[]
  onChange: (v: unknown) => void
  path: string
}) {
  const addItem = () => {
    if (items.length === 0) return
    const template = items[0]
    let newItem: unknown
    if (typeof template === 'string') newItem = ''
    else if (typeof template === 'object' && template !== null) {
      newItem = Object.fromEntries(
        Object.entries(template).map(([k, v]) => [
          k,
          typeof v === 'string' ? '' : typeof v === 'number' ? 0 : typeof v === 'boolean' ? false : v,
        ])
      )
    } else {
      newItem = ''
    }
    onChange([...items, newItem])
  }

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx))
  }

  const updateItem = (idx: number, val: unknown) => {
    const updated = [...items]
    updated[idx] = val
    onChange(updated)
  }

  // Simple string array
  if (items.length > 0 && typeof items[0] === 'string') {
    return (
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item as string}
              onChange={(e) => updateItem(idx, e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F8B6E] focus:outline-none"
            />
            <button
              onClick={() => removeItem(idx)}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="flex items-center gap-1 text-xs font-medium text-[#0F8B6E] hover:text-[#0d7a60]"
        >
          <Plus className="h-3 w-3" /> Add item
        </button>
      </div>
    )
  }

  // Array of objects
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative rounded-lg border border-gray-100 bg-gray-50 p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">
              #{idx + 1}
            </span>
            <button
              onClick={() => removeItem(idx)}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <FieldEditor
            value={item}
            onChange={(v) => updateItem(idx, v)}
            path={`${path}[${idx}]`}
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-1 text-xs font-medium text-[#0F8B6E] hover:text-[#0d7a60]"
      >
        <Plus className="h-3 w-3" /> Add item
      </button>
    </div>
  )
}

/* ─── Helpers ─── */

function formatSectionName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, ' ')
}

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, ' ')
}

function isImageField(key: string, value: unknown): boolean {
  if (typeof value !== 'string') return false
  const imageKeys = ['image', 'src', 'backgroundImage', 'backgroundVideo', 'ogImage', 'logo']
  if (imageKeys.some((k) => key.toLowerCase().includes(k.toLowerCase()))) return true
  if (value.match(/\.(jpg|jpeg|png|webp|gif|svg|mp4)$/i)) return true
  if (value.startsWith('/images/')) return true
  return false
}
