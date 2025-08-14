import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ParishButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'default' | 'link';
  theme?: 'parish' | 'default';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

/**
 * Componente de botón con estilos específicos del sistema parroquial
 * Incluye efectos de hover, animaciones y soporte para temas
 */
export const ParishButton: React.FC<ParishButtonProps> = ({
  children,
  variant = 'primary',
  theme = 'parish',
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}) => {
  const getThemeClasses = () => {
    if (theme === 'default') return '';

    switch (variant) {
      case 'primary':
        return 'parish-button-primary hover-lift rounded-xl';
      case 'secondary':
        return 'parish-button-secondary hover-lift rounded-xl';
      case 'outline':
        return 'hover-glow click-effect rounded-lg border-2';
      case 'ghost':
        return 'hover-scale transition-smooth rounded-lg';
      case 'destructive':
        return 'hover-scale click-effect rounded-xl';
      default:
        return 'parish-button-primary hover-lift rounded-xl';
    }
  };

  const renderIcon = () => {
    if (!Icon) return null;
    return (
      <Icon 
        className={cn(
          'h-4 w-4 transition-transform duration-300',
          iconPosition === 'left' ? 'mr-2' : 'ml-2'
        )} 
      />
    );
  };

  const getButtonVariant = (): ButtonProps['variant'] => {
    if (theme === 'parish') {
      return variant === 'primary' ? 'default' : variant as ButtonProps['variant'];
    }
    return variant === 'primary' ? 'default' : variant as ButtonProps['variant'];
  };

  return (
    <Button
      variant={getButtonVariant()}
      className={cn(
        theme === 'parish' && getThemeClasses(),
        'font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl',
        className
      )}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </Button>
  );
};

export default ParishButton;
