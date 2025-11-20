import axios, { AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  LoginResponse, 
  RefreshTokenResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  VerifyEmailResponse 
} from '@/types/auth';
import { TokenManager } from '@/utils/cookies';
import { API_BASE_URL, API_TIMEOUTS, DEFAULT_HEADERS, DEV_CONFIG, API_ENDPOINTS } from '@/config/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

// Instancia de axios configurada para autenticación
const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUTS.AUTH,
  headers: DEFAULT_HEADERS,
});

/**
 * Servicio de autenticación con manejo seguro de tokens
 */
export class AuthService {
  /**
   * Transforma los datos del usuario del servidor al formato esperado por el frontend
   * @param serverUserData - Datos del usuario del servidor
   * @returns Datos del usuario en el formato del frontend
   */
  private static mapUserData(serverUserData: any): any {
    // Extraer el primer rol del array de roles, o usar rol/role directo como fallback
    let userRole = 'user'; // rol por defecto
    
    if (serverUserData.roles && Array.isArray(serverUserData.roles) && serverUserData.roles.length > 0) {
      // Tomar el primer rol del array y convertirlo a minúsculas
      const firstRole = serverUserData.roles[0].toLowerCase();
      
      // Mapear roles del español al inglés si es necesario
      const roleMapping: { [key: string]: string } = {
        'administrador': 'admin',
        'usuario': 'user',
        'manager': 'manager',
        'supervisor': 'supervisor'
      };
      
      userRole = roleMapping[firstRole] || firstRole;
    } else if (serverUserData.rol) {
      userRole = serverUserData.rol.toLowerCase();
    } else if (serverUserData.role) {
      userRole = serverUserData.role.toLowerCase();
    }

    return {
      id: serverUserData.id,
      firstName: serverUserData.primer_nombre || serverUserData.firstName,
      lastName: serverUserData.primer_apellido || serverUserData.lastName,
      email: serverUserData.correo_electronico || serverUserData.email,
      role: userRole,
      // Información adicional que puede ser útil
      secondName: serverUserData.segundo_nombre,
      secondLastName: serverUserData.segundo_apellido,
      phone: serverUserData.telefono,
      active: serverUserData.activo,
      emailVerified: serverUserData.email_verificado,
      roles: serverUserData.roles, // Mantener el array original de roles
      // Mantener datos originales por si se necesitan
      _original: serverUserData
    };
  }

