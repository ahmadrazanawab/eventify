"use client";

import React from 'react'

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Download, RefreshCcw } from "lucide-react";

type PaymentStatus = "none" | "pending" | "paid";

type EventLite = {
  _id: string;
  title: string;
  date?: string;
  time?: string;
  venue?: string;
};

type Registration = {
  _id: string;
  event?: EventLite;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  eventFees?: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'none' | 'online' | 'cash';
  registeredAt?: string;
};

export default function AdminRegistrationsPage() {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [q, setQ] = useState("");
  const [eventId, setEventId] = useState<string>("");
  const [pay, setPay] = useState<"" | PaymentStatus>("");

  const fetchRegs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/student-register-event", { withCredentials: true });
      setRegs(res.data?.data || []);
      setError("");
    } catch {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegs();
  }, []);

  const events = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of regs) {
      if (r.event?._id && r.event?.title) map.set(r.event._id, r.event.title);
    }
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [regs]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return regs.filter((r) => {
      if (eventId && r.event?._id !== eventId) return false;
      if (pay && r.paymentStatus !== pay) return false;
      if (!needle) return true;
      const hay = [
        r.name,
        r.email,
        r.phone,
        r.department,
        r.year,
        r.event?.title ?? "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [regs, q, eventId, pay]);

  const markPaid = async (id: string) => {
    try {
      const res = await axios.patch(
        `/api/admin/registrations/${id}`,
        { paymentStatus: 'paid', paymentMethod: 'cash' },
        { withCredentials: true }
      );
      if (res.data?.success) {
        // refresh list locally
        setRegs((prev) =>
          prev.map((r) =>
            r._id === id ? ({ ...r, paymentStatus: 'paid', paymentMethod: 'cash' } as Registration) : r
          )
        );
      } else {
        alert(res.data?.message || 'Failed to mark as paid');
      }
    } catch {
      alert('Failed to mark as paid');
    }
  };

  const updateMethod = async (id: string, method: 'none' | 'online' | 'cash') => {
    try {
      const res = await axios.patch(`/api/admin/registrations/${id}`, { paymentMethod: method }, { withCredentials: true });
      if (res.data?.success) {
        setRegs((prev) => prev.map(r => r._id === id ? { ...r, paymentMethod: method } as Registration : r));
      } else {
        alert(res.data?.message || 'Failed to update method');
      }
    } catch {
      alert('Failed to update method');
    }
  };

  const exportCSV = () => {
    const rows = [
      [
        "RegID",
        "Event",
        "Name",
        "Email",
        "Phone",
        "Department",
        "Year",
        "Fee",
        "Payment",
        "RegisteredAt",
      ],
      ...filtered.map((r) => [
        r._id,
        r.event?.title ?? "",
        r.name,
        r.email,
        r.phone,
        r.department,
        r.year,
        String(r.eventFees ?? 0),
        r.paymentStatus,
        r.registeredAt ? new Date(r.registeredAt).toISOString() : "",
      ]),
    ];
    const csv = rows.map((row) => row.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-[70vw] mt-10 mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
          <p className="text-sm text-muted-foreground">Review and manage event registrations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRegs} className="gap-2">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
          <Button onClick={exportCSV} className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </header>

      <Card className="mb-2  border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="search" className="text-sm">Search</Label>
              <Input id="search" placeholder="Search name, email, phone, dept, event" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="event" className="text-sm">Event</Label>
              <select id="event" className="select select-bordered w-full" value={eventId} onChange={(e) => setEventId(e.target.value)}>
                <option value="">All events</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="payment" className="text-sm">Payment</Label>
              <select id="payment" className="select select-bordered w-full" value={pay} onChange={(e) => setPay(e.target.value as PaymentStatus | "")}> 
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">All Registrations <span className="text-muted-foreground">({filtered.length})</span></CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Spinner className="h-6 w-6" />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="overflow-hidden rounded-md border max-w-full">
              <div className="overflow-x-auto max-h-[70vh] overflow-y-auto w-full">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="text-left text-gray-600 whitespace-nowrap">
                      <th className="px-3 py-2 border">Reg ID</th>
                      <th className="px-3 py-2 border">Event</th>
                      <th className="px-3 py-2 border">Name</th>
                      <th className="px-3 py-2 border">Email</th>
                      <th className="px-3 py-2 border">Phone</th>
                      <th className="px-3 py-2 border">Dept/Year</th>
                      <th className="px-3 py-2 border text-right">Fee</th>
                      <th className="px-3 py-2 border">Payment</th>
                      <th className="px-3 py-2 border">Method</th>
                      <th className="px-3 py-2 border">Registered</th>
                      <th className="px-3 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r._id} className="odd:bg-white even:bg-gray-50">
                        <td className="px-3 py-2 border font-mono text-xs" title={r._id}>{r._id}</td>
                        <td className="px-3 py-2 border" title={r.event?.title ?? "-"}>{r.event?.title ?? "-"}</td>
                        <td className="px-3 py-2 border break-words">{r.name}</td>
                        <td className="px-3 py-2 border" title={r.email}>{r.email}</td>
                        <td className="px-3 py-2 border">{r.phone}</td>
                        <td className="px-3 py-2 border">{r.department} {r.year ? `/ ${r.year}` : ""}</td>
                        <td className="px-3 py-2 border text-right">₹{r.eventFees ?? 0}</td>
                        <td className="px-3 py-2 border">
                          <Badge variant={r.paymentStatus === "paid" ? undefined : "secondary"}>
                            {r.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 border capitalize">
                          <select
                            className="select select-bordered select-xs"
                            value={r.paymentMethod || 'none'}
                            onChange={(e) => updateMethod(r._id, e.target.value as 'none' | 'online' | 'cash')}
                          >
                            <option value="none">none</option>
                            <option value="online">online</option>
                            <option value="cash">cash</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 border whitespace-nowrap" title={r.registeredAt ? new Date(r.registeredAt).toLocaleString() : ""}>{r.registeredAt ? new Date(r.registeredAt).toLocaleString() : ""}</td>
                        <td className="px-3 py-2 border">
                          {r.paymentMethod === 'cash' && r.paymentStatus !== 'paid' ? (
                            <Button size="sm" onClick={() => markPaid(r._id)} className="h-8 px-3">Mark Paid</Button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">No registrations found</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
