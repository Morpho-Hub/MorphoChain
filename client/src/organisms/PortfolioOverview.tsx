import { PortfolioDistribution } from '../organisms/PortfolioDistribution';
import { PieChartData } from '../molecules/PieChart';
import { PortfolioPerformance } from '../organisms/PortfolioPerformance';
import { LineChartData } from '../molecules/LineChart';

interface PortfolioOverviewProps {
  titlePortfolioDistribution?: string;
  titlePortfolioPerformance?: string;
  portfolioData: PieChartData[];
  performanceData: LineChartData[];
  growth?: {
    percentage: string;
    trend: 'up' | 'down';
  };
  className?: string;
  layout?: 'equal' | 'auto';
  statCardLabel?: string;
}

export const PortfolioOverview = ({
  titlePortfolioDistribution,
  titlePortfolioPerformance,
  portfolioData,
  performanceData,
  growth,
  className = '',
  layout = 'equal',
  statCardLabel
}: PortfolioOverviewProps) => {
  const gridLayout = layout === 'equal' 
    ? 'grid-cols-1 lg:grid-cols-2' 
    : 'grid-cols-1 lg:grid-cols-3';

  return (
    <div className={`grid ${gridLayout} gap-6 ${className}`}>
      <PortfolioDistribution
        title={titlePortfolioDistribution}
        data={portfolioData}
      />
      <PortfolioPerformance
        title={titlePortfolioPerformance}
        statCardLabel={statCardLabel}
        data={performanceData} 
        growth={growth}
      />
    </div>
  );
};