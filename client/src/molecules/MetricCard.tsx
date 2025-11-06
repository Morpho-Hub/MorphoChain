import { Typography } from '../atoms/Typography';
import Progress from '../atoms/Progress';
import { Icon } from '../atoms/Icon';

interface MetricCardProps {
  title: string;
  value: number;
  icon: 'leaf' | 'sprout' | 'wind';
  color?: 'green' | 'blue';
  suffix?: string;
}

export const MetricCard = ({ title, value, icon, color = 'green', suffix = '%' }: MetricCardProps) => {
  const bgColor = color === 'green' ? 'bg-[#d1e751]/10' : 'bg-[#4dbce9]/10';

  return (
    <div className={`p-3 rounded-lg ${bgColor}`}>
      <div className="flex items-center justify-between mb-1">
        <Typography variant="caption">{title}</Typography>
        <Icon name={icon} size="sm" className="text-black/70" />
      </div>
      <Typography variant="body" className="text-sm">
        {value}{suffix}
      </Typography>
      <Progress value={value} color={color} className="h-1 mt-2" />
    </div>
  );
};