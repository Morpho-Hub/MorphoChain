// Product Service
import { api, ApiResponse } from './api';

export interface Product {
  _id: string;
  name: string;
  farm: string | {
    _id: string;
    name: string;
    location: string;
    owner: {
      _id: string;
      name: string;
    };
  };
  category: string;
  price: number;
  unit: string;
  stock: number;
  description?: string;
  images?: string[];
  status: 'draft' | 'active' | 'out-of-stock' | 'discontinued' | 'pending';
  certifications?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface CreateProductData {
  name: string;
  farm: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  description?: string;
  images?: ProductImage[];
  certifications?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  status?: 'draft' | 'active' | 'out-of-stock' | 'discontinued' | 'pending';
  images?: ProductImage[];
}

class ProductService {
  async getAllProducts(filters?: {
    category?: string;
    farm?: string;
    status?: string;
  }): Promise<ApiResponse<Product[]>> {
    let endpoint = '/products';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.farm) params.append('farm', filters.farm);
      if (filters.status) params.append('status', filters.status);
      
      const queryString = params.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    
    return api.get<Product[]>(endpoint);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return api.get<Product>(`/products/${id}`);
  }

  async getProductsByFarm(farmId: string): Promise<ApiResponse<Product[]>> {
    // Use public products endpoint with farm filter to avoid auth requirement
    const params = new URLSearchParams();
    params.append('farm', farmId);
    // Prefer active products by default
    params.append('status', 'active');
    return api.get<Product[]>(`/products?${params.toString()}`);
  }

  async getByFarm(farmId: string): Promise<ApiResponse<Product[]>> {
    return this.getProductsByFarm(farmId);
  }

  async getProductsBySeller(userId: string): Promise<ApiResponse<Product[]>> {
    return api.get<Product[]>(`/products/seller/${userId}`);
  }

  async getMyProducts(): Promise<ApiResponse<Product[]>> {
    return api.get<Product[]>('/products/my/products');
  }

  async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    return api.post<Product>('/products', data);
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<ApiResponse<Product>> {
    return api.put<Product>(`/products/${id}`, data);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/products/${id}`);
  }

  async updateStock(id: string, quantity: number): Promise<ApiResponse<Product>> {
    return api.put<Product>(`/products/${id}/stock`, { quantity });
  }
}

export const productService = new ProductService();
