'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './utils/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push(user.role === 'Admin' ? '/admin' : '/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#2d5a27] mx-auto mb-4"></div>
        <h1 className="text-xl font-bold text-white">AgriCore <span className="text-[#8bc34a]">System</span></h1>
        <p className="text-[#94a3b8] mt-2">Initializing secure environment...</p>
      </div>
    </div>
  );
}
