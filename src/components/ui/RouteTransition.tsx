import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente que envuelve las rutas con transiciones CSS suaves
 * Versión simplificada sin flushSync para prevenir errores de DOM
 * Compatible con el ciclo de vida natural de React
 */
export const RouteTransition: React.FC<RouteTransitionProps> = ({ 
  children, 
  className = "" 
}) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const previousLocationRef = useRef(location.pathname);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Manejar cambios de ruta de forma más segura
  useEffect(() => {
    // Solo proceder si realmente cambió la ubicación y el componente sigue montado
    if (previousLocationRef.current === location.pathname || !isMountedRef.current) {
      setDisplayChildren(children);
      return;
    }

    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Actualizar referencia
    previousLocationRef.current = location.pathname;

    // Iniciar animación de salida
    if (isMountedRef.current) {
      setIsAnimating(true);

      // Esperar que termine la animación antes de cambiar el contenido
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setDisplayChildren(children);
          
          // Pequeña pausa antes de mostrar el nuevo contenido
          setTimeout(() => {
            if (isMountedRef.current) {
              setIsAnimating(false);
            }
          }, 50);
        }
      }, 150);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [location.pathname, children]);

  return (
    <div className={cn("route-transition-container", className)}>
      <div
        className={cn(
          "route-transition-content",
          "transition-all duration-300 ease-out",
          isAnimating 
            ? "opacity-0 translate-y-1 scale-[0.99]" 
            : "opacity-100 translate-y-0 scale-100"
        )}
      >
        {displayChildren}
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
