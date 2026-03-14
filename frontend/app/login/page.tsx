'use client';

import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, LifeBuoy } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ username, password });
    } catch (err) {
      setError('Identity verification failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await googleLogin(credentialResponse.credential);
      }
    } catch (err) {
      setError('Google synchronization failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070b14] overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2d5a27]/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#4c8c4a]/5 blur-[100px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-[480px] relative z-10 border-white/5 shadow-2xl"
      >
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4c8c4a] to-[#2d5a27] rounded-2xl flex items-center justify-center shadow-2xl shadow-green-900/40">
            <LifeBuoy size={32} className="text-white" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Access Portal</h1>
          <p className="text-[#94a3b8] font-medium">Verify your identity to proceed to AgriCore</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8bc34a] uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
              <input
                type="text"
                className="input-field !pl-12 !mt-0 !bg-white/5"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="User identifier"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8bc34a] uppercase tracking-widest ml-1">Secret Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
              <input
                type="password"
                className="input-field !pl-12 !mt-0 !bg-white/5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-semibold flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-green-900/20 mt-4 disabled:opacity-50"
          >
            {isLoading ? 'Decrypting Access...' : 'Establish Session'}
          </motion.button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="border-t border-white/5 w-full"></div>
            <span className="bg-[#1e293b] px-4 text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] absolute">Secure Auth Link</span>
          </div>

          <div className="flex justify-center">
            <div className="hover:scale-105 transition-transform">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('External identity link failed')}
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-[#94a3b8] text-sm font-medium">
          New system user?{' '}
          <Link href="/signup" className="text-[#8bc34a] font-bold hover:text-white transition-colors underline-offset-4 hover:underline">
            Initiate Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
