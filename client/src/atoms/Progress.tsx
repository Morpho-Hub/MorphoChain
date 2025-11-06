import React, { FC } from "react";

interface ProgressProps {
  value: number;
  className?: string;
  color?: 'green' | 'blue';
}

const Progress: FC<ProgressProps> = ({ value, className = "", color = 'green' }) => {

  const colorStyles = {
    green: 'bg-[#d1e751]',
    blue: 'bg-[#4dbce9]'
  };


  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${colorStyles[color]} h-full transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

export default Progress;
