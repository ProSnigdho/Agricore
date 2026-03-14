'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
import { motion } from 'framer-motion';

type AdminView = 'overview' | 'notices' | 'users';

interface AdminStats {
  total_users: number;
  active_customers: number;
  total_livestock: number;
  total_notices: number;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [userList, setUserList] = useState<UserData[]>([]);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'Admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/user/admin/stats/'),
          api.get('/user/admin/users/')
        ]);
        setStats(statsRes.data);
        setUserList(usersRes.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
    };
    if (user && user.role === 'Admin') fetchData();
  }, [user]);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await api.post('/notices/', { title: noticeTitle, content: noticeContent });
      setNoticeTitle('');
      setNoticeContent('');
      const res = await api.get('/user/admin/stats/');
      setStats(res.data);
      alert('Notice published.');
    } catch (err) {
      alert('Failed to publish notice.');
    } finally {
      setLoadingAction(true);
      setTimeout(() => setLoadingAction(false), 500);
    }
  };

  if (loading || !user || user.role !== 'Admin') {
    return <div className="min-h-screen bg-[#070b14] flex items-center justify-center"><div className="spinner" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#070b14] p-8 flex flex-col">
        <h1 className="text-xl font-bold text-[#4c8c4a] mb-12">Admin Panel</h1>
        
        <nav className="flex-grow space-y-4">
          <button 
            onClick={() => setActiveView('overview')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === 'overview' ? 'bg-white/10 text-white' : 'text-[#94a3b8] hover:bg-white/5'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveView('users')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === 'users' ? 'bg-white/10 text-white' : 'text-[#94a3b8] hover:bg-white/5'}`}
          >
            User List
          </button>
          <button 
            onClick={() => setActiveView('notices')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === 'notices' ? 'bg-white/10 text-white' : 'text-[#94a3b8] hover:bg-white/5'}`}
          >
            Broadcast
          </button>
        </nav>

        <button 
          onClick={logout}
          className="mt-auto text-sm font-semibold text-red-500 hover:text-red-400 py-2 px-4"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-12 max-w-5xl">
        <header className="mb-12">
          <h2 className="text-3xl font-semibold capitalize">{activeView}</h2>
        </header>

        {activeView === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
              <p className="text-sm text-[#94a3b8] mb-2">Total Users</p>
              <p className="text-4xl font-bold">{stats?.total_users || 0}</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
              <p className="text-sm text-[#94a3b8] mb-2">Platform Notices</p>
              <p className="text-4xl font-bold">{stats?.total_notices || 0}</p>
            </div>
          </div>
        )}

        {activeView === 'users' && (
          <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-[#94a3b8] font-medium uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userList.map(u => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 font-medium">{u.username}</td>
                    <td className="px-6 py-4 text-[#94a3b8]">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${u.role === 'Admin' ? 'bg-white/10' : 'bg-[#4c8c4a]/20 text-[#8bc34a]'}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeView === 'notices' && (
          <div className="bg-white/5 p-8 rounded-2xl border border-white/5 max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Create New Notice</h3>
            <form onSubmit={handleCreateNotice} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#94a3b8]">Title</label>
                <input 
                  className="input-field !bg-white/5" 
                  value={noticeTitle}
                  onChange={e => setNoticeTitle(e.target.value)}
                  placeholder="Notice Heading"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#94a3b8]">Message</label>
                <textarea 
                  className="input-field !bg-white/5 min-h-[200px] resize-none py-3" 
                  value={noticeContent}
                  onChange={e => setNoticeContent(e.target.value)}
                  placeholder="Content..."
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loadingAction}
                className="btn-primary w-full py-3 flex items-center justify-center"
              >
                {loadingAction ? <div className="spinner" /> : 'Publish Notice'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
