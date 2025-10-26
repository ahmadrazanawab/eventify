'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, decodeToken, isTokenExpired } from '@/lib/auth';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthorized'>('loading');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getAuthToken();
                
                // If no token, redirect to login
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Check if token is valid
                const decoded = decodeToken(token);
                if (!decoded || isTokenExpired(decoded)) {
                    throw new Error('Invalid or expired token');
                }

                // Check student status via API
                const response = await fetch('/api/check-student', {
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
                
                // If user is not a student, check if they're an admin
                if (!data.isStudent) {
                    const adminCheck = await fetch('/api/check-admin', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (adminCheck.ok) {
                        router.push('/admin/dashboard');
                    } else {
                        router.push('/');
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
        return null; // Redirecting in the background
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}
