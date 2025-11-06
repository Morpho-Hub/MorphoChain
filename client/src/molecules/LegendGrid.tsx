import { LegendItem } from '../atoms/LegendItem';

export interface LegendItemData {
  name: string;
  value: number;
  color: string;
}

interface LegendGridProps {
  data: LegendItemData[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export const LegendGrid = ({ data, className = '', columns = 2 }: LegendGridProps) => {
  const gridColumns = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };

  return (
    <div className={`grid ${gridColumns[columns]} gap-3 ${className}`}>
      {data.map((item) => (
        <LegendItem
          key={item.name}
          name={item.name}
          value={item.value}
          color={item.color}
        />
      ))}
    </div>
  );
};