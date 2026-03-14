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
    <div className="min-h-screen flex items-center justify-center bg-[#070b14]">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
        <h1 className="text-xl font-bold text-white">AgriCore</h1>
        <p className="text-[#94a3b8] mt-2">Loading...</p>
      </div>
    </div>
  );
}
