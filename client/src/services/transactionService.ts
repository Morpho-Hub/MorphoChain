// Transaction Service
import { api, ApiResponse } from './api';

export interface Transaction {
  _id: string;
  user: string;
  type: 'investment' | 'purchase' | 'sale' | 'reward';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
  blockchainNetwork?: string;
  relatedEntity?: {
    type: 'farm' | 'product' | 'investment';
    id: string;
  };
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTransactionData {
  type: 'investment' | 'purchase' | 'sale' | 'reward';
  amount: number;
  relatedEntity?: {
    type: 'farm' | 'product' | 'investment';
    id: string;
  };
  metadata?: any;
}

class TransactionService {
  async getAllTransactions(filters?: {
    type?: string;
    status?: string;
  }): Promise<ApiResponse<Transaction[]>> {
    let endpoint = '/transactions';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      
      const queryString = params.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    
    return api.get<Transaction[]>(endpoint);
  }

  async getMyTransactions(): Promise<ApiResponse<Transaction[]>> {
    return api.get<Transaction[]>('/transactions/my-transactions');
  }

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    return api.get<Transaction>(`/transactions/${id}`);
  }

  async createTransaction(data: CreateTransactionData): Promise<ApiResponse<Transaction>> {
    return api.post<Transaction>('/transactions', data);
  }
}

export const transactionService = new TransactionService();
