'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  LogOut, 
  Bell, 
  User as UserIcon, 
  Activity, 
  Calendar,
  ExternalLink
} from 'lucide-react';

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-10 w-10 border-t-2 border-[#8bc34a] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-8 font-sans">
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-16 max-w-7xl mx-auto bg-[#0f172a]/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2d5a27] rounded-xl flex items-center justify-center">
            <Leaf size={24} className="text-[#8bc34a]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AgriCore <span className="text-[#8bc34a]">Portal</span></h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold">{user.first_name || user.username}</p>
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest">{user.role} Account</p>
          </div>
          <button 
            onClick={logout} 
            className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 font-bold text-sm"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            title="My Profile" 
            value={user.username} 
            subtitle={user.email} 
            icon={<UserIcon size={20} />} 
            delay={0.1}
          />
          <DashboardCard 
            title="Account Status" 
            value="Verified" 
            subtitle="JWT Authentication Active" 
            icon={<Activity size={20} />} 
            color="#8bc34a"
            delay={0.2}
          />
          <DashboardCard 
            title="Last Sync" 
            value={new Date().toLocaleDateString()} 
            subtitle="System Online" 
            icon={<Calendar size={20} />} 
            delay={0.3}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card !bg-[#0f172a] border-white/5 !p-10"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-1">Global Notices</h2>
              <p className="text-[#94a3b8] text-sm font-medium">Updates from AgriCore Administration</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${fetching ? 'bg-blue-500/10 text-blue-400' : 'bg-[#2d5a27] text-white'}`}>
              {fetching ? 'Syncing...' : 'Live Feed'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {fetching ? (
                <p className="text-[#94a3b8] italic">Accessing database records...</p>
              ) : notices.length > 0 ? (
                notices.map((notice, i) => (
                  <motion.div 
                    key={notice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="group p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#4c8c4a]/30 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={16} className="text-[#8bc34a]" />
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#8bc34a] mt-2.5 shadow-[0_0_8px_#8bc34a]" />
                      <div>
                        <h4 className="font-bold text-white text-lg group-hover:text-[#8bc34a] transition-colors">{notice.title}</h4>
                        <p className="text-[#94a3b8] mt-2 leading-relaxed">{notice.content}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                            {new Date(notice.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] font-black text-[#4c8c4a] uppercase tracking-widest">
                            Official Archive
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-[#94a3b8] font-medium">No official broadcasts found in the repository.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function DashboardCard({ title, value, subtitle, icon, color = "#94a3b8", delay = 0 }: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  color?: string; 
  delay?: number; 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="glass-card border-white/5 !p-8 shadow-2xl"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10" style={{ color }}>
          {icon}
        </div>
      </div>
      <p className="text-[#94a3b8] text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-bold tracking-tight text-white mb-1">{value}</p>
      <p className="text-xs text-[#94a3b8] font-medium">{subtitle}</p>
    </motion.div>
  );
}
