"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, IndianRupee, CreditCard, Megaphone } from "lucide-react";

type Event = {
  _id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  participants?: string[];
  status?: 'upcoming' | 'ongoing' | 'completed';
};

type Registration = {
  _id: string;
  event?: Event | null;
  paymentStatus?: 'none' | 'pending' | 'paid';
  eventFees?: number;
  registeredAt?: string;
  paymentMethod?: 'none' | 'online' | 'cash';
};

type Announcement = {
  _id: string;
  title: string;
  message: string;
  audience: 'All' | 'Students' | 'Admins';
  priority: 'High' | 'Medium' | 'Low';
  publishAt?: string;
  createdAt: string;
};

export default function StudentDashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [_loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registeredRegs, setRegisteredRegs] = useState<Registration[]>([]);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, regsRes] = await Promise.all([
          axios.get("/api/create-event", { withCredentials: true }),
          axios.get("/api/student-register-event", { withCredentials: true })
        ]);

        setEvents(eventsRes.data?.data || []);
        const regs = regsRes.data?.data || [];
        setRegisteredRegs(regs);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const r = await fetch('/api/announcements?limit=10', { cache: 'no-store' })
        const d = await r.json()
        const items: Announcement[] = Array.isArray(d?.data) ? d.data : []
        setAnnouncements(items.filter(a => a.audience === 'All' || a.audience === 'Students'))
      } catch {}
    }
    loadAnnouncements()
  }, [])
  
  // Build a Set of event IDs already registered by the student for quick checks
  const registeredEventIds = new Set(
    registeredRegs
      .map((r) => r.event?._id)
      .filter((id): id is string => Boolean(id))
  );
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate >= today;
  });

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-blue-700">
            <CardTitle className="text-xl font-medium text-blue-700">Total Events</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5 text-blue-500">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-700">{events.length}</div>
            <p className="text-md text-blue-700/70">Total events available</p>
            <div className="mt-3 h-1.5 w-full rounded bg-blue-200" />
          </CardContent>
        </Card>
        
        <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-emerald-700">
            <CardTitle className="text-xl font-medium text-emerald-700">Registered Events</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5 text-emerald-500">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-700">{registeredRegs.length}</div>
            <p className="text-md text-emerald-700/70">Events you&apos;ve registered for</p>
            <div className="mt-3 h-1.5 w-full rounded bg-emerald-200" />
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-white hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-amber-700">
            <CardTitle className="text-xl font-medium text-amber-700">Upcoming Events</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5 text-amber-500">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-700">{upcomingEvents.length}</div>
            <p className="text-md text-amber-700/70">Upcoming events</p>
            <div className="mt-3 h-1.5 w-full rounded bg-amber-200" />
          </CardContent>
        </Card>
      </div>
      
      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Megaphone className="h-5 w-5"/> Announcements</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => (
              <Card key={a._id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-snug">{a.title}</CardTitle>
                    <span className="rounded px-2 py-1 text-xs border">{a.priority}</span>
                  </div>
                  <div className="mt-1 text-md text-gray-500">
                    {a.audience} {a.publishAt ? `• ${new Date(a.publishAt).toLocaleString()}` : ''}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-md text-gray-700">{a.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event, idx) => {
            const isRegistered = registeredEventIds.has(event._id);
            const themes = [
              { card: "border-blue-100 bg-gradient-to-br from-blue-50 to-white", text: "text-blue-700", icon: "text-blue-500", bar: "bg-blue-200", chip: "bg-blue-50 text-blue-700" },
              { card: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white", text: "text-emerald-700", icon: "text-emerald-500", bar: "bg-emerald-200", chip: "bg-emerald-50 text-emerald-700" },
              { card: "border-amber-100 bg-gradient-to-br from-amber-50 to-white", text: "text-amber-700", icon: "text-amber-500", bar: "bg-amber-200", chip: "bg-amber-50 text-amber-700" },
              { card: "border-violet-100 bg-gradient-to-br from-violet-50 to-white", text: "text-violet-700", icon: "text-violet-500", bar: "bg-violet-200", chip: "bg-violet-50 text-violet-700" },
            ];
            const t = themes[idx % themes.length];
            return (
            <Card key={event._id} className={`relative hover:shadow-md transition border ${t.card}`}>
              <CardHeader className={`pb-3 ${t.text}`}>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-snug">{event.title}</CardTitle>
                  {event.category && (
                    <span className={`rounded px-2 py-1 text-xs font-medium ${t.chip}`}>{event.category}</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-600 flex items-center gap-3 flex-wrap">
                  <span className={`inline-flex items-center gap-1 ${t.text}`}><Calendar className="h-3.5 w-3.5" /> {new Date(event.date).toLocaleDateString()}</span>
                  <span className={`inline-flex items-center gap-1 ${t.text}`}><Clock className="h-3.5 w-3.5" /> {event.time}</span>
                  <span className={`inline-flex items-center gap-1 ${t.text}`}><MapPin className="h-3.5 w-3.5" /> {event.venue}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                {isRegistered ? (
                  <Button disabled className="w-full" variant="outline">
                    Registered
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/student/dashboard/student-register-event")}
                    className="w-full"
                  >
                    Register
                  </Button>
                )}
                <div className={`mt-4 h-1.5 w-full rounded ${t.bar}`} />
              </CardContent>
            </Card>
          );})}
        </div>
      </section>
      
      {/* Your Registered Events */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Registered Events</h2>
        {registeredRegs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {registeredRegs.map((reg) => {
              const event = reg.event;
              if (!event) return null;
              return (
              <Card key={reg._id} className="hover:shadow-md transition">
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="mt-1 text-xs text-gray-500 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(event.date).toLocaleDateString()}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {event.time}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.venue}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${
                        reg.paymentStatus === 'paid'
                          ? 'bg-green-50 text-green-700'
                          : reg.paymentStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5" /> {reg.paymentStatus || 'none'}
                    </span>
                    {(reg.eventFees ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs bg-gray-100 text-gray-700">
                        <IndianRupee className="h-3.5 w-3.5" /> {reg.eventFees}
                      </span>
                    )}
                  </div>
                  {reg.paymentStatus === 'paid' ? (
                    <Button
                      className="mt-4 w-full"
                      variant="outline"
                      onClick={() => { setSelectedReg(reg); setTicketOpen(true); }}
                    >
                      View Receipt
                    </Button>
                  ) : reg.paymentStatus === 'pending' && (reg.eventFees ?? 0) > 0 && reg.paymentMethod !== 'cash' ? (
                    <Button
                      className="mt-4 w-full"
                      onClick={() => router.push(`/student/dashboard/student-register-event?eventId=${event._id}`)}
                    >
                      Pay Now
                    </Button>
                  ) : reg.paymentStatus === 'pending' && reg.paymentMethod === 'cash' ? (
                    <Button className="mt-4 w-full" variant="outline" disabled>
                      Awaiting Cash Confirmation
                    </Button>
                  ) : null}
                  <div
                    className={`mt-4 h-1.5 w-full rounded ${
                      reg.paymentStatus === 'paid'
                        ? 'bg-green-200'
                        : reg.paymentStatus === 'pending'
                        ? 'bg-amber-200'
                        : 'bg-gray-200'
                    }`}
                  />
                </CardContent>
              </Card>
              );})}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven&apos;t registered for any events yet.</p>
        )}
      </section>

      {ticketOpen && selectedReg && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-lg font-bold"
              onClick={() => setTicketOpen(false)}
            >
              &times;
            </button>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Receipt</h2>
            </div>
            <div className="mt-4 flex flex-col items-center gap-3">
              <div className="w-full text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Reg ID</span><span className="font-medium">{selectedReg._id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Event</span><span className="font-medium">{selectedReg.event?.title}</span></div>
                {(selectedReg.eventFees ?? 0) > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium">₹{selectedReg.eventFees}</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium capitalize">{selectedReg.paymentStatus || 'none'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{new Date(selectedReg.registeredAt || Date.now()).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button className="w-full" onClick={() => window.print()}>Print</Button>
              <Button variant="outline" className="w-full" onClick={() => setTicketOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//                 </div>

//             </main>
//         </section>
//     );
// }


// // // app/student/dashboard/page.tsx
// // import { cookies } from "next/headers";
// // import { redirect } from "next/navigation";
// // import jwt from "jsonwebtoken";

// // export default async function StudentDashboardPage() {
// //     const cookiesStore = await cookies();
// //     const token = cookiesStore.get("token")?.value;

// //     if (!token) redirect("/login");

// //     try {
// //         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

// //         // ✅ if not student, redirect
// //         if (decoded.role !== "student") {
// //             redirect("/admin/dashboard");
// //         }
// //     } catch {
// //         redirect("/login");
// //     }

// //     return <div className="min-h-screen flex flex-col justify-center items-center">
// //         <h4 className="text-4xl font-semibold text-center">Welcome to Student Dashboard</h4>
// //          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ut facilis sit.</p>
// //         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, ipsum tenetur.</p>
// //     </div>;
// // }
