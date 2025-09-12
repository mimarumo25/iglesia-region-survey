import { useCallback } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

/**
 * Hook optimizado para manejo rápido del sidebar
 * Elimina delays y optimiza la apertura/cierre inmediato
 */
export const useFastSidebar = () => {
  const { state, setOpenMobile, isMobile, toggleSidebar } = useSidebar();

  // Toggle inmediato sin delays
  const fastToggle = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  // Cerrar inmediatamente en móvil
  const fastCloseMobile = useCallback(() => {
    if (isMobile && state === "expanded") {
      setOpenMobile(false);
    }
  }, [isMobile, state, setOpenMobile]);

  // Abrir inmediatamente en móvil
  const fastOpenMobile = useCallback(() => {
    if (isMobile && state === "collapsed") {
      setOpenMobile(true);
    }
  }, [isMobile, state, setOpenMobile]);

  return {
    isOpen: state === "expanded",
    isMobile,
    fastToggle,
    fastCloseMobile, 
    fastOpenMobile,
    state
  };
};
