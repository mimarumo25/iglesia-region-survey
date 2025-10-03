// Utilidades para manejo seguro de tokens con persistencia mejorada
export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'auth_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private static readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';
  private static readonly USER_DATA_KEY = 'auth_user_data';

  /**
   * Almacena el access token con tiempo de expiración
   * @param token - Token de acceso
   * @param expiresInSeconds - Tiempo de expiración en segundos
   */
  static setAccessToken(token: string, expiresInSeconds: number): void {
    try {
      const expiryTime = Date.now() + (expiresInSeconds * 1000);
      
      // Almacenar en sessionStorage para persistencia durante la sesión
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
      
      // También almacenar en cookie como respaldo (no httpOnly para JavaScript)
      this.setCookie(this.ACCESS_TOKEN_KEY, token, expiresInSeconds);
    } catch (error) {
      // Error silenciado
    }
  }

  /**
   * Almacena el refresh token
   * @param token - Refresh token
   */
  static setRefreshToken(token: string): void {
    try {
      // Refresh token con duración de 7 días
      const expiresInSeconds = 7 * 24 * 60 * 60; // 7 días
      
      // Almacenar en localStorage para persistencia a largo plazo
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
      
      // También almacenar en cookie
      this.setCookie(this.REFRESH_TOKEN_KEY, token, expiresInSeconds);
    } catch (error) {
      // Error silenciado
    }
  }

  /**
   * Almacena datos del usuario
   * @param userData - Datos del usuario
   */
  static setUserData(userData: any): void {
    try {
      sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      // Error silenciado
    }
  }

  /**
   * Obtiene el access token si aún es válido
   * @returns Token de acceso válido o null
   */
  static getAccessToken(): string | null {
    try {
      // Intentar obtener de sessionStorage primero
      let token = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      let expiryTime = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
      
      // Si no está en sessionStorage, intentar obtener de cookies
      if (!token) {
        token = this.getCookie(this.ACCESS_TOKEN_KEY);
      }
      
      if (!token) {
        return null;
      }
      
      // Verificar si el token ha expirado
      if (expiryTime) {
        const expiry = parseInt(expiryTime);
        if (Date.now() > expiry) {
          this.clearAccessToken();
          return null;
        }
      }
      
      return token;
    } catch (error) {
      // Error silenciado
      return null;
    }
  }

  /**
   * Obtiene el refresh token
   * @returns Refresh token o null
   */
  static getRefreshToken(): string | null {
    try {
      // Intentar obtener de localStorage primero
      let token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      
      // Si no está en localStorage, intentar obtener de cookies
      if (!token) {
        token = this.getCookie(this.REFRESH_TOKEN_KEY);
      }
      
      return token;
    } catch (error) {
      // Error silenciado
      return null;
    }
  }

  /**
   * Obtiene los datos del usuario almacenados
   * @returns Datos del usuario o null
   */
  static getUserData(): any | null {
    try {
      const userData = sessionStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      // Error silenciado
      return null;
    }
  }

  /**
   * Verifica si hay tokens válidos almacenados
   * @returns true si hay tokens válidos
   */
  static hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return !!(accessToken || refreshToken);
  }

  /**
   * Limpia solo el access token
   */
  static clearAccessToken(): void {
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      this.removeCookie(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      // Error silenciado
    }
  }

  /**
   * Limpia todos los tokens y datos de usuario
   */
  static clearAll(): void {
    try {
      // Limpiar sessionStorage
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      sessionStorage.removeItem(this.USER_DATA_KEY);
      
      // Limpiar localStorage
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      
      // Limpiar cookies
      this.removeCookie(this.ACCESS_TOKEN_KEY);
      this.removeCookie(this.REFRESH_TOKEN_KEY);
      
    } catch (error) {
      // Error silenciado
    }
  }

  /**
   * Establece una cookie
   * @param name - Nombre de la cookie
   * @param value - Valor de la cookie
   * @param expiresInSeconds - Tiempo de expiración en segundos
   */
  private static setCookie(name: string, value: string, expiresInSeconds: number): void {
    try {
      const expirationDate = new Date(Date.now() + expiresInSeconds * 1000);
      const isSecure = window.location.protocol === 'https:';
      
      let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
      
      if (isSecure) {
        cookieString += '; Secure';
      }
      
      document.cookie = cookieString;
    } catch (error) {
      // Error silenciado
    }
  }

  /**
   * Obtiene el valor de una cookie
   * @param name - Nombre de la cookie
   * @returns Valor de la cookie o null
   */
  private static getCookie(name: string): string | null {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue ? decodeURIComponent(cookieValue) : null;
      }
      
      return null;
    } catch (error) {
      // Error silenciado
      return null;
    }
  }

  /**
   * Elimina una cookie
   * @param name - Nombre de la cookie a eliminar
   */
  private static removeCookie(name: string): void {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    } catch (error) {
      // Error silenciado
    }
  }

}

// Mantener compatibilidad con el código existente
export class CookieManager {
  static set = TokenManager.setAccessToken;
  static get = TokenManager.getAccessToken;
  static remove = TokenManager.clearAccessToken;
  static clearAuthCookies = TokenManager.clearAll;
}
