'use client';

import React from 'react';
import { MapPin, Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { Chip } from '@/src/atoms';
import { es } from '@/locales';

export interface Farm {
  id: string;
  name: string;
  location: string;
  description: string;
  estimatedEarnings: number;
  receivedEarnings: number;
  products: string[];
  productsCount: number;
  sustainability: number;
  practices: number;
}

interface FarmCardProps {
  farm: Farm;
  onEdit?: (farm: Farm) => void;
  onDelete?: (farmId: string) => void;
  onSellProduct?: (farm: Farm) => void;
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, onEdit, onDelete, onSellProduct }) => {
  const t = es.farmerDashboard;
  const tListing = es.productListing;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-morpho transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-black mb-2">
            {farm.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{farm.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(farm)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: 'var(--morpho-blue)' }}
            title={t.edit}
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete?.(farm.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={t.delete}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6">{farm.description}</p>

      {/* Earnings */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(209, 231, 81, 0.15)' }}>
          <p className="text-xs font-medium text-gray-600 mb-1">
            {t.estimatedEarnings}
          </p>
          <p className="text-lg font-bold text-black">
            {formatCurrency(farm.estimatedEarnings)}
          </p>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(77, 188, 233, 0.15)' }}>
          <p className="text-xs font-medium text-gray-600 mb-1">
            {t.receivedEarnings}
          </p>
          <p className="text-lg font-bold text-black">
            {formatCurrency(farm.receivedEarnings)}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 mb-2">
          {t.mainProducts}:
        </p>
        <div className="flex flex-wrap gap-2">
          {farm.products.map((product, index) => (
            <Chip
              key={index}
              label={product}
              variant="warning"
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Sell Product Button */}
      <button
        onClick={() => onSellProduct?.(farm)}
        className="w-full gradient-green text-black px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all font-medium mb-4"
      >
        <ShoppingBag className="w-5 h-5" />
        {tListing.sellProduct}
      </button>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            <strong className="text-black">{farm.productsCount}</strong> {t.products}
          </span>
          <span className="text-gray-600">
            <strong className="text-black">{farm.sustainability}%</strong> {t.sustainability}
          </span>
          <span className="text-gray-600">
            <strong className="text-black">{farm.practices}</strong> {t.practices}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FarmCard;
