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
  return (
    <Card className={`p-6 ${className}`}>
      <Typography variant="h3" className="mb-6">{title}</Typography>
      
      <div className="flex items-center justify-center">
        <PieChart data={data} />
      </div>
      
      <LegendGrid data={data} className="mt-6" />
    </Card>
  );
};
