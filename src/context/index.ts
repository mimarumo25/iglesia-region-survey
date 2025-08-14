// Exportaciones centralizadas para el módulo de autenticación
export { AuthProvider, useAuthContext } from './AuthContext';
export { PrivateRoute, PublicRoute, usePermissions } from '../components/auth/PrivateRoute';
export { UserMenu } from '../components/auth/UserMenu';
export { AuthService } from '../services/auth';
export { useAuth } from '../hooks/useAuth';
export { CookieManager } from '../utils/cookies';

// Exportaciones para el sistema de temas
export { ThemeProvider, useTheme, themePresets } from './ThemeContext';
export type { ThemeColors, ThemePreset } from './ThemeContext';

// Tipos de datos
export type { 
  User, 
  LoginCredentials, 
  LoginResponse, 
  RefreshTokenResponse, 
  AuthContextType 
} from '../types/auth';
