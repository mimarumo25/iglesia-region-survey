# 🔐 Autenticación y Seguridad - Sistema MIA

## 📋 Visión General

Sistema robusto de autenticación basado en **JWT (JSON Web Tokens)** con refresh tokens, gestión segura de sesiones y control de permisos granular por roles.

## 🎯 Arquitectura de Autenticación

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  Login Component → useAuth Hook → AuthService           │
│       ↓                 ↓                ↓              │
│  AuthContext  ←  TokenManager  ←  API Interceptors     │
│       ↓                                                  │
│  PrivateRoute + usePermissions                          │
└─────────────────────────────────────────────────────────┘
                         ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────┐
│                    Backend API                           │
├─────────────────────────────────────────────────────────┤
│  /api/auth/login                                        │
│  /api/auth/refresh-token                                │
│  /api/auth/logout                                       │
│  /api/auth/verify                                       │
└─────────────────────────────────────────────────────────┘
```

## 🔑 Sistema de Tokens JWT

### Access Token
- **Duración**: 15 minutos
- **Almacenamiento**: httpOnly cookie (seguro)
- **Uso**: Autenticación en cada request
- **Contenido**: `{ userId, role, permissions, exp }`

### Refresh Token
- **Duración**: 7 días
- **Almacenamiento**: httpOnly cookie (seguro)
- **Uso**: Renovar access token expirado
- **Rotación**: Nuevo refresh token en cada renovación

## 🔐 Implementación de Autenticación

### 1. AuthService (`src/services/auth.ts`)

Servicio centralizado para todas las operaciones de autenticación.

```typescript
export class AuthService {
  /**
   * Login de usuario con credenciales
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await authApi.post(API_ENDPOINTS.AUTH.LOGIN, {
      correo_electronico: credentials.email,
      contrasena: credentials.password,
    });

    if (response.data.status === 'success') {
      // Almacenar tokens de forma segura
      TokenManager.setAccessToken(response.data.data.accessToken);
      TokenManager.setRefreshToken(response.data.data.refreshToken);
      TokenManager.setUserData(response.data.data.user);
      
      return response.data;
    }
    
    throw new Error(response.data.message);
  }

  /**
   * Renovar access token con refresh token
   */
  static async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await authApi.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refresh_token: refreshToken
    });

    if (response.data.status === 'success') {
      // Actualizar solo el access token (refresh se mantiene)
      TokenManager.setAccessToken(response.data.data.accessToken);
      return response.data;
    }

    throw new Error('Token refresh failed');
  }

  /**
   * Logout y limpieza de sesión
   */
  static async logout(): Promise<void> {
    try {
      await authApi.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Limpiar tokens incluso si falla la llamada
      TokenManager.clearAll();
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    return TokenManager.hasValidTokens();
  }

  /**
   * Obtener datos del usuario almacenados
   */
  static getUserData(): User | null {
    return TokenManager.getUserData();
  }
}
```

### 2. TokenManager (Interno en AuthService)

Gestión segura de tokens en localStorage.

```typescript
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_DATA_KEY = 'user_data';

  static setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setUserData(user: User): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
  }

  static getUserData(): User | null {
    const data = localStorage.getItem(this.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  static clearAll(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  static hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return !!(accessToken && refreshToken);
  }
}
```

### 3. useAuth Hook (`src/hooks/useAuth.ts`)

Hook personalizado para manejar el estado de autenticación en componentes.

```typescript
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Login de usuario
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await AuthService.login(credentials);

      if (response.status === 'success') {
        setUser(response.data.user);
        
        toast({
          title: "¡Bienvenido!",
          description: `Hola ${response.data.user.firstName}, acceso autorizado.`,
        });

        return true;
      }
    } catch (error) {
      toast({
        title: "Error de autenticación",
        description: error.message,
        variant: "destructive"
      });
      
      setUser(null);
      AuthService.clearSession();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Logout de usuario
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await AuthService.logout();
      setUser(null);
      
      toast({
        title: "Sesión cerrada",
        description: "Has salido del sistema correctamente.",
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [toast]);

  /**
   * Verificar autenticación
   */
  const isAuthenticated = useCallback((): boolean => {
    return !!user && AuthService.isAuthenticated();
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
  };
};
```

### 4. AuthContext (`src/context/AuthContext.tsx`)

Contexto global para compartir estado de autenticación en toda la app.

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  useEffect(() => {
    // Inicializar autenticación al cargar la app
    const storedUserData = AuthService.getUserData();
    const hasValidTokens = AuthService.isAuthenticated();
    
    if (hasValidTokens && storedUserData) {
      auth.setUserData(storedUserData);
    } else {
      AuthService.clearSession();
    }
  }, []);

  const contextValue: AuthContextType = {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    logout: auth.logout,
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
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};
```

## 🛡️ Protección de Rutas

### PrivateRoute Component (`src/components/auth/PrivateRoute.tsx`)

Componente para proteger rutas que requieren autenticación.

```typescript
interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string | string[]; // Roles requeridos opcionales
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const location = useLocation();

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  // Redirigir a login si no está autenticado
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

  // Usuario autenticado y con permisos correctos
  return <>{children}</>;
};
```

### Uso en Routing

```typescript
// src/App.tsx
<Routes>
  {/* Rutas públicas */}
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  
  {/* Rutas protegidas - cualquier usuario autenticado */}
  <Route path="/dashboard" element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } />
  
  {/* Rutas con rol específico */}
  <Route path="/users" element={
    <PrivateRoute requiredRole="admin">
      <UsersManagement />
    </PrivateRoute>
  } />
  
  {/* Rutas con múltiples roles permitidos */}
  <Route path="/reports" element={
    <PrivateRoute requiredRole={['admin', 'coordinator']}>
      <Reports />
    </PrivateRoute>
  } />
</Routes>
```

## 👤 Sistema de Roles y Permisos

### Roles del Sistema

```typescript
enum UserRole {
  ADMIN = 'admin',           // Acceso total
  COORDINATOR = 'coordinator', // Gestión de sectores y reportes
  SURVEYOR = 'surveyor',      // Crear y editar encuestas
  USER = 'user'               // Solo lectura
}
```

### usePermissions Hook (`src/hooks/usePermissions.ts`)

Hook para verificar permisos específicos basados en roles.

```typescript
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuthContext();

  const permissions = useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false,
        canCreateSurveys: false,
        canEditSurveys: false,
        canDeleteSurveys: false,
        isAdmin: false,
        isCoordinator: false,
        isSurveyor: false,
      };
    }

    const isAdmin = user.role === 'admin';
    const isCoordinator = user.role === 'coordinator';
    const isSurveyor = user.role === 'surveyor';

    return {
      // Permisos específicos
      canManageUsers: isAdmin,
      canViewReports: isAdmin || isCoordinator,
      canManageSettings: isAdmin,
      canCreateSurveys: isAdmin || isCoordinator || isSurveyor,
      canEditSurveys: isAdmin || isCoordinator || isSurveyor,
      canDeleteSurveys: isAdmin || isCoordinator,
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
   * Verificar si el usuario tiene un permiso específico
   */
  const hasPermission = (permission: keyof typeof permissions): boolean => {
    return permissions[permission] as boolean;
  };

  /**
   * Verificar si el usuario tiene acceso a una ruta
   */
  const canAccessRoute = (route: string): boolean => {
    switch (route) {
      case '/users':
        return permissions.canManageUsers;
      case '/reports':
        return permissions.canViewReports;
      case '/settings':
        return permissions.canManageSettings;
      default:
        return isAuthenticated;
    }
  };

  return {
    ...permissions,
    hasPermission,
    canAccessRoute
  };
};
```

### Uso en Componentes

```typescript
const Dashboard = () => {
  const { canViewReports, canManageUsers, isAdmin } = usePermissions();

  return (
    <div>
      {canViewReports && <ReportsWidget />}
      {canManageUsers && <UsersManagementButton />}
      {isAdmin && <AdvancedSettings />}
    </div>
  );
};
```

## 🔧 Interceptores Axios

### Request Interceptor

Añade el token de autenticación a cada request automáticamente.

```typescript
// src/interceptors/axios.ts
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor

Maneja la renovación automática de tokens expirados.

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar renovar el token
        const response = await AuthService.refreshToken();
        
        if (response.status === 'success') {
          // Actualizar token y reintentar request original
          originalRequest.headers.Authorization = 
            `Bearer ${response.data.accessToken}`;
          
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, cerrar sesión
        AuthService.clearSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

## 🎯 Flujo Completo de Autenticación

### Login Flow

```
1. Usuario ingresa email y contraseña en Login Component
      ↓
2. Login.tsx llama a useAuth().login(credentials)
      ↓
3. useAuth llama a AuthService.login()
      ↓
4. AuthService hace POST /api/auth/login
      ↓
5. Backend valida credenciales y retorna tokens + user data
      ↓
6. TokenManager almacena tokens en localStorage
      ↓
7. AuthContext actualiza estado global (user, isAuthenticated)
      ↓
8. PrivateRoute detecta autenticación válida
      ↓
9. Usuario es redirigido a /dashboard
```

### Protected Request Flow

```
1. Component hace una llamada API (ej: fetchSurveys())
      ↓
2. Axios Request Interceptor agrega Bearer token
      ↓
3. Backend valida token
      ↓
      ├─ Token válido → Retorna datos
      │     ↓
      │   Component recibe datos
      │
      └─ Token expirado (401) → Response Interceptor
            ↓
          Llama a AuthService.refreshToken()
            ↓
          POST /api/auth/refresh-token
            ↓
          Recibe nuevo accessToken
            ↓
          Reintenta request original con nuevo token
            ↓
          Component recibe datos
```

### Logout Flow

```
1. Usuario hace click en "Cerrar Sesión"
      ↓
2. UserMenu llama a useAuth().logout()
      ↓
3. useAuth llama a AuthService.logout()
      ↓
4. AuthService hace POST /api/auth/logout (notifica al backend)
      ↓
5. TokenManager.clearAll() limpia localStorage
      ↓
6. AuthContext resetea estado (user = null, isAuthenticated = false)
      ↓
7. PrivateRoute detecta logout
      ↓
8. Usuario es redirigido a /login
```

## 🔒 Mejores Prácticas de Seguridad

### 1. Almacenamiento Seguro
✅ **USAR**: localStorage para tokens (única opción en SPA)
❌ **EVITAR**: Cookies JavaScript-accessible (XSS vulnerable)

### 2. HTTPS Obligatorio en Producción
```nginx
# nginx.conf
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

### 3. Validación de Tokens
- Verificar expiración antes de cada request
- Renovar tokens automáticamente
- Invalidar tokens en backend al logout

### 4. Rate Limiting
```typescript
// Backend debe implementar rate limiting
// Ejemplo: Max 5 intentos de login por minuto por IP
```

### 5. No Exponer Información Sensible
```typescript
// ❌ MAL
console.log('Token:', accessToken);

// ✅ BIEN
console.log('Autenticación exitosa');
```

## 🧪 Testing de Autenticación

### Test de Login
```typescript
describe('AuthService.login', () => {
  it('should login successfully with valid credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await AuthService.login(credentials);
    
    expect(response.status).toBe('success');
    expect(TokenManager.getAccessToken()).toBeTruthy();
  });
});
```

## 📚 Referencias Adicionales

- [Arquitectura del Sistema](system-architecture.md)
- [Flujo de Datos](data-flow.md)
- [Guía de Desarrollo](../development/development-guide.md)

## 🆘 Troubleshooting

### Token expirado constantemente
**Causa**: Access token de 15 min muy corto
**Solución**: El interceptor debe renovar automáticamente. Verificar Response Interceptor.

### Loop infinito de renovación
**Causa**: Refresh token también expirado
**Solución**: Logout automático y redirigir a login

### Usuario pierde sesión al recargar
**Causa**: No se cargan tokens almacenados al inicializar
**Solución**: Verificar `AuthProvider` inicializa correctamente desde localStorage
