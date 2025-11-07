import { ImpactContribution } from '../organisms/ImpactContribution';
import { ImpactMetricData } from '../molecules/ImpactMetric';

interface ImpactDashboardProps {
  title?: string;
  impactData: {
    metrics: ImpactMetricData[];
    achievement?: {
      title: string;
      description: string;
    };
  };
  className?: string;
}

export const ImpactDashboard = ({ impactData, title="Tu Contribución de Impacto Verificado" ,className = '' }: ImpactDashboardProps) => {
  return (
    <ImpactContribution
      title={title}
      metrics={impactData.metrics}
      achievement={impactData.achievement}
      className={className}
    />
  );
};