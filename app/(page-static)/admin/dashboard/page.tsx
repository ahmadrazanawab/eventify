"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateEventFormInputs } from '@/app/type/event';
import { Calendar, MapPin, Users as UsersIcon, CalendarPlus, FileBarChart, ClipboardList } from "lucide-react";

type Stats = {
    totalEvents: number;
    totalStudents: number;
    upcomingEvents: number;
    totalRegistrations: number;
};

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentEvents, setRecentEvents] = useState<CreateEventFormInputs[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, eventsRes] = await Promise.all([
                    axios.get('/api/admin/stats'),
                    axios.get('/api/events?limit=5')
                ]);

                setStats(statsRes.data.data);
                setRecentEvents(eventsRes.data.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;

    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!stats) return <div>No data available</div>;

    return (
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-blue-700">
                        <CardTitle className="text-sm font-medium text-blue-700">Total Events</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5 text-blue-500">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">{stats.totalEvents}</div>
                        <p className="text-xs text-blue-700/70">Total events created</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-emerald-700">
                        <CardTitle className="text-sm font-medium text-emerald-700">Total Students</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5 text-emerald-500">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">{stats.totalStudents}</div>
                        <p className="text-xs text-emerald-700/70">Registered students</p>
                    </CardContent>
                </Card>

                <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-white hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-amber-700">
                        <CardTitle className="text-sm font-medium text-amber-700">Upcoming Events</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5 text-amber-500">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">{stats.upcomingEvents}</div>
                        <p className="text-xs text-amber-700/70">Scheduled events</p>
                    </CardContent>
                </Card>

                <Card className="border-violet-100 bg-gradient-to-br from-violet-50 to-white hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-violet-700">
                        <CardTitle className="text-sm font-medium text-violet-700">Total Registrations</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5 text-violet-500">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-violet-700">{stats.totalRegistrations}</div>
                        <p className="text-xs text-violet-700/70">Event registrations</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Events and Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-md transition">
                    <CardHeader>
                        <CardTitle>Recent Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentEvents.length > 0 ? (
                            <ul className="divide-y">
                                {recentEvents.map((event) => (
                                    <li key={event._id} className="py-3 flex items-start justify-between gap-3">
                                        <div>
                                            <div className="font-medium">{event.title}</div>
                                            <div className="mt-1 text-xs text-gray-600 flex items-center gap-3 flex-wrap">
                                                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/> {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> {event.venue ?? event.location ?? 'No location'}</span>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={() => router.push('/admin/dashboard/events')}>View</Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">No recent events</p>
                        )}
                        <div className="mt-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push('/admin/dashboard/events')}
                            >
                                View All Events
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Button className="w-full justify-start gap-2" onClick={() => router.push('/admin/dashboard/events')}>
                            <CalendarPlus className="h-4 w-4"/> Create New Event
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push('/admin/dashboard/events')}>
                            <ClipboardList className="h-4 w-4"/> Manage Events
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push('/admin/dashboard/registrations')}>
                            <FileBarChart className="h-4 w-4"/> Registrations
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push('/admin/dashboard/users')}>
                            <UsersIcon className="h-4 w-4"/> Users
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push('/admin/dashboard/reports')}>
                            <FileBarChart className="h-4 w-4"/> Reports
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
