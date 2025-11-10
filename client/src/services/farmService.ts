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
  status: 'active' | 'inactive' | 'pending' | 'draft';
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
  product?: {
    name: string;
    stock: number;
    price: number;
    unit: string;
  };
  sustainabilityData?: any;
  createdAt?: string;
  updatedAt?: string;
  id?: string; // Alias for _id
}

export interface CreateFarmData {
  name: string;
  location: string;
  size: number;
  category: string;
  description?: string;
  practices?: string[];
  product?: {
    name: string;
    stock: number;
    price: number;
    unit: string;
  };
  sustainabilityData?: any;
}

export interface UpdateFarmData extends Partial<CreateFarmData> {
  status?: 'active' | 'inactive' | 'pending' | 'draft';
}

class FarmService {
  async getAll(filters?: {
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
    
    const response = await api.get<Farm[]>(endpoint);
    // Normalize _id to id
    if (response.success && response.data) {
      response.data = response.data.map(farm => ({
        ...farm,
        id: farm._id || farm.id
      }));
    }
    return response;
  }

  async getById(id: string): Promise<ApiResponse<Farm>> {
    const response = await api.get<Farm>(`/farms/${id}`);
    if (response.success && response.data) {
      response.data.id = response.data._id || response.data.id;
    }
    return response;
  }

  async getMyFarms(): Promise<ApiResponse<Farm[]>> {
    const response = await api.get<Farm[]>('/farms/my-farms');
    if (response.success && response.data) {
      response.data = response.data.map(farm => ({
        ...farm,
        id: farm._id || farm.id
      }));
    }
    return response;
  }

  async create(data: CreateFarmData): Promise<ApiResponse<Farm>> {
    console.log('🌾 Creating farm with data:', data);
    const response = await api.post<Farm>('/farms', data);
    console.log('🌾 Farm creation response:', response);
    if (response.success && response.data) {
      response.data.id = response.data._id || response.data.id;
    }
    return response;
  }

  async update(id: string, data: UpdateFarmData): Promise<ApiResponse<Farm>> {
    const response = await api.put<Farm>(`/farms/${id}`, data);
    if (response.success && response.data) {
      response.data.id = response.data._id || response.data.id;
    }
    return response;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/farms/${id}`);
  }

  async tokenize(id: string, data: {
    sustainabilityScore: number;
    carbonScore: number;
    soilHealth: number;
    waterUsage: number;
    biodiversity: number;
  }): Promise<ApiResponse<Farm>> {
    const response = await api.post<Farm>(`/farms/${id}/tokenize`, data);
    if (response.success && response.data) {
      response.data.id = response.data._id || response.data.id;
    }
    return response;
  }

  async createProduct(farmId: string, productData: {
    name: string;
    stock: number;
    price: number;
    unit: string;
    description?: string;
    category?: string;
  }): Promise<ApiResponse<any>> {
    return api.post(`/products`, {
      name: productData.name,
      description: productData.description || `Producto orgánico de ${productData.name}`,
      category: productData.category || 'other',
      price: productData.price,
      stock: productData.stock,
      unit: productData.unit,
      farm: farmId,
      status: 'active',
      isOrganic: true,
      isFairTrade: true
    });
  }
}

export const farmService = new FarmService();
