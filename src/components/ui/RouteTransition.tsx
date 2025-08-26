import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente que envuelve las rutas con transiciones CSS suaves
 * Elimina el parpadeo y crea una experiencia fluida sin dependencias externas
 */
export const RouteTransition: React.FC<RouteTransitionProps> = ({ 
  children, 
  className = "" 
}) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentContent, setCurrentContent] = useState(children);

  useEffect(() => {
    // Iniciar animación de salida
    setIsAnimating(true);

    // Después de la animación de salida, cambiar el contenido
    const timer = setTimeout(() => {
      setCurrentContent(children);
      setIsAnimating(false);
    }, 150); // Duración de la animación de salida

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={cn("route-transition-container", className)}>
      <div
        className={cn(
          "route-transition-content",
          "transition-all duration-300 ease-out",
          isAnimating 
            ? "opacity-0 translate-y-2 scale-[0.98]" 
            : "opacity-100 translate-y-0 scale-100"
        )}
      >
        {currentContent}
      </div>
    </div>
  );
};

/**
 * Hook para aplicar animaciones CSS a elementos individuales
 */
export const usePageAnimation = (delay: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    className: cn(
      "transition-all duration-500 ease-out",
      isVisible 
        ? "opacity-100 translate-y-0" 
        : "opacity-0 translate-y-4"
    ),
    isVisible
  };
};

/**
 * Componente auxiliar para animar elementos individuales con CSS
 */
export const AnimatedElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => {
  const animation = usePageAnimation(delay);

  return (
    <div className={cn(animation.className, className)}>
      {children}
    </div>
  );
};

/**
 * Componente para animar listas/grids con stagger effect
 */
export const StaggeredList: React.FC<{
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = "", staggerDelay = 100 }) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimatedElement key={index} delay={index * staggerDelay}>
          {child}
        </AnimatedElement>
      ))}
    </div>
  );
};

export default RouteTransition;
