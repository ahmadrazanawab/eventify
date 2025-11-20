"use client";
import React from "react";
import Image from "next/image";
import hero from "@/app/assist/hero5.jpg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, Users, CreditCard, BarChart2, Search } from "lucide-react";

type Stats = {
    totalEvents?: number;
    totalStudents?: number;
    totalRegistrations?: number;
    upcomingEvents?: number;
};

type StudentRegistrationLite = {
    paymentStatus?: string;
    event?: { date?: string | Date };
};

const HeroSection = () => {
    const [query, setQuery] = React.useState("");
    const [isAuth, setIsAuth] = React.useState(false);
    const [userRole, setUserRole] = React.useState<string | null>(null);
    const [stats, setStats] = React.useState<Stats | null>(null);
    const [studentRegs, setStudentRegs] = React.useState<StudentRegistrationLite[] | null>(null);

    React.useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch("/api/check-jwt");
                const data = await res.json();
                setIsAuth(!!data?.authenticated);
                setUserRole(data?.user?.role ?? null);
                if (data?.user?.role === "admin") {
                    try {
                        const rs = await fetch("/api/admin/stats");
                        const ds = await rs.json();
                        if (ds?.success) setStats(ds.data);
                    } catch {}
                } else if (data?.user?.role === "student") {
                    try {
                        const rr = await fetch("/api/student-register-event");
                        const dr = await rr.json();
                        if (dr?.success) setStudentRegs(Array.isArray(dr.data) ? dr.data : []);
                        else setStudentRegs([]);
                    } catch {
                        setStudentRegs([]);
                    }
                }
            } catch {
                setIsAuth(false);
                setUserRole(null);
            }
        };
        check();
    }, []);

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        window.location.href = `/student/dashboard/student-register-event?search=${encodeURIComponent(query.trim())}`;
    };

    return isAuth ? (
        <div className="mt-20 pt-2">
            <div className="max-w-5xl mx-auto px-4">
                <div className="rounded-xl bg-gradient-to-r from-[#0071BC] to-blue-600 text-white p-8 sm:p-10">
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        Welcome back {userRole === "admin" ? "Admin" : "Student"}
                    </h1>
                    <p className="text-white/90 mt-2">
                        Quick access to your dashboard and tasks.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {userRole === "admin" ? (
                            <>
                                <Link href="/admin/dashboard">
                                    <Button className="bg-white text-[#0a58a5] hover:bg-white/90">Go to Admin Dashboard</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/student/dashboard">
                                    <Button className="bg-white text-[#0a58a5] hover:bg-white/90">Go to Student Dashboard</Button>
                                </Link>
                                <Link href="/student/dashboard/student-register-event">
                                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">Browse Events</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                {userRole === "admin" && (
                    <>
                        {stats && (
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="rounded-lg border p-4 bg-white">
                                    <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><CalendarDays className="h-5 w-5"/> Total Events</div>
                                    <p className="text-2xl font-bold mt-1">{stats.totalEvents ?? 0}</p>
                                </div>
                                <div className="rounded-lg border p-4 bg-white">
                                    <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><Users className="h-5 w-5"/> Students</div>
                                    <p className="text-2xl font-bold mt-1">{stats.totalStudents ?? 0}</p>
                                </div>
                                <div className="rounded-lg border p-4 bg-white">
                                    <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><CreditCard className="h-5 w-5"/> Registrations</div>
                                    <p className="text-2xl font-bold mt-1">{stats.totalRegistrations ?? 0}</p>
                                </div>
                                <div className="rounded-lg border p-4 bg-white">
                                    <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><BarChart2 className="h-5 w-5"/> Upcoming</div>
                                    <p className="text-2xl font-bold mt-1">{stats.upcomingEvents ?? 0}</p>
                                </div>
                            </div>
                        )}
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Link href="/admin/dashboard/events" className="rounded-lg border p-4 bg-white hover:shadow transition">
                                <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><CalendarDays className="h-5 w-5"/> Create Event</div>
                                <p className="text-sm text-gray-600 mt-1">Publish a new event with details and fee.</p>
                            </Link>
                            <Link href="/admin/dashboard/events" className="rounded-lg border p-4 bg-white hover:shadow transition">
                                <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><CalendarDays className="h-5 w-5"/> Manage Events</div>
                                <p className="text-sm text-gray-600 mt-1">Edit or update existing events.</p>
                            </Link>
                            <Link href="/admin/dashboard/registrations" className="rounded-lg border p-4 bg-white hover:shadow transition">
                                <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><CreditCard className="h-5 w-5"/> Registrations</div>
                                <p className="text-sm text-gray-600 mt-1">Review and manage participant registrations.</p>
                            </Link>
                            <Link href="/admin/dashboard/users" className="rounded-lg border p-4 bg-white hover:shadow transition">
                                <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><Users className="h-5 w-5"/> Users</div>
                                <p className="text-sm text-gray-600 mt-1">Search and manage user accounts.</p>
                            </Link>
                            <Link href="/admin/dashboard/reports" className="rounded-lg border p-4 bg-white hover:shadow transition">
                                <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><BarChart2 className="h-5 w-5"/> Reports</div>
                                <p className="text-sm text-gray-600 mt-1">View insights and export data.</p>
                            </Link>
                        </div>
                    </>
                )}
                {userRole === "student" && (
                    <>
                        {studentRegs && (
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="rounded-lg border p-4 bg-white">
                                    <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><Users className="h-5 w-5"/> My Registrations</div>
                                    <p className="text-2xl font-bold mt-1">{studentRegs.length}</p>
                                </div>
                                <div className="rounded-lg border p-4 bg-white">
                                    <div className="flex items-center gap-2 text-green-600 font-semibold"><CreditCard className="h-5 w-5"/> Paid</div>
                                    <p className="text-2xl font-bold mt-1">{studentRegs.filter((r) => r.paymentStatus === "paid").length}</p>
                                </div>
                                <div className="rounded-lg border p-4 bg-white">
                                    <div className="flex items-center gap-2 text-amber-600 font-semibold"><BarChart2 className="h-5 w-5"/> Pending</div>
                                    <p className="text-2xl font-bold mt-1">{studentRegs.filter((r) => r.paymentStatus === "pending").length}</p>
                                </div>
                                <div className="rounded-lg border p-4 bg-white">
                                    <div className="flex items-center gap-2 text-blue-600 font-semibold"><CalendarDays className="h-5 w-5"/> Upcoming</div>
                                    <p className="text-2xl font-bold mt-1">{studentRegs.filter((r) => {
                                        const d = r?.event?.date as string | Date | undefined;
                                        const dt = d ? new Date(d) : new Date(NaN);
                                        return !isNaN(dt.getTime()) && dt >= new Date();
                                    }).length}</p>
                                </div>
                            </div>
                        )}
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Link href="/student/dashboard/student-register-event" className="rounded-lg border p-4 bg-white hover:shadow transition">
                                <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><CalendarDays className="h-5 w-5"/> Browse Events</div>
                                <p className="text-sm text-gray-600 mt-1">Find and register for upcoming events.</p>
                            </Link>
                            <Link href="/student/dashboard" className="rounded-lg border p-4 bg-white hover:shadow transition">
                                <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><Users className="h-5 w-5"/> My Dashboard</div>
                                <p className="text-sm text-gray-600 mt-1">View your registrations and profile.</p>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    ) : (
        <div className="mt-20 pt-2">
            {/* Hero Image with Overlay */}
            <div className="relative  w-full h-[70vh] sm:h-[60vh] xs:h-[50vh]">
                <Image
                    src={hero}
                    fill
                    priority
                    alt="College Events Hero"
                    className="object-cover brightness-75"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="max-w-5xl px-4 text-center space-y-4">
                        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
                            Empower Your Campus Events with Ease
                        </h1>
                        <p className="text-white/90 max-w-3xl mx-auto text-sm sm:text-base">
                            Plan, publish, register, pay, and track — all in one event management system for colleges and universities.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/student/dashboard/student-register-event">
                                <Button className="min-w-40">Browse Events</Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" className="min-w-40 bg-white/90 text-gray-900 hover:bg-white">
                                    Admin Login
                                </Button>
                            </Link>
                        </div>
                        <form onSubmit={onSearch} className="mx-auto max-w-2xl">
                            <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/95 p-2 shadow-sm">
                                <Search className="h-5 w-5 text-gray-500" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search events by title, category, or venue"
                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Button type="submit">Search</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col w-full items-center mb-10 px-4 sm:px-8 text-center">
                <h4 className="text-[#0071BC] text-2xl sm:text-3xl md:text-4xl font-semibold my-6">
                    P. A. Inamdar University Event Management System
                </h4>

                <p className="text-base sm:text-lg font-sans max-w-4xl leading-relaxed">
                P. A. Inamdar University is a vibrant hub of academic, social, and cultural activities. 
                With numerous events, workshops, and programs held across the campus, an efficient 
                event management system helps streamline coordination and create memorable experiences 
                for students and faculty alike.
                </p>

            <p className="text-base sm:text-lg font-sans max-w-4xl leading-relaxed mt-3">
            The P. A. Inamdar University Event Management System allows easy scheduling, registration, 
            and tracking of all campus events in one centralized platform — making event planning 
            simpler, faster, and more organized.
            </p>

            <p className="text-base sm:text-lg font-sans max-w-4xl leading-relaxed mt-3">
            With this system, the university can avoid double bookings, improve communication between 
            departments, and ensure every event runs smoothly and efficiently.
            </p>
            
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
                <div className="rounded-lg border p-4 bg-white/80 backdrop-blur">
                    <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><CalendarDays className="h-5 w-5"/> Plan</div>
                    <p className="text-sm text-gray-600 mt-1">Create and schedule events with date, venue, and capacity.</p>
                </div>
                <div className="rounded-lg border p-4 bg-white/80 backdrop-blur">
                    <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><Users className="h-5 w-5"/> Register</div>
                    <p className="text-sm text-gray-600 mt-1">Students can register in seconds with their profile.</p>
                </div>
                <div className="rounded-lg border p-4 bg-white/80 backdrop-blur">
                    <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><CreditCard className="h-5 w-5"/> Pay</div>
                    <p className="text-sm text-gray-600 mt-1">Secure online payments via Razorpay or cash confirmation.</p>
                </div>
                <div className="rounded-lg border p-4 bg-white/80 backdrop-blur">
                    <div className="flex items-center gap-2 text-[#0071BC] font-semibold"><BarChart2 className="h-5 w-5"/> Track</div>
                    <p className="text-sm text-gray-600 mt-1">Monitor registrations, payments, and attendance.</p>
                </div>
            </div>

            <div className="mt-10 w-full max-w-5xl grid gap-4 sm:grid-cols-3 text-left">
                <div className="rounded-lg border p-4 bg-white">
                    <div className="text-sm font-semibold text-gray-700">1. Create Event</div>
                    <div className="text-sm text-gray-600 mt-1">Admins publish event details and capacity.</div>
                </div>
                <div className="rounded-lg border p-4 bg-white">
                    <div className="text-sm font-semibold text-gray-700">2. Students Register</div>
                    <div className="text-sm text-gray-600 mt-1">One-click registration with payment options.</div>
                </div>
                <div className="rounded-lg border p-4 bg-white">
                    <div className="text-sm font-semibold text-gray-700">3. Verify & Attend</div>
                    <div className="text-sm text-gray-600 mt-1">QR verification and live status tracking.</div>
                </div>
            </div>
            
            <div className="mt-10 w-full max-w-5xl">
                <div className="rounded-xl bg-gradient-to-r from-[#0071BC] to-blue-600 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <div className="text-lg sm:text-xl font-semibold">Get started organizing campus events</div>
                        <div className="text-white/90 text-sm">Sign up or log in to create and manage your first event now.</div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/signup"><Button className="bg-white text-[#0a58a5] hover:bg-white/90">Create Account</Button></Link>
                        <Link href="/login"><Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">Sign In</Button></Link>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default HeroSection;


// "use client";
// import React from 'react'
// import Image from 'next/image';
// import hero from "@/app/assist/hero5.jpg";

// const HeroSection = () => {
//     return (
//         <div>
//             <div className="mt-20 relative w-full h-[70vh]">
//                 <Image src={hero} fill={true} className='object-fill' alt="noImage" />
//             </div>
//             <div className='flex flex-col w-full items-center mb-5'>
//                 <h4 className="text-[#0071BC] text-4xl font-medium text-center my-4">Event Management Platform for Colleges and Universities</h4>
//                 <p className='text-md font-sans'>Is your campus a dynamic hub of academic, social, and cultural activities? With the many activities, courses and events educational institutions offer, a</p>
//                 <p className='text-md font-sans'>complete campus event planning and scheduling software will help you execute memorable events that build your thriving campus community.</p>
//                 <p className='text-md font-sans pt-5'>EventPro's university and college event management software lets you schedule appointments and keep track of all your planning efforts with ease.</p>
//                 <p className='text-md font-sans'>Thanks to all the planning tools EventPro provides, you can eliminate the potential stress of double bookings, missed deadlines, communication</p>
//                 <p className='text-md font-sans'>breakdowns, and disorganized processes.</p>
//             </div>
            
//         </div>
//     )
// }

// export default HeroSection
