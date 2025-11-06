import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Ene", value: 1000 },
  { month: "Feb", value: 1400 },
  { month: "Mar", value: 1800 },
  { month: "Abr", value: 2200 },
  { month: "May", value: 2600 },
  { month: "Jun", value: 3000 },
];

export default function PerformanceChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Crecimiento del Portafolio</h2>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#84cc16" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
