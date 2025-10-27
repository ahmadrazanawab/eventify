"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CreateEventFormInputs } from '@/app/type/event';




export default function AdminDashboardPage() {
    const router = useRouter();
    const [events, setEvents] = useState<CreateEventFormInputs[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];

                if (!token) {
                    router.push('/login');
                    return;
                }

                // Verify token and role
                const verifyRes = await axios.get('/api/verify-token');
                if (verifyRes.data.role !== 'admin') {
                    router.push('/student/dashboard');
                    return;
                }

                // Fetch events
                const eventsRes = await axios.get('/api/create-event', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(eventsRes.data.data || []);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to load dashboard');
                if (err.response?.status === 401) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                    <p className="text-gray-700 mb-4">
                        {error}
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
            <div className="flex flex-1">
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, Admin!</h1>
                    <p className="text-gray-600 leading-relaxed">
                        Manage university events, users, and reports efficiently using your admin tools.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                            <h3 className="text-lg font-semibold text-blue-800">Total Events</h3>
                            <p className="text-3xl font-bold text-blue-700 mt-2">{events.length}</p>
                        </div>
                        <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                            <h3 className="text-lg font-semibold text-green-800">Upcoming Events</h3>
                            <p className="text-3xl font-bold text-green-700 mt-2">
                                {events.filter(event => new Date(event.date) > new Date()).length}
                            </p>
                        </div>
                        <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                            <h3 className="text-lg font-semibold text-purple-800">Registered Students</h3>
                            <p className="text-3xl font-bold text-purple-700 mt-2">
                                {events.reduce((total, event) => total + (event.attendees?.length || 0), 0)}
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </section>
    );
}
