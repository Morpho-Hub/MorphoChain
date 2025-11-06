import { Typography } from '../atoms/Typography';
import { Icon } from '../atoms/Icon';

interface InvestmentMetricsProps {
  tokens: number;
  invested: string;
  value: string;
  roi: string;
  impactScore: number;
  trend: 'up' | 'down';
}

export const InvestmentMetrics = ({
  tokens,
  invested,
  value,
  roi,
  impactScore,
  trend
}: InvestmentMetricsProps) => {
  const metrics = [
    { label: 'Tokens en Posesión', value: tokens.toString() },
    { label: 'Invertido', value: invested },
    { label: 'Valor Actual', value: value },
    { 
      label: 'ROI', 
      value: roi,
      isROI: true,
      trend 
    },
    { label: 'Impacto', value: impactScore.toString() }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <div key={index}>
          <Typography variant="caption" className="mb-1">
            {metric.label}
          </Typography>
          <div className="flex items-center gap-1">
            <Typography 
              variant="body" 
              className={metric.isROI ? 'text-[#d1e751]' : 'text-black'}
            >
              {metric.value}
            </Typography>
            {metric.isROI && (
              <Icon 
                name={metric.trend === 'up' ? 'arrow-up' : 'arrow-down'} 
                className={metric.trend === 'up' ? 'text-[#d1e751]' : 'text-[#26ade4]'} 
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};