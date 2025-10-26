"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardStats() {
    const [stats, setStats] = useState({ 
        totalEvents: 0, 
        upcomingEvents: 0, 
        registeredStudents: 0 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/admin/stats');
                setStats(response.data.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-800">Total Events</h3>
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <p className="text-3xl font-bold text-blue-700 mt-2">{stats.totalEvents}</p>
            </div>

            <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-green-800">Upcoming Events</h3>
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <p className="text-3xl font-bold text-green-700 mt-2">{stats.upcomingEvents}</p>
            </div>

            <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-purple-800">Registered Students</h3>
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <p className="text-3xl font-bold text-purple-700 mt-2">{stats.registeredStudents}</p>
            </div>
        </div>
    );
}
