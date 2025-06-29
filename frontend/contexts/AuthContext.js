"use client";
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect runs once on mount to check localStorage for an existing session
    const token = typeof window !== 'undefined' ? localStorage.getItem('echocrm_token') : null;
    const userName = typeof window !== 'undefined' ? localStorage.getItem('echocrm_user_name') : null;

    if (token && userName) {
      setUser({ name: userName, token });
    }
    setLoading(false); // Finished initial auth check
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
    // --- THIS IS THE CRITICAL FIX ---
    // It now correctly redirects to the homepage ('/').
    router.push('/'); 
  }, [router]);

  // Memoize the context value to prevent unnecessary re-renders of consumers
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
  // This check is crucial for debugging. If it fires, a component is outside the provider.
  if (!context) {
    throw new Error('useAuth() hook was called outside of the AuthProvider. Ensure your component is a descendant of <AuthProvider>.');
  }
  return context;
};