'use client';

import dynamic from 'next/dynamic';

// Dynamically import LoginForm with SSR disabled
const LoginForm = dynamic(() => import('./LoginForm'), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  );
}
