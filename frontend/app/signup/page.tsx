'use client';

import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
      setError('Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070b14]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-[450px] border-white/5"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign Up</h1>
          <p className="text-[#94a3b8] text-sm">Create your AgriCore account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8] ml-1">First Name</label>
              <input
                name="first_name"
                type="text"
                className="input-field !bg-white/5 !py-2.5"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94a3b8] ml-1">Last Name</label>
              <input
                name="last_name"
                type="text"
                className="input-field !bg-white/5 !py-2.5"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8] ml-1">Username</label>
            <input
              name="username"
              type="text"
              className="input-field !bg-white/5 !py-2.5"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="johndoe"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8] ml-1">Email</label>
            <input
              name="email"
              type="email"
              className="input-field !bg-white/5 !py-2.5"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94a3b8] ml-1">Password</label>
            <input
              name="password"
              type="password"
              className="input-field !bg-white/5 !py-2.5"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs font-medium text-center bg-red-400/10 py-2 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-3 text-base font-bold flex items-center justify-center gap-3 disabled:opacity-70 mt-2"
          >
            {isLoading ? <div className="spinner" /> : 'Register'}
          </button>
        </form>

        <p className="text-center mt-8 text-[#94a3b8] text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#4c8c4a] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
