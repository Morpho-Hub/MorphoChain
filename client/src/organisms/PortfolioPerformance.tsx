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
  growth = { percentage: '+0%', trend: 'up' },
  title = "Rendimiento del Portafolio",
  className = '',
  statCardLabel = "Crecimiento Total"
}: PortfolioPerformanceProps) => {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);
  
  return (
    <Card className={`p-6 ${className}`}>
      <Typography variant="h3" className="mb-6">{title}</Typography>
      
      {hasData ? (
        <>
          <LineChart data={data} />
          
          <StatCard
            label={statCardLabel}
            value={growth.percentage}
            trend={growth.trend}
            className="mt-6"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">📈</div>
          <Typography variant="body" className="text-gray-500">
            Sin datos de rendimiento
          </Typography>
          <Typography variant="caption" className="text-gray-400 mt-2">
            El rendimiento se mostrará una vez que tengas inversiones activas
          </Typography>
        </div>
      )}
    </Card>
  );
};