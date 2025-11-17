'use client';

import React from 'react';
import { DollarSign, TrendingUp, Sprout, Leaf, Plus } from 'lucide-react';
import { DashboardStatCard, FarmCard } from '@/src/molecules';
import type { Farm } from '@/src/molecules/FarmCard';
import Button from '@/src/atoms/button';
import { es } from '@/locales';

interface FarmerDashboardProps {
  userName?: string;
  farms?: Farm[];
  totalProducts?: number; // Optional override for total products
  onAddFarm?: () => void;
  onEditFarm?: (farm: Farm) => void;
  onDeleteFarm?: (farmId: string) => void;
  onViewMarket?: () => void;
  onViewDetails?: (farm: Farm) => void;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  userName = 'Juan Pérez',
  farms = [],
  totalProducts: totalProductsProp,
  onAddFarm,
  onEditFarm,
  onDeleteFarm,
  onViewMarket,
  onViewDetails,
}) => {
  const t = es.farmerDashboard;

  // Calcular estadísticas localmente desde las fincas
  const totalEstimatedEarnings = farms.reduce((sum, farm) => sum + farm.estimatedEarnings, 0);
  const totalReceivedEarnings = farms.reduce((sum, farm) => sum + farm.receivedEarnings, 0);
  const totalProducts = totalProductsProp ?? farms.reduce((sum, farm) => sum + farm.productsCount, 0);
  const averageSustainability = farms.length > 0
    ? Math.round(farms.reduce((sum, farm) => sum + farm.sustainability, 0) / farms.length)
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              {t.title}
            </h1>
            <p className="text-gray-600">
              {t.welcomeBack}, {userName}
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button
              variant="white_bordered"
              className="!rounded-lg !px-5 !py-2.5"
              title={t.viewMarket}
              onClick={onViewMarket}
            />
            <button
              onClick={onAddFarm}
              className="gradient-earth text-white rounded-lg px-5 py-2.5 shadow-morpho flex items-center gap-2 font-medium transition-all hover:opacity-90"
            >
              <Plus className="w-5 h-5" />
              {t.addNewFarm}
            </button>
          </div>
        </div>

        {/* Stats Grid - Simple */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">{t.totalFarms}</p>
            <p className="text-3xl font-bold text-black">{farms.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Productos</p>
            <p className="text-3xl font-bold text-black">{totalProducts}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Sostenibilidad</p>
            <p className="text-3xl font-bold text-black">{averageSustainability}%</p>
          </div>
        </div>

        {/* My Farms Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-black mb-6">
            {t.myFarms}
          </h2>

          {farms.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">
                {t.noFarms}
              </h3>
              <p className="text-gray-600 mb-6">
                {t.createFirstFarm}
              </p>
              <button
                onClick={onAddFarm}
                className="gradient-earth text-white rounded-lg px-6 py-3 shadow-morpho inline-flex items-center gap-2 font-medium transition-all hover:opacity-90"
              >
                <Plus className="w-5 h-5" />
                {t.addNewFarm}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {farms.map((farm, index) => (
                <FarmCard
                  key={farm.id || `farm-${index}`}
                  farm={farm}
                  onEdit={onEditFarm}
                  onDelete={onDeleteFarm}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
