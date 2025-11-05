import React, { FC, ReactNode } from "react";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

const StatCard: FC<StatCardProps> = ({ value, label, className = "" }) => {
  return (
    <div className={`text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm ${className}`}>
      <div className="text-2xl text-[#26ade4] font-bold">{value}</div>
      <div className="text-sm text-[#000000]/70">{label}</div>
    </div>
  );
};

export default StatCard;
