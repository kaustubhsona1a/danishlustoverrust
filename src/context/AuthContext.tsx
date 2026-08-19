import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginAsDealer: () => void; // Keep for interface compatibility, but implement via Supabase
  loginWithGoogle?: () => Promise<void>; 
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginAsDealer: () => {},
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdminRole(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setIsAdmin(true); // Is admin
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      console.error('Failed to check admin role', e);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loginAsDealer = () => {
    // Phase 5: "Remove Hardcoded PIN, Dealer mode, LocalStorage login flags"
    // We will redirect to a proper Supabase Login page later or show a form
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loading, 
      loginAsDealer, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

