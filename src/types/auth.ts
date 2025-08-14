// Tipos para el sistema de autenticación
export interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  // Campos adicionales opcionales
  secondName?: string;
  secondLastName?: string;
  phone?: string;
  active?: boolean;
  emailVerified?: boolean;
  roles?: string[]; // Array de roles original del servidor
  // Campos adicionales del perfil
  birthDate?: string;
  sector?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bio?: string;
  profilePictureUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
  };
}

export interface RefreshTokenResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    expiresIn: number;
    // Nota: el refresh endpoint solo devuelve accessToken y expiresIn
    // El refreshToken se mantiene el mismo
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
}

// Tipos para recuperación de contraseña
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  status: string;
  message: string;
}

// Tipos para verificación de email
export interface VerifyEmailResponse {
  status: string;
  message: string;
}
