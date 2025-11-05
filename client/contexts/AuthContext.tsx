'use client';

import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
  role: 'farmer' | 'investor';
  avatar?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper para cargar usuario desde localStorage
const loadUserFromStorage = (): { user: User | null; isLoggedIn: boolean } => {
  if (typeof window === 'undefined') {
    return { user: null, isLoggedIn: false };
  }
  
  try {
    const savedUser = localStorage.getItem('morphochain_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      return { user: userData, isLoggedIn: true };
    }
  } catch (error) {
    console.error('Error loading user from storage:', error);
    localStorage.removeItem('morphochain_user');
  }
  
  return { user: null, isLoggedIn: false };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(() => loadUserFromStorage());
  const { user, isLoggedIn } = state;

  const login = (userData: User) => {
    setState({ user: userData, isLoggedIn: true });
    localStorage.setItem('morphochain_user', JSON.stringify(userData));
  };

  const logout = () => {
    setState({ user: null, isLoggedIn: false });
    localStorage.removeItem('morphochain_user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
