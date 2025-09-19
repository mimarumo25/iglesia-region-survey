import { useAuthContext } from "@/context/AuthContext";
import { useMemo } from "react";

/**
 * Hook para verificar permisos específicos del usuario
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuthContext();

  const permissions = useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false,
        isAdmin: false,
        isCoordinator: false,
        isSurveyor: false,
        userRole: null
      };
    }

    const isAdmin = user.role === 'admin';
    const isCoordinator = user.role === 'coordinator';
    const isSurveyor = user.role === 'surveyor';

    return {
      // Permisos específicos
      canManageUsers: isAdmin, // Solo administradores pueden gestionar usuarios
      canViewReports: isAdmin || isCoordinator,
      canManageSettings: isAdmin,
      canCreateUsers: isAdmin, // Solo administradores pueden crear usuarios
      canEditUsers: isAdmin, // Solo administradores pueden editar usuarios
      canDeleteUsers: isAdmin,
      canViewAllSurveys: isAdmin || isCoordinator,
      canManageSectors: isAdmin || isCoordinator,
      
      // Roles
      isAdmin,
      isCoordinator, 
      isSurveyor,
      userRole: user.role,
      
      // Datos del usuario
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email
    };
  }, [user, isAuthenticated]);

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param permission - Nombre del permiso a verificar
   * @returns boolean
   */
  const hasPermission = (permission: keyof typeof permissions): boolean => {
    return permissions[permission] as boolean;
  };

  /**
   * Verifica si el usuario tiene uno de varios roles
   * @param roles - Array de roles a verificar
   * @returns boolean
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  /**
   * Verifica si el usuario tiene acceso a una ruta específica
   * @param route - Ruta a verificar
   * @returns boolean
   */
  const canAccessRoute = (route: string): boolean => {
    switch (route) {
      case '/users':
        return permissions.canManageUsers;
      case '/reports':
        return permissions.canViewReports;
      case '/settings':
        return permissions.canManageSettings;
      case '/settings/sectores-config':
        return permissions.canManageSectors;
      default:
        return isAuthenticated; // Rutas generales requieren solo autenticación
    }
  };

  return {
    ...permissions,
    hasPermission,
    hasAnyRole,
    canAccessRoute
  };
};
