import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
                <p className="text-gray-600">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/admin/dashboard">
                        Go to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    );
}
