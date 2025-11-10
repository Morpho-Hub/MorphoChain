'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User as ServiceUser } from '@/src/services';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'investor' | 'admin';
  walletAddress?: string;
  isVerified: boolean;
  avatar?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: 'investor' | 'farmer';
    walletAddress?: string;
  }) => Promise<{success: boolean; error?: string; statusCode?: number}>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (token) {
        const response = await authService.getMe();
        if (response.success && response.data) {
          setUser(response.data as User);
          setIsLoggedIn(true);
        } else {
          // Token is invalid, clear it
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user as User);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Error al iniciar sesión' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    role: 'investor' | 'farmer';
    walletAddress?: string;
  }) => {
    try {
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        setUser(response.data.user as User);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        // Pasar el error completo para que pueda ser detectado
        return { 
          success: false, 
          error: response.error || 'Error al registrarse',
          statusCode: response.statusCode 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Error de conexión',
        statusCode: error?.response?.status 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const refreshUser = async () => {
    const response = await authService.getMe();
    if (response.success && response.data) {
      setUser(response.data as User);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, refreshUser, loading }}>
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
