'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  /**
   * Título de la estadística
   */
  title: string;
  /**
   * Valor principal a mostrar
   */
  value: string | number;
  /**
   * Subtítulo o descripción adicional
   */
  subtitle?: string;
  /**
   * Icono de Lucide React
   */
  icon: LucideIcon;
  /**
   * Color del ícono (CSS class o hex)
   */
  iconColor?: string;
  /**
   * Color de fondo del contenedor del ícono
   */
  iconBgColor?: string;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-gray-700',
  iconBgColor = 'bg-gray-100',
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-morpho transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-black mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs font-medium" style={{ color: 'var(--morpho-blue)' }}>{subtitle}</p>
          )}
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;
