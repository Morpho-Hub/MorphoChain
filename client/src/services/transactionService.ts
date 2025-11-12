// Transaction Service
import { api, ApiResponse } from './api';

export interface Transaction {
  _id: string;
  from?: string;
  to?: string;
  fromWallet?: string;
  toWallet?: string;
  type: 'investment' | 'product-purchase' | 'token-transfer' | 'dividend' | 'harvest-sale' | 'withdrawal' | 'deposit' | 'refund' | 'fee' | 'other';
  amount: number;
  amountInTokens?: number;
  currency?: string;
  fee?: number;
  netAmount?: number;
  transactionHash?: string;
  blockNumber?: number;
  blockTimestamp?: Date;
  status: 'pending' | 'processing' | 'confirmed' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  relatedFarm?: string;
  relatedInvestment?: string;
  relatedProduct?: string;
  farmTokenId?: string;
  productListingId?: string;
  metadata?: TransactionMetadata;
  paymentMethod?: 'crypto' | 'card' | 'bank' | 'wallet' | 'other';
  paymentProvider?: string;
  externalTransactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionMetadata {
  description?: string;
  notes?: string;
  invoiceNumber?: string;
  orderId?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  farmName?: string;
  investmentPercentage?: number;
  products?: PurchasedProduct[];
  shippingAddress?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface PurchasedProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  total: number;
}

export interface CreateTransactionData {
  type: 'investment' | 'product-purchase' | 'token-transfer' | 'dividend' | 'harvest-sale' | 'withdrawal' | 'deposit' | 'refund' | 'fee' | 'other';
  amount: number;
  to?: string;
  relatedFarm?: string;
  relatedProduct?: string;
  metadata?: TransactionMetadata;
  paymentMethod?: 'crypto' | 'card' | 'bank' | 'wallet' | 'other';
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
