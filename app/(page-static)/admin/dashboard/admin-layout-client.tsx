'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export default function AdminLayoutClient({ 
    children,
    isAuthenticated,
    userRole
}: { 
    children: React.ReactNode,
    isAuthenticated: boolean,
    userRole: string | null
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (userRole !== 'admin') {
            router.push('/student/dashboard');
            return;
        }

        setIsLoading(false);
    }, [isAuthenticated, userRole, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white">
            <AdminSidebar />
            <main className="flex-1 p-4 lg:p-8 lg:ml-64 mt-16 lg:mt-0">
                {children}
            </main>
        </div>
    );
}
