'use client'
import React, { useState } from 'react'
import { MessageSquare, Send, ClipboardList } from 'lucide-react'

export default function Page() {
  const [form, setForm] = useState({
    title: '',
    category: '',
    feedback: '',
    priority: 'Medium',
  })
  const [submissions, setSubmissions] = useState<Array<typeof form>>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmissions(prev => [{ ...form }, ...prev])
    setForm({ title: '', category: '', feedback: '', priority: 'Medium' })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-emerald-600" />
        <h1 className="text-2xl font-semibold">Feedback</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 rounded-lg border bg-white p-6">
          <h2 className="text-lg font-medium mb-4">Share your event feedback</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="title">Event title</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Coding Marathon" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" required>
                <option value="">Select</option>
                <option>Workshop</option>
                <option>Seminar</option>
                <option>Competition</option>
                <option>Festival</option>
                <option>Meetup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="feedback">Your feedback</label>
              <textarea id="feedback" name="feedback" value={form.feedback} onChange={handleChange} rows={5} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="What went well? What can be improved?" required />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
                <Send className="h-4 w-4" />
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-medium">Recent submissions</h2>
          </div>
          {submissions.length === 0 ? (
            <p className="text-sm text-slate-500">No submissions yet.</p>
          ) : (
            <ul className="space-y-4">
              {submissions.map((s, i) => (
                <li key={i} className="rounded-md border p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">{s.title || 'Untitled event'}</p>
                    <span className="text-xs rounded-full px-2 py-0.5 border">{s.priority}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{s.category || 'General'}</p>
                  <p className="text-sm whitespace-pre-wrap">{s.feedback}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
