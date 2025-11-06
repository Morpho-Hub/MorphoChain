'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface LineChartData {
  month: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  height?: number;
  strokeColor?: string;
  className?: string;
}

export const LineChart = ({ 
  data, 
  height = 250, 
  strokeColor = '#26ade4',
  className = '' 
}: LineChartProps) => {
  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1e751" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="#000000" 
            fontSize={12}
          />
          <YAxis 
            stroke="#000000" 
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #d1e751',
              borderRadius: '12px',
              fontSize: '14px',
            }}
            formatter={(value: number) => [formatTooltipValue(value), 'Valor']}
            labelFormatter={(label) => `Mes: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={3}
            dot={{ fill: strokeColor, r: 5 }}
            activeDot={{ r: 7, fill: strokeColor }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};