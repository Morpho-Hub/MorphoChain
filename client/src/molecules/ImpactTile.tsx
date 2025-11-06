import { ElementType, ReactNode } from "react";
import { TileOutlined } from "../atoms/TileOutlined";

interface TileStatsProps {
  as?: ElementType;
  icon?: ReactNode;
  value: string | number;
  description: string;
  status?: string;
  iconColor?: string;   
  statusColor?: string;  
  className?: string;
}

export function TileStats({
  as = "article",
  icon,
  value,
  description,
  status,
  iconColor = "",
  statusColor = "",
  className = "",
}: TileStatsProps) {
  return (
    <TileOutlined
      as={as}
      leading={
        icon ? (
          <div className={iconColor}>
            {icon}
          </div>
        ) : null
      }
      className={className}
    >
      <div className="flex flex-col gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <p className="text-sm text-gray-600">{description}</p>
        {status && (
          <span className={`text-xs font-medium ${statusColor}`}>
            {status}
          </span>
        )}
      </div>
    </TileOutlined>
  );
}
