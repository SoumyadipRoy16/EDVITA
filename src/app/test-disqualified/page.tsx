// app/test-disqualified/page.tsx
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function TestDisqualifiedPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-600">Test Disqualification</h1>
          <p className="text-lg text-gray-600">
            You have been disqualified from the test due to violations of test guidelines. 
            This may include:
          </p>
          <ul className="list-disc list-inside text-left text-gray-600 space-y-2">
            <li>Suspected cheating</li>
            <li>Multiple browser tab switches</li>
            <li>Using unauthorized tools or resources</li>
            <li>Violation of test rules</li>
          </ul>
          <div className="flex justify-center space-x-4">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}