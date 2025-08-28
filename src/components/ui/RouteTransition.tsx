import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { cn } from '@/lib/utils';

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente que envuelve las rutas con transiciones CSS suaves
 * Mejorado para prevenir errores de manipulación del DOM durante las transiciones
 * Compatible con SafeRenderer para máxima estabilidad
 */
export const RouteTransition: React.FC<RouteTransitionProps> = ({ 
  children, 
  className = "" 
}) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentContent, setCurrentContent] = useState(children);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const locationKeyRef = useRef(location.key);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Solo proceder si el componente sigue montado y la ubicación realmente cambió
    if (!mountedRef.current || locationKeyRef.current === location.key) {
      return;
    }

    // Limpiar timeouts y animation frames previos
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Actualizar referencia de ubicación
    locationKeyRef.current = location.key;

    // Usar flushSync para operaciones sincronizadas de DOM
    if (mountedRef.current) {
      // Iniciar animación de forma sincronizada
      animationFrameRef.current = requestAnimationFrame(() => {
        if (mountedRef.current) {
          flushSync(() => {
            setIsAnimating(true);
          });

          // Programar cambio de contenido
          timeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              flushSync(() => {
                setCurrentContent(children);
                setIsAnimating(false);
              });
            }
          }, 150);
        }
      });
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [location.key, children]);

  // Actualizar contenido inmediatamente si no hay animación
  useEffect(() => {
    if (!isAnimating && mountedRef.current) {
      setCurrentContent(children);
    }
  }, [children, isAnimating]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
