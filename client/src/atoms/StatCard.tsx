import React, { FC, ReactNode } from "react";
import { Icon } from './Icon';

interface StatCardProps {
  value: string;
  label: string;
  trend?: 'up' | 'down';
  className?: string;
}

const StatCard = ({ label, value, trend, className = '' }: StatCardProps) => {
  return (
    <div className={`p-4 rounded-xl bg-[#d1e751]/10 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-black/70">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg text-[#26ade4]">{value}</span>
          {trend && (
            <Icon 
              name={trend === 'up' ? 'arrow-up' : 'arrow-down'} 
              className={trend === 'up' ? 'text-[#d1e751]' : 'text-red-500'} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

