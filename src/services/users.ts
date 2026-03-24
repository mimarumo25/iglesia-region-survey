import axios, { AxiosResponse } from 'axios';
import { TokenManager } from '@/utils/cookies';
import { API_BASE_URL, API_ENDPOINTS, AXIOS_CONFIG } from '@/config/api';

// Tipos para el usuario
export interface CreateUserRequest {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo_electronico: string;
  contrasena: string;  // Backend espera 'contrasena'
  telefono?: string;
  numero_documento?: string;
  rol: string;  // Backend requiere 'rol': "Administrador" | "Encuestador"
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

export class UsersServiceError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'UsersServiceError';
    this.status = status;
    this.code = code;
  }
}

// Interfaz específica para la respuesta de usuarios
export interface UsersApiResponse {
  users: UserResponse[];
}

// Instancia de axios configurada para usuarios
const usersApi = axios.create(AXIOS_CONFIG);

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
      const response: AxiosResponse<ApiResponse<UsersApiResponse>> = await usersApi.get(API_ENDPOINTS.USERS);
      
      if (response.data.status === 'success') {
        // Extraer el array de usuarios de la estructura anidada
        return response.data.data.users;
      } else {
        throw new Error(response.data.message || 'Error al obtener usuarios');
      }
    } catch (error: any) {
      console.error('Error getting users:', error);

      const status = error.response?.status as number | undefined;
      const code = error.response?.data?.code as string | undefined;
      const backendMessage = error.response?.data?.message as string | undefined;

      // Sesión inválida o vencida
      if (status === 401) {
        throw new UsersServiceError(
          backendMessage || 'Tu sesión expiró. Inicia sesión nuevamente.',
          status,
          code
        );
      }

      // Falta de permisos en el backend
      if (status === 403 || code === 'INSUFFICIENT_PERMISSIONS') {
        throw new UsersServiceError(
          backendMessage || 'No tiene permisos para ver la lista de usuarios. Esta funcionalidad requiere permisos de administrador.',
          status,
          code || 'INSUFFICIENT_PERMISSIONS'
        );
      }

      // Otros errores de respuesta del servidor
      if (backendMessage) {
        throw new UsersServiceError(backendMessage, status, code);
      }

      // Error genérico
      throw new UsersServiceError('Error al conectar con el servidor. Verifique su conexión.', status, code);
    }
  }

  /**
   * Obtiene un usuario por ID
   * @param id - ID del usuario
   * @returns Promise con los datos del usuario
   */
  static async getUserById(id: string): Promise<UserResponse> {
    try {
      const response: AxiosResponse<ApiResponse<UserResponse>> = await usersApi.get(`${API_ENDPOINTS.USERS}/${id}`);
      
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
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Manejar errores de validación del backend
      if (error.response?.data?.code === 'VALIDATION_ERROR' && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages: string[] = [];
        
        // Agrupar errores por campo
        const groupedErrors: Record<string, string[]> = {};
        errors.forEach((err: any) => {
          if (!groupedErrors[err.field]) {
            groupedErrors[err.field] = [];
          }
          groupedErrors[err.field].push(err.message);
        });
        
        // Crear mensajes amigables
        Object.entries(groupedErrors).forEach(([field, messages]) => {
          const fieldName = field === 'contrasena' ? 'Contraseña' :
                          field === 'telefono' ? 'Teléfono' :
                          field === 'rol' ? 'Rol' :
                          field === 'correo_electronico' ? 'Email' :
                          field === 'primer_nombre' ? 'Primer Nombre' :
                          field === 'primer_apellido' ? 'Primer Apellido' : field;
          errorMessages.push(`${fieldName}: ${messages.join(', ')}`);
        });
        
        throw new Error(`Por favor corrija los siguientes errores:\n\n${errorMessages.join('\n')}`);
      }
      
      // Manejar otros errores específicos
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      // Error genérico
      throw new Error('Error al conectar con el servidor. Verifique su conexión e intente nuevamente.');
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
      const response: AxiosResponse<ApiResponse<UserResponse>> = await usersApi.put(`${API_ENDPOINTS.USERS}/${id}`, userData);
      
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
      const response: AxiosResponse<ApiResponse> = await usersApi.delete(`${API_ENDPOINTS.USERS}/${id}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
