import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-800">
                {isDOMError ? 'Error de Componente' : 'Error Inesperado'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isDOMError 
                  ? 'Se produjo un error durante la actualización de componentes. Esto suele ser temporal.'
                  : 'Algo salió mal. Por favor, intenta de nuevo.'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Información sobre reintentos automáticos */}
              {isDOMError && this.state.retryCount > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Reintentos automáticos:</span> {this.state.retryCount} de {maxRetries}
                  </p>
                  {this.state.retryCount < maxRetries && (
                    <p className="text-xs text-blue-600 mt-1">
                      El sistema intentará corregir el error automáticamente...
                    </p>
                  )}
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {canRetry && (
                  <Button 
                    onClick={this.handleManualRetry}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Intentar de Nuevo
                  </Button>
                )}

                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recargar Página
                </Button>

                <Button 
                  onClick={this.handleGoBack}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Ir Atrás
                </Button>
              </div>

              {/* Detalles del error (solo en desarrollo) */}
              {this.props.showErrorDetails && process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Detalles del Error (Desarrollo)
                  </summary>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>Error:</strong>
                      <pre className="mt-1 p-2 bg-gray-200 rounded text-red-800 overflow-auto">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 p-2 bg-gray-200 rounded text-gray-700 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}

              {/* Sugerencias para el usuario */}
              <div className="text-center text-sm text-gray-500">
                <p>Si el problema persiste:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Actualiza la página</li>
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Intenta en unos minutos</li>
                </ul>
              </div>
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
