import { useState, useCallback } from 'react';
import { AuthService } from '@/services/auth';
import { LoginCredentials, User } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook personalizado para manejar autenticación
 * Proporciona funciones para login, logout y gestión del estado de usuario
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Función para autenticar usuario
   * @param credentials - Credenciales de login (email y password)
   * @returns Promise<boolean> - true si el login es exitoso
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Validaciones básicas
      if (!credentials.email || !credentials.password) {
        throw new Error('Email y contraseña son requeridos');
      }

      // Intentar autenticación
      const response = await AuthService.login(credentials);

      if (response.status === 'success') {
        // Almacenar datos del usuario en estado
        setUser(response.data.user);

        // Mostrar notificación de éxito
        const displayName = response.data.user.firstName && response.data.user.lastName
          ? `${response.data.user.firstName} ${response.data.user.lastName}`
          : response.data.user.email || 'Usuario';
          
        toast({
          title: "¡Bienvenido!",
          description: `Hola ${displayName}, acceso autorizado al sistema.`,
          variant: "default"
        });

        return true;
      } else {
        throw new Error(response.message || 'Error en la autenticación');
      }

    } catch (error) {
      // Manejar errores de autenticación
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido durante el login';

      toast({
        title: "Error de autenticación",
        description: errorMessage,
        variant: "destructive"
      });

      // Limpiar estado en caso de error
      setUser(null);
      AuthService.clearSession();

      return false;

    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Función para cerrar sesión
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Llamar al servicio de logout
      await AuthService.logout();

      // Limpiar estado del usuario
      setUser(null);

      // Mostrar notificación
      toast({
        title: "Sesión cerrada",
        description: "Ha cerrado sesión correctamente.",
        variant: "default"
      });

      // En modo desarrollo, evitar la re-autenticación automática temporalmente
      if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
        // Agregar un flag temporal para evitar la re-autenticación inmediata
        sessionStorage.setItem('manual_logout', 'true');
      }

      // Redirigir al login
      window.location.href = '/login';

    } catch (error) {
      // Incluso si hay error en el servidor, limpiar localmente
      setUser(null);
      AuthService.clearSession();

      toast({
        title: "Sesión cerrada",
        description: "Sesión cerrada localmente.",
        variant: "default"
      });

      // En modo desarrollo, evitar la re-autenticación automática temporalmente
      if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
        sessionStorage.setItem('manual_logout', 'true');
      }

      window.location.href = '/login';

    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Función para renovar autenticación
   * Útil para verificar la validez del token al cargar la app
   * @returns Promise<boolean> - true si la renovación es exitosa
   */
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    // Verificar si hay tokens almacenados
    if (!AuthService.isAuthenticated()) {
      return false;
    }

    setIsLoading(true);

    try {
      // Intentar renovar el token
      const response = await AuthService.refreshToken();

      if (response.status === 'success') {
        // Si no tenemos datos de usuario, necesitamos obtenerlos
        // (esto podría requerir una llamada adicional a la API para obtener info del usuario)
        // Por ahora, verificamos que la renovación fue exitosa
        return true;
      }

      return false;

    } catch (error) {
      // Si falla la renovación, limpiar estado
      setUser(null);
      AuthService.clearSession();
      return false;

    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Función para establecer datos de usuario
   * Útil cuando se obtienen los datos del usuario por separado
   * @param userData - Datos del usuario a establecer
   */
  const setUserData = useCallback((userData: User | null) => {
    setUser(userData);
  }, []);

  /**
   * Verificar si el usuario está autenticado
   * @returns boolean - true si hay usuario y token válido
   */
  const isAuthenticated = useCallback((): boolean => {
    return !!user && AuthService.isAuthenticated();
  }, [user]);

  return {
    // Estado
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),

    // Funciones
    login,
    logout,
    refreshAuth,
    setUserData,
  };
};
