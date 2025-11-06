import { Leaf, Clock, TrendingUp, Globe } from "lucide-react";
import PortfolioCard from "./components/PortfolioCard";
import InvestmentList from "./components/InvestmentList";
import DistributionChart from "./components/DistributionChart";
import ImpactTile from "./components/ImpactTile";

export default function InvestorDashboard() {
  return (
    <div className="p-8 space-y-10">
      {/* ✅ Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Panel de Inversor</h1>
          <p className="text-gray-500">Bienvenida de nuevo, María Rodríguez</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-100 rounded-full hover:bg-blue-200 transition">
            Explorar Mercado
          </button>
          <button className="px-4 py-2 border rounded-full hover:bg-gray-50">
            Depositar Fondos
          </button>
        </div>
      </div>

      {/* ✅ Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PortfolioCard
          title="Valor Total del Portafolio"
          value="$25,175"
          change="+22.5%"
          icon={<Leaf className="w-5 h-5" />}
        />
        <PortfolioCard
          title="Tokens Activos"
          value="100"
          subtitle="En 8 fincas"
          icon={<Clock className="w-5 h-5" />}
        />
        <PortfolioCard
          title="ROI Mensual Promedio"
          value="9.8%"
          change="+1.2%"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <PortfolioCard
          title="Puntuación de Impacto"
          value="88"
          subtitle="Excelente"
          icon={<Leaf className="w-5 h-5" />}
        />
      </div>

      {/* ✅ Mis Inversiones */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mis Inversiones</h2>
          <button className="px-4 py-2 border rounded-full hover:bg-gray-50">
            Agregar Más
          </button>
        </div>
        <InvestmentList />
      </div>

      {/* ✅ Gráficos: Distribución + Rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <DistributionChart />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <PerformanceChart />
        </div>
      </div>

      {/* ✅ Impacto Verificado */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-6">Tu Contribución de Impacto Verificado</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ImpactTile
            icon={<Leaf className="w-8 h-8" />}
            value="42 tons"
            label="CO₂ Secuestrado"
            progress={78}
            description="78% de la meta anual"
          />
          <ImpactTile
            icon={<Globe className="w-8 h-8" />}
            value="8.5 ha"
            label="Suelo Restaurado"
            progress={92}
            description="92% de mejora"
          />
        </div>
      </div>

      {/* ✅ Banner de Logro */}
      <div className="bg-black text-white text-center rounded-3xl py-4">
        <p className="font-semibold">🎉 Logro de Impacto Desbloqueado</p>
        <p className="text-sm">
          Has ayudado a restaurar más de 8 hectáreas de tierras agrícolas costarricenses
        </p>
      </div>
    </div>
  );
}
