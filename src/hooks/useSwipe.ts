import { useEffect, useRef } from 'react';

interface SwipeDirection {
  left: () => void;
  right: () => void;
  up?: () => void;
  down?: () => void;
}

interface UseSwipeOptions {
  threshold?: number; // Mínimo desplazamiento para considerar swipe
  timeout?: number;   // Tiempo máximo para completar el swipe
}

/**
 * Hook personalizado para manejar gestos de deslizamiento (swipe) en móvil
 * Útil para cerrar sidebar con gesto hacia la izquierda
 */
export const useSwipe = (
  directions: Partial<SwipeDirection>,
  options: UseSwipeOptions = {}
) => {
  const {
    threshold = 50,
    timeout = 500
  } = options;

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const touchEndTime = Date.now();

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    const deltaTime = touchEndTime - touchStartTime.current;

    // Verificar si el gesto fue suficientemente rápido
    if (deltaTime > timeout) return;

    // Verificar si el desplazamiento fue suficiente
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < threshold && absY < threshold) return;

    // Determinar dirección principal
    if (absX > absY) {
      // Swipe horizontal
      if (deltaX > 0 && directions.right) {
        directions.right();
      } else if (deltaX < 0 && directions.left) {
        directions.left();
      }
    } else {
      // Swipe vertical
      if (deltaY > 0 && directions.down) {
        directions.down();
      } else if (deltaY < 0 && directions.up) {
        directions.up();
      }
    }
  };

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return ref;
};