# 🔧 Solución a Dependencia Circular - axios.ts

## ❌ **Problema Identificado**

```
axios.ts:7 Uncaught ReferenceError: Cannot access 'AXIOS_CONFIG' before initialization
```

**Causa raíz**: **Dependencia circular** entre módulos:

```
📁 src/interceptors/axios.ts 
   ↓ import { AXIOS_CONFIG } from '@/config/api'
📁 src/config/api.ts 
   ↓ import { apiClient } from '@/interceptors/axios'
```

Este bucle impedía que JavaScript inicializara correctamente las constantes.

## ✅ **Solución Implementada**

### 1. **Configuración Directa en el Interceptor**

**Antes** (❌ Problemático):
```typescript
// axios.ts - CAUSABA EL ERROR
import { AXIOS_CONFIG, DEV_CONFIG } from '@/config/api';
export const apiClient = axios.create(AXIOS_CONFIG); // ← Error aquí
```

**Después** (✅ Corregido):
```typescript
// axios.ts - CONFIGURACIÓN DIRECTA
const API_BASE_URL = import.meta.env.VITE_BASE_URL_SERVICES;
const IS_DEVELOPMENT = import.meta.env.DEV;
const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'es-ES,es;q=0.8',
    'X-Requested-With': 'XMLHttpRequest',
  },
});
```

### 2. **Importación Dinámica para Evitar Ciclos**

**En** `src/config/api.ts`:
```typescript
export function getApiClient(): AxiosInstance {
  if (DEV_CONFIG.IS_DEVELOPMENT && DEV_CONFIG.SKIP_AUTH) {
    return basicClient;
  }
  
  // ✅ Importación dinámica para evitar dependencias circulares
  const { apiClient } = require('@/interceptors/axios');
  return apiClient;
}
```

### 3. **Eliminación de Dependencias Problemáticas**

- ✅ Removido `import { apiClient }` de `api.ts`
- ✅ Movida configuración de axios directamente al interceptor
- ✅ Reemplazadas referencias `DEV_CONFIG.*` con constantes locales

## 📊 **Resultado Final**

### ✅ **Estado Actual**
- **Sin dependencias circulares**
- **Servidor funcionando** en `http://localhost:8081`
- **Hot reload activo** - cambios se reflejan automáticamente
- **Zero errores de compilación**
- **Configuración centralizada** mantenida

### 🏗️ **Arquitectura Limpia**
```
📁 src/interceptors/axios.ts
   ✅ Configuración autocontenida
   ✅ No importa desde config/api.ts

📁 src/config/api.ts  
   ✅ Función getApiClient() reutilizable
   ✅ Importación dinámica cuando necesita apiClient

📁 src/services/*.ts
   ✅ Usan getApiClient() sin problemas
   ✅ No conocen detalles de implementación
```

## 🎯 **Principios Aplicados**

1. **Eliminación de dependencias circulares**
2. **Configuración autocontenida** en interceptores
3. **Lazy loading** para módulos conflictivos
4. **Separación clara de responsabilidades**

---

## 🔍 **Debugging tip futuro**

Cuando aparezca el error `Cannot access 'X' before initialization`:

1. Buscar **importaciones circulares** con:
   ```bash
   # Buscar archivos que se importen mutuamente
   grep -r "from '@/config/api'" src/
   grep -r "from '@/interceptors/axios'" src/
   ```

2. **Soluciones posibles**:
   - Mover configuración al módulo que la necesita
   - Usar importación dinámica `require()`  
   - Crear un módulo intermedio sin dependencias

---

*Problema resuelto el 18 de septiembre de 2025*  
*Tiempo total de debugging: ~10 minutos*