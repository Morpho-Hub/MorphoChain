"use client"

import { Droplet, Leaf, Coins, DollarSign, ChartLine,Sprout, Globe } from "lucide-react";
import Button from "@/src/atoms/button";
import { TileStats } from "@/src/molecules/ImpactTile";
import { MyInvestmentsSection } from "@/src/organisms/MyInvestmentsSection";
import { LineChartData } from "@/src/molecules/LineChart";
import { PieChartData } from "@/src/molecules/PieChart";
import { PortfolioOverview } from "@/src/organisms/PortfolioOverview";
import { ImpactDashboard } from "@/src/organisms/ImpactDashboard";
import { useRouter } from "next/navigation";
import { es } from "@/locales";
import { useState, useEffect } from "react";
import { dashboardService, investmentService, impactMetricsService } from "@/src/services";

const PortfolioPage: React.FC = () => {
  const router = useRouter();
  const t = es.InvestorDashboard;
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,       
    activeTokens: 0,
    farmsCount: 0,
    avgMonthlyROI: 0,    
    roiChange: 0,   
    impactScore: 0,
    impactLabel: 'Sin datos',
    growthPercentage: 0, 
  });
  const [myInvestments, setMyInvestments] = useState<any[]>([]);
  const [impactData, setImpactData] = useState<any>(null);
  const [portfolioChartData, setPortfolioChartData] = useState<PieChartData[]>([]);
  const [performanceData, setPerformanceData] = useState<LineChartData[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load portfolio stats
        const statsResponse = await investmentService.getPortfolioStats();
        if (statsResponse.success && statsResponse.data) {
          const stats = statsResponse.data;
          setPortfolioData({
            totalValue: stats.totalValue,
            activeTokens: stats.activeInvestments,
            farmsCount: stats.farmsCount,
            avgMonthlyROI: stats.avgMonthlyROI,
            roiChange: stats.totalROI > 0 ? 1.2 : -0.5,
            impactScore: 88, // TODO: Calculate from metrics
            impactLabel: stats.totalROI > 10 ? 'Excelente' : 'Bueno',
            growthPercentage: ((stats.totalValue - stats.totalInvested) / stats.totalInvested) * 100,
          });
        }

        // Load my investments
        const investmentsResponse = await investmentService.getMyInvestments();
        if (investmentsResponse.success && investmentsResponse.data) {
          const formattedInvestments = investmentsResponse.data.map((inv: any) => {
            const farm = typeof inv.farm === 'object' ? inv.farm : null;
            const roi = inv.roi || 0;
            
            return {
              id: inv._id,
              name: farm?.name || 'Finca',
              location: farm?.location || 'Costa Rica',
              tokens: inv.tokensAmount,
              value: `$${inv.currentValue?.toFixed(2) || inv.amount.toFixed(2)}`,
              invested: `$${inv.amount.toFixed(2)}`,
              roi: roi >= 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`,
              trend: roi >= 0 ? 'up' as const : 'down' as const,
              impactScore: farm?.impactMetrics?.soilHealth || 0,
              soilHealth: farm?.impactMetrics?.soilHealth || 0,
              carbonScore: farm?.impactMetrics?.carbonScore || 0,
              vegetationIndex: farm?.impactMetrics?.vegetationIndex || 0,
              isVerified: farm?.verificationStatus === 'verified',
            };
          });
          setMyInvestments(formattedInvestments);
        }

        // Load impact metrics
        const impactResponse = await impactMetricsService.getMyAggregatedImpact();
        if (impactResponse.success && impactResponse.data) {
          const impact = impactResponse.data;
          setImpactData({
            metrics: [
              {
                value: `${impact.totalCO2Sequestered.toFixed(1)} tons`,
                label: "CO₂ Secuestrado",
                progress: 78,
                progressLabel: "78% de la meta anual",
                icon: Sprout,
                theme: "light" as const
              },
              {
                value: `${(impact.totalWaterConserved / 1000).toFixed(1)}K gal`,
                label: "Agua Conservada",
                progress: 85,
                progressLabel: "85% de la meta anual",
                icon: Droplet,
                theme: "light" as const
              },
              {
                value: `${impact.totalSoilRestored.toFixed(1)} ha`,
                label: "Suelo Restaurado",
                progress: 92,
                progressLabel: "92% de mejora",
                icon: Globe,
                theme: "light" as const
              },
              {
                value: `+${impact.avgBiodiversity.toFixed(0)}%`,
                label: "Biodiversidad",
                progress: impact.avgBiodiversity,
                progressLabel: `${impact.avgBiodiversity}% de aumento`,
                icon: Leaf,
                theme: "light" as const
              }
            ],
            achievement: {
              title: "Logro de Impacto Desbloqueado",
              description: `Has ayudado a restaurar más de ${impact.totalSoilRestored.toFixed(1)} hectáreas de tierras agrícolas costarricenses`
            }
          });
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Default impact data structure
  const defaultImpactData = {
    metrics: [
      {
        value: "0 tons",
        label: "CO₂ Secuestrado",
        progress: 0,
        progressLabel: "Sin datos",
        icon: Sprout,
        theme: "light" as const
      },
      {
        value: "0K gal",
        label: "Agua Conservada",
        progress: 0,
        progressLabel: "Sin datos",
        icon: Droplet,
        theme: "light" as const
      },
      {
        value: "0 ha",
        label: "Suelo Restaurado",
        progress: 0,
        progressLabel: "Sin datos",
        icon: Globe,
        theme: "light" as const
      },
      {
        value: "+0%",
        label: "Biodiversidad",
        progress: 0,
        progressLabel: "Sin datos",
        icon: Leaf,
        theme: "light" as const
      }
    ],
    achievement: {
      title: "Comienza a Invertir",
      description: "Realiza tu primera inversión para empezar a generar impacto positivo"
    }
  };

  const displayImpactData = impactData || defaultImpactData;

  type PerformanceChange = {
  percentage: string;
  direction: 'up' | 'down';
  };

  function getPerformanceChange(data: LineChartData[]): PerformanceChange {
  if (!data || data.length < 2) {
    return { percentage: '+0%', direction: 'up' };
  }

  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;

  if (firstValue === 0) {
    return { percentage: '+0%', direction: 'up' };
  }

  const change = ((lastValue - firstValue) / firstValue) * 100;
  const direction: 'up' | 'down' = change < 0 ? 'down' : 'up';
  const formattedPercentage = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;

  return { percentage: formattedPercentage, direction };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Cargando dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {t.header.title}
          </h1>
          <p className="text-gray-600 mt-4">
            {t.header.welcome}
          </p>
        </div>
        <Button
          title={t.header.exploreMarket}
          variant="blue"
          className="mt-6 md:mt-0 !py-3 !px-8 text-lg"
          onClick={() => {router.push('/mercado')}}
        />
      </section>

      {/* Portfolio Overview */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-6">
        {/* Tile 1 - Valor Total del Portafolio */}
        <TileStats
          icon={<DollarSign size={28} />}
          value={`$ ${portfolioData.totalValue.toLocaleString()}`}
          description={t.portfolio.totalValue}
          status={t.portfolio.growth(portfolioData.growthPercentage)}
        />

        {/* Tile 2 - Tokens Activos */}
        <TileStats
          icon={<Coins size={28} />}
          value={portfolioData.activeTokens.toString()}
          description={t.portfolio.activeTokens}
          status={t.portfolio.farmsCount(portfolioData.farmsCount)}
        />

        {/* Tile 3 - ROI Mensual Promedio */}
        <TileStats
          icon={<ChartLine size={28} />}
          value={`${portfolioData.avgMonthlyROI.toFixed(1)}%`}
          description={t.portfolio.avgMonthlyROI}
          status={t.portfolio.roiChange(portfolioData.roiChange)}
        />

        {/* Tile 4 - Puntuación de Impacto */}
        <TileStats
          icon={<Leaf size={28} />}
          value={portfolioData.impactScore.toString()}
          description={t.portfolio.impactScore}
          status={portfolioData.impactLabel}
        />
      </section>

      {/* My Investments Section */}
      <div className="container max-w-7xl mx-auto p-6">
        <MyInvestmentsSection
          investments={myInvestments}
          onClick={() => router.push('/inversion')}
        />

      {/* Charts */}
      <PortfolioOverview
        titlePortfolioDistribution={t.charts.portfolioDistribution}
        titlePortfolioPerformance={t.charts.portfolioPerformance}
        statCardLabel={t.charts.totalGrowth}
        portfolioData={portfolioChartData}
        performanceData={performanceData}
        growth={{ 
          percentage: getPerformanceChange(performanceData).percentage, 
          trend: getPerformanceChange(performanceData).direction 
        }}
      />
      
      {/* Verified Impact Metrics */}
      <ImpactDashboard 
        impactData={displayImpactData} 
        title={t.impact.title} 
      />
      </div>
    </div>
  );
}

export default PortfolioPage;