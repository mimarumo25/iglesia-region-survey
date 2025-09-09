import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/auth';
import { apiGet } from '@/interceptors/axios';

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Variable global para manejar el estado de logout
let isLoggingOut = false;

/**
 * Proveedor de contexto de autenticación
 * Maneja el estado global de autenticación y la persistencia de sesión
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  /**
   * Función para obtener datos del usuario desde la API
   * @returns Promise<User | null> - Datos del usuario o null si hay error
   */
  const fetchUserData = async (): Promise<User | null> => {
    try {
      // Llamada a la API para obtener datos actuales del usuario
      const response = await apiGet<{ status: string; data: User }>('/api/auth/me');
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  };

  /**
   * Función para inicializar la sesión al cargar la aplicación
   */
  const initializeAuth = async () => {
    
    // Si está en proceso de logout, no hacer nada
    if (isLoggingOut) {
      return;
    }
    
    // Verificar si se hizo un logout manual
    const manualLogout = sessionStorage.getItem('manual_logout');
    if (manualLogout === 'true') {
      return; // No limpiar el flag aquí para que persista
    }
    
    // MODO DESARROLLO: Permitir acceso sin autenticación para pruebas
    if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
      console.log('🔧 AuthContext: Modo desarrollo SKIP_AUTH activado');
      const devUser = {
        id: 'dev-user-123',
        firstName: 'Diego',
        lastName: 'García',
        secondName: 'Carlos',
        secondLastName: 'López',
        email: 'admin@parroquia.com',
        role: 'admin',
        phone: '+57 300 456 7890',
        active: true,
        emailVerified: true,
        roles: ['Administrador']
      };
      console.log('🔧 AuthContext: Estableciendo usuario de desarrollo:', devUser);
      auth.setUserData(devUser);
      return;
    }
    
    // Verificar si hay tokens almacenados
    if (!AuthService.isAuthenticated()) {
      return;
    }

    try {
      // Primero intentar cargar datos del usuario almacenados localmente
      const storedUserData = AuthService.getUserData();
      
      if (storedUserData) {
        auth.setUserData(storedUserData);
      }

      // Intentar renovar el token para asegurar que sea válido
      const refreshSuccess = await auth.refreshAuth();
      
      if (refreshSuccess) {
        
        // Si no tenemos datos de usuario localmente, intentar obtenerlos del servidor
        if (!storedUserData) {
          const userData = await fetchUserData();
          
          if (userData) {
            auth.setUserData(userData);
          }
        }
      } else {
      }
    } catch (error) {
      console.error('❌ Error al inicializar autenticación:', error);
      // En caso de error, limpiar la sesión
      AuthService.clearSession();
    }
  };

  // Efecto para inicializar la autenticación al montar el componente
  useEffect(() => {
    initializeAuth();
  }, []); // Solo ejecutar una vez al montar

  // Efecto para manejar cambios en la visibilidad de la página
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Cuando la página vuelve a ser visible, verificar la sesión
      if (!document.hidden && AuthService.isAuthenticated()) {
        initializeAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Efecto para manejar el evento beforeunload (antes de cerrar la página)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Opcional: realizar alguna limpieza antes de cerrar la página
      // Por ahora, no hacemos nada específico
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  /**
   * Función personalizada de logout que maneja el estado global
   */
  const handleLogout = useCallback(async (): Promise<void> => {
    // Marcar que se está haciendo logout
    isLoggingOut = true;
    
    try {
      await auth.logout();
    } finally {
      // Resetear el flag después del logout
      isLoggingOut = false;
    }
  }, [auth]);

  const contextValue: AuthContextType = {
    user: auth.user,
    isLoading: auth.isLoading,
    // En modo desarrollo, forzar autenticación si hay usuario
    isAuthenticated: import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true' 
      ? !!auth.user 
      : auth.isAuthenticated,
    login: auth.login,
    logout: handleLogout, // Usar la función personalizada
    refreshAuth: auth.refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar el contexto de autenticación
 * @returns AuthContextType - Contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

export default AuthContext;
