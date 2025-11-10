// Dashboard Service
import { api, ApiResponse } from './api';

export interface DashboardStats {
  // Investor Dashboard
  portfolio?: {
    totalValue: number;
    totalInvested: number;
    totalROI: number;
    activeTokens: number;
    farmsCount: number;
    avgMonthlyROI: number;
    growthPercentage: number;
  };
  
  // Farmer Dashboard
  farms?: {
    totalFarms: number;
    activeFarms: number;
    totalArea: number;
    tokenizedFarms: number;
  };
  
  // Impact Metrics
  impact?: {
    co2Sequestered: number;
    waterConserved: number;
    soilRestored: number;
    biodiversity: number;
    impactScore: number;
  };
  
  // Recent Activity
  recentTransactions?: Array<{
    id: string;
    type: string;
    amount: number;
    date: string;
    status: string;
  }>;
  
  recentInvestments?: Array<{
    id: string;
    farmName: string;
    amount: number;
    tokensAmount: number;
    date: string;
  }>;
}

export interface PerformanceData {
  monthly: Array<{
    month: string;
    value: number;
    investments?: number;
    revenue?: number;
  }>;
  
  yearly: Array<{
    year: number;
    value: number;
  }>;
}

class DashboardService {
  async getInvestorDashboard(): Promise<ApiResponse<DashboardStats>> {
    return api.get<DashboardStats>('/dashboard/investor');
  }

  async getFarmerDashboard(): Promise<ApiResponse<DashboardStats>> {
    return api.get<DashboardStats>('/dashboard/farmer');
  }

  async getPerformanceData(period: 'monthly' | 'yearly' = 'monthly'): Promise<ApiResponse<PerformanceData>> {
    return api.get<PerformanceData>(`/dashboard/performance?period=${period}`);
  }

  async getImpactDashboard(): Promise<ApiResponse<DashboardStats['impact']>> {
    return api.get<DashboardStats['impact']>('/dashboard/impact');
  }
}

export const dashboardService = new DashboardService();
