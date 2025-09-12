import { useState, useEffect } from 'react';

/**
 * Hook para manejar el estado de visibilidad de la página
 * Optimizado para evitar recargas innecesarias cuando se cambia de pestaña
 * @returns Object con estado de visibilidad y tiempo desde último cambio
 */
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState<boolean>(!document.hidden);
  const [lastVisibilityChange, setLastVisibilityChange] = useState<number>(Date.now());
  const [wasHiddenFor, setWasHiddenFor] = useState<number>(0);

  useEffect(() => {
    let hiddenStartTime = 0;

    const handleVisibilityChange = () => {
      const now = Date.now();
      const newIsVisible = !document.hidden;
      
      if (newIsVisible && !isVisible) {
        // La página acaba de volverse visible
        const timeSinceHidden = now - hiddenStartTime;
        setWasHiddenFor(timeSinceHidden);
      } else if (!newIsVisible && isVisible) {
        // La página acaba de ocultarse
        hiddenStartTime = now;
        setWasHiddenFor(0);
      }
      
      setIsVisible(newIsVisible);
      setLastVisibilityChange(now);
    };

    // Configurar listener con options para mejor performance
    document.addEventListener('visibilitychange', handleVisibilityChange, {
      passive: true,
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVisible]);

  return {
    isVisible,
    lastVisibilityChange,
    wasHiddenFor,
    /**
     * Determina si debe ejecutarse una acción basada en el tiempo que la página estuvo oculta
     * @param minHiddenTime Tiempo mínimo en milisegundos que debe estar oculta
     * @returns true si debe ejecutar la acción
     */
    shouldExecuteOnVisible: (minHiddenTime: number = 60000) => {
      return isVisible && wasHiddenFor >= minHiddenTime;
    },
  };
};

export default usePageVisibility;
