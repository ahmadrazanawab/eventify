"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentRegistrationsPage() {
  const [loading, setLoading] = useState(true);
  const [regs, setRegs] = useState<Array<{
    _id: string;
    event?: { title?: string; venue?: string; location?: string; date?: string | Date };
    paymentStatus?: 'none' | 'pending' | 'paid' | string;
    eventFees?: number;
  }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const res = await fetch("/api/student-register-event", { cache: "no-store" });
        const data = await res.json();
        if (data?.success && Array.isArray(data.data)) {
          setRegs(data.data);
          setError(null);
        } else {
          setRegs([]);
          setError(null);
        }
      } catch (_) {
        setError("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };
    fetchRegs();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">My Registrations</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your recent registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : regs.length === 0 ? (
            <div className="py-10 text-center text-gray-500">No registrations found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2 pr-4">Event</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Fee</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regs.map((r) => {
                    const ev = r.event || {};
                    const dateVal = ev.date ? new Date(ev.date as string | number | Date) : null;
                    return (
                      <tr key={r._id} className="border-t">
                        <td className="py-2 pr-4">
                          <div className="font-medium">{ev.title || "Untitled"}</div>
                          <div className="text-xs text-gray-500">{ev.venue || ev.location || ""}</div>
                        </td>
                        <td className="py-2 pr-4">
                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              r.paymentStatus === "paid"
                                ? "bg-green-50 text-green-700"
                                : r.paymentStatus === "pending"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {r.paymentStatus}
                          </span>
                        </td>
                        <td className="py-2 pr-4">{typeof r.eventFees === "number" ? `₹${r.eventFees}` : "₹0"}</td>
                        <td className="py-2 pr-4">{dateVal ? dateVal.toLocaleDateString() : "-"}</td>
                        <td className="py-2 pr-4">
                          {r.paymentStatus === "pending" ? (
                            <Button size="sm" variant="outline" onClick={() => (window.location.href = "/student/dashboard/student-register-event")}>Continue Payment</Button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
