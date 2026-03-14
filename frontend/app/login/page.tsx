'use client';

import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
      setError('Invalid credentials. Please try again.');
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
      setError('Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070b14]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-[400px] border-white/5"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
          <p className="text-[#94a3b8] text-sm">Welcome back to AgriCore</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#94a3b8] ml-1">Username</label>
            <input
              type="text"
              className="input-field !bg-white/5"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#94a3b8] ml-1">Password</label>
            <input
              type="password"
              className="input-field !bg-white/5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
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
            className="btn-primary w-full py-3 text-base font-bold flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isLoading ? <div className="spinner" /> : 'Login'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/5 w-full"></div>
            <span className="bg-[#0f172a] px-3 text-[10px] text-[#94a3b8] uppercase absolute">or</span>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              theme="outline"
              shape="pill"
            />
          </div>
        </div>

        <p className="text-center mt-8 text-[#94a3b8] text-sm">
          No account?{' '}
          <Link href="/signup" className="text-[#4c8c4a] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
