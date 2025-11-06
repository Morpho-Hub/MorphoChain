'use client';

import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export interface PieChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; }

interface PieChartProps {
  data: PieChartData[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
  dataKey?: string;
}

export const PieChart = ({ 
  data, 
  height = 250, 
  innerRadius = 60,
  outerRadius = 100,
  className = '',
  dataKey = "value"
}: PieChartProps) => {
  return (
<div className={className} style={{ height: `${height}px`, width: '100%' }}>
  <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color as string}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Porcentaje']}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};