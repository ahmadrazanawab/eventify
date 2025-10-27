import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import axios from "axios";


export default async function AdminDashboardPage() {
    try {
        const cookiesStore = cookies();
        const token = cookiesStore.get("token")?.value;

        if (!token) {
            console.log('No token found, redirecting to login');
            redirect("/login");
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
            if (decoded.role !== "admin") {
                console.log('Non-admin user, redirecting to student dashboard');
                redirect("/student/dashboard");
            }
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError);
            redirect("/login");
        }

        // For server-side requests in production, we should use relative URLs
        const apiUrl = process.env.NODE_ENV === 'production' 
            ? '/api/create-event' 
            : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/create-event`;

        console.log('Fetching events from:', apiUrl);
        const res = await fetch(apiUrl, {
            cache: 'no-store', // Ensure we're not getting cached data
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${cookiesStore.get('token')?.value}`
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('API request failed:', res.status, errorText);
            throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Events data received:', data?.data?.length || 0, 'events');
        return (
            <section className="min-h-screen mt-24 w-full flex flex-col bg-white">
                <div className="flex flex-1">
                    <main className="flex-1 p-8">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, Admin!</h1>
                        <p className="text-gray-600 leading-relaxed">
                            Manage university events, users, and reports efficiently using your admin tools.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                                <h3 className="text-lg font-semibold text-blue-800">Total Events</h3>
                                <p className="text-3xl font-bold text-blue-700 mt-2">{data?.data?.length || 0}</p>
                            </div>
                            <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                                <h3 className="text-lg font-semibold text-green-800">Upcoming Events</h3>
                                <p className="text-3xl font-bold text-green-700 mt-2">4</p>
                            </div>
                            <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                                <h3 className="text-lg font-semibold text-purple-800">Registered Students</h3>
                                <p className="text-3xl font-bold text-purple-700 mt-2">280</p>
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error in AdminDashboardPage:', error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                    <p className="text-gray-700 mb-4">
                        We're having trouble loading the admin dashboard. Please try again later.
                    </p>
                    <p className="text-sm text-gray-500">
                        Error: {error instanceof Error ? error.message : 'Unknown error'}
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }


    return (
        <section className="min-h-screen mt-24 w-full flex flex-col bg-white">
            {/* ✅ Use existing Navbar */}
            {/* <NavbarWrapper /> */}

            <div className="flex flex-1">
                {/* Sidebar */}
                {/* <AdminSidebar /> */}

                {/* Main Dashboard Area */}
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, Admin!</h1>
                    <p className="text-gray-600 leading-relaxed">
                        Manage university events, users, and reports efficiently using your admin tools.
                    </p>

                    {/* Dashboard Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                            <h3 className="text-lg font-semibold text-blue-800">Total Events</h3>
                            <p className="text-3xl font-bold text-blue-700 mt-2">{data?.data?.length || 0}</p>
                        </div>

                        <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                            <h3 className="text-lg font-semibold text-green-800">Upcoming Events</h3>
                            <p className="text-3xl font-bold text-green-700 mt-2">4</p>
                        </div>

                        <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                            <h3 className="text-lg font-semibold text-purple-800">Registered Students</h3>
                            <p className="text-3xl font-bold text-purple-700 mt-2">280</p>
                        </div>
                    </div>
                </main>
            </div>
        </section>
    );
}
