'use client'
import React, { useEffect, useState } from 'react'
import { Megaphone, Send, ClipboardList } from 'lucide-react'

type Audience = 'All' | 'Students' | 'Admins'
type Priority = 'High' | 'Medium' | 'Low'

type Announcement = {
  _id?: string
  id: string
  title: string
  message: string
  audience: Audience
  priority: Priority
  publishAt?: string
  createdAt: string
}

export default function Page() {
  const [form, setForm] = useState<{
    title: string
    message: string
    audience: Audience
    priority: Priority
    publishAt: string
  }>({ title: '', message: '', audience: 'All', priority: 'Medium', publishAt: '' })
  const [items, setItems] = useState<Announcement[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('/api/announcements?limit=20', { cache: 'no-store' })
        const d = await r.json()
        setItems(Array.isArray(d?.data) ? d.data : [])
      } catch {}
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const r = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          message: form.message,
          audience: form.audience,
          priority: form.priority,
          publishAt: form.publishAt || undefined,
        }),
      })
      const d = await r.json()
      if (d?.success && d?.data) {
        setItems(prev => [d.data as Announcement, ...prev])
        setForm({ title: '', message: '', audience: 'All', priority: 'Medium', publishAt: '' })
      }
    } catch {}
  }

  return (
    <div className="space-y-8 mt-20">
      <div className="flex items-center gap-3">
        <Megaphone className="h-6 w-6 text-violet-600" />
        <h1 className="text-2xl font-semibold">Announcements</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 rounded-lg border bg-white p-6">
          <h2 className="text-lg font-medium mb-4">Create announcement</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500" placeholder="e.g., Maintenance window" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="audience">Audience</label>
              <select id="audience" name="audience" value={form.audience} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500">
                <option>All</option>
                <option>Students</option>
                <option>Admins</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="publishAt">Publish at</label>
              <input type="datetime-local" id="publishAt" name="publishAt" value={form.publishAt} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
              <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={5} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500" placeholder="Details for students/admins" required />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-700">
                <Send className="h-4 w-4" />
                Publish
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-medium">Recent announcements</h2>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">No announcements yet.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((a) => (
                <li key={a._id ?? a.id} className="rounded-md border p-4">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <p className="font-medium">{a.title}</p>
                    <span className="text-xs rounded-full px-2 py-0.5 border">{a.priority}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{a.audience} {a.publishAt ? `• ${new Date(a.publishAt).toLocaleString()}` : ''}</p>
                  <p className="text-sm whitespace-pre-wrap">{a.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
