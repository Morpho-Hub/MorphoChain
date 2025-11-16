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
  // Preserve checksum-cased address from Thirdweb
  const walletAddress = account?.address;

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
        
        // Try to get user by wallet address (backend will normalize for lookup)
        const response = await authService.getUserByWallet(walletAddress);
        
        console.log('📡 Response from getUserByWallet:', response);
        console.log('📡 response.success:', response.success);
        console.log('📡 response.data:', response.data);
        console.log('📡 response.error:', response.error);
        
        if (response.success && response.data) {
          // User exists, login
          // The response contains { user, token }
          const userData = response.data.user || response.data;
          console.log('✅ Usuario encontrado:', userData);
          console.log('Setting isLoggedIn=true, needsOnboarding=false');
          setUser(userData as User);
          setIsLoggedIn(true);
          setNeedsOnboarding(false);
          
          // Store in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(userData));
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
        } else {
          // User doesn't exist, needs onboarding
          console.log('❌ Usuario no encontrado, needs onboarding');
          console.log('Setting isLoggedIn=false, needsOnboarding=true');
          setUser(null);
          setIsLoggedIn(false);
          setNeedsOnboarding(true);
        }
      } catch (error: any) {
        console.error('❌ Error checking user:', error);
        
        // Check if it's a 404 (user not found) - that means needs onboarding
        // Any other error (network, server, etc.) should not trigger onboarding
        const is404 = error?.response?.status === 404 || error?.status === 404;
        
        if (is404) {
          console.log('⚠️ 404 - Usuario no existe, needs onboarding');
          setUser(null);
          setIsLoggedIn(false);
          setNeedsOnboarding(true);
        } else {
          console.log('⚠️ Error de red u otro problema, no mostrar onboarding');
          // Don't set needsOnboarding on network errors
          setUser(null);
          setIsLoggedIn(false);
          setNeedsOnboarding(false);
        }
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
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        return { success: true };
      } else {
        // Check if wallet is already registered
        if (response.error?.includes('Wallet already registered') || response.error?.includes('already registered')) {
          console.log('⚠️ Wallet already registered, trying to login instead...');
          // Try to fetch user by wallet
          const loginResponse = await authService.getUserByWallet(walletAddress);
          if (loginResponse.success && loginResponse.data) {
            const userData = loginResponse.data.user || loginResponse.data;
            setUser(userData as User);
            setIsLoggedIn(true);
            setNeedsOnboarding(false);
            
            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            if (loginResponse.data.token) {
              localStorage.setItem('token', loginResponse.data.token);
            }
            
            return { success: true };
          }
        }
        
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
