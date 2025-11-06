import Card from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { ImpactMetricsGrid } from './ImpactMetricsGrid';
import { ImpactMetricData } from '../molecules/ImpactMetric';

import { AchievementBadge } from '../atoms/AchievementBadge';

interface ImpactContributionProps {
  title?: string;
  metrics: ImpactMetricData[];
  achievement?: {
    title: string;
    description: string;
  };
  className?: string;
}

export const ImpactContribution = ({
  title = "Tu Contribución de Impacto Verificado",
  metrics,
  achievement,
  className = ''
}: ImpactContributionProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <Typography variant="h3" className="mb-6">{title}</Typography>
      
      <ImpactMetricsGrid metrics={metrics} />
      
      {achievement && (
        <AchievementBadge
          title={achievement.title}
          description={achievement.description}
          className="mt-6"
        />
      )}
    </Card>
  );
};