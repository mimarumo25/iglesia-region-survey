import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/auth';

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Variable global para manejar el estado de logout
let isLoggingOut = false;

/**
 * Proveedor de contexto de autenticación
 * ULTRA-SIMPLIFICADO: NO hace verificaciones automáticas ni llamadas API
 * Solo carga datos almacenados y deja que el usuario maneje las acciones
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  /**
   * Función para inicializar SOLO datos locales - SIN servicios
   * Solo carga lo que ya está almacenado, NO hace ninguna llamada
   */
  const initializeAuth = () => {
    // Si está en proceso de logout, no hacer nada
    if (isLoggingOut) {
      return;
    }
    
    // Verificar si se hizo un logout manual
    const manualLogout = sessionStorage.getItem('manual_logout');
    if (manualLogout === 'true') {
      return; // No limpiar el flag aquí para que persista
    }
    
    // MODO DESARROLLO: Usuario ficticio sin llamadas
    if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
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
      auth.setUserData(devUser);
      return;
    }
    
    try {
      // SOLO verificar si hay tokens válidos almacenados (sin llamadas)
      const hasValidTokens = AuthService.isAuthenticated();
      const storedUserData = AuthService.getUserData();
      
      if (hasValidTokens && storedUserData) {
        // Solo usar datos ya almacenados - NO hacer verificaciones
        auth.setUserData(storedUserData);
      } else if (!hasValidTokens) {
        // Si no hay tokens válidos, limpiar todo
        AuthService.clearSession();
        auth.setUserData(null);
      }

    } catch (error) {
      // En caso de error, solo limpiar localmente
      console.error('Error al cargar datos locales:', error);
      AuthService.clearSession();
      auth.setUserData(null);
    }
  };

  // ✅ INICIALIZACIÓN: Solo una vez al cargar, sin verificaciones posteriores
  useEffect(() => {
    initializeAuth();
  }, []); // Solo ejecutar una vez al montar - NO más verificaciones automáticas

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
    // ❌ NO exponer refreshAuth - los componentes no deberían usarlo automáticamente
    refreshAuth: () => Promise.resolve(false), // Función dummy para mantener interfaz
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
