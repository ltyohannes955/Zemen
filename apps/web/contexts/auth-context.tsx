'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, setTokens, clearTokens } from '../lib/api-client';
import type { AuthResponse } from '@zemen/scheduler';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zemen_access_token');
    if (token) {
      api.auth.profile()
        .then((profile) => setUser(profile as User))
        .catch(() => clearTokens())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    handleAuthResponse(res);
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const res = await api.auth.register({ email, password, name });
    handleAuthResponse(res);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  function handleAuthResponse(res: AuthResponse) {
    setTokens(res.accessToken, res.refreshToken);
    setUser(res.user);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
