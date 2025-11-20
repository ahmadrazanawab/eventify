'use client'
import React, { useState } from 'react'
import { MessageSquarePlus, Send, ClipboardList } from 'lucide-react'

export default function Page() {
  const [form, setForm] = useState({
    title: '',
    category: '',
    date: '',
    attendees: '',
    needs: '',
    budget: '',
    volunteers: '',
    contact: '',
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
    setForm({ title: '', category: '', date: '', attendees: '', needs: '', budget: '', volunteers: '', contact: '', priority: 'Medium' })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <MessageSquarePlus className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">Feedback</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 rounded-lg border bg-white p-6">
          <h2 className="text-lg font-medium mb-4">Event Organization Feedback</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="title">Event title</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Tech Fest 2025" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select</option>
                <option>Workshop</option>
                <option>Seminar</option>
                <option>Competition</option>
                <option>Festival</option>
                <option>Meetup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="date">Preferred date</label>
              <input type="date" id="date" name="date" value={form.date} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="attendees">Expected attendees</label>
              <input type="number" min="0" id="attendees" name="attendees" value={form.attendees} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 150" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="budget">Budget estimate (₹)</label>
              <input type="number" min="0" id="budget" name="budget" value={form.budget} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 50000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="volunteers">Volunteers needed</label>
              <input type="number" min="0" id="volunteers" name="volunteers" value={form.volunteers} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 12" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="contact">Contact email</label>
              <input type="email" id="contact" name="contact" value={form.contact} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., organizer@college.edu" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="needs">Organization needs / notes</label>
              <textarea id="needs" name="needs" value={form.needs} onChange={handleChange} rows={4} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Logistics, venue, AV, sponsorship, publicity, judges, certificates, refreshments..." />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                <Send className="h-4 w-4" />
                Submit feedback
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
            <p className="text-sm text-slate-500">No feedback yet. Submit the form to add an entry.</p>
          ) : (
            <ul className="space-y-4">
              {submissions.map((s, i) => (
                <li key={i} className="rounded-md border p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">{s.title || 'Untitled event'}</p>
                    <span className="text-xs rounded-full px-2 py-0.5 border">{s.priority}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{s.category} • {s.date || 'TBD'} • {s.attendees ? `${s.attendees} attendees` : 'Attendees TBD'}</p>
                  {s.needs ? <p className="text-sm whitespace-pre-wrap">{s.needs}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
