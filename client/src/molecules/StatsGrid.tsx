import React, { FC } from "react";
import StatCard from "@/src/atoms/StatCard";

interface StatsGridProps {
  stats: Array<{
    value: string;
    label: string;
  }>;
  className?: string;
}

const StatsGrid: FC<StatsGridProps> = ({ stats, className = "" }) => {
  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
};

export default StatsGrid;
