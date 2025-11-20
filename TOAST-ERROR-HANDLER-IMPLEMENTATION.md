# 🍞 Implementación de Toast Error Handler

## 📋 Resumen de Cambios

Se ha implementado un sistema centralizado de manejo de errores con toasts para mejorar la experiencia de usuario al mostrar errores de API.

## ✅ Archivos Completados

### 1. **Utilidad Centralizada** ✅
- **Archivo**: `src/utils/toastErrorHandler.ts`
- **Funciones creadas**:
  - `showErrorToast(error, operacion, options?)` - Muestra toast de error
  - `showSuccessToast(mensaje, descripcion?)` - Muestra toast de éxito
  - `showWarningToast(mensaje, descripcion?)` - Muestra toast de advertencia
  - `showInfoToast(mensaje, descripcion?)` - Muestra toast informativo
  - `extractErrorMessage(error)` - Extrae mensaje legible del error
  - `getErrorStatus(error)` - Obtiene código HTTP del error
  - `handleErrorWithToast(error, operacion, callbacks?)` - Maneja error con lógica específica
  - **Helpers de validación**:
    - `isAuthenticationError(error)` - Valida si es error 401
    - `isAuthorizationError(error)` - Valida si es error 403
    - `isValidationError(error)` - Valida si es error 400/422
    - `isServerError(error)` - Valida si es error 500+

### 2. **Servicios Actualizados** ✅

#### **encuestas.ts** ✅
- ✅ Import agregado: `import { showErrorToast } from '@/utils/toastErrorHandler'`
- ✅ Toast agregado en todos los catch blocks (7 métodos):
  - `getEncuestas()` - Obtener lista de encuestas
  - `getEncuestaById()` - Obtener encuesta por ID
  - `createEncuesta()` - Crear nueva encuesta
  - `updateEncuesta()` - Actualizar encuesta
  - `deleteEncuesta()` - Eliminar encuesta
  - `validarEncuesta()` - Validar encuesta
  - `getEstadisticas()` - Obtener estadísticas

#### **surveySubmission.ts** ✅
- ✅ Import agregado: `import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler'`
- ✅ Toast agregado en métodos:
  - `submitSurvey()` - Toast de éxito al enviar + toast de error en catch
  - `updateSurvey()` - Toast de éxito al actualizar + toast de error en catch

#### **familias.ts** ✅
- ✅ Import agregado: `import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler'`
- ✅ Toast agregado en:
  - `handleApiError()` - Función centralizada de manejo de errores
  - `exportFamiliasToExcel()` - Toast de éxito al descargar Excel

## 🔄 Patrón de Implementación

### Patrón Estándar para Servicios

```typescript
// 1. Agregar import al inicio del archivo
import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';

// 2. En bloques try-catch, agregar toast ANTES del throw
try {
  // ... código de llamada API
  const response = await api.get('/api/endpoint');
  return response.data;
  
} catch (error) {
  console.error('❌ Error al realizar operación:', error);
  
  // ⭐ AGREGAR ESTA LÍNEA
  showErrorToast(error, 'realizar operación');
  
  throw error; // o return según el caso
}

// 3. Para operaciones exitosas, agregar toast de éxito
try {
  const response = await api.post('/api/endpoint', data);
  
  // ⭐ AGREGAR TOAST DE ÉXITO
  showSuccessToast('Operación exitosa', 'Los datos se guardaron correctamente');
  
  return response.data;
  
} catch (error) {
  console.error('❌ Error:', error);
  showErrorToast(error, 'guardar datos');
  throw error;
}
```

## 📝 Servicios Pendientes de Actualización

### Alta Prioridad
- [ ] `src/services/auth.ts` - 6 catch blocks
- [ ] `src/services/users.ts` - 5 catch blocks
- [ ] `src/services/profile.ts` - 7 catch blocks

### Media Prioridad (Catálogos)
- [ ] `src/services/difuntos.ts` - 4 catch blocks
- [ ] `src/services/salud.ts` - 2 catch blocks
- [ ] `src/services/enfermedades.ts` - 7 catch blocks
- [ ] `src/services/estudios.ts` - 9 catch blocks
- [ ] `src/services/habilidades.ts` - 2 catch blocks
- [ ] `src/services/destrezas.ts` - 2 catch blocks
- [ ] `src/services/parentescos.ts` - 6 catch blocks
- [ ] `src/services/sexos.ts` - 7 catch blocks
- [ ] `src/services/tipos-identificacion.ts` - 8 catch blocks
- [ ] `src/services/tipos-vivienda.ts` - 7 catch blocks
- [ ] `src/services/sistemas-acueducto.ts` - 5+ catch blocks
- [ ] `src/services/aguas-residuales.ts` - 6 catch blocks
- [ ] `src/services/disposicion-basura.ts` - múltiples catch blocks

### Baja Prioridad (Geográficos)
- [ ] `src/services/departamentos.ts` - 5 catch blocks
- [ ] `src/services/municipios.ts` - múltiples catch blocks
- [ ] `src/services/veredas.ts` - 9 catch blocks
- [ ] `src/services/corregimientos.ts` - 6 catch blocks
- [ ] `src/services/centros-poblados.ts` - 6 catch blocks
- [ ] `src/services/parroquias.ts` - múltiples catch blocks
- [ ] `src/services/sectores.ts` - múltiples catch blocks

