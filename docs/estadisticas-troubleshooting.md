# 🔧 Guía de Troubleshooting - Estadísticas Completas

## ❓ Problema: "No veo las estadísticas en el dashboard"

### 1️⃣ **Verificar que estás en la ruta correcta**

Asegúrate de estar en: `http://localhost:8081/estadisticas`

**NO** en: `http://localhost:8081/dashboard`

### 2️⃣ **Revisar la consola del navegador**

1. Abre las **DevTools** (F12 o Ctrl+Shift+I)
2. Ve a la pestaña **Console**
3. Busca mensajes como:

```
🔄 Iniciando petición a /api/estadisticas/completas...
✅ Respuesta recibida: {exito: true, ...}
✅ Estadísticas obtenidas correctamente
```

### 3️⃣ **Errores Comunes**

#### Error: "Network Error" o "ERR_CONNECTION_REFUSED"
```
❌ El servidor backend no está corriendo
```

**Solución:**
- Verifica que el backend esté activo en `http://206.62.139.100:3001`
- Verifica tu conexión a internet
- Revisa que el CORS esté configurado correctamente

#### Error: "401 Unauthorized"
```
❌ Token de autenticación inválido o expirado
```

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Intenta acceder nuevamente a `/estadisticas`

#### Error: "404 Not Found"
```
❌ El endpoint /api/estadisticas/completas no existe
```

**Solución:**
- Verifica que el backend tenga el endpoint implementado
- Usa el curl de prueba para verificar:
```bash
curl 'http://206.62.139.100:3001/api/estadisticas/completas' \
  -H 'Authorization: Bearer TU_TOKEN'
```

#### Error: Página en blanco o "Loading..."
```
❌ El componente no se está renderizando
```

**Solución:**
- Revisa la consola del navegador para ver errores de React
- Verifica que todos los imports estén correctos
- Compila nuevamente el proyecto: `npm run dev`

### 4️⃣ **Modo de Prueba con Datos Mock**

Si el API no está disponible, puedes usar datos de prueba:

1. Abre `src/services/estadisticas-completas.ts`
2. Cambia:
```typescript
const USE_MOCK_DATA = false
```
a:
```typescript
const USE_MOCK_DATA = true
```

3. Guarda el archivo
4. Recarga la página

Ahora verás las estadísticas con datos de prueba **sin necesidad del API**.

### 5️⃣ **Verificar el Estado de Carga**

Si ves el spinner de "Cargando estadísticas..." indefinidamente:

1. Abre la consola
2. Busca el mensaje `📊 Cargando estadísticas completas...`
3. Si no hay un mensaje `✅ Estadísticas cargadas:`, hay un problema con la petición

### 6️⃣ **Verificar Componentes de Gráficos**

Si los gráficos no se muestran:

```bash
# Verificar que Recharts esté instalado
npm list recharts

# Si no está instalado, instalarlo
npm install recharts
```

### 7️⃣ **Accesos Rápidos**

#### Desde el Dashboard:
1. Ve a `http://localhost:8081/dashboard`
2. Click en el botón **"Ver Estadísticas Completas"**

#### Desde el Sidebar:
1. Click en el menú **"Reportes"**
2. Click en **"Estadísticas Completas"**

### 8️⃣ **Verificar Estructura de Respuesta del API**

La respuesta del API debe tener esta estructura:

```json
{
  "exito": true,
  "mensaje": "Estadísticas completas obtenidas exitosamente",
  "datos": {
    "timestamp": "2025-10-14T00:25:59.099Z",
    "resumen": { ... },
    "geografia": { ... },
    "poblacion": { ... },
    "familias": { ... },
    "salud": { ... },
    "educacion": { ... },
    "vivienda": { ... },
    "usuarios": { ... }
  }
}
```

Si falta algún campo, puede causar errores.

### 9️⃣ **Logs Detallados**

Para activar logs más detallados:

1. Abre `src/services/estadisticas-completas.ts`
2. Los logs ya están activados con emojis:
   - 🔄 = Iniciando petición
   - ✅ = Éxito
   - ❌ = Error

### 🔟 **Test Manual del Endpoint**

Prueba el endpoint directamente:

```bash
# Obtener tu token del localStorage
# En la consola del navegador:
localStorage.getItem('auth_token')

# Luego usa curl:
curl 'http://206.62.139.100:3001/api/estadisticas/completas' \
  -H 'Authorization: Bearer TU_TOKEN_AQUI' \
  -H 'accept: application/json'
```

Si esto funciona, el problema está en el frontend.

## 📊 Checklist de Verificación

- [ ] Estoy en la ruta `/estadisticas`
- [ ] El backend está corriendo
- [ ] Estoy autenticado (tengo token válido)
- [ ] No hay errores en la consola del navegador
- [ ] Recharts está instalado
- [ ] El endpoint responde correctamente con curl
- [ ] La respuesta del API tiene la estructura correcta

## 🆘 Si Nada Funciona

### Opción 1: Reiniciar Todo
```bash
# Detener servidor
Ctrl+C

# Limpiar caché
npm run clean  # o rm -rf node_modules/.vite

# Reinstalar dependencias
npm install

# Iniciar nuevamente
npm run dev
```

### Opción 2: Verificar Versiones
```bash
npm list recharts
npm list react
npm list typescript
```

## 📞 Información de Soporte

**Endpoint:** `GET /api/estadisticas/completas`  
**Base URL:** `http://206.62.139.100:3001`  
**Puerto Local:** `http://localhost:8081`  
**Ruta Frontend:** `/estadisticas`

---

## 🎯 Próximos Pasos

Una vez que veas las estadísticas:

1. ✅ Navega entre las pestañas (Población, Salud, Educación, etc.)
2. ✅ Prueba los gráficos interactivos (hover sobre las barras/donas)
3. ✅ Verifica que todos los datos se muestren correctamente
4. ✅ Prueba en diferentes tamaños de pantalla (responsive)

---

**Última actualización:** Octubre 2025
