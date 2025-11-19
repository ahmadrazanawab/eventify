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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold">Registrations</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRegs}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="search">Search</Label>
              <Input id="search" placeholder="Name, email, phone, dept, event" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="event">Event</Label>
              <select id="event" className="select select-bordered w-full" value={eventId} onChange={(e) => setEventId(e.target.value)}>
                <option value="">All events</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="payment">Payment</Label>
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

      <Card>
        <CardHeader>
          <CardTitle>All Registrations ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Spinner className="h-6 w-6" />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap">Reg ID</th>
                    <th>Event</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Dept/Year</th>
                    <th className="text-right">Fee</th>
                    <th>Payment</th>
                    <th>Method</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r._id}>
                      <td className="font-mono text-xs max-w-40 truncate" title={r._id}>{r._id}</td>
                      <td className="min-w-40">{r.event?.title ?? "-"}</td>
                      <td>{r.name}</td>
                      <td>{r.email}</td>
                      <td>{r.phone}</td>
                      <td>{r.department} {r.year ? `/ ${r.year}` : ""}</td>
                      <td className="text-right">₹{r.eventFees ?? 0}</td>
                      <td>
                        <Badge variant={r.paymentStatus === "paid" ? undefined : "secondary"}>{r.paymentStatus}</Badge>
                      </td>
                      <td className="capitalize">
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
                      <td className="whitespace-nowrap">{r.registeredAt ? new Date(r.registeredAt).toLocaleString() : ""}</td>
                      <td>
                        {r.paymentMethod === 'cash' && r.paymentStatus !== 'paid' ? (
                          <Button size="sm" onClick={() => markPaid(r._id)}>Mark Paid</Button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-6">No registrations found</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
