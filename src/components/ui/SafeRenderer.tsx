import React, { useEffect, useRef, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { ErrorBoundary } from './ErrorBoundary';
import './safe-renderer.css';

interface SafeRendererProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolateDOM?: boolean;
  className?: string;
}

/**
 * SafeRenderer - Componente que proporciona renderizado seguro con manejo avanzado de DOM
 * Diseñado específicamente para prevenir errores de removeChild y manipulación del DOM
 */
export const SafeRenderer: React.FC<SafeRendererProps> = ({
  children,
  fallback,
  onError,
  isolateDOM = false,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const [renderKey, setRenderKey] = useState(0);
  const [isStable, setIsStable] = useState(false);

  // Cleanup function seguro
  const safeCleanup = useCallback(() => {
    if (!mountedRef.current || !containerRef.current) return;

    try {
      // Usar flushSync para asegurar que todas las actualizaciones pendientes se completen
      flushSync(() => {
        // Forzar que React complete todas las operaciones pendientes
        setIsStable(false);
      });
    } catch (error) {
      console.warn('SafeRenderer cleanup warning:', error);
    }
  }, []);

  // Effect para gestionar el ciclo de vida del componente
  useEffect(() => {
    mountedRef.current = true;
    
    // Marcar como estable después de la primera renderización
    const stabilizeTimer = setTimeout(() => {
      if (mountedRef.current) {
        setIsStable(true);
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(stabilizeTimer);
      
      // Cleanup seguro al desmontar
      safeCleanup();
    };
  }, [safeCleanup]);

  // Handler de error personalizado
  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    console.error('SafeRenderer caught error:', error);
    
    // Si es un error de DOM, intentar recuperación
    const isDOMError = error.message?.includes('removeChild') ||
                      error.message?.includes('The node to be removed is not a child') ||
                      error.message?.includes('NotFoundError');

    if (isDOMError && mountedRef.current) {
      console.log('🔄 Attempting DOM error recovery...');
      
      // Intentar recuperación forzando un re-render
      setTimeout(() => {
        if (mountedRef.current) {
          flushSync(() => {
            setRenderKey(prev => prev + 1);
          });
        }
      }, 100);
    }

    // Llamar handler externo si se proporciona
    onError?.(error, errorInfo);
  }, [onError]);

  // Render del contenido con key dinámico para forzar re-mount en caso de error
  const renderContent = () => {
    if (!isStable) {
      // Mostrar loader mientras se estabiliza
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-pulse text-gray-500 text-sm">Cargando...</div>
        </div>
      );
    }

    return (
      <div key={renderKey} className="safe-content">
        {children}
      </div>
    );
  };

  if (isolateDOM) {
    // Modo de aislamiento: usar una estructura de DOM separada
    return (
      <ErrorBoundary
        fallback={fallback}
        onError={handleError}
        maxRetries={5}
        showErrorDetails={false}
      >
        <div 
          ref={containerRef}
          className={`safe-renderer-isolated ${className}`}
          style={{
            isolation: 'isolate', // CSS isolation
            contain: 'layout style paint', // CSS containment (fixed property name)
          }}
        >
          <div className="safe-renderer-content">
            {renderContent()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Modo normal con ErrorBoundary
  return (
    <ErrorBoundary
      fallback={fallback}
      onError={handleError}
      maxRetries={3}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <div 
        ref={containerRef}
        className={`safe-renderer ${className}`}
      >
        {renderContent()}
      </div>
    </ErrorBoundary>
  );
};

/**
 * Hook para usar SafeRenderer de manera declarativa
 */
export const useSafeRenderer = () => {
  const [renderKey, setRenderKey] = useState(0);
  
  const forceRerender = useCallback(() => {
    flushSync(() => {
      setRenderKey(prev => prev + 1);
    });
  }, []);

  const safeRender = useCallback((element: React.ReactNode, options?: {
    isolateDOM?: boolean;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }) => {
    return (
      <SafeRenderer
        key={renderKey}
        isolateDOM={options?.isolateDOM}
        onError={options?.onError}
      >
        {element}
      </SafeRenderer>
    );
  }, [renderKey]);

  return {
    safeRender,
    forceRerender,
    renderKey
  };
};

/**
 * HOC para envolver componentes automáticamente con SafeRenderer
 */
export const withSafeRenderer = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    isolateDOM?: boolean;
    fallback?: React.ReactNode;
  }
) => {
  const WrappedComponent = (props: P) => (
    <SafeRenderer
      isolateDOM={options?.isolateDOM}
      fallback={options?.fallback}
    >
      <Component {...props} />
    </SafeRenderer>
  );

  WrappedComponent.displayName = `withSafeRenderer(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default SafeRenderer;
