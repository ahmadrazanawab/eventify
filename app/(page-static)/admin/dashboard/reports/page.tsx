'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { IndianRupee } from 'lucide-react'

type EventLite = {
  _id: string
  title: string
  date?: string | Date
  venue?: string
  category?: string
}

type StudentLite = {
  _id: string
  name: string
  email: string
  phone?: string | number
  department?: string
  year?: string
}

type Registration = {
  _id: string
  event?: EventLite
  student?: StudentLite
  eventFees?: number
  paymentStatus?: 'none' | 'pending' | 'paid' | string
  paymentMethod?: 'none' | 'online' | 'cash' | string
  registeredAt?: string | number | Date
}

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [regs, setRegs] = useState<Registration[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('/api/student-register-event', { cache: 'no-store' })
        const d = await r.json()
        if (d?.success && Array.isArray(d.data)) {
          setRegs(d.data as Registration[])
          setError(null)
        } else {
          setRegs([])
          setError(null)
        }
      } catch {
        setError('Failed to load reports')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const byEvent = useMemo(() => {
    const map = new Map<string, { event: EventLite; rows: Registration[]; total: number; paid: number; revenue: number }>()
    for (const r of regs) {
      const ev = r.event
      if (!ev?._id) continue
      const key = ev._id
      if (!map.has(key)) map.set(key, { event: ev, rows: [], total: 0, paid: 0, revenue: 0 })
      const bucket = map.get(key)!
      bucket.rows.push(r)
      bucket.total += 1
      if (r.paymentStatus === 'paid') {
        bucket.paid += 1
        bucket.revenue += typeof r.eventFees === 'number' ? r.eventFees : 0
      }
    }
    return Array.from(map.values()).sort((a, b) => String(a.event.title).localeCompare(String(b.event.title)))
  }, [regs])

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : byEvent.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No registrations found</div>
      ) : (
        <div className="space-y-6">
          {byEvent.map((g) => (
            <Card key={g.event._id} className="hover:shadow-md transition">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl leading-snug">{g.event.title}</CardTitle>
                    <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-3">
                      {g.event.date ? <span>{new Date(g.event.date).toLocaleDateString()}</span> : null}
                      {g.event.venue ? <span>{g.event.venue}</span> : null}
                      {g.event.category ? <span>{g.event.category}</span> : null}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total: {g.total}</div>
                    <div className="text-sm text-green-700">Paid: {g.paid}</div>
                    <div className="text-sm font-semibold flex items-center justify-end gap-1"><IndianRupee className="h-4 w-4" />{g.revenue}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-gray-500">
                      <tr>
                        <th className="py-2 pr-4">Student</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Phone</th>
                        <th className="py-2 pr-4">Dept</th>
                        <th className="py-2 pr-4">Year</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Fee</th>
                        <th className="py-2 pr-4">Method</th>
                        <th className="py-2 pr-4">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.rows.map((r) => {
                        const s = r.student
                        const fee = typeof r.eventFees === 'number' ? r.eventFees : 0
                        const dt = r.registeredAt ? new Date(r.registeredAt) : null
                        return (
                          <tr key={r._id} className="border-t">
                            <td className="py-2 pr-4 font-medium">{s?.name || '-'}</td>
                            <td className="py-2 pr-4">{s?.email || '-'}</td>
                            <td className="py-2 pr-4">{s?.phone ?? '-'}</td>
                            <td className="py-2 pr-4">{s?.department ?? '-'}</td>
                            <td className="py-2 pr-4">{s?.year ?? '-'}</td>
                            <td className="py-2 pr-4">
                              <span
                                className={`rounded px-2 py-1 text-xs ${
                                  r.paymentStatus === 'paid'
                                    ? 'bg-green-50 text-green-700'
                                    : r.paymentStatus === 'pending'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {r.paymentStatus || 'none'}
                              </span>
                            </td>
                            <td className="py-2 pr-4">{fee > 0 ? `₹${fee}` : '₹0'}</td>
                            <td className="py-2 pr-4 capitalize">{r.paymentMethod || 'none'}</td>
                            <td className="py-2 pr-4">{dt ? dt.toLocaleString() : '-'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
