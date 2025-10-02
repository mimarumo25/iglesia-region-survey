import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseServiceRetryOptions {
  /** Número máximo de reintentos automáticos */
  maxRetries?: number;
  /** Delay entre reintentos en milisegundos */
  retryDelay?: number;
  /** Mostrar toast de error cuando falle */
  showErrorToast?: boolean;
  /** Mensaje personalizado para el toast de error */
  errorMessage?: string;
}

interface UseServiceRetryReturn {
  /** Estado de loading de reintento */
  isRetrying: boolean;
  /** Número de reintentos realizados */
  retryCount: number;
  /** Función para reintentar la operación */
  retry: () => Promise<void>;
  /** Resetear el contador de reintentos */
  resetRetryCount: () => void;
}

/**
 * Hook personalizado para manejar reintentos de servicios fallidos
 * con manejo de estados y notificaciones apropiadas
 */
export const useServiceRetry = (
  serviceFunction: () => Promise<any> | void,
  options: UseServiceRetryOptions = {}
): UseServiceRetryReturn => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    showErrorToast = true,
    errorMessage = "Error al reintentar la operación"
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const retry = useCallback(async () => {
    if (isRetrying || retryCount >= maxRetries) {
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      // Agregar delay si no es el primer intento
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }

      await serviceFunction();

      // Éxito - resetear contador
      if (retryCount > 0) {
        toast({
          title: "✅ Datos cargados correctamente",
          description: "La información se ha actualizado exitosamente.",
          variant: "default"
        });
      }
      
      setRetryCount(0);
    } catch (error) {
      console.error(`Reintento ${retryCount + 1} falló:`, error);
      
      if (showErrorToast) {
        const isLastAttempt = retryCount + 1 >= maxRetries;
        toast({
          title: isLastAttempt ? "❌ Error persistente" : "⚠️ Reintentando...",
          description: isLastAttempt 
            ? `${errorMessage}. Se han agotado los reintentos automáticos.`
            : `${errorMessage}. Reintento ${retryCount + 1} de ${maxRetries}.`,
          variant: "destructive"
        });
      }
    } finally {
      setIsRetrying(false);
    }
  }, [serviceFunction, isRetrying, retryCount, maxRetries, retryDelay, showErrorToast, errorMessage, toast]);

  const resetRetryCount = useCallback(() => {
    setRetryCount(0);
  }, []);

  return {
    isRetrying,
    retryCount,
    retry,
    resetRetryCount
  };
};

export default useServiceRetry;