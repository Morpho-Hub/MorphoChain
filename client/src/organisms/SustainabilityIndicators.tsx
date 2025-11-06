import { MetricCard } from '../molecules/MetricCard';

interface SustainabilityIndicatorsProps {
  soilHealth: number;
  carbonScore: number;
  vegetationIndex: number;
}

export const SustainabilityIndicators = ({
  soilHealth,
  carbonScore,
  vegetationIndex
}: SustainabilityIndicatorsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <MetricCard
        title="Suelo (S)"
        value={soilHealth}
        icon="sprout"
        color="green"
      />
      <MetricCard
        title="Carbono (C)"
        value={carbonScore}
        icon="wind"
        color="blue"
      />
      <MetricCard
        title="Vegetación (V)"
        value={vegetationIndex}
        icon="leaf"
        color="green"
      />
    </div>
  );
};