// Investment Service
import { api, ApiResponse } from './api';

export interface Investment {
  _id: string;
  investor: string | {
    _id: string;
    name: string;
    email: string;
  };
  farm: string | {
    _id: string;
    name: string;
    location: string;
    category: string;
  };
  amount: number;
  tokensAmount: number;
  tokenPrice: number;
  status: 'active' | 'completed' | 'cancelled';
  transactionHash?: string;
  roi?: number;
  currentValue?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvestmentData {
  farm: string;
  amount: number;
  tokensAmount: number;
}

class InvestmentService {
  async getAllInvestments(filters?: {
    farm?: string;
    status?: string;
  }): Promise<ApiResponse<Investment[]>> {
    let endpoint = '/investments';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.farm) params.append('farm', filters.farm);
      if (filters.status) params.append('status', filters.status);
      
      const queryString = params.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    
    return api.get<Investment[]>(endpoint);
  }

  async getMyInvestments(): Promise<ApiResponse<Investment[]>> {
    return api.get<Investment[]>('/investments/my-investments');
  }

  async getInvestmentById(id: string): Promise<ApiResponse<Investment>> {
    return api.get<Investment>(`/investments/${id}`);
  }

  async createInvestment(data: CreateInvestmentData): Promise<ApiResponse<Investment>> {
    return api.post<Investment>('/investments', data);
  }

  async buyFarmTokens(farmId: string, tokenAmount: number, transferTxHash: string): Promise<ApiResponse<{
    investment: Investment;
    farmName: string;
    tokensPurchased: number;
    morphoSpent: number;
    expectedAnnualReturn: number;
  }>> {
    return api.post('/investments/buy-tokens', {
      farmId,
      tokenAmount,
      transferTxHash
    });
  }

  async getInvestmentsByFarm(farmId: string): Promise<ApiResponse<Investment[]>> {
    return api.get<Investment[]>(`/investments/farm/${farmId}`);
  }

  async getPortfolioStats(): Promise<ApiResponse<{
    totalValue: number;
    totalInvested: number;
    totalROI: number;
    activeInvestments: number;
    farmsCount: number;
    avgMonthlyROI: number;
  }>> {
    return api.get('/investments/portfolio/stats');
  }

  async buyRegenerativeTokens(
    tokenAmount: number, 
    transferTxHash: string, 
    companyName?: string
  ): Promise<ApiResponse<{
    investment: Investment;
    tokensPurchased: number;
    morphoSpent: number;
    carbonOffset: string;
    waterSaved: string;
    treesPlanted: number;
    transactionHash: string;
    mintTransactionHash?: string;
    certificateId: string;
    purchaseDate: string;
  }>> {
    return api.post('/investments/buy-regenerative-tokens', {
      tokenAmount,
      transferTxHash,
      companyName
    });
  }
}

export const investmentService = new InvestmentService();
