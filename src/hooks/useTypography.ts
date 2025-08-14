import { useEffect } from 'react';
import { TYPOGRAPHY_CONFIG, TYPOGRAPHY_CLASSES } from '@/config/typography';

// Hook para aplicar configuración global de tipografía
export const useGlobalTypography = () => {
  useEffect(() => {
    // Aplicar estilos globales al documento
    const root = document.documentElement;
    
    // Configurar variables CSS personalizadas para tipografía
    root.style.setProperty('--font-size-body', TYPOGRAPHY_CONFIG.fontSize.body);
    root.style.setProperty('--font-size-body-small', TYPOGRAPHY_CONFIG.fontSize.bodySmall);
    root.style.setProperty('--font-size-caption', TYPOGRAPHY_CONFIG.fontSize.caption);
    root.style.setProperty('--font-size-h1', TYPOGRAPHY_CONFIG.fontSize.h1);
    root.style.setProperty('--font-size-h2', TYPOGRAPHY_CONFIG.fontSize.h2);
    root.style.setProperty('--font-size-h3', TYPOGRAPHY_CONFIG.fontSize.h3);
    root.style.setProperty('--font-size-h4', TYPOGRAPHY_CONFIG.fontSize.h4);
    root.style.setProperty('--font-size-button', TYPOGRAPHY_CONFIG.fontSize.button);
    root.style.setProperty('--font-size-input', TYPOGRAPHY_CONFIG.fontSize.input);

    // Aplicar font-smoothing y otras optimizaciones
    const bodyStyle = document.body.style as any;
    bodyStyle.fontSmoothing = 'antialiased';
    bodyStyle.webkitFontSmoothing = 'antialiased';
    bodyStyle.mozOsxFontSmoothing = 'grayscale';
    bodyStyle.textRendering = 'optimizeLegibility';

  }, []);

  // Función para obtener clases de tipografía
  const getTypographyClass = (element: keyof typeof TYPOGRAPHY_CLASSES) => {
    return TYPOGRAPHY_CLASSES[element];
  };

  // Función para aplicar estilos a un elemento específico
  const applyTypographyToElement = (element: HTMLElement, typographyKey: keyof typeof TYPOGRAPHY_CLASSES) => {
    const classes = TYPOGRAPHY_CLASSES[typographyKey].split(' ');
    element.classList.add(...classes);
  };

  return {
    getTypographyClass,
    applyTypographyToElement,
    config: TYPOGRAPHY_CONFIG,
  };
};

// Hook específico para componentes que necesitan tipografía responsiva
export const useResponsiveTypography = () => {
  const { getTypographyClass } = useGlobalTypography();

  // Detectar el tamaño de pantalla y ajustar tipografía
  const getResponsiveTypographyClass = (
    element: keyof typeof TYPOGRAPHY_CLASSES,
    options?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
    }
  ) => {
    const baseClass = getTypographyClass(element);
    
    if (options) {
      // Agregar clases responsivas si se proporcionan
      const responsiveClasses = [
        options.mobile && `sm:${options.mobile}`,
        options.tablet && `md:${options.tablet}`,
        options.desktop && `lg:${options.desktop}`
      ].filter(Boolean).join(' ');
      
      return `${baseClass} ${responsiveClasses}`;
    }
    
    return baseClass;
  };

  return {
    getResponsiveTypographyClass,
    getTypographyClass,
  };
};
