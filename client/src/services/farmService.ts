// Farm Service
import { api, ApiResponse } from './api';

export interface Farm {
  _id: string;
  name: string;
  owner: string;
  location: string;
  size: number;
  category: string;
  description?: string;
  images?: string[];
  status: 'active' | 'inactive' | 'pending';
  tokenId?: number;
  blockchainAddress?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  impactMetrics?: {
    soilHealth?: number;
    carbonScore?: number;
    vegetationIndex?: number;
    waterUsage?: number;
    biodiversity?: number;
  };
  practices?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFarmData {
  name: string;
  location: string;
  size: number;
  category: string;
  description?: string;
  practices?: string[];
}

export interface UpdateFarmData extends Partial<CreateFarmData> {
  status?: 'active' | 'inactive' | 'pending';
}

class FarmService {
  async getAllFarms(filters?: {
    category?: string;
    region?: string;
    status?: string;
  }): Promise<ApiResponse<Farm[]>> {
    let endpoint = '/farms';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.region) params.append('region', filters.region);
      if (filters.status) params.append('status', filters.status);
      
      const queryString = params.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    
    return api.get<Farm[]>(endpoint);
  }

  async getFarmById(id: string): Promise<ApiResponse<Farm>> {
    return api.get<Farm>(`/farms/${id}`);
  }

  async getMyFarms(): Promise<ApiResponse<Farm[]>> {
    return api.get<Farm[]>('/farms/my-farms');
  }

  async createFarm(data: CreateFarmData): Promise<ApiResponse<Farm>> {
    return api.post<Farm>('/farms', data);
  }

  async updateFarm(id: string, data: UpdateFarmData): Promise<ApiResponse<Farm>> {
    return api.put<Farm>(`/farms/${id}`, data);
  }

  async deleteFarm(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/farms/${id}`);
  }

  async tokenizeFarm(id: string, data: {
    initialSupply: number;
    pricePerToken: number;
  }): Promise<ApiResponse<Farm>> {
    return api.post<Farm>(`/farms/${id}/tokenize`, data);
  }
}

export const farmService = new FarmService();
