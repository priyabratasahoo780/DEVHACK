import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial session check
    const initSession = async () => {
      if (!supabase) {
        // Demo mode
        const saved = localStorage.getItem('agrisaar_demo_user');
        if (saved) setUser(JSON.parse(saved));
        setLoading(false);
        return;
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      const demoUser = localStorage.getItem('agrisaar_demo_user');
      if (!currentSession && demoUser) {
        setUser(JSON.parse(demoUser));
      } else {
        setUser(currentSession?.user ?? null);
      }
      setLoading(false);
    };

    initSession();

    // 2. Auth state change listener
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
          const demoUser = localStorage.getItem('agrisaar_demo_user');
          if (!newSession && demoUser) {
            setUser(JSON.parse(demoUser));
          } else {
            setUser(newSession?.user ?? null);
          }
          setLoading(false);
        }
      );
      return () => subscription.unsubscribe();
    }
  }, []);

  // Get current access token for API calls
  const getAccessToken = async () => {
    if (!supabase) return 'demo-token';
    const { data: { session: s } } = await supabase.auth.getSession();
    return s?.access_token ?? null;
  };

  const signup = async (email, password, name, phone) => {
    if (!supabase) {
      const mockUser = { uid: 'demo-' + Date.now(), email, displayName: name, phone: phone, isDemo: true };
      setUser(mockUser);
      localStorage.setItem('agrisaar_demo_user', JSON.stringify(mockUser));
      return { user: mockUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, phone: phone } },
    });
    if (error) throw error;
    return data;
  };

  const login = async (identifier, password) => {
    if (!supabase) {
      const displayName = identifier.includes('@') ? identifier.split('@')[0] : identifier;
      const mockUser = { uid: 'demo-user', identifier, displayName, isDemo: true };
      setUser(mockUser);
      localStorage.setItem('agrisaar_demo_user', JSON.stringify(mockUser));
      return { user: mockUser };
    }

    const isEmail = identifier.includes('@');
    const credentials = isEmail 
      ? { email: identifier, password } 
      : { phone: identifier, password };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      setSession(null);
      localStorage.removeItem('agrisaar_demo_user');
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const googleLogin = async () => {
    if (!supabase) {
      const mockUser = { uid: 'demo-google', email: 'demo@google.com', displayName: 'Google User', isDemo: true };
      setUser(mockUser);
      localStorage.setItem('agrisaar_demo_user', JSON.stringify(mockUser));
      return;
    }

    // signInWithOAuth redirects the browser — does NOT return a session
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    // Browser will redirect to Google, then back to /auth/callback
    // No session is available here — it comes after the redirect
  };

  const value = {
    user,
    session,
    loading,
    signup,
    login,
    logout,
    googleLogin,
    getAccessToken,
    isDemo: !supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
