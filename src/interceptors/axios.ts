import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthService } from '@/services/auth';
import { TokenManager } from '@/utils/cookies';

// Configuración directa en el interceptor para evitar dependencias circulares
const API_BASE_URL = import.meta.env.VITE_BASE_URL_SERVICES;
const IS_DEVELOPMENT = import.meta.env.DEV;
const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';

// Instancia principal de axios para todas las peticiones autenticadas
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'es-ES,es;q=0.8',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Variable para controlar el estado de refresh en progreso
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * Añade un suscriptor a la cola de espera durante el refresh
 * @param callback - Función a ejecutar cuando el refresh termine
 */
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

/**
 * Notifica a todos los suscriptores que el refresh ha terminado
 * @param token - Nuevo token de acceso
 */
function onRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

/**
 * Maneja el fallo del refresh token
 */
function onRefreshFailure() {
  refreshSubscribers = [];
  
  // En modo desarrollo con SKIP_AUTH, no limpiar sesión ni redirigir
  if (IS_DEVELOPMENT && SKIP_AUTH) {
    return;
  }
  
  AuthService.clearSession();
  
  // Redirigir al login solo si no estamos ya en la página de login
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
}

// Interceptor de peticiones: añade automáticamente el token de autorización
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token de acceso para peticiones autenticadas
    const accessToken = TokenManager.getAccessToken();
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Añadir headers de seguridad adicionales
    if (config.headers) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers['Accept-Language'] = 'es-ES,es;q=0.8';
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: maneja automáticamente la renovación de tokens
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Respuesta exitosa - retornar directamente
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Verificar si es un error 401 (no autorizado) y no es una petición ya reintentada
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // En modo desarrollo con SKIP_AUTH, solo logear el error sin procesar
      if (IS_DEVELOPMENT && SKIP_AUTH) {
        return Promise.reject(error);
      }
      
      // Si ya hay un refresh en progreso, esperar a que termine
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      // Marcar la petición como reintentada para evitar bucles infinitos
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar renovar el token
        const refreshResponse = await AuthService.refreshToken();
        const newAccessToken = refreshResponse.data.accessToken;

        // Notificar a las peticiones en espera
        onRefreshed(newAccessToken);

        // Reintentar la petición original con el nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);

      } catch (refreshError) {
        // Si falla el refresh, manejar el logout
        onRefreshFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para otros errores, rechazar normalmente
    return Promise.reject(error);
  }
);

/**
 * Wrapper para peticiones GET autenticadas
 * @param url - URL del endpoint
 * @param config - Configuración adicional de axios
 */
export const apiGet = <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => {
  return apiClient.get<T>(url, config);
};

/**
 * Wrapper para peticiones POST autenticadas
 * @param url - URL del endpoint
 * @param data - Datos a enviar
 * @param config - Configuración adicional de axios
 */
export const apiPost = <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
  return apiClient.post<T>(url, data, config);
};

/**
 * Wrapper para peticiones PUT autenticadas
 * @param url - URL del endpoint
 * @param data - Datos a enviar
 * @param config - Configuración adicional de axios
 */
export const apiPut = <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
  return apiClient.put<T>(url, data, config);
};

/**
 * Wrapper para peticiones DELETE autenticadas
 * @param url - URL del endpoint
 * @param config - Configuración adicional de axios
 */
export const apiDelete = <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => {
  return apiClient.delete<T>(url, config);
};

export default apiClient;
