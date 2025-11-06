import Card from '../atoms/Card';
import { InvestmentHeader } from '../molecules/InvestmentHeader';
import { InvestmentMetrics } from './InvestmentMetrics';
import { SustainabilityIndicators } from './SustainabilityIndicators';

export interface InvestmentData {
  id: number;
  name: string;
  location: string;
  tokens: number;
  value: string;
  invested: string;
  roi: string;
  trend: 'up' | 'down';
  impactScore: number;
  soilHealth: number;
  carbonScore: number;
  vegetationIndex: number;
  isVerified?: boolean;
}

interface InvestmentCardProps {
  investment: InvestmentData;
  className?: string;
}

export const InvestmentCard = ({ investment, className = '' }: InvestmentCardProps) => {
  return (
    <Card 
      className={`p-5 rounded-xl bg-gradient-to-r from-white to-[#d1e751]/5 hover:border-[#d1e751] transition-all ${className}`}
    >
      <div className="flex flex-col gap-4">
        <InvestmentHeader
          name={investment.name}
          location={investment.location}
          isVerified={investment.isVerified}
        />
        
        <InvestmentMetrics
          tokens={investment.tokens}
          invested={investment.invested}
          value={investment.value}
          roi={investment.roi}
          impactScore={investment.impactScore}
          trend={investment.trend}
        />
        
        <SustainabilityIndicators
          soilHealth={investment.soilHealth}
          carbonScore={investment.carbonScore}
          vegetationIndex={investment.vegetationIndex}
        />
      </div>
    </Card>
  );
};