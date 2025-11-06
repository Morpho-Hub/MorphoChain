"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface PortfolioBarChartProps {
  data: ChartData[];
}

export function PortfolioBarChart({ data }: PortfolioBarChartProps) {
  return (
    <div className="w-full h-64 p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#84CC16" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
