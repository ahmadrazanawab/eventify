"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loder } from "@/app/components/Loder";
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

type Student = {
  _id: string;
  name: string;
  email: string;
  registeredEvents?: string[];
  phone?: string;
  department?: string;
  year?: string;
};

export default function StudentDashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you'd get the student ID from auth context or session
        const [eventsRes, studentRes] = await Promise.all([
          axios.get("/api/events"),
          // Replace 'student123' with actual student ID from auth
          axios.get(`/api/students/student123`)
        ]);
        
        setEvents(eventsRes.data);
        setStudent(studentRes.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegister = async (eventId: string) => {
    if (!student) return;
    
    try {
      setIsRegistering(prev => ({ ...prev, [eventId]: true }));
      
      // Register for the event
      await axios.post(`/api/events/${eventId}/register`, {
        studentId: student._id
      });
      
      // Update local state
      setStudent(prev => ({
        ...prev!,
        registeredEvents: [...(prev?.registeredEvents || []), eventId]
      }));
      
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Failed to register for the event');
    } finally {
      setIsRegistering(prev => ({ ...prev, [eventId]: false }));
    }
  };
  
  const isRegistered = (eventId: string) => {
    return student?.registeredEvents?.includes(eventId) || false;
  };
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate >= today;
  });
  
  const registeredEvents = events.filter(event => 
    student?.registeredEvents?.includes(event._id)
  );

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  
  if (!student) return <div>Student data not found</div>;

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
            <div className="text-2xl font-bold">{registeredEvents.length}</div>
            <p className="text-xs text-muted-foreground">Events you've registered for</p>
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
          {upcomingEvents.map((event) => (
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
                <Button 
                  onClick={() => handleRegister(event._id)}
                  disabled={isRegistering[event._id] || isRegistered(event._id)}
                  className="w-full"
                >
                  {isRegistering[event._id] 
                    ? 'Registering...' 
                    : isRegistered(event._id) 
                      ? 'Registered' 
                      : 'Register'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Your Registered Events */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Registered Events</h2>
        {registeredEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {registeredEvents.map((event) => (
              <Card key={event._id}>
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
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven't registered for any events yet.</p>
        )}
      </section>
    </div>
  );
}
//                         <h3 className="text-lg font-semibold text-green-800">Registered Events</h3>
//                         <p className="text-3xl font-bold text-green-700 mt-2">{/* registeredEvents */}</p>
//                     </div>
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
