import axios, { AxiosInstance } from 'axios';
import { TokenManager } from '@/utils/cookies';

/**
 * Configuración centralizada de la API
 * Este arch# Configurar interceptors básicos para el cliente autenticado
authenticatedClient.interceptors.request.use((config) => {
  // Solo añadir token si está disponible y no estamos en modo SKIP_AUTH
  if (!DEV_CONFIG.SKIP_AUTH) {
    try {
      const accessToken = TokenManager.getAccessToken();
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      // Error silenciado - fallo al obtener token
    }
  }
  return config;
});das las configuraciones relacionadas con la API del backend
 */

/**
 * URL base del servidor backend
 * Se obtiene desde las variables de entorno
 */
export const API_BASE_URL = import.meta.env.VITE_BASE_URL_SERVICES;

/**
 * Configuración de timeouts para peticiones HTTP
 */
export const API_TIMEOUTS = {
  DEFAULT: 15000, // 15 segundos
  AUTH: 10000,    // 10 segundos para autenticación
  UPLOAD: 30000,  // 30 segundos para uploads
} as const;

/**
 * Headers por defecto para todas las peticiones
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Accept-Language': 'es-ES,es;q=0.8',
  'X-Requested-With': 'XMLHttpRequest',
} as const;

/**
 * Configuración de desarrollo
 */
export const DEV_CONFIG = {
  SKIP_AUTH: import.meta.env.VITE_SKIP_AUTH === 'true',
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

/**
 * Endpoints principales de la API
 */
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh-token',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  
  // Catálogos
  CATALOG: {
    AGUAS_RESIDUALES: '/api/catalog/aguas-residuales',
    DEPARTAMENTOS: '/api/catalog/departamentos',
    DISPOSICION_BASURA: '/api/catalog/disposicion-basura',
    ENFERMEDADES: '/api/catalog/enfermedades',
    ESTADOS_CIVILES: '/api/catalog/estados-civiles',
    ESTUDIOS: '/api/catalog/estudios',
    MUNICIPIOS: '/api/catalog/municipios',
    PARENTESCOS: '/api/catalog/parentescos',
    PARROQUIAS: '/api/catalog/parroquias',
    PROFESIONES: '/api/catalog/profesiones',
    SECTORES: '/api/catalog/sectores',
    SEXOS: '/api/catalog/sexos',
    SISTEMAS_ACUEDUCTO: '/api/catalog/sistemas-acueducto',
    SITUACIONES_CIVILES: '/api/catalog/situaciones-civiles',
    TALLAS: '/api/catalog/tallas',
    TIPOS_IDENTIFICACION: '/api/catalog/tipos-identificacion',
    TIPOS_VIVIENDA: '/api/catalog/tipos-vivienda',
    COMUNIDADES_CULTURALES: '/api/catalog/comunidades-culturales',
    VEREDAS: '/api/catalog/veredas',
  },
  
  // Gestión de usuarios
  USERS: '/api/users',
  
  // Perfil de usuario
  PROFILE: '/api/profile',
  
  // Encuestas
  SURVEYS: '/api/encuesta',
  
  // Difuntos
  DIFUNTOS: '/api/difuntos',
  
  // Familias
  FAMILIAS: '/api/familias',
} as const;

/**
 * Validar configuración de la API
 * Útil para desarrollo y debugging
 */
export function validateApiConfig(): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!API_BASE_URL || API_BASE_URL === 'http://localhost:3000') {
    warnings.push('VITE_BASE_URL_SERVICES no está configurada o está usando el valor por defecto');
  }
  
  if (API_BASE_URL.includes('localhost') && !DEV_CONFIG.IS_DEVELOPMENT) {
    warnings.push('Usando localhost en producción');
  }
  
  if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
    warnings.push('URL base no tiene protocolo válido');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Construir URL completa de un endpoint
 */
export function buildApiUrl(endpoint: string): string {
  // Si el endpoint ya es una URL completa, devolverla tal como está
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // Si no empieza con /, agregarlo
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${API_BASE_URL}${normalizedEndpoint}`;
}

/**
 * Configuración por defecto para axios
 */
export const AXIOS_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUTS.DEFAULT,
  headers: DEFAULT_HEADERS,
} as const;

/**
 * Cliente básico sin autenticación para modo desarrollo
 */
export const basicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUTS.DEFAULT,
  headers: DEFAULT_HEADERS,
});

// Crear un cliente autenticado aquí para evitar importaciones circulares
const authenticatedClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUTS.DEFAULT,
  headers: DEFAULT_HEADERS,
});

// Configurar interceptors básicos para el cliente autenticado
authenticatedClient.interceptors.request.use((config) => {
  // Solo añadir token si está disponible y no estamos en modo SKIP_AUTH
  if (!DEV_CONFIG.SKIP_AUTH) {
    try {
      const accessToken = TokenManager.getAccessToken();
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      // Error silenciado - fallo al obtener token
    }
  }
  return config;
});

/**
 * Función centralizada para obtener el cliente HTTP correcto
 * Evita duplicar la lógica de selección de cliente en cada servicio
 */
export function getApiClient(): AxiosInstance {
  // En modo desarrollo y con SKIP_AUTH, usar cliente básico
  if (DEV_CONFIG.IS_DEVELOPMENT && DEV_CONFIG.SKIP_AUTH) {
    return basicClient;
  }
  
  // Usar el cliente autenticado local
  return authenticatedClient;
}
