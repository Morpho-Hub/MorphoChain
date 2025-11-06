import { LucideIcon } from 'lucide-react';
import { Typography } from '../atoms/Typography';
import Progress from '../atoms/Progress';
import { IconCircle } from '../atoms/IconCircle';

export interface ImpactMetricData {
  value: string;
  label: string;
  progress: number;
  progressLabel: string;
  icon: LucideIcon;
  theme: 'light' | 'dark';
}

interface ImpactMetricProps {
  data: ImpactMetricData;
  className?: string;
}

export const ImpactMetric = ({ data, className = '' }: ImpactMetricProps) => {
  const { value, label, progress, progressLabel, icon, theme } = data;
  
  const themeStyles = {
    light: {
      bg: 'bg-gradient-green',
      text: 'text-black',
      textMuted: 'text-black/70',
      border: 'border-black/20'
    },
    dark: {
      bg: 'bg-gradient-earth',
      text: 'text-white',
      textMuted: 'text-white/70',
      border: 'border-white/20'
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={`p-6 rounded-xl ${currentTheme.bg} ${className}`}>
      <div className="text-center">
        <IconCircle 
          icon={icon}
          className="mx-auto mb-3"
          iconClassName={currentTheme.text}
        />
        <Typography variant="h1" className={`mb-1 ${currentTheme.text}`}>
          {value}
        </Typography>
        <Typography variant="caption" className={currentTheme.textMuted}>
          {label}
        </Typography>
        <div className={`mt-3 pt-3 border-t ${currentTheme.border}`}>
          <Progress value={progress} className="h-2 mb-2" />
          <Typography variant="caption" className={currentTheme.textMuted}>
            {progressLabel}
          </Typography>
        </div>
      </div>
    </div>
  );
};