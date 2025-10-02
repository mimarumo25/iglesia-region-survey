import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ServiceErrorDisplayProps {
  /** Error recibido del servicio */
  error?: any;
  /** Nombre del servicio que falló */
  serviceName?: string;
  /** Mensaje personalizado de error */
  customMessage?: string;
  /** Función para reintentar la carga */
  onRetry?: () => void;
  /** Mostrar solo como inline sin alert container */
  inline?: boolean;
  /** Tamaño del componente */
  size?: "sm" | "md" | "lg";
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente reutilizable para mostrar errores de servicios de forma consistente
 * Sigue las mejores prácticas del sistema de diseño MIA
 */
const ServiceErrorDisplay = ({
  error,
  serviceName = "servicio",
  customMessage,
  onRetry,
  inline = false,
  size = "md",
  className
}: ServiceErrorDisplayProps) => {
  
  // Determinar el tipo de error y mensaje apropiado
  const getErrorInfo = () => {
    if (customMessage) {
      return {
        title: "Error de Carga",
        message: customMessage,
        type: "custom"
      };
    }

    if (!error) {
      return {
        title: "Error de Servicio",
        message: `Error desconocido en ${serviceName}`,
        type: "unknown"
      };
    }

    // Error de red/conectividad
    if (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('fetch') ||
      error.message?.includes('Network') ||
      error.message?.includes('Failed to fetch') ||
      error.name === 'NetworkError'
    ) {
      return {
        title: "Error de Conexión",
        message: `No se pudo conectar al servidor para cargar ${serviceName}. Verifique su conexión a internet.`,
        type: "network"
      };
    }

    // Error de timeout
    if (
      error.code === 'TIMEOUT' ||
      error.message?.includes('timeout') ||
      error.message?.includes('Timeout')
    ) {
      return {
        title: "Tiempo de Espera Agotado",
        message: `El servidor tardó demasiado en responder para ${serviceName}. Intente nuevamente.`,
        type: "timeout"
      };
    }

    // Error 404 - Recurso no encontrado
    if (error.status === 404 || error.message?.includes('404')) {
      return {
        title: "Recurso No Encontrado",
        message: `El servicio de ${serviceName} no está disponible en este momento.`,
        type: "not_found"
      };
    }

    // Error 500 - Error del servidor
    if (error.status >= 500 || error.message?.includes('500')) {
      return {
        title: "Error del Servidor",
        message: `Hubo un problema en el servidor al cargar ${serviceName}. Intente más tarde.`,
        type: "server"
      };
    }

    // Error 401/403 - Autenticación/Autorización
    if (error.status === 401 || error.status === 403) {
      return {
        title: "Error de Autenticación",
        message: `No tiene permisos para acceder a ${serviceName}. Contacte al administrador.`,
        type: "auth"
      };
    }

    // Error genérico
    const errorMessage = error.message || error.toString?.() || 'Error desconocido';
    return {
      title: "Error al Cargar Datos",
      message: `No se pudieron cargar los datos de ${serviceName}: ${errorMessage}`,
      type: "generic"
    };
  };

  const errorInfo = getErrorInfo();

  // Determinar el icono según el tipo de error
  const getIcon = () => {
    switch (errorInfo.type) {
      case "network":
        return <WifiOff className="h-4 w-4" />;
      case "timeout":
        return <Wifi className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Estilos según el tamaño
  const sizeStyles = {
    sm: {
      container: "p-3",
      title: "text-sm font-semibold",
      message: "text-xs",
      button: "h-7 px-2 text-xs"
    },
    md: {
      container: "p-4",
      title: "text-sm font-semibold", 
      message: "text-sm",
      button: "h-8 px-3 text-sm"
    },
    lg: {
      container: "p-6",
      title: "text-base font-semibold",
      message: "text-sm",
      button: "h-10 px-4"
    }
  };

  const currentStyles = sizeStyles[size];

  // Renderizado inline (para usar dentro de otros componentes)
  if (inline) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-destructive",
        currentStyles.message,
        className
      )}>
        {getIcon()}
        <span className="font-medium">{errorInfo.message}</span>
        {onRetry && (
          <Button
            variant="ghost" 
            size="sm"
            onClick={onRetry}
            className={cn(
              "text-destructive hover:text-destructive hover:bg-destructive/10",
              currentStyles.button
            )}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  // Renderizado completo con Alert
  return (
    <Alert 
      variant="destructive" 
      className={cn(
        "border-destructive/20 bg-destructive/5 dark:bg-destructive/10",
        currentStyles.container,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 space-y-2">
          <AlertTitle className={currentStyles.title}>
            {errorInfo.title}
          </AlertTitle>
          <AlertDescription className={cn(
            "text-destructive/90 dark:text-destructive/80",
            currentStyles.message
          )}>
            {errorInfo.message}
          </AlertDescription>
          {onRetry && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className={cn(
                  "border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground",
                  currentStyles.button
                )}
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Reintentar Carga
              </Button>
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default ServiceErrorDisplay;