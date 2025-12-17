import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import LoaderSkeleton from '@/components/ui/LoaderSkeleton';
import { RouteTransition } from '@/components/ui/RouteTransition';
import { getSkeletonType } from '@/config/routes';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface RouteSuspenseWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper que combina Suspense con skeleton inteligente, transiciones y manejo de errores
 * Elimina el parpadeo, muestra el skeleton apropiado y captura errores de renderizado
 */
export const RouteSuspenseWrapper: React.FC<RouteSuspenseWrapperProps> = ({ children }) => {
  const location = useLocation();
  const skeletonType = getSkeletonType(location.pathname);

  return (
    <ErrorBoundary
      maxRetries={2}
      resetKeys={[location.pathname]}
      showErrorDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        // Log específico para errores de ruta
        console.error('🚨 Error en ruta:', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          route: location.pathname,
          search: location.search,
          timestamp: new Date().toISOString()
        });
      }}
    >
      <Suspense
        fallback={
          <LoaderSkeleton
            type={skeletonType}
            message="Cargando..."
            showLogo={skeletonType === 'generic'}
            reduceAnimation={false}
          />
        }
      >
        <RouteTransition>
          {children}
        </RouteTransition>
      </Suspense>
    </ErrorBoundary>
  );
};

export default RouteSuspenseWrapper;
