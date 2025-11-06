import { ImpactMetric, ImpactMetricData } from '../molecules/ImpactMetric';

interface ImpactMetricsGridProps {
  metrics: ImpactMetricData[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export const ImpactMetricsGrid = ({ 
  metrics, 
  className = '',
  columns = 4 
}: ImpactMetricsGridProps) => {
  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridColumns[columns]} gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <ImpactMetric
          key={index}
          data={metric}
        />
      ))}
    </div>
  );
};