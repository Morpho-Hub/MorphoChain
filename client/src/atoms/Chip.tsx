import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ChipProps {
  /**
   * Texto a mostrar en el chip
   */
  label?: string;
  /**
   * Emoji o ícono a mostrar
   */
  emoji?: string;
  /**
   * Icono de Lucide React
   */
  icon?: LucideIcon;
  /**
   * Color de fondo del chip
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'default';
  /**
   * Tamaño del chip
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  emoji,
  icon: Icon,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  // Validación: debe tener al menos label, emoji o icon
  if (!label && !emoji && !Icon) {
    console.warn('Chip debe tener al menos un label, emoji o icon');
    return null;
  }

  // Estilos base
  const baseStyles = 'inline-flex items-center gap-2 rounded-full font-medium transition-all';

  // Variantes de color
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800 border border-blue-200',
    secondary: 'bg-purple-100 text-purple-800 border border-purple-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    info: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
  };

  // Tamaños
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  // Tamaño del emoji/icon según el tamaño del chip
  const emojiSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Tamaño del icono de Lucide
  const iconSizeMap = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {Icon && (
        <Icon size={iconSizeMap[size]} className="flex-shrink-0" />
      )}
      {emoji && (
        <span className={emojiSizeStyles[size]} role="img" aria-label="chip-icon">
          {emoji}
        </span>
      )}
      {label && <span>{label}</span>}
    </span>
  );
};

export default Chip;
