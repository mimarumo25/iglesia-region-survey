/**
 * 🍞 Toast Error Handler
 * Utilidad centralizada para mostrar toasts de error desde servicios
 * 
 * IMPORTANTE: Esta utilidad debe usarse desde componentes React que tengan acceso a useToast
 * Para servicios puros, se debe pasar la función toast como parámetro
 */

import { toast as toastFunction } from "sonner";

/**
 * Interfaz para el objeto toast de shadcn/ui
 */
export interface ToastFunction {
  (props: {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }): void;
  error?: (props: { title?: string; description?: string }) => void;
  success?: (props: { title?: string; description?: string }) => void;
  warning?: (props: { title?: string; description?: string }) => void;
}

/**
 * Extrae mensaje de error legible desde diferentes formatos de error
 */
export const extractErrorMessage = (error: any): string => {
  // Error estructurado del API con formato nuevo
  if (error?.response?.data?.code && error?.response?.data?.message) {
    const errorData = error.response.data;
    let message = errorData.message;
    
    // Agregar información adicional si está disponible
    if (errorData.catalog) {
      message += ` (Catálogo: ${errorData.catalog})`;
    }
    if (errorData.invalidId) {
      message += ` (ID inválido: ${errorData.invalidId})`;
    }
    if (errorData.person) {
      message += ` (Persona: ${errorData.person})`;
    }
    
    return message;
  }
  
  // Error con mensaje en response.data
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Error con array de errores
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.join(', ');
  }
  
  // Error simple en response.data.error
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Error con mensaje directo
  if (error?.message) {
    return error.message;
  }
  
  // Fallback
  return 'Error desconocido en la operación';
};

/**
 * Obtiene código de status HTTP del error
 */
export const getErrorStatus = (error: any): number => {
  return error?.response?.status || 500;
};

/**
 * Muestra toast de error usando sonner (disponible globalmente)
 * Esta función puede ser llamada desde cualquier parte del código
 * 
 * @param error - Objeto de error capturado
 * @param operacion - Descripción de la operación que falló
 * @param options - Opciones adicionales para el toast
 */
export const showErrorToast = (
  error: any,
  operacion: string,
  options?: {
    duration?: number;
    showStatus?: boolean;
  }
): void => {
  const errorMessage = extractErrorMessage(error);
  const status = getErrorStatus(error);
  
  // Construir título
  let title = `Error al ${operacion}`;
  if (options?.showStatus && status) {
    title += ` (${status})`;
  }
  
  // Mostrar toast usando sonner
  toastFunction.error(title, {
    description: errorMessage,
    duration: options?.duration || 5000,
  });
  
  // Log para debugging
  console.error(`❌ ${title}:`, {
    mensaje: errorMessage,
    status: status,
    error: error
  });
};

/**
 * Muestra toast de éxito usando sonner
 * 
 * @param mensaje - Mensaje de éxito
 * @param descripcion - Descripción adicional opcional
 */
export const showSuccessToast = (
  mensaje: string,
  descripcion?: string
): void => {
  toastFunction.success(mensaje, {
    description: descripcion,
    duration: 3000,
  });
};

/**
 * Muestra toast de advertencia usando sonner
 * 
 * @param mensaje - Mensaje de advertencia
 * @param descripcion - Descripción adicional opcional
 */
export const showWarningToast = (
  mensaje: string,
  descripcion?: string
): void => {
  toastFunction.warning(mensaje, {
    description: descripcion,
    duration: 4000,
  });
};

/**
 * Muestra toast informativo usando sonner
 * 
 * @param mensaje - Mensaje informativo
 * @param descripcion - Descripción adicional opcional
 */
export const showInfoToast = (
  mensaje: string,
  descripcion?: string
): void => {
  toastFunction.info(mensaje, {
    description: descripcion,
    duration: 3000,
  });
};

/**
 * Helper para validar si un error es de autenticación (401)
 */
export const isAuthenticationError = (error: any): boolean => {
  return getErrorStatus(error) === 401;
};

/**
 * Helper para validar si un error es de autorización (403)
 */
export const isAuthorizationError = (error: any): boolean => {
  return getErrorStatus(error) === 403;
};

/**
 * Helper para validar si un error es de validación (400 o 422)
 */
export const isValidationError = (error: any): boolean => {
  const status = getErrorStatus(error);
  return status === 400 || status === 422;
};

/**
 * Helper para validar si un error es de servidor (500+)
 */
export const isServerError = (error: any): boolean => {
  return getErrorStatus(error) >= 500;
};

/**
 * Maneja error con lógica específica según tipo de error
 * 
 * @param error - Error capturado
 * @param operacion - Operación que falló
 * @param callbacks - Callbacks opcionales para tipos específicos de error
 */
export const handleErrorWithToast = (
  error: any,
  operacion: string,
  callbacks?: {
    onAuthError?: () => void;
    onValidationError?: () => void;
    onServerError?: () => void;
  }
): void => {
  // Mostrar toast
  showErrorToast(error, operacion, { showStatus: true });
  
  // Ejecutar callbacks específicos
  if (isAuthenticationError(error) && callbacks?.onAuthError) {
    callbacks.onAuthError();
  } else if (isValidationError(error) && callbacks?.onValidationError) {
    callbacks.onValidationError();
  } else if (isServerError(error) && callbacks?.onServerError) {
    callbacks.onServerError();
  }
};

export default {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
  showInfoToast,
  extractErrorMessage,
  getErrorStatus,
  handleErrorWithToast,
  isAuthenticationError,
  isAuthorizationError,
  isValidationError,
  isServerError
};
