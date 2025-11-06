import { LucideIcon } from 'lucide-react';

interface IconCircleProps {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const IconCircle = ({ 
  icon: Icon, 
  className = '', 
  iconClassName = '',
  size = 'md' 
}: IconCircleProps) => {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`rounded-xl bg-white/50 flex items-center justify-center ${sizeStyles[size]} ${className}`}>
      <Icon className={`${iconClassName} ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-7 h-7' : 'w-10 h-10'}`} />
    </div>
  );
};