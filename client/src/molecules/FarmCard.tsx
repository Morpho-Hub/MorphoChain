'use client';

import React from 'react';
import { MapPin, Edit2, Trash2 } from 'lucide-react';
import { Chip } from '@/src/atoms';
import { es } from '@/locales';

export interface EnvironmentalMetrics {
  carbonReduction: number; // toneladas CO2
  waterSaved: number; // m³
  biodiversityIndex: number; // 0-100
  soilHealth: number; // 0-100
  lastVerificationDate: string;
  nextVerificationDate: string;
  verificationStatus: 'pending' | 'verified' | 'expired';
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  description: string;
  estimatedEarnings: number; // Total estimado (productos + tokens)
  receivedEarnings: number; // Total recibido (productos + tokens)
  productSalesEarnings: number; // Ingresos por venta de productos
  tokenEarnings: number; // Ingresos pasivos por tokenización
  products: string[];
  productsCount: number;
  sustainability: number;
  practices: number;
  images?: string[];
  certifications?: string[];
  environmentalMetrics?: EnvironmentalMetrics;
}

interface FarmCardProps {
  farm: Farm;
  onEdit?: (farm: Farm) => void;
  onDelete?: (farmId: string) => void;
  onViewDetails?: (farm: Farm) => void;
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, onEdit, onDelete, onViewDetails }) => {
  const t = es.farmerDashboard;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-morpho transition-all cursor-pointer"
      onClick={() => onViewDetails?.(farm)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-black">
              {farm.name}
            </h3>
            {!farm.environmentalMetrics ? (
              // Farm SIN encuesta
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                ⚠️ Pendiente
              </span>
            ) : farm.environmentalMetrics.verificationStatus === 'verified' ? (
              // Farm verificada
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                ✓ Verificada
              </span>
            ) : farm.environmentalMetrics.verificationStatus === 'expired' ? (
              // Farm expirada
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                ⚠️ Expirada
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{farm.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(farm);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: 'var(--morpho-blue)' }}
            title={t.edit}
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(farm.id);
            }}
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
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-600 mb-2">
          {t.mainProducts}:
        </p>
        <div className="flex flex-wrap gap-2">
          {farm.products && farm.products.length > 0 ? (
            farm.products.map((product, index) => (
              <Chip
                key={index}
                label={product}
                variant="warning"
                size="sm"
              />
            ))
          ) : (
            <span className="text-sm text-gray-500">No hay productos registrados</span>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            <strong className="text-black">{farm.productsCount || 0}</strong> {t.products}
          </span>
          <span className="text-gray-600">
            <strong className="text-black">{farm.sustainability || 0}%</strong> {t.sustainability}
          </span>
          <span className="text-gray-600">
            <strong className="text-black">{farm.practices || 0}</strong> {t.practices}
          </span>
        </div>
      </div>

      {/* Environmental Survey Alert - Cuando NO tiene encuesta completada */}
      {!farm.environmentalMetrics ? (
        // Farm SIN encuesta en absoluto
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">
            <strong>⚠️ Encuesta ambiental pendiente</strong>
          </p>
          <p className="text-xs text-yellow-700 mb-3">
            Completa la encuesta para tokenizar tu finca y generar ingresos pasivos adicionales. Esta verificación es necesaria para acceder a beneficios adicionales.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(farm);
            }}
            className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--morpho-blue)' }}
          >
            Completar encuesta ahora
          </button>
        </div>
      ) : farm.environmentalMetrics.verificationStatus === 'verified' ? (
        /* Verification Status - Farm verificada */
        <div className="mt-4 p-4 rounded-lg border bg-green-50 border-green-200">
          <p className="text-sm font-medium mb-1">
            ✅ Verificación completada
          </p>
          <p className="text-xs text-gray-600">
            Próxima verificación: {new Date(farm.environmentalMetrics.nextVerificationDate).toLocaleDateString('es-CR')}
          </p>
        </div>
      ) : farm.environmentalMetrics.verificationStatus === 'expired' ? (
        /* Verification Status - Farm expirada */
        <div className="mt-4 p-4 rounded-lg border bg-red-50 border-red-200">
          <p className="text-sm font-medium mb-1">
            ❌ Verificación expirada - Requiere renovación
          </p>
          <p className="text-xs text-gray-600">
            Completa una nueva verificación para mantener tus beneficios
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(farm);
            }}
            className="mt-3 w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors bg-red-600 hover:bg-red-700"
          >
            Renovar verificación
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FarmCard;
