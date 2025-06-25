"use client";
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('echocrm_token') : null;
    const userName = typeof window !== 'undefined' ? localStorage.getItem('echocrm_user_name') : null;

    if (token && userName) {
      setUser({ name: userName, token });
    }
    setLoading(false);
  }, []);

  const login = useCallback((token, name) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('echocrm_token', token);
      localStorage.setItem('echocrm_user_name', name);
    }
    setUser({ name, token });
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('echocrm_token');
      localStorage.removeItem('echocrm_user_name');
    }
    setUser(null);
    router.push('/'); // MODIFIED: Redirects to the homepage after logout.
  }, [router]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    login,
    logout,
    loading
  }), [user, login, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth() hook was called outside of the AuthProvider. Ensure your component is a descendant of <AuthProvider>.');
  }
  return context;
};