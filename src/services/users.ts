import axios, { AxiosResponse } from 'axios';
import { TokenManager } from '@/utils/cookies';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_BASE_URL_SERVICES;

// Tipos para el usuario
export interface CreateUserRequest {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo_electronico: string;
  password: string;
  telefono?: string;
  numero_documento?: string;
}

export interface UpdateUserRequest {
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  correo_electronico?: string;
  telefono?: string;
  numero_documento?: string;
  activo?: boolean;
}

export interface UserResponse {
  id: string;
  correo_electronico: string;
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  numero_documento: string | null;
  telefono: string | null;
  activo: boolean;
  fecha_ultimo_acceso: string | null;
  intentos_fallidos: number;
  bloqueado_hasta: string | null;
  email_verificado: boolean;
  fecha_verificacion_email: string | null;
  expira_token_reset: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

// Interfaz específica para la respuesta de usuarios
export interface UsersApiResponse {
  users: UserResponse[];
}

// Instancia de axios configurada para usuarios
const usersApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'es-ES,es;q=0.8',
  },
});

// Interceptor para añadir el token de autorización
usersApi.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Servicio para gestión de usuarios
 */
export class UsersService {
  /**
   * Obtiene la lista de todos los usuarios
   * @returns Promise con la lista de usuarios
   */
  static async getUsers(): Promise<UserResponse[]> {
    try {
      const response: AxiosResponse<ApiResponse<UsersApiResponse>> = await usersApi.get('/api/users');
      
      if (response.data.status === 'success') {
        // Extraer el array de usuarios de la estructura anidada
        return response.data.data.users;
      } else {
        throw new Error(response.data.message || 'Error al obtener usuarios');
      }
    } catch (error: any) {
      console.error('Error getting users:', error);
      
      // Manejar específicamente errores de permisos
      if (error.response?.data?.code === 'INSUFFICIENT_PERMISSIONS') {
        throw new Error('No tiene permisos para ver la lista de usuarios. Esta funcionalidad requiere permisos de administrador.');
      }
      
      // Otros errores de respuesta del servidor
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      // Error genérico
      throw new Error('Error al conectar con el servidor. Verifique su conexión.');
    }
  }

  /**
   * Obtiene un usuario por ID
   * @param id - ID del usuario
   * @returns Promise con los datos del usuario
   */
  static async getUserById(id: string): Promise<UserResponse> {
    try {
      const response: AxiosResponse<ApiResponse<UserResponse>> = await usersApi.get(`/api/users/${id}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener usuario');
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   * @param userData - Datos del usuario a crear
   * @returns Promise con los datos del usuario creado
   */
  static async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    try {
      const response: AxiosResponse<ApiResponse<UserResponse>> = await usersApi.post('/api/auth/register', userData);
      
      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   * @param id - ID del usuario a actualizar
   * @param userData - Datos a actualizar
   * @returns Promise con los datos del usuario actualizado
   */
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response: AxiosResponse<ApiResponse<UserResponse>> = await usersApi.put(`/api/users/${id}`, userData);
      
      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Elimina un usuario
   * @param id - ID del usuario a eliminar
   * @returns Promise que se resuelve cuando el usuario es eliminado
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse> = await usersApi.delete(`/api/users/${id}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
