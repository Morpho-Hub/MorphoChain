import Card from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { LineChart, LineChartData } from '../molecules/LineChart';
import StatCard from '../atoms/StatCard';

interface PortfolioPerformanceProps {
  data: LineChartData[];
  growth?: {
    percentage: string;
    trend: 'up' | 'down';
  };
  title?: string;
  className?: string;
}

export const PortfolioPerformance = ({ 
  data, 
  growth = { percentage: '+22.5%', trend: 'up' },
  title = "Rendimiento del Portafolio",
  className = '' 
}: PortfolioPerformanceProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <Typography variant="h3" className="mb-6">{title}</Typography>
      
      <LineChart data={data} />
      
      <StatCard
        label="Crecimiento Total"
        value={growth.percentage}
        trend={growth.trend}
        className="mt-6"
      />
    </Card>
  );
};