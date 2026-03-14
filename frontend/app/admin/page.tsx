'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  Settings, 
  LogOut, 
  TrendingUp, 
  ShieldCheck, 
  Bell,
  ArrowBigUpDash,
  Mail,
  Calendar,
  Shield
} from 'lucide-react';
import api from '../utils/api';

type AdminView = 'overview' | 'notices' | 'users';

interface AdminStats {
  total_users: number;
  active_customers: number;
  total_livestock: number;
  total_notices: number;
  system_health: string;
  performance_nodes: number[];
}

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<AdminView>('overview');
  
  // Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [userList, setUserList] = useState<UserData[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'Admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/user/admin/stats/');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      }
    };
    if (user && user.role === 'Admin') fetchStats();
  }, [user]);

  // Fetch Users when view changes
  useEffect(() => {
    if (activeView === 'users' && user) {
      const fetchUsers = async () => {
        setFetchingData(true);
        try {
          const res = await api.get('/user/admin/users/');
          setUserList(res.data);
        } catch (err) {
          console.error("Failed to fetch users", err);
        } finally {
          setFetchingData(false);
        }
      };
      fetchUsers();
    }
  }, [activeView, user]);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/notices/', { title: noticeTitle, content: noticeContent });
      setSuccess(true);
      setNoticeTitle('');
      setNoticeContent('');
      setTimeout(() => setSuccess(false), 3000);
      // Refresh stats after creating notice
      const res = await api.get('/user/admin/stats/');
      setStats(res.data);
    } catch (err) {
      console.error("Notice creation failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-[#4c8c4a] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex font-sans">
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex w-full"
        >
          {/* Sidebar */}
          <aside className="w-72 bg-[#0f172a] border-r border-white/5 p-8 flex flex-col fixed h-full shadow-2xl z-50">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4c8c4a] to-[#2d5a27] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                <ArrowBigUpDash size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">AgriCore <span className="text-[#8bc34a]">Admin</span></h1>
            </div>

            <nav className="space-y-2 flex-grow">
              <SidebarItem 
                icon={<LayoutDashboard size={20} />} 
                label="Overview" 
                active={activeView === 'overview'} 
                onClick={() => setActiveView('overview')} 
              />
              <SidebarItem 
                icon={<Megaphone size={20} />} 
                label="Post Notice" 
                active={activeView === 'notices'} 
                onClick={() => setActiveView('notices')} 
              />
              <SidebarItem 
                icon={<Users size={20} />} 
                label="Users" 
                active={activeView === 'users'} 
                onClick={() => setActiveView('users')} 
              />
            </nav>

            <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-xs font-bold border border-white/10 text-[#8bc34a]">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold truncate max-w-[120px]">{user.username}</p>
                  <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Premium Admin</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/5 rounded-xl transition-all font-medium group"
              >
                <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="flex-grow ml-72 p-12 overflow-y-auto">
            <header className="flex justify-between items-start mb-16">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={activeView}
              >
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">
                  {activeView === 'overview' ? 'System Overview' : activeView === 'notices' ? 'Notice Management' : 'User Directory'}
                </h2>
                <p className="text-[#94a3b8] flex items-center gap-2 font-medium">
                  <ShieldCheck size={14} className="text-[#8bc34a]" /> Security Protocol Active • Live API Data
                </p>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#1e293b] rounded-full text-[#94a3b8] cursor-pointer hover:text-white transition">
                  <Bell size={20} />
                </div>
              </div>
            </header>

            <div className="flex gap-10 h-full max-w-7xl">
              {/* Left Column (Stats or Content) */}
              <div className={`flex-grow space-y-8 transition-all duration-500 ${activeView === 'notices' ? 'w-1/2' : 'w-full'}`}>
                {activeView === 'overview' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatCard label="Total Livestock" value={stats?.total_livestock.toString() || "..."} trend="Live" icon={<TrendingUp size={20} />} />
                      <StatCard label="Active Customers" value={stats?.active_customers.toString() || "..."} trend="Current" icon={<Users size={20} />} />
                      <StatCard label="System Health" value={stats?.system_health || "..."} trend="Stable" icon={<ShieldCheck size={20} />} />
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card mt-10 !p-10 border-[#4c8c4a]/10"
                    >
                      <h3 className="text-xl font-bold mb-6">Real-time Performance</h3>
                      <div className="h-64 flex items-end gap-3 px-4">
                        {(stats?.performance_nodes || [40, 70, 45, 90, 65, 80, 55, 95, 75, 85]).map((h, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05 }}
                            className="flex-grow bg-[#2d5a27]/20 rounded-t-lg border-t-2 border-[#4c8c4a]/40"
                          />
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}

                {activeView === 'notices' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Drafting Workspace</h3>
                    <p className="text-[#94a3b8]">You have currently published <span className="text-white font-bold">{stats?.total_notices || 0}</span> global notices.</p>
                    <div className="p-10 bg-white/5 border border-white/5 rounded-3xl">
                      <div className="flex items-center gap-4 text-[#8bc34a] mb-6">
                        <Megaphone size={32} />
                        <span className="text-sm font-bold uppercase tracking-widest">Global Broadcast</span>
                      </div>
                      <p className="text-lg text-white/60 italic leading-relaxed">
                        "Your broadcast will reach {stats?.active_customers || 0} active customers instantly."
                      </p>
                    </div>
                  </div>
                )}
                
                {activeView === 'users' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-white">Registered Entities</h3>
                      <span className="bg-[#4c8c4a]/20 text-[#8bc34a] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#4c8c4a]/20">
                        {userList.length} Total Users
                      </span>
                    </div>

                    <div className="overflow-hidden bg-[#0f172a] rounded-3xl border border-white/5 shadow-2xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5">
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#8bc34a]">Identity</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#8bc34a]">Email Link</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#8bc34a]">Category</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#8bc34a]">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {userList.map((u) => (
                            <motion.tr 
                              key={u.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-white/5 transition-colors group"
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold border border-white/10 group-hover:border-[#4c8c4a]/50 transition-colors">
                                    {u.username.slice(0, 1).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-white">{u.username}</p>
                                    <p className="text-[10px] text-[#94a3b8]">{u.first_name} {u.last_name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-xs text-[#94a3b8] font-medium flex items-center gap-2">
                                  <Mail size={12} className="text-[#8bc34a]/60" /> {u.email}
                                </span>
                              </td>
                              <td className="px-6 py-5">
                                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                  u.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Verified</span>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                          {fetchingData && (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-[#94a3b8] italic text-sm animate-pulse">
                                Retrieving encrypted user database...
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (Notice Form) - Only visible when Posting Notice */}
              <AnimatePresence>
                {activeView === 'notices' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.95 }}
                    className="w-[450px] shrink-0"
                  >
                    <div className="glass-card !bg-[#0f172a] border-white/10 sticky top-12 shadow-2xl overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4c8c4a] to-transparent"></div>
                      <h3 className="text-2xl font-bold mb-8 text-white">Compose Broadcast</h3>
                      
                      <form onSubmit={handleCreateNotice} className="space-y-6">
                        <div>
                          <label className="text-xs font-bold text-[#8bc34a] uppercase tracking-wider block mb-2">Notice Title</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#4c8c4a] focus:ring-0 transition outline-none text-white text-lg placeholder:text-white/20"
                            placeholder="Headline of the notice"
                            value={noticeTitle}
                            onChange={(e) => setNoticeTitle(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs font-bold text-[#8bc34a] uppercase tracking-wider block mb-2">Description</label>
                          <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#4c8c4a] focus:ring-0 transition outline-none text-white min-h-[250px] resize-none placeholder:text-white/20"
                            placeholder="Write your announcement details here..."
                            value={noticeContent}
                            onChange={(e) => setNoticeContent(e.target.value)}
                            required
                          />
                        </div>

                        {success && (
                          <motion.p 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="text-green-400 font-bold flex items-center gap-2 text-sm"
                          >
                            <ShieldCheck size={16} /> Broadcast successful and live.
                          </motion.p>
                        )}

                        <button 
                          disabled={submitting}
                          className="w-full py-5 bg-gradient-to-r from-[#4c8c4a] to-[#2d5a27] rounded-2xl font-bold text-lg shadow-xl shadow-green-900/10 hover:shadow-green-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          {submitting ? 'Transmitting...' : 'Dispatch Notice'}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${
        active 
          ? 'bg-[#2d5a27] text-white shadow-lg shadow-green-900/20' 
          : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]" />}
    </button>
  );
}

function StatCard({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card shadow-xl border-white/5"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl text-[#8bc34a] border border-white/10">
          {icon}
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${trend === 'Stable' ? 'bg-blue-400/10 text-blue-400' : 'bg-green-400/10 text-green-400'}`}>
          {trend}
        </span>
      </div>
      <p className="text-[#94a3b8] text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-extrabold tracking-tighter">{value}</p>
    </motion.div>
  );
}
