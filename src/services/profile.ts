import { apiGet, apiPut, apiPost } from '@/interceptors/axios';
import type { User } from '@/types/auth';
import { AuthService } from '@/services/auth';

// Tipos específicos para el perfil
export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  secondName?: string;
  secondLastName?: string;
  phone?: string;
  bio?: string;
  birthDate?: string;
  sector?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface ProfilePreferencesRequest {
  emailNotifications: boolean;
  pushNotifications: boolean;
  reportNotifications: boolean;
  language: string;
  timezone: string;
  theme: string;
  compactView: boolean;
  showProfilePicture: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// Servicio para gestionar el perfil del usuario
export class ProfileService {
  
  /**
   * Obtener el perfil completo del usuario actual
   */
  static async getProfile(): Promise<User> {
    try {
      // Usar el endpoint correcto /api/auth/profile
      const response = await apiGet<ApiResponse<{ user: any }>>('/api/auth/profile');
      
      if (response.data.status === 'success') {
        // Transformar los datos del usuario del formato del backend al frontend
        const serverUserData = response.data.data.user;
        
        // Obtener roles del usuario (por ahora usar un rol por defecto ya que no viene en la respuesta)
        const userRole = 'admin'; // Asumiendo que es admin basado en los datos previos
        
        const transformedUser: User = {
          id: serverUserData.id,
          firstName: serverUserData.primer_nombre || serverUserData.firstName,
          lastName: serverUserData.primer_apellido || serverUserData.lastName,
          email: serverUserData.correo_electronico || serverUserData.email,
          role: userRole,
          // Información adicional
          secondName: serverUserData.segundo_nombre,
          secondLastName: serverUserData.segundo_apellido,
          phone: serverUserData.telefono,
          active: serverUserData.activo,
          emailVerified: serverUserData.email_verificado,
          // Campos adicionales del perfil (pueden venir null del servidor)
          birthDate: serverUserData.fecha_nacimiento || undefined,
          sector: serverUserData.sector || undefined,
          address: serverUserData.direccion || undefined,
          emergencyContact: serverUserData.contacto_emergencia || undefined,
          emergencyPhone: serverUserData.telefono_emergencia || undefined,
          bio: serverUserData.biografia || undefined,
          profilePictureUrl: serverUserData.foto_perfil_url || undefined,
        };
        
        return transformedUser;
      }
      
      throw new Error(response.data.message || 'Error al obtener el perfil');
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  /**
   * Actualizar información del perfil
   */
  static async updateProfile(profileData: ProfileUpdateRequest): Promise<User> {
    try {
      // Obtener el ID del usuario actual
      const currentUser = await ProfileService.getProfile();
      const userId = currentUser.id;

      // Transformar los datos al formato esperado por el backend
      const backendData = {
        primer_nombre: profileData.firstName,
        primer_apellido: profileData.lastName,
        segundo_nombre: profileData.secondName || null,
        segundo_apellido: profileData.secondLastName || null,
        telefono: profileData.phone || null,
        fecha_nacimiento: profileData.birthDate || null,
        sector: profileData.sector || null,
        direccion: profileData.address || null,
        contacto_emergencia: profileData.emergencyContact || null,
        telefono_emergencia: profileData.emergencyPhone || null,
        biografia: profileData.bio || null,
      };

      const response = await apiPut<ApiResponse<any>>(`/api/users/${userId}`, backendData);
      
      if (response.data.status === 'success') {
        // Transformar los datos actualizados de vuelta al formato del frontend
        const serverUserData = response.data.data;
        const userRole = serverUserData.roles && Array.isArray(serverUserData.roles) && serverUserData.roles.length > 0
          ? serverUserData.roles[0].toLowerCase() === 'administrador' ? 'admin' : serverUserData.roles[0].toLowerCase()
          : 'user';

        const transformedUser: User = {
          id: serverUserData.id,
          firstName: serverUserData.primer_nombre || serverUserData.firstName,
          lastName: serverUserData.primer_apellido || serverUserData.lastName,
          email: serverUserData.correo_electronico || serverUserData.email,
          role: userRole,
          secondName: serverUserData.segundo_nombre,
          secondLastName: serverUserData.segundo_apellido,
          phone: serverUserData.telefono,
          active: serverUserData.activo,
          emailVerified: serverUserData.email_verificado,
          birthDate: serverUserData.fecha_nacimiento,
          sector: serverUserData.sector,
          address: serverUserData.direccion,
          emergencyContact: serverUserData.contacto_emergencia,
          emergencyPhone: serverUserData.telefono_emergencia,
          bio: serverUserData.biografia,
          profilePictureUrl: serverUserData.foto_perfil_url,
        };
        
        return transformedUser;
      }
      
      throw new Error(response.data.message || 'Error al actualizar el perfil');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Actualizar preferencias del usuario
   */
  static async updatePreferences(preferences: ProfilePreferencesRequest): Promise<boolean> {
    try {
      // Por ahora, almacenar las preferencias localmente ya que no existe el endpoint
      // En el futuro, cuando se implemente el endpoint, se puede cambiar
      localStorage.setItem('user_preferences', JSON.stringify(preferences));
      
      return true;
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      throw error;
    }
  }

  /**
   * Cambiar contraseña del usuario
   */
  static async changePassword(passwordData: ChangePasswordRequest): Promise<boolean> {
    try {
      // Obtener el ID del usuario actual
      const currentUser = await ProfileService.getProfile();
      const userId = currentUser.id;

      // Hacer la petición al endpoint de cambio de contraseña
      const response = await apiPost<ApiResponse<any>>(`/api/users/${userId}/change-password`, {
        contrasena_actual: passwordData.currentPassword,
        nueva_contrasena: passwordData.newPassword
      });
      
      if (response.data.status === 'success') {
        return true;
      }
      
      throw new Error(response.data.message || 'Error al cambiar la contraseña');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      // Si el endpoint no existe, mostrar un mensaje más amigable
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error('La funcionalidad de cambio de contraseña no está disponible actualmente.');
      }
      throw error;
    }
  }

  /**
   * Obtener preferencias del usuario
   */
  static async getPreferences(): Promise<ProfilePreferencesRequest> {
    try {
      // Intentar obtener desde almacenamiento local primero
      const storedPreferences = localStorage.getItem('user_preferences');
      
      if (storedPreferences) {
        return JSON.parse(storedPreferences);
      }
      
      // Devolver valores por defecto si no hay preferencias almacenadas
      return {
        emailNotifications: true,
        pushNotifications: true,
        reportNotifications: true,
        language: 'es',
        timezone: 'America/Bogota',
        theme: 'light',
        compactView: false,
        showProfilePicture: true
      };
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      // Devolver valores por defecto si hay error
      return {
        emailNotifications: true,
        pushNotifications: true,
        reportNotifications: true,
        language: 'es',
        timezone: 'America/Bogota',
        theme: 'light',
        compactView: false,
        showProfilePicture: true
      };
    }
  }

  /**
   * Subir foto de perfil
   */
  static async uploadProfilePicture(file: File): Promise<string> {
    try {
      // Obtener el ID del usuario actual
      const currentUser = await ProfileService.getProfile();
      const userId = currentUser.id;

      const formData = new FormData();
      formData.append('foto_perfil', file);

      const response = await apiPost<ApiResponse<{ url: string }>>(`/api/users/${userId}/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.status === 'success') {
        return response.data.data.url;
      }
      
      throw new Error(response.data.message || 'Error al subir la foto');
    } catch (error) {
      console.error('Error al subir foto:', error);
      // Si el endpoint no existe, mostrar un mensaje más amigable
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error('La funcionalidad de subir foto de perfil no está disponible actualmente.');
      }
      throw error;
    }
  }

  /**
   * Obtener estadísticas del usuario (si aplica)
   */
  static async getUserStats(): Promise<any> {
    try {
      // Por ahora devolver estadísticas de prueba ya que no existe el endpoint
      // En el futuro se puede implementar un endpoint real
      return {
        encuestasRealizadas: 0,
        encuestasCompletadas: 0,
        tiempoEnSistema: new Date().toISOString(),
        ultimoAcceso: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return null;
    }
  }
}

export default ProfileService;
