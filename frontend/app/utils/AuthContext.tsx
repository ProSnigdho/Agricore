'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';
import { User, AuthState } from '../types/auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token) {
        try {
          const res = await api.get<User>('user/profile/');
          setUser(res.data);
          // Sync cookie on refresh
          document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const setAuthData = (data: { access: string; refresh: string; user?: User }) => {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    // Set cookie for middleware access (7 days for simplicity)
    document.cookie = `access_token=${data.access}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    if (data.user) setUser(data.user);
  };

  const login = async (credentials: any) => {
    const res = await api.post<{ access: string; refresh: string }>('user/login/', credentials);
    setAuthData(res.data);
    const profile = await api.get<User>('user/profile/');
    setUser(profile.data);
    router.push(profile.data.role === 'Admin' ? '/admin' : '/dashboard');
  };

  const signup = async (userData: any) => {
    const res = await api.post<{ user: User; access: string; refresh: string }>('user/register/', userData);
    setAuthData(res.data);
    setUser(res.data.user);
    router.push('/dashboard');
  };

  const googleLogin = async (googleToken: string) => {
    const res = await api.post<{ user: User; access: string; refresh: string }>('user/login/google/', { token: googleToken });
    setAuthData(res.data);
    setUser(res.data.user);
    router.push('/dashboard');
  }

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
