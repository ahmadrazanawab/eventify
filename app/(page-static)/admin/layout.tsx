'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { getAuthToken, decodeToken, isTokenExpired } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthorized'>('loading');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getAuthToken();
                
                // If no token, redirect to login
                if (!token) {
                    console.log('No token found, redirecting to login');
                    router.push('/login');
                    return;
                }
                console.log('Token found:', token.substring(0, 10) + '...');

                // Check if token is valid
                console.log('Decoding token...');
                const decoded = decodeToken(token);
                console.log('Decoded token:', decoded);
                
                if (!decoded) {
                    console.error('Failed to decode token');
                    throw new Error('Invalid token');
                }
                
                if (isTokenExpired(decoded)) {
                    console.error('Token expired at:', new Date(decoded.exp! * 1000));
                    throw new Error('Expired token');
                }

                // Check admin status via API
                const response = await fetch('/api/check-admin', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Not authorized');
                }

                const data = await response.json();
                
                // If user is not an admin, check if they're a student
                if (!data.isAdmin) {
                    const studentCheck = await fetch('/api/check-student', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (studentCheck.ok) {
                        router.push('/student/dashboard');
                    } else {
                        router.push('/login');
                    }
                    return;
                }

                setAuthState('authenticated');
            } catch (error) {
                console.error('Authentication error:', error);
                setAuthState('unauthorized');
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    if (authState === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (authState !== 'authenticated') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // If we're at /admin, redirect to /admin/dashboard
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
            router.push('/admin/dashboard');
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
