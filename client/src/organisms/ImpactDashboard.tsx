import { ImpactContribution } from '../organisms/ImpactContribution';
import { ImpactMetricData } from '../molecules/ImpactMetric';

interface ImpactDashboardProps {
  impactData: {
    metrics: ImpactMetricData[];
    achievement?: {
      title: string;
      description: string;
    };
  };
  className?: string;
}

export const ImpactDashboard = ({ impactData, className = '' }: ImpactDashboardProps) => {
  return (
    <ImpactContribution
      title="Tu Contribución de Impacto Verificado"
      metrics={impactData.metrics}
      achievement={impactData.achievement}
      className={className}
    />
  );
};