// Configuración global de tipografía para la aplicación
export const TYPOGRAPHY_CONFIG = {
  // Tamaños de fuente base para diferentes elementos
  fontSize: {
    // Textos generales
    body: '0.95rem',        // 15.2px - Tamaño principal para lectura
    bodySmall: '0.875rem',  // 14px - Para texto secundario
    caption: '0.75rem',     // 12px - Para texto muy pequeño como badges

    // Títulos y encabezados
    h1: '1.875rem',         // 30px
    h2: '1.5rem',           // 24px
    h3: '1.25rem',          // 20px
    h4: '1.125rem',         // 18px
    h5: '1rem',             // 16px
    h6: '0.875rem',         // 14px

    // Elementos de interfaz
    button: '0.9rem',       // 14.4px
    input: '0.9rem',        // 14.4px
    label: '0.875rem',      // 14px
    tableHeader: '0.85rem', // 13.6px
    tableCell: '0.9rem',    // 14.4px

    // Elementos especiales
    badge: '0.75rem',       // 12px
    tooltip: '0.8rem',      // 12.8px
    navigation: '0.9rem',   // 14.4px
  },

  // Pesos de fuente
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Alturas de línea
  lineHeight: {
    tight: '1.25',      // Para títulos
    normal: '1.5',      // Para texto general
    relaxed: '1.6',     // Para párrafos largos
    loose: '1.8',       // Para texto con mucho contenido
  },

  // Espaciado de letras
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0em',
    wide: '0.005em',
    wider: '0.025em',
  },
} as const;

// Clases CSS predefinidas para uso rápido
export const TYPOGRAPHY_CLASSES = {
  // Títulos
  h1: 'text-2xl lg:text-3xl font-bold leading-tight tracking-tight',
  h2: 'text-xl lg:text-2xl font-semibold leading-tight tracking-tight',
  h3: 'text-lg lg:text-xl font-semibold leading-normal tracking-normal',
  h4: 'text-base lg:text-lg font-medium leading-normal tracking-normal',
  h5: 'text-sm lg:text-base font-medium leading-normal',
  h6: 'text-sm font-medium leading-normal',

  // Texto del cuerpo
  body: 'text-[0.95rem] leading-relaxed font-normal tracking-tight',
  bodySmall: 'text-sm leading-normal font-normal',
  caption: 'text-xs leading-normal font-medium tracking-wide',

  // Elementos de interfaz
  button: 'text-[0.9rem] font-medium leading-normal tracking-wide',
  input: 'text-[0.9rem] font-normal leading-normal tracking-normal',
  label: 'text-sm font-medium leading-normal tracking-normal',
  
  // Elementos de tabla
  tableHeader: 'text-[0.85rem] font-semibold uppercase tracking-wider',
  tableCell: 'text-[0.9rem] font-normal leading-normal',

  // Elementos especiales
  badge: 'text-xs font-medium tracking-wide',
  tooltip: 'text-[0.8rem] font-normal leading-normal',
  navigation: 'text-[0.9rem] font-medium leading-normal',
} as const;

// Función helper para obtener estilos de tipografía
export const getTypographyStyle = (element: keyof typeof TYPOGRAPHY_CLASSES) => {
  return TYPOGRAPHY_CLASSES[element];
};

// Configuración responsiva para diferentes breakpoints
export const RESPONSIVE_TYPOGRAPHY = {
  mobile: {
    // En móvil, hacemos las fuentes ligeramente más grandes para mejor legibilidad
    scaleMultiplier: 1.05,
    baseSize: '1rem', // 16px como base en móvil
  },
  tablet: {
    scaleMultiplier: 1,
    baseSize: '0.95rem', // 15.2px en tablet
  },
  desktop: {
    scaleMultiplier: 1,
    baseSize: '0.95rem', // 15.2px en desktop
  },
} as const;

// Función para aplicar estilos de tipografía dinámicamente
export const applyTypographyStyle = (element: HTMLElement, typographyKey: keyof typeof TYPOGRAPHY_CLASSES) => {
  const classes = TYPOGRAPHY_CLASSES[typographyKey].split(' ');
  element.classList.add(...classes);
};

export default TYPOGRAPHY_CONFIG;
