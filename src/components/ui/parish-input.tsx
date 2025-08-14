import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface ParishInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'enhanced';
  error?: string;
  success?: boolean;
}

/**
 * Componente de input con estilos específicos del sistema parroquial
 * Incluye efectos de focus, iconos y validación visual
 */
export const ParishInput: React.FC<ParishInputProps> = ({
  label,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  error,
  success = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || `parish-input-${Math.random().toString(36).substr(2, 9)}`;

  const getVariantClasses = () => {
    switch (variant) {
      case 'enhanced':
        return 'parish-input';
      default:
        return 'transition-all duration-300 hover:border-primary/50 focus:ring-2 focus:ring-primary/20';
    }
  };

  const getStatusClasses = () => {
    if (error) {
      return 'border-destructive focus:border-destructive focus:ring-destructive/20';
    }
    if (success) {
      return 'border-success focus:border-success focus:ring-success/20';
    }
    return '';
  };

  const renderIcon = () => {
    if (!Icon) return null;
    return (
      <div className={cn(
        'absolute top-1/2 transform -translate-y-1/2 pointer-events-none',
        iconPosition === 'left' ? 'left-3' : 'right-3'
      )}>
        <Icon className={cn(
          'h-4 w-4 transition-colors duration-300',
          error ? 'text-destructive' : success ? 'text-success' : 'text-muted-foreground'
        )} />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium transition-colors duration-300',
            error && 'text-destructive',
            success && 'text-success'
          )}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id={inputId}
          className={cn(
            getVariantClasses(),
            getStatusClasses(),
            Icon && iconPosition === 'left' && 'pl-10',
            Icon && iconPosition === 'right' && 'pr-10',
            'theme-transition', // Para transiciones suaves de tema
            className
          )}
          {...props}
        />
        {renderIcon()}
      </div>
      
      {error && (
        <p className="text-sm text-destructive animate-slide-in-right">
          {error}
        </p>
      )}
    </div>
  );
};

export default ParishInput;
