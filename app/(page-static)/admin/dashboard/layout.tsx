import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import AdminLayoutClient from './admin-layout-client';

export default async function AdminDashboardLayout({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    const cookieStore =await cookies();
    const token = cookieStore.get('token')?.value;
    
    let isAuthenticated = false;
    let userRole = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role?: string };
            isAuthenticated = true;
            userRole = decoded.role || null;

            // Redirect non-admin users
            if (userRole !== 'admin') {
                redirect('/student/dashboard');
            }
        } catch (error) {
            // Token is invalid or expired
            isAuthenticated = false;
        }
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        redirect('/login');
    }

    return (
        <AdminLayoutClient isAuthenticated={isAuthenticated} userRole={userRole}>
            {children}
        </AdminLayoutClient>
    );
}

