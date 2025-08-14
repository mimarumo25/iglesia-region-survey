import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface ParishCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'gradient';
  glowEffect?: boolean;
  hoverAnimation?: boolean;
  themeBackground?: 'default' | 'primary' | 'secondary' | 'subtle' | 'animated';
}

/**
 * Componente de tarjeta con estilos específicos del sistema parroquial
 * Incluye efectos de hover, sombras, gradientes y integración con el sistema de temas
 */
export const ParishCard: React.FC<ParishCardProps> = ({
  children,
  variant = 'default',
  glowEffect = false,
  hoverAnimation = true,
  themeBackground = 'default',
  className,
  ...props
}) => {
  const { currentTheme, isDarkMode } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'shadow-lg hover:shadow-xl border-primary/10';
      case 'interactive':
        return 'parish-card cursor-pointer';
      case 'gradient':
        return 'card-enhanced border-primary/20';
      default:
        return 'shadow-card hover:shadow-md';
    }
  };

  const getThemeBackgroundClasses = () => {
    const baseClasses = [];
    
    switch (themeBackground) {
      case 'primary':
        baseClasses.push('bg-primary text-primary-foreground');
        if (variant === 'gradient') {
          baseClasses.push('[background:var(--gradient-primary)]');
        }
        break;
      case 'secondary':
        baseClasses.push('bg-secondary text-secondary-foreground');
        if (variant === 'gradient') {
          baseClasses.push('[background:var(--gradient-secondary)]');
        }
        break;
      case 'subtle':
        baseClasses.push('[background:var(--gradient-subtle)]');
        break;
      case 'animated':
        baseClasses.push('parish-gradient-header');
        break;
      default:
        if (variant === 'gradient') {
          baseClasses.push('[background:var(--gradient-card)]');
        } else {
          baseClasses.push('bg-card');
        }
    }
    
    return baseClasses.join(' ');
  };

  const getEffectClasses = () => {
    const classes = [];
    
    if (hoverAnimation) {
      classes.push('hover-lift');
    }
    
    if (glowEffect) {
      classes.push('hover-glow');
    }
    
    // Sombra temática basada en el tema actual
    if (themeBackground === 'primary' || themeBackground === 'animated') {
      classes.push('hover:shadow-glow');
    }
    
    return classes.join(' ');
  };

  const getThemeSpecificClasses = () => {
    const themeClasses = [];
    
    // Clases específicas por tema
    themeClasses.push(`theme-${currentTheme}`);
    
    if (isDarkMode) {
      themeClasses.push('dark-mode-enhanced');
    }
    
    // Efectos especiales para fondos temáticos
    if (themeBackground === 'animated') {
      themeClasses.push('overflow-hidden relative');
    }
    
    if (themeBackground === 'primary' || themeBackground === 'secondary') {
      themeClasses.push('bg-opacity-95 backdrop-blur-sm');
    }
    
    return themeClasses.join(' ');
  };

  return (
    <Card
      className={cn(
        'transition-all duration-300 border border-border',
        getVariantClasses(),
        getThemeBackgroundClasses(),
        getEffectClasses(),
        getThemeSpecificClasses(),
        'theme-transition', // Para transiciones suaves de tema
        className
      )}
      {...props}
    >
      {themeBackground === 'animated' && (
        <>
          {/* Overlay shimmer effect para fondos animados */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
          {/* Patrón de puntos decorativo */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{
                 backgroundImage: `radial-gradient(circle, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
                 backgroundSize: '20px 20px'
               }} 
          />
        </>
      )}
      
      {/* Contenido con z-index relativo para estar sobre los overlays */}
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
};

export default ParishCard;
