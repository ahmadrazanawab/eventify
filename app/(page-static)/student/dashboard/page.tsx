"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loder } from "@/app/components/Loder";

type Event = {
  _id: string;
  title: string;
  category: string;
  date: string;
  venue: string;
  description: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  year?: string;
};

export default function StudentDashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
        // Fetch student info
        const studentRes = await axios.get("/api/student/me", { withCredentials: true });
        if (!studentRes.data.success) {
          router.push("/login");
          return;
        }
            setStudent(studentRes.data.student);
         

        // Fetch all events
        const eventsRes = await axios.get("/api/create-event/[id]", { withCredentials: true });
        setEvents(eventsRes.data.data || []);

        // Fetch registered events
        const registeredRes = await axios.get("/api/student-register-event", { withCredentials: true });
        setRegisteredEvents(registeredRes.data.data || []);
           setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
            router.push("/login");
               setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

//   if (loading) {
//     return <p className="p-8 text-gray-600">Loading...</p>;
//   }

  return (
    <section className="min-h-screen mt-24 w-full flex flex-col bg-white">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome, {student?.name || "Student"}!
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Check available college events and your registered list.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800">Total Events</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">{events.length}</p>
          </div>

          <div className="p-5 bg-green-50 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-green-800">Registered Events</h3>
            <p className="text-3xl font-bold text-green-700 mt-2">
              {registeredEvents.length}
            </p>
          </div>
        </div>

        {/* Event List */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Available Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? <div className="w-[80vw] flex justify-center mt-20"><Loder/></div> :events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event._id}
                  className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {event.date} | {event.category}
                  </p>
                  <p className="text-gray-600">{event.venue}</p>
                  <p className="text-gray-700 mt-2 text-sm">{event.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No events available.</p>
            )}
          </div>
        </div>
      </main>
    </section>
  );
}




// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import jwt from "jsonwebtoken";

// export default async function StudentDashboardPage() {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) redirect("/login");

    

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string; id: string };
//         if (decoded.role !== "student") {
//             redirect("/admin/dashboard");
//         }

//         // ✅ fetch student-specific data here if needed

//     } catch {
//         redirect("/login");
//     }

//     return (
//         <section className="min-h-screen mt-24 w-full flex flex-col bg-white">
//             <main className="flex-1 p-8">
//                 <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, Student!</h1>
//                 <p className="text-gray-600 leading-relaxed">
//                     Check available college events and register to participate.
//                 </p>

//                 {/* Add summary cards here */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//                     <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
//                         <h3 className="text-lg font-semibold text-blue-800">Total Events</h3>
//                         <p className="text-3xl font-bold text-blue-700 mt-2">{/* totalEvents */}</p>
//                     </div>

//                     <div className="p-5 bg-green-50 rounded-xl border border-green-100">
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
