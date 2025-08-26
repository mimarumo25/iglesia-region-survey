import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import LoaderSkeleton from '@/components/ui/LoaderSkeleton';
import { RouteTransition } from '@/components/ui/RouteTransition';
import { getSkeletonType } from '@/config/routes';

interface RouteSuspenseWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper que combina Suspense con skeleton inteligente y transiciones
 * Elimina el parpadeo y muestra el skeleton apropiado para cada ruta
 */
export const RouteSuspenseWrapper: React.FC<RouteSuspenseWrapperProps> = ({ children }) => {
  const location = useLocation();
  const skeletonType = getSkeletonType(location.pathname);

  return (
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
  );
};

export default RouteSuspenseWrapper;
