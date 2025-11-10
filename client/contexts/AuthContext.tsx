'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { authService } from '@/src/services';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  name?: string; // Computed field
  email: string;
  role: 'farmer' | 'investor' | 'admin';
  walletAddress: string;
  emailVerified?: boolean;
  isVerified?: boolean;
  profilePicture?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  country?: string;
  language?: string;
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
  // Normalize wallet address to lowercase to match database format
  const walletAddress = account?.address?.toLowerCase();

  // Check if user exists when wallet connects or on mount
  useEffect(() => {
    const checkUserByWallet = async () => {
      // First, try to load from localStorage on mount
      if (!walletAddress) {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('🔄 Restoring user from localStorage:', userData);
            setUser(userData);
            setIsLoggedIn(true);
            setNeedsOnboarding(false);
          } catch (e) {
            console.error('Error parsing stored user:', e);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
        
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        console.log('🔍 Checking wallet:', walletAddress);
        
        // Try to get user by wallet address
        const response = await authService.getUserByWallet(walletAddress);
        
        console.log('📡 Response from getUserByWallet:', response);
        
        if (response.success && response.data) {
          // User exists, login
          // The response contains { user, token }
          const userData = response.data.user || response.data;
          console.log('✅ Usuario encontrado:', userData);
          setUser(userData as User);
          setIsLoggedIn(true);
          setNeedsOnboarding(false);
        } else {
          // User doesn't exist, needs onboarding
          console.log('❌ Usuario no encontrado, needs onboarding');
          setUser(null);
          setIsLoggedIn(false);
          setNeedsOnboarding(true);
        }
      } catch (error) {
        console.error('❌ Error checking user:', error);
        // On error, check if user doesn't exist or it's a network issue
        setUser(null);
        setIsLoggedIn(false);
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
    } catch (error) {
      console.error('Error completing onboarding:', error);
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
      const userData = response.data.user || response.data;
      setUser(userData as User);
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
