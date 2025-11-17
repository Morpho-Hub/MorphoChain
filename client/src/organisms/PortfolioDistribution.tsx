import Card from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { PieChart, PieChartData } from '../molecules/PieChart';
import { LegendGrid } from '../molecules/LegendGrid';

interface PortfolioDistributionProps {
  data: PieChartData[];
  title?: string;
  className?: string;
}

export const PortfolioDistribution = ({ 
  data, 
  title = "Distribución del Portafolio",
  className = '' 
}: PortfolioDistributionProps) => {
  const hasData = data && data.length > 0;
  
  return (
    <Card className={`p-6 ${className}`}>
      <Typography variant="h3" className="mb-6">{title}</Typography>
      
      {hasData ? (
        <>
          <div className="flex items-center justify-center">
            <PieChart data={data} />
          </div>
          
          <LegendGrid data={data} className="mt-6" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <Typography variant="body" className="text-gray-500">
            No hay inversiones aún
          </Typography>
          <Typography variant="caption" className="text-gray-400 mt-2">
            Realiza tu primera inversión para ver la distribución de tu portafolio
          </Typography>
        </div>
      )}
    </Card>
  );
};
