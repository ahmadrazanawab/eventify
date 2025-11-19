"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  event: Event;
  paymentStatus?: 'none' | 'pending' | 'paid';
  eventFees?: number;
  registeredAt?: string;
  paymentMethod?: 'none' | 'online' | 'cash';
};

export default function StudentDashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [_loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registeredRegs, setRegisteredRegs] = useState<Registration[]>([]);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Total events available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Events</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registeredRegs.length}</div>
            <p className="text-xs text-muted-foreground">Events you&apos;ve registered for</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Upcoming events</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Events Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => {
            const isRegistered = registeredEventIds.has(event._id);
            return (
            <Card key={event._id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()} • {event.time}
                </div>
                <div className="text-sm">{event.venue}</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
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
              return (
              <Card key={reg._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} • {event.time}
                  </div>
                  <div className="text-sm">{event.venue}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-medium capitalize">{reg.paymentStatus || 'none'}</span></div>
                    {(reg.eventFees ?? 0) > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium">₹{reg.eventFees}</span></div>
                    )}
                  </div>
                  {reg.paymentStatus === 'paid' ? (
                    <Button
                      className="mt-3 w-full"
                      variant="outline"
                      onClick={() => { setSelectedReg(reg); setTicketOpen(true); }}
                    >
                      View Receipt
                    </Button>
                  ) : reg.paymentStatus === 'pending' && (reg.eventFees ?? 0) > 0 && reg.paymentMethod !== 'cash' ? (
                    <Button
                      className="mt-3 w-full"
                      onClick={() => router.push(`/student/dashboard/student-register-event?eventId=${event._id}`)}
                    >
                      Pay Now
                    </Button>
                  ) : reg.paymentStatus === 'pending' && reg.paymentMethod === 'cash' ? (
                    <Button className="mt-3 w-full" variant="outline" disabled>
                      Awaiting Cash Confirmation
                    </Button>
                  ) : null}
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
