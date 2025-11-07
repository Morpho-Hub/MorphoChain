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

const PortfolioPage: React.FC = () => {
  const router = useRouter();
  const t = es.InvestorDashboard;

  const portfolioDataExample = {
    totalValue: 25175,       
    activeTokens: 100,
    farmsCount: 8,
    avgMonthlyROI: 9.8,    
    roiChange: 1.2,   
    impactScore: 88,
    impactLabel: 'Excelente',
    growthPercentage: 22.5, 
  };

  const impactData = {
    metrics: [
      {
        value: "42 tons",
        label: "CO₂ Secuestrado",
        progress: 78,
        progressLabel: "78% de la meta anual",
        icon: Sprout,
        theme: "light" as const
      },
      {
        value: "12K gal",
        label: "Agua Conservada",
        progress: 85,
        progressLabel: "85% de la meta anual",
        icon: Droplet,
        theme: "light" as const
      },
      {
        value: "8.5 ha",
        label: "Suelo Restaurado",
        progress: 92,
        progressLabel: "92% de mejora",
        icon: Globe,
        theme: "light" as const
      },
      {
        value: "+35%",
        label: "Biodiversidad",
        progress: 88,
        progressLabel: "88% de aumento",
        icon: Leaf,
        theme: "light" as const
      }
    ],
    achievement: {
      title: "Logro de Impacto Desbloqueado",
      description: "Has ayudado a restaurar más de 8 hectáreas de tierras agrícolas costarricenses"
    }
  };

  const myInvestments = [
    {
      id: 1,
      name: "Finca Verde - Café",
      location: "Cartago, Costa Rica",
      tokens: 45,
      value: "$11,250",
      invested: "$10,000",
      roi: "+12.5%",
      trend: "up" as const,
      impactScore: 92,
      soilHealth: 92,
      carbonScore: 88,
      vegetationIndex: 90,
      isVerified: true,
    },
    {
      id: 3,
      name: "Finca Verde - Café",
      location: "Cartago, Costa Rica",
      tokens: 45,
      value: "$11,250",
      invested: "$10,000",
      roi: "+12.5%",
      trend: "up" as const,
      impactScore: 92,
      soilHealth: 92,
      carbonScore: 88,
      vegetationIndex: 90,
      isVerified: true,
    },
    {
      id: 2,
      name: "Finca Verde - Café",
      location: "Cartago, Costa Rica",
      tokens: 45,
      value: "$11,250",
      invested: "$10,000",
      roi: "+12.5%",
      trend: "down" as const,
      impactScore: 92,
      soilHealth: 23,
      carbonScore: 88,
      vegetationIndex: 90,
      isVerified: false,
    },
  ];

  const portfolioData: PieChartData[] = [
    { name: "Café", value: 35, color: "#d1e751" },
    { name: "Cacao", value: 28, color: "#4dbce9" },
    { name: "Banano", value: 20, color: "#26ade4" },
    { name: "Otro", value: 17, color: "#000000" },
  ];

  const performanceData: LineChartData[] = [
    { month: "Ene", value: 10300 },
    { month: "Feb", value: 10500 },
    { month: "Mar", value: 10800 },
    { month: "Abr", value: 11110 },
    { month: "May", value: 11800 },
    { month: "Jun", value: 12250 },
  ];

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
          value={`$ ${portfolioDataExample.totalValue.toLocaleString()}`}
          description={t.portfolio.totalValue}
          status={t.portfolio.growth(portfolioDataExample.growthPercentage)}
        />

        {/* Tile 2 - Tokens Activos */}
        <TileStats
          icon={<Coins size={28} />}
          value={portfolioDataExample.activeTokens.toString()}
          description={t.portfolio.activeTokens}
          status={t.portfolio.farmsCount(portfolioDataExample.farmsCount)}
        />

        {/* Tile 3 - ROI Mensual Promedio */}
        <TileStats
          icon={<ChartLine size={28} />}
          value={`${portfolioDataExample.avgMonthlyROI}%`}
          description={t.portfolio.avgMonthlyROI}
          status={t.portfolio.roiChange(portfolioDataExample.roiChange)}
        />

        {/* Tile 4 - Puntuación de Impacto */}
        <TileStats
          icon={<Leaf size={28} />}
          value={portfolioDataExample.impactScore.toString()}
          description={t.portfolio.impactScore}
          status={portfolioDataExample.impactLabel}
        />
      </section>

      {/* My Investments Section */}
      <div className="container max-w-7xl mx-auto p-6">
        <MyInvestmentsSection
          investments={myInvestments}
        />

      {/* Charts */}
      <PortfolioOverview
        titlePortfolioDistribution={t.charts.portfolioDistribution}
        titlePortfolioPerformance={t.charts.portfolioPerformance}
        statCardLabel={t.charts.totalGrowth}
        portfolioData={portfolioData}
        performanceData={performanceData}
        growth={{ 
          percentage: getPerformanceChange(performanceData).percentage, 
          trend: getPerformanceChange(performanceData).direction 
        }}
      />
      
      {/* Verified Impact Metrics */}
      <ImpactDashboard 
        impactData={impactData} 
        title={t.impact.title} 
      />
      </div>
    </div>
  );
}

export default PortfolioPage;