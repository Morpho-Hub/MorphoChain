interface LegendItemProps {
  name: string;
  value: string | number;
  color: string;
  className?: string;
}

export const LegendItem = ({ name, value, color, className = '' }: LegendItemProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="w-4 h-4 rounded flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-black truncate">{name}</div>
        <div className="text-xs text-black/70">{value}%</div>
      </div>
    </div>
  );
};