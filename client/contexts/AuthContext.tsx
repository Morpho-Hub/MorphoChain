'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { authService } from '@/src/services';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'investor' | 'admin';
  walletAddress: string;
  isVerified: boolean;
  avatar?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  walletAddress: string | undefined;
  needsOnboarding: boolean;
  completeOnboarding: (data: {
    name: string;
    email: string;
    role: 'investor' | 'farmer';
  }) => Promise<{success: boolean; error?: string}>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const account = useActiveAccount();
  const walletAddress = account?.address;

  // Check if user exists when wallet connects
  useEffect(() => {
    const checkUserByWallet = async () => {
      if (!walletAddress) {
        setUser(null);
        setIsLoggedIn(false);
        setNeedsOnboarding(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Try to get user by wallet address
        const response = await authService.getUserByWallet(walletAddress);
        
        if (response.success && response.data) {
          // User exists, login
          setUser(response.data as User);
          setIsLoggedIn(true);
          setNeedsOnboarding(false);
        } else {
          // User doesn't exist, needs onboarding
          setUser(null);
          setIsLoggedIn(false);
          setNeedsOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setNeedsOnboarding(true);
      } finally {
        setLoading(false);
      }
    };

    checkUserByWallet();
  }, [walletAddress]);

  const completeOnboarding = async (data: {
    name: string;
    email: string;
    role: 'investor' | 'farmer';
  }) => {
    if (!walletAddress) {
      return { success: false, error: 'No wallet connected' };
    }

    try {
      const response = await authService.registerWithWallet({
        ...data,
        walletAddress,
      });
      
      if (response.success && response.data) {
        setUser(response.data.user as User);
        setIsLoggedIn(true);
        setNeedsOnboarding(false);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Error al completar perfil'
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Error de conexión'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setNeedsOnboarding(false);
    // Note: This doesn't disconnect the wallet, just clears the user data
  };

  const refreshUser = async () => {
    if (!walletAddress) return;
    
    const response = await authService.getUserByWallet(walletAddress);
    if (response.success && response.data) {
      setUser(response.data as User);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      walletAddress,
      needsOnboarding,
      completeOnboarding,
      logout, 
      refreshUser, 
      loading 
    }}>
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
