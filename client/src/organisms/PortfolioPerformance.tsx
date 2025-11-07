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
  statCardLabel?: string;
}

export const PortfolioPerformance = ({ 
  data, 
  growth = { percentage: '+22.5%', trend: 'up' },
  title = "Rendimiento del Portafolio",
  className = '',
  statCardLabel = "Crecimiento Total"
}: PortfolioPerformanceProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <Typography variant="h3" className="mb-6">{title}</Typography>
      
      <LineChart data={data} />
      
      <StatCard
        label={statCardLabel}
        value={growth.percentage}
        trend={growth.trend}
        className="mt-6"
      />
    </Card>
  );
};