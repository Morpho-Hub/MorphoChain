import { ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
}

export const Typography = ({ children, className = '', variant = 'body' }: TypographyProps) => {
  const baseStyles = 'text-black';
  
  const variantStyles = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-semibold',
    h4: 'text-lg font-medium',
    body: 'text-base',
    caption: 'text-sm text-black/70'
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};