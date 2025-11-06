import { PortfolioDistribution } from '../organisms/PortfolioDistribution';
import { PieChartData } from '../molecules/PieChart';
import { PortfolioPerformance } from '../organisms/PortfolioPerformance';
import { LineChartData } from '../molecules/LineChart';

interface PortfolioOverviewProps {
  portfolioData: PieChartData[];
  performanceData: LineChartData[];
  growth?: {
    percentage: string;
    trend: 'up' | 'down';
  };
  className?: string;
  layout?: 'equal' | 'auto';
}

export const PortfolioOverview = ({
  portfolioData,
  performanceData,
  growth,
  className = '',
  layout = 'equal'
}: PortfolioOverviewProps) => {
  const gridLayout = layout === 'equal' 
    ? 'grid-cols-1 lg:grid-cols-2' 
    : 'grid-cols-1 lg:grid-cols-3';

  return (
    <div className={`grid ${gridLayout} gap-6 ${className}`}>
      <PortfolioDistribution data={portfolioData} />
      <PortfolioPerformance 
        data={performanceData} 
        growth={growth}
      />
    </div>
  );
};