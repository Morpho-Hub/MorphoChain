import { Typography } from '../atoms/Typography';
import { Icon } from '../atoms/Icon';

interface InvestmentMetricsProps {
  tokens?: number;
  invested?: string;
  value?: string;
  roi?: string;
  impactScore?: number;
  trend?: 'up' | 'down';
}

export const InvestmentMetrics = ({
  tokens = 0,
  invested = '$0',
  value = '$0',
  roi = '+0%',
  impactScore = 0,
  trend = 'up'
}: InvestmentMetricsProps) => {
  const metrics = [
    { label: 'Tokens en Posesión', value: (tokens || 0).toString() },
    { label: 'Invertido', value: invested || '$0' },
    { label: 'Valor Actual', value: value || '$0' },
    { 
      label: 'ROI', 
      value: roi || '+0%',
      isROI: true,
      trend 
    },
    { label: 'Impacto', value: (impactScore || 0).toString() }
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