### Otros Servicios
- [ ] `src/services/estadisticas.ts` - 1 catch block
- [ ] `src/services/familias-consolidadas.ts` - 6 catch blocks
- [ ] `src/services/comunidades-culturales.ts` - 1 catch block

### Utils (Opcional - Solo si tiene sentido mostrar toast)
- [ ] `src/utils/surveyAPITransformer.ts` - 1 catch block
- [ ] `src/utils/sessionDataTransformer.ts` - 1 catch block
- [ ] `src/utils/downloadUtils.ts` - 1 catch block

## 🎯 Checklist de Implementación

Para cada archivo de servicio:

1. [ ] Abrir el archivo
2. [ ] Agregar import al inicio:
   ```typescript
   import { showErrorToast, showSuccessToast } from '@/utils/toastErrorHandler';
   ```
3. [ ] Buscar todos los `catch (error` o `catch (error: any`
4. [ ] En cada catch block, agregar DESPUÉS del console.error:
   ```typescript
   showErrorToast(error, 'descripción de la operación');
   ```
5. [ ] Para operaciones de creación/actualización exitosas, agregar:
   ```typescript
   showSuccessToast('Título del éxito', 'Descripción opcional');
   ```
6. [ ] Verificar que compile sin errores
7. [ ] Probar manualmente si es posible

## 🔧 Consideraciones Técnicas

### ¿Cuándo mostrar toast?
- ✅ **SÍ mostrar**: Operaciones de usuario (CRUD, login, envío de formularios)
- ✅ **SÍ mostrar**: Errores de validación o permisos
- ✅ **SÍ mostrar**: Errores de red o servidor
- ❌ **NO mostrar**: Operaciones en background o silenciosas
- ❌ **NO mostrar**: Errores que ya tienen manejo específico en UI

### Mensajes de Operación
Usar verbos en infinitivo para describir la operación:
- ✅ "obtener encuestas"
- ✅ "crear familia"
- ✅ "actualizar perfil"
- ✅ "eliminar registro"
- ✅ "descargar reporte"

### Toasts de Éxito
Agregar en operaciones de modificación de datos:
- ✅ Crear registros
- ✅ Actualizar registros
- ✅ Eliminar registros
- ✅ Descargar archivos
- ❌ Consultas de solo lectura (GET)

## 📊 Progreso General

```
Total de servicios: ~30
Completados: 3 (10%)
Pendientes: 27 (90%)
```

### Archivos Completados (3/30)
1. ✅ encuestas.ts
2. ✅ surveySubmission.ts
3. ✅ familias.ts

## 🚀 Próximos Pasos

1. **Fase 1 - Servicios Críticos** (Alta Prioridad)
   - auth.ts
   - users.ts
   - profile.ts

2. **Fase 2 - Catálogos Principales** (Media Prioridad)
   - difuntos.ts
   - salud.ts
   - enfermedades.ts
   - estudios.ts

3. **Fase 3 - Catálogos Secundarios** (Media Prioridad)
   - tipos-identificacion.ts
   - parentescos.ts
   - sexos.ts
   - tipos-vivienda.ts
   - sistemas-acueducto.ts
   - aguas-residuales.ts

4. **Fase 4 - Servicios Geográficos** (Baja Prioridad)
   - Todos los servicios de ubicación geográfica

5. **Fase 5 - Utils** (Opcional)
   - Evaluar caso por caso si tiene sentido mostrar toast

## 💡 Notas Importantes

- La utilidad `toastErrorHandler.ts` usa **sonner** (toast.error, toast.success, etc.)
- Los toasts son **no-bloqueantes** y se muestran automáticamente
- La función `extractErrorMessage()` maneja múltiples formatos de error del API
- Los toasts tienen **duración automática**: 5s para errores, 3s para éxitos
- Los mensajes son **user-friendly** y contextuales
- Se mantiene el `console.error()` para debugging en DevTools

## 🎨 Estilo de Mensajes

### Toasts de Error
```typescript
// Título automático: "Error al {operacion}"
showErrorToast(error, 'guardar encuesta');
// Resultado: "Error al guardar encuesta"
// Descripción: mensaje extraído del error del API
```

### Toasts de Éxito
```typescript
showSuccessToast('Encuesta guardada', 'Los datos se han almacenado correctamente');
// Título: "Encuesta guardada"
// Descripción: "Los datos se han almacenado correctamente"
```

### Toasts de Advertencia
```typescript
showWarningToast('Datos incompletos', 'Algunos campos opcionales están vacíos');
```

## 📖 Documentación de Referencia

- **Archivo principal**: `src/utils/toastErrorHandler.ts`
- **Biblioteca de toast**: sonner (ya integrado en el proyecto)
- **Patrón de diseño**: Documentado en `.github/instructions/documentos.instructions.md`

---

**Última actualización**: 2024-11-19
**Versión**: 1.0.0
**Responsable**: Sistema de desarrollo MIA
