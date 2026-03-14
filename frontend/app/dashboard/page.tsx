'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
import { motion } from 'framer-motion';

interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user && user.role === 'Admin') {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/notices/');
        setNotices(res.data);
      } catch (err) {
        console.error("Failed to fetch notices", err);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchNotices();
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#070b14] flex items-center justify-center"><div className="spinner" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 py-4 px-8 flex justify-between items-center bg-[#070b14]">
        <h1 className="text-xl font-bold text-[#4c8c4a]">AgriCore</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#94a3b8]">{user.username}</span>
          <button 
            onClick={logout}
            className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto py-12 px-8">
        <header className="mb-12">
          <h2 className="text-3xl font-semibold mb-2">Dashboard</h2>
          <p className="text-[#94a3b8]">Hello, {user.first_name || user.username}. Welcome back.</p>
        </header>

        <section className="space-y-8">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Profile</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#94a3b8]">Username</p>
                <p>{user.username}</p>
              </div>
              <div>
                <p className="text-[#94a3b8]">Email</p>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Latest Notices</h3>
            <div className="space-y-4">
              {fetching ? (
                <div className="flex justify-center py-4"><div className="spinner" /></div>
              ) : notices.length > 0 ? (
                notices.map((notice) => (
                  <div key={notice.id} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <h4 className="font-medium text-white">{notice.title}</h4>
                    <p className="text-[#94a3b8] text-sm mt-1">{notice.content}</p>
                    <p className="text-[10px] text-[#4c8c4a] mt-2 uppercase">{new Date(notice.created_at).toDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-[#94a3b8] py-8">No notices available.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
