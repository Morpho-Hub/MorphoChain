import { Leaf, Sprout, Wind, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface IconProps {
  name: 'leaf' | 'sprout' | 'wind' | 'arrow-up' | 'arrow-down';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Icon = ({ name, className = '', size = 'md' }: IconProps) => {
  const sizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const iconProps = {
    className: `${sizeStyles[size]} ${className}`
  };

  const icons = {
    leaf: <Leaf {...iconProps} />,
    sprout: <Sprout {...iconProps} />,
    wind: <Wind {...iconProps} />,
    'arrow-up': <ArrowUpRight {...iconProps} />,
    'arrow-down': <ArrowDownRight {...iconProps} />
  };

  return icons[name];
};