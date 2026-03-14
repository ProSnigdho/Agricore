'use client';

import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, User, Mail, Lock, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signup(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Verify data format.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070b14] overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2d5a27]/10 blur-[120px] rounded-full"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-[540px] relative z-10 border-white/5 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#4c8c4a] to-[#2d5a27] rounded-2xl flex items-center justify-center shadow-xl shadow-green-900/30">
            <UserPlus size={28} className="text-white" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-[#94a3b8] font-medium">Join the AgriCore global cooperative</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8bc34a] uppercase tracking-widest ml-1">First Name</label>
              <input
                name="first_name"
                type="text"
                className="input-field !mt-0 !bg-white/5"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8bc34a] uppercase tracking-widest ml-1">Last Name</label>
              <input
                name="last_name"
                type="text"
                className="input-field !mt-0 !bg-white/5"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#8bc34a] uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
              <input
                name="username"
                type="text"
                className="input-field !pl-11 !mt-0 !bg-white/5"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="johndoe123"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#8bc34a] uppercase tracking-widest ml-1">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
              <input
                name="email"
                type="email"
                className="input-field !pl-11 !mt-0 !bg-white/5"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@agricore.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#8bc34a] uppercase tracking-widest ml-1">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
              <input
                name="password"
                type="password"
                className="input-field !pl-11 !mt-0 !bg-white/5"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-xs font-bold text-center bg-red-400/5 py-2 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-green-900/20 mt-4 disabled:opacity-50"
          >
            {isLoading ? 'Verifying Data...' : 'Confirm Registration'}
          </motion.button>
        </form>

        <p className="text-center mt-10 text-[#94a3b8] text-sm font-medium">
          Already verified?{' '}
          <Link href="/login" className="text-[#8bc34a] font-bold hover:text-white transition-colors underline-offset-4 hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
