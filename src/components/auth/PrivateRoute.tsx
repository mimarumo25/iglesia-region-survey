import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/ui/logo';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

/**
 * Componente de loading para mostrar mientras se verifica la autenticación
 */
const AuthLoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 dark:from-background dark:via-background dark:to-muted/5 flex items-center justify-center">
    <Card className="w-full max-w-md mx-auto shadow-xl dark:shadow-2xl dark:shadow-black/20 border-border dark:border-border bg-card dark:bg-card">
      <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary dark:from-primary dark:to-secondary rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <Logo size="sm" showText={false} className="w-10 h-10" />
          </div>
          <div className="absolute inset-0 border-4 border-primary dark:border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Verificando sesión MIA...</h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">Por favor espere</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

/**
 * Componente para proteger rutas que requieren autenticación
 * @param children - Componentes hijos a proteger
 * @param requiredRole - Rol requerido para acceder (opcional)
 * @returns JSX.Element - Componente protegido o redirección
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  // Si no está autenticado, redirigir al login con el estado de la ubicación actual
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Verificar rol requerido si se especifica
  if (requiredRole && user?.role) {
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
      
    if (!hasRequiredRole) {
      return (
        <Navigate 
          to="/unauthorized" 
          state={{ from: location, requiredRole }} 
          replace 
        />
      );
    }
  }

  // Si todo está correcto, mostrar el contenido protegido
  return <>{children}</>;
};

/**
 * Componente para proteger rutas que solo deben ser accesibles por usuarios no autenticados
 * Útil para páginas como login, donde usuarios autenticados deberían ser redirigidos
 */
export const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  // Si ya está autenticado, redirigir al dashboard o a la página de origen
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Si no está autenticado, mostrar el contenido público
  return <>{children}</>;
};

/**
 * Hook para verificar permisos específicos
 * @param permission - Permiso requerido
 * @returns boolean - true si el usuario tiene el permiso
 */
export const usePermissions = (permission?: string) => {
  const { user, isAuthenticated } = useAuthContext();

  const hasPermission = (perm: string): boolean => {
    if (!isAuthenticated || !user) return false;

    // Lógica básica de permisos por rol
    // Esto puede expandirse según los requerimientos específicos
    switch (user.role) {
      case 'admin':
        return true; // Los administradores tienen todos los permisos
      case 'manager':
        return ['read', 'write', 'update'].includes(perm);
      case 'user':
        return ['read'].includes(perm);
      default:
        return false;
    }
  };

  return {
    hasPermission: permission ? hasPermission(permission) : true,
    userRole: user?.role,
    isAuthenticated,
  };
};
