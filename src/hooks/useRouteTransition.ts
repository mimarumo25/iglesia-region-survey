import { useCallback, useTransition, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personalizado que combina useTransition con navegación
 * para crear transiciones suaves sin parpadeo entre rutas
 */
export const useRouteTransition = () => {
  const navigate = useNavigate();
  const [isPending, startNavigationTransition] = useTransition();

  /**
   * Navega a una ruta usando transitions para suavizar el cambio
   * @param to - Ruta de destino
   * @param options - Opciones adicionales de navegación
   */
  const navigateWithTransition = useCallback((
    to: string, 
    options?: { replace?: boolean }
  ) => {
    startNavigationTransition(() => {
      navigate(to, options);
    });
  }, [navigate]);

  /**
   * Ejecuta una función de navegación dentro de una transición
   * @param navigationFn - Función que contiene la lógica de navegación
   */
  const executeWithTransition = useCallback((
    navigationFn: () => void
  ) => {
    startNavigationTransition(navigationFn);
  }, []);

  return {
    isPending,
    navigateWithTransition,
    executeWithTransition,
    startNavigationTransition
  };
};

/**
 * Hook para precargar componentes lazy antes de la navegación
 */
export const useRoutePreloader = () => {
  // Cache para almacenar las promesas de carga
  const preloadCache = new Map<string, Promise<any>>();

  /**
   * Precarga un componente lazy
   * @param routePath - Path de la ruta
   * @param importFn - Función de importación lazy
   */
  const preloadRoute = useCallback(async (
    routePath: string, 
    importFn: () => Promise<any>
  ) => {
    // Si ya está en cache, no hacer nada
    if (preloadCache.has(routePath)) {
      return preloadCache.get(routePath);
    }

    // Crear la promesa de carga y almacenarla en cache
    const loadPromise = importFn();
    preloadCache.set(routePath, loadPromise);

    try {
      await loadPromise;
      // Ruta precargada exitosamente
    } catch (error) {
      // Error precargando ruta - removiendo del cache
      preloadCache.delete(routePath);
    }

    return loadPromise;
  }, []);

  /**
   * Precarga múltiples rutas
   * @param routes - Array de objetos con routePath e importFn
   */
  const preloadMultipleRoutes = useCallback(async (
    routes: Array<{ routePath: string; importFn: () => Promise<any> }>
  ) => {
    const promises = routes.map(({ routePath, importFn }) => 
      preloadRoute(routePath, importFn)
    );
    
    await Promise.allSettled(promises);
  }, [preloadRoute]);

  return {
    preloadRoute,
    preloadMultipleRoutes,
    preloadCache
  };
};
