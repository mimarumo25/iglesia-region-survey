import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  resetKeys?: any[];
  className?: string;
  variant?: 'full-page' | 'component';
}

/**
 * ErrorBoundary que maneja errores relacionados con manipulación del DOM en React
 * Especialmente diseñado para capturar errores de removeChild y similares
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { hasError } = this.state;
    const { resetKeys } = this.props;

    if (
      hasError &&
      resetKeys &&
      prevProps.resetKeys &&
      this.hasArrayChanged(prevProps.resetKeys, resetKeys)
    ) {
      this.handleRetry();
    }
  }

  private hasArrayChanged(a: any[], b: any[]) {
    return (
      a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]))
    );
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error details:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Llamar callback opcional
    this.props.onError?.(error, errorInfo);

    // Auto-retry para errores conocidos de DOM manipulation
    this.handleAutoRetry(error);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private handleAutoRetry = (error: Error) => {
    const isDOMError = this.isDOMManipulationError(error);
    const maxRetries = this.props.maxRetries ?? 3;
    
    if (isDOMError && this.state.retryCount < maxRetries) {
      // Auto-retry después de un breve delay para errores de DOM
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, 1000 + (this.state.retryCount * 1000)); // Incrementar delay con cada retry
    }
  };

  private isDOMManipulationError = (error: Error): boolean => {
    const domErrorPatterns = [
      'removeChild',
      'The node to be removed is not a child',
      'NotFoundError',
      'commitDeletionEffectsOnFiber',
      'removeChildFromContainer'
    ];
    
    return domErrorPatterns.some(pattern => 
      error.message?.includes(pattern) || 
      error.stack?.includes(pattern)
    );
  };

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));

    // Force a clean re-render
    this.forceUpdate();
  };

  private handleManualRetry = () => {
    this.handleRetry();
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/dashboard';
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Si se proporciona un fallback personalizado
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDOMError = this.isDOMManipulationError(this.state.error);
      const maxRetries = this.props.maxRetries ?? 3;
      const canRetry = this.state.retryCount < maxRetries;
      const variant = this.props.variant || 'full-page';

      if (variant === 'component') {
        return (
          <Card className={cn("w-full border-red-200 bg-red-50/30", this.props.className)}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-red-900">Error en el módulo</h3>
                    <p className="text-sm text-red-700">
                      {isDOMError 
                        ? 'Error de renderizado. El sistema intentará recuperarse.'
                        : 'Este componente no pudo cargarse correctamente.'
                      }
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {canRetry && (
                      <Button 
                        size="sm"
                        onClick={this.handleManualRetry}
                        className="h-8 text-xs"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reintentar
                      </Button>
                    )}
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={this.handleGoBack}
                      className="h-8 text-xs"
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      Volver
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      return (
        <div className={cn(
          "flex items-center justify-center p-4",
          variant === 'full-page' ? "min-h-[60vh]" : "w-full py-12",
          this.props.className
        )}>
          <Card className="w-full max-w-2xl shadow-xl border-red-100">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-900">
                {isDOMError ? 'Error de Visualización' : 'Algo no salió como esperábamos'}
              </CardTitle>
              <CardDescription className="text-gray-500 max-w-md mx-auto">
                {isDOMError 
                  ? 'Hubo un problema técnico al mostrar este contenido. No te preocupes, tus datos están seguros.'
                  : 'El sistema encontró un error inesperado. Puedes intentar de nuevo o navegar a otra sección.'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {/* Información sobre reintentos automáticos */}
              {isDOMError && this.state.retryCount > 0 && (
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <p className="text-sm text-blue-800">
                    Reintentando automáticamente ({this.state.retryCount}/{maxRetries})...
                  </p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {canRetry && (
                  <Button 
                    onClick={this.handleManualRetry}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Intentar de Nuevo
                  </Button>
                )}

                <Button 
                  onClick={this.handleGoBack}
                  variant="outline"
                  className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Ir al Inicio
                </Button>

                <Button 
                  onClick={this.handleReload}
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recargar Todo
                </Button>
              </div>

              {/* Detalles del error (solo en desarrollo) */}
              {this.props.showErrorDetails && import.meta.env.DEV && this.state.errorInfo && (
                <details className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <summary className="cursor-pointer font-medium text-gray-600 mb-2 text-sm">
                    Información técnica para desarrolladores
                  </summary>
                  <div className="space-y-2 text-[10px] font-mono">
                    <div className="p-2 bg-white border border-red-100 rounded text-red-700 overflow-auto max-h-32">
                      {this.state.error.toString()}
                    </div>
                    <div className="p-2 bg-white border border-gray-100 rounded text-gray-500 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para usar ErrorBoundary con React functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
};

/**
 * HOC para envolver componentes con ErrorBoundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;
