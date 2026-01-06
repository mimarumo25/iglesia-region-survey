import { useState, useEffect } from 'react';

/**
 * Hook personalizado para determinar si se debe mostrar vista móvil de tablas
 * Usa breakpoints de Tailwind CSS para consistencia
 */
export const useResponsiveTable = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isVerySmall, setIsVerySmall] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      
      // Detectar dispositivo touch
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(touchDevice);
      
      // Breakpoints ajustados: sm: 640px, md: 768px, lg: 1024px, xl: 1280px
      if (width < 480) {
        // Pantallas muy pequeñas
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
        setIsVerySmall(true);
        setScreenSize('mobile');
      } else if (width < 768) {
        // Móviles normales
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
        setIsVerySmall(false);
        setScreenSize('mobile');
      } else if (width < 1280) {
        // Tablets y pantallas medianas (aumentado a 1280px para evitar scroll horizontal)
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
        setIsVerySmall(false);
        setScreenSize('tablet');
      } else {
        // Desktop grande (≥1280px)
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
        setIsVerySmall(false);
        setScreenSize('desktop');
      }
    };

    // Verificar tamaño inicial
    checkScreenSize();

    // Escuchar cambios de tamaño de ventana con debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    /** Verdadero si la vista móvil de tablas debe usarse */
    shouldUseMobileView: isMobile || (isTablet && isTouchDevice),
    /** Verdadero solo para dispositivos móviles muy pequeños */
    isVerySmall,
    /** Verdadero si es un dispositivo touch */
    isTouchDevice,
    /** Ancho actual de la ventana */
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  };
};

/**
 * Hook para determinar el número óptimo de columnas a mostrar según el tamaño de pantalla
 */
export const useOptimalColumns = (totalColumns: number) => {
  const { screenSize } = useResponsiveTable();
  
  const getOptimalColumnCount = (): number => {
    switch (screenSize) {
      case 'mobile':
        // En móvil, mostrar máximo 2-3 columnas principales
        return Math.min(totalColumns, 3);
      case 'tablet':
        // En tablet, mostrar hasta 4-5 columnas
        return Math.min(totalColumns, 5);
      case 'desktop':
      default:
        // En desktop, mostrar todas las columnas
        return totalColumns;
    }
  };

  return {
    optimalColumns: getOptimalColumnCount(),
    shouldTruncate: getOptimalColumnCount() < totalColumns,
    hiddenColumns: Math.max(0, totalColumns - getOptimalColumnCount()),
  };
};
