// Definición de las rutas lazy con sus funciones de importación
export const lazyRoutes = {
  // Rutas principales
  '/dashboard': () => import('@/pages/Dashboard'),
  '/surveys': () => import('@/pages/Surveys'),
  '/surveys/:id': () => import('@/pages/SurveyDetails'),
  '/families': () => import('@/pages/Families'),

  '/reports': () => import('@/pages/Reports'),
  '/users': () => import('@/pages/Users'),
  '/profile': () => import('@/pages/Profile'),
  
  // Rutas de configuración
  '/settings': () => import('@/pages/SettingsWrapper'),
  '/settings/parroquias': () => import('@/pages/SettingsWrapper'),
  '/settings/veredas': () => import('@/pages/SettingsWrapper'),
  '/settings/municipios': () => import('@/pages/SettingsWrapper'),
  '/settings/aguas-residuales': () => import('@/pages/SettingsWrapper'),
  '/settings/tipos-vivienda': () => import('@/pages/SettingsWrapper'),
  '/settings/parentescos': () => import('@/pages/SettingsWrapper'),
  '/settings/estados-civiles': () => import('@/pages/SettingsWrapper'),
  '/settings/sexos': () => import('@/pages/SettingsWrapper'),
  '/settings/comunidades-culturales': () => import('@/pages/SettingsWrapper'),
  '/settings/estudios': () => import('@/pages/SettingsWrapper'),
  '/settings/departamentos': () => import('@/pages/SettingsWrapper'),
  '/settings/profesiones': () => import('@/pages/SettingsWrapper'),
  '/settings/sectores-config': () => import('@/pages/SettingsWrapper'),
    // '/settings/tallas': () => import('@/pages/SettingsWrapper'),
  
  // Rutas de formularios
  '/survey': () => import('@/components/SurveyForm'),
  '/survey/new-hierarchy': () => import('@/pages/NewSurveyWithHierarchy'),
  
  // Rutas de autenticación (por si se necesitan)
  '/login': () => import('@/pages/Login'),
  '/reset-password': () => import('@/pages/ResetPassword'),
  '/verify-email': () => import('@/pages/VerifyEmail')
} as const;

/**
 * Tipos para el sistema de rutas
 */
export type RoutePath = keyof typeof lazyRoutes;

/**
 * Metadata de las rutas para el sistema de preloading
 */
export const routeMetadata: Record<string, {
  skeletonType: 'dashboard' | 'form' | 'table' | 'settings' | 'generic';
  priority: 'high' | 'medium' | 'low';
  preloadTrigger: 'hover' | 'idle' | 'manual';
  dependencies?: string[]; // Rutas que deberían precargarse junto con esta
}> = {
  '/dashboard': {
    skeletonType: 'dashboard',
    priority: 'high',
    preloadTrigger: 'idle',
    dependencies: ['/surveys', '/families']
  },
  '/surveys': {
    skeletonType: 'table',
    priority: 'high',
    preloadTrigger: 'hover',
    dependencies: ['/survey']
  },
  '/surveys/:id': {
    skeletonType: 'generic',
    priority: 'high',
    preloadTrigger: 'hover'
  },
  '/families': {
    skeletonType: 'table',
    priority: 'high',
    preloadTrigger: 'hover'
  },

  '/reports': {
    skeletonType: 'dashboard',
    priority: 'medium',
    preloadTrigger: 'hover'
  },
  '/users': {
    skeletonType: 'table',
    priority: 'medium',
    preloadTrigger: 'hover'
  },
  '/profile': {
    skeletonType: 'form',
    priority: 'low',
    preloadTrigger: 'hover'
  },
  '/settings': {
    skeletonType: 'settings',
    priority: 'medium',
    preloadTrigger: 'hover'
  },
  '/survey': {
    skeletonType: 'form',
    priority: 'high',
    preloadTrigger: 'hover'
  },
  '/survey/new-hierarchy': {
    skeletonType: 'form',
    priority: 'medium',
    preloadTrigger: 'hover'
  }
};

/**
 * Obtener tipo de skeleton para una ruta
 */
export const getSkeletonType = (path: string) => {
  // Buscar coincidencia exacta primero
  if (routeMetadata[path]) {
    return routeMetadata[path].skeletonType;
  }
  
  // Buscar coincidencia por patrón (para sub-rutas de settings)
  if (path.startsWith('/settings/')) {
    return 'settings';
  }
  
  return 'generic';
};

/**
 * Obtener prioridad de preloading para una ruta
 */
export const getPreloadPriority = (path: string) => {
  if (routeMetadata[path]) {
    return routeMetadata[path].priority;
  }
  return 'low';
};