  /**
   * Autentica al usuario con credenciales
   * @param credentials - Email y contraseña del usuario
   * @returns Promise con la respuesta de autenticación
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await authApi.post(API_ENDPOINTS.AUTH.LOGIN, {
        correo_electronico: credentials.email,
        contrasena: credentials.password,
      }, {
        headers: {
          'Origin': window.location.origin,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent': navigator.userAgent,
        },
      });

      // Validar respuesta exitosa
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Error en el login');
      }

      // Transformar datos del usuario al formato esperado
      const transformedData = {
        ...response.data,
        data: {
          ...response.data.data,
          user: this.mapUserData(response.data.data.user)
        }
      };

      // Almacenar tokens de forma segura
      this.storeTokens(transformedData.data);

      // Toast de éxito
      showSuccessToast('Inicio de sesión exitoso', `Bienvenido ${transformedData.data.user.firstName}`);

      return transformedData;
    } catch (error) {
      // Mostrar toast de error
      showErrorToast(error, 'iniciar sesión');
      
      if (axios.isAxiosError(error)) {
        // Manejar errores específicos de la API
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error ||
                           'Error de comunicación con el servidor';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Renueva el token de acceso usando el refresh token
   * @returns Promise con la nueva información de tokens
   */
  static async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response: AxiosResponse<RefreshTokenResponse> = await authApi.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken: refreshToken,
      });

      // Validar respuesta exitosa
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Error al renovar token');
      }

      // Actualizar access token almacenado
      TokenManager.setAccessToken(response.data.data.accessToken, response.data.data.expiresIn);

      return response.data;
    } catch (error) {
      // Mostrar toast de error
      showErrorToast(error, 'renovar sesión');
      
      // Si falla el refresh, limpiar cookies y forzar re-login
      this.clearSession();
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                           'Error al renovar la sesión';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Almacena tokens de forma segura usando TokenManager
   * @param tokenData - Datos de tokens y expiración
   */
  private static storeTokens(tokenData: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user?: any;
  }): void {
    const { accessToken, refreshToken, expiresIn, user } = tokenData;

    // Almacenar tokens usando el TokenManager
    TokenManager.setAccessToken(accessToken, expiresIn);
    TokenManager.setRefreshToken(refreshToken);
    
    // Almacenar datos del usuario si están disponibles (ya transformados)
    if (user) {
      TokenManager.setUserData(user);
    }
  }

  /**
   * Obtiene el token de acceso almacenado
   * @returns Token de acceso o null si no existe
   */
  static getAccessToken(): string | null {
    return TokenManager.getAccessToken();
  }

  /**
   * Obtiene el refresh token almacenado
   * @returns Refresh token o null si no existe
   */
  static getRefreshToken(): string | null {
    return TokenManager.getRefreshToken();
  }

  /**
   * Obtiene los datos del usuario almacenados
   * @returns Datos del usuario o null si no existen
   */
  static getUserData(): any | null {
    return TokenManager.getUserData();
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns True si hay tokens válidos o está en modo desarrollo
   */
  static isAuthenticated(): boolean {
    // En modo desarrollo, permitir acceso sin tokens
    if (DEV_CONFIG.IS_DEVELOPMENT && DEV_CONFIG.SKIP_AUTH) {
      return true;
    }
    return TokenManager.hasValidTokens();
  }

  /**
   * Limpia la sesión del usuario
   */
  static clearSession(): void {
    TokenManager.clearAll();
  }

  /**
   * Cierra la sesión del usuario
   */
  static async logout(): Promise<void> {
    try {
      // Opcional: llamar endpoint de logout en el servidor
      const accessToken = this.getAccessToken();
      if (accessToken) {
        await authApi.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
          headers: {
            'Accept-Language': 'es,es-ES;q=0.9',
            'Authorization': `Bearer ${accessToken}`,
            'Connection': 'keep-alive',
            'Content-Length': '0',
            'Origin': window.location.origin,
            'Referer': `${window.location.origin}/api-docs/`,
            'User-Agent': navigator.userAgent,
            'accept': 'application/json',
          },
        });
      }
    } catch (error) {
      // Mostrar toast de error
      showErrorToast(error, 'cerrar sesión');
      // Continuar con logout local incluso si falla el servidor
    } finally {
      // Siempre limpiar la sesión local
      this.clearSession();
      // Toast de información
      showSuccessToast('Sesión cerrada', 'Has salido correctamente del sistema');
    }
  }

  /**
   * Solicita recuperación de contraseña
   * @param email - Email del usuario
   * @returns Promise con la respuesta del servidor
   */
  static async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response: AxiosResponse<ForgotPasswordResponse> = await authApi.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email,
      }, {
        headers: {
          'Origin': window.location.origin,
        },
      });

      // Toast de éxito
      showSuccessToast('Email enviado', 'Revisa tu correo para restablecer tu contraseña');

      return response.data;
    } catch (error: any) {
      // Mostrar toast de error
      showErrorToast(error, 'solicitar recuperación de contraseña');
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Error al solicitar recuperación de contraseña');
    }
  }

  /**
   * Restablece la contraseña con token
   * @param token - Token de recuperación
   * @param newPassword - Nueva contraseña
   * @returns Promise con la respuesta del servidor
   */
  static async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    try {
      const response: AxiosResponse<ResetPasswordResponse> = await authApi.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword,
      }, {
        headers: {
          'Origin': window.location.origin,
        },
      });

      // Toast de éxito
      showSuccessToast('Contraseña restablecida', 'Tu contraseña ha sido actualizada correctamente');

      return response.data;
    } catch (error: any) {
      // Mostrar toast de error
      showErrorToast(error, 'restablecer contraseña');
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Error al restablecer la contraseña');
    }
  }

  /**
   * Verifica el email del usuario con token
   * @param token - Token de verificación
   * @returns Promise con la respuesta del servidor
   */
  static async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const response: AxiosResponse<VerifyEmailResponse> = await authApi.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'es,es-ES;q=0.9',
        },
      });

      // Toast de éxito
      showSuccessToast('Email verificado', 'Tu correo ha sido verificado exitosamente');

      return response.data;
    } catch (error: any) {
      console.error('Error al verificar email:', error);
      
      // Mostrar toast de error
      showErrorToast(error, 'verificar email');
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Error al verificar el email');
    }
  }
}
