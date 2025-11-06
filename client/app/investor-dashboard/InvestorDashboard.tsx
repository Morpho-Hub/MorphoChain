"use client"

import { Droplet, Leaf, Factory, DollarSign, Sprout, Globe } from "lucide-react";
import Button from "@/src/atoms/button";
import { TileStats } from "@/src/molecules/ImpactTile";
import { MyInvestmentsSection } from "@/src/organisms/MyInvestmentsSection";
import { LineChartData } from "@/src/molecules/LineChart";
import { PieChartData } from "@/src/molecules/PieChart";
import { PortfolioOverview } from "@/src/organisms/PortfolioOverview";
import { ImpactDashboard } from "@/src/organisms/ImpactDashboard";

const PortfolioPage: React.FC = () => {

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
        id: 1,
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
      { month: "Ene", value: 10000 },
      { month: "Feb", value: 10500 },
      { month: "Mar", value: 10800 },
      { month: "Abr", value: 11200 },
      { month: "May", value: 11800 },
      { month: "Jun", value: 12250 },
    ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Tu Portafolio de Inversiones Sustentables
          </h1>
          <p className="text-gray-600 mt-4">
            Bienvenida de nuevo, María Rodríguez.
          </p>
        </div>
        <Button
          title="Explorar Mercado"
          variant="blue"
          className="mt-6 md:mt-0 !py-3 !px-8 text-lg"
        />
      </section>

      {/* Portfolio Overview */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-6">

        {/* Tile 1 - Valor Total del Portafolio */}
        <TileStats
          icon={<Leaf size={28} />}
          value="$ 25,175"
          description="Valor Total del Portafolio"
          status="+22.5%"
        />

        {/* Tile 2 - Tokens Activos */}
        <TileStats
          icon={<Leaf size={28} />}
          value="100"
          description="Tokens Activos"
          status="En 8 fincas"
        />

        {/* Tile 3 - ROI Mensual Promedio */}
        <TileStats
          icon={<Leaf size={28} />}
          value="9.8%"
          description="ROI Mensual Promedio"
          status="+1.2%"
        />

        {/* Tile 4 - Puntuación de Impacto */}
        <TileStats
          icon={<Leaf size={28} />}
          value="88"
          description="Puntuación de Impacto"
          status="Excelente"
        />
      </section>

      {/* My Investments Section */}
      <div className="container max-w-7xl mx-auto p-6">
        <MyInvestmentsSection
          investments={myInvestments}
        />
      

      {/* Charts */}
      <PortfolioOverview
        portfolioData={portfolioData}
        performanceData={performanceData}
        growth={{ percentage: '+22.5%', trend: 'up' }}
      />
      
      {/* Verified Impact Metrics */}
      <ImpactDashboard impactData={impactData} />
      </div>
    </div>
  );
};

export default PortfolioPage;