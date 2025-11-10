// Impact Metrics Service
import { api, ApiResponse } from './api';

export interface ImpactMetrics {
  _id: string;
  farm: string;
  soilHealth: number;
  carbonSequestration: number;
  waterConservation: number;
  biodiversityIndex: number;
  vegetationCover: number;
  erosionControl: number;
  organicMatter: number;
  verificationDate?: string;
  verifiedBy?: string;
  certifications?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateImpactMetricsData {
  farm: string;
  soilHealth: number;
  carbonSequestration: number;
  waterConservation: number;
  biodiversityIndex: number;
  vegetationCover: number;
  erosionControl: number;
  organicMatter: number;
  notes?: string;
}

export interface AggregatedImpactMetrics {
  totalCO2Sequestered: number;
  totalWaterConserved: number;
  totalSoilRestored: number;
  avgBiodiversity: number;
  farmsCount: number;
}

class ImpactMetricsService {
  async getImpactMetricsByFarm(farmId: string): Promise<ApiResponse<ImpactMetrics[]>> {
    return api.get<ImpactMetrics[]>(`/impact-metrics/farm/${farmId}`);
  }

  async getLatestImpactMetrics(farmId: string): Promise<ApiResponse<ImpactMetrics>> {
    return api.get<ImpactMetrics>(`/impact-metrics/farm/${farmId}/latest`);
  }

  async createImpactMetrics(data: CreateImpactMetricsData): Promise<ApiResponse<ImpactMetrics>> {
    return api.post<ImpactMetrics>('/impact-metrics', data);
  }

  async updateImpactMetrics(id: string, data: Partial<CreateImpactMetricsData>): Promise<ApiResponse<ImpactMetrics>> {
    return api.put<ImpactMetrics>(`/impact-metrics/${id}`, data);
  }

  async getMyAggregatedImpact(): Promise<ApiResponse<AggregatedImpactMetrics>> {
    return api.get<AggregatedImpactMetrics>('/impact-metrics/my-impact/aggregated');
  }

  async verifyMetrics(id: string): Promise<ApiResponse<ImpactMetrics>> {
    return api.post<ImpactMetrics>(`/impact-metrics/${id}/verify`, {});
  }
}

export const impactMetricsService = new ImpactMetricsService();
