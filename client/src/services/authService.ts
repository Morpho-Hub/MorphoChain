// Authentication Service
import { api, ApiResponse } from './api';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'investor' | 'farmer' | 'admin';
  walletAddress?: string;
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'investor' | 'farmer';
  walletAddress?: string;
}

export interface RegisterWalletData {
  email: string;
  name: string;
  role: 'investor' | 'farmer';
  walletAddress: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  // Register with wallet (Google OAuth)
  async registerWithWallet(data: RegisterWalletData): Promise<ApiResponse<AuthResponse>> {
    // Normalize wallet address to lowercase to match database format
    const normalizedData = {
      ...data,
      walletAddress: data.walletAddress.toLowerCase()
    };
    const response = await api.post<AuthResponse>('/auth/register-wallet', normalizedData);
    
    if (response.success && response.data) {
      // Save token to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  }

  // Get user by wallet address (returns user and token)
  async getUserByWallet(walletAddress: string): Promise<ApiResponse<{ user: User; token: string }>> {
    // Normalize wallet address to lowercase to match database format
    const normalizedAddress = walletAddress.toLowerCase();
    const response = await api.get<{ user: User; token: string }>(`/users/wallet/${normalizedAddress}`);
    
    // If successful, save token to localStorage
    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  }

  // Legacy methods (mantener por compatibilidad)
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  }

  async getMe(): Promise<ApiResponse<User>> {
    return api.get<User>('/auth/me');
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return api.put<User>('/auth/profile', data);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}

export const authService = new AuthService();
