# 🔴 Nueva Estructura de Errores del API de Encuestas

## 📋 Contexto

El backend del API de encuestas ahora devuelve errores estructurados con información detallada sobre fallos de validación de catálogos. Esta nueva estructura proporciona mejor contexto para debugging y mensajes más útiles para el usuario.

---

## 🆕 Nueva Estructura de Error

### Interfaz TypeScript

```typescript
export interface APIErrorResponse {
  status: 'error';
  code: string;              // Código del error (ej: "INVALID_CATALOG_REFERENCE")
  message: string;           // Mensaje principal del error
  details: string;           // Detalles específicos del error
  suggestion: string;        // Sugerencia de solución
  catalog?: string;          // Nombre del catálogo afectado (ej: "parentescos")
  invalidId?: number | string; // ID inválido que causó el error
  person?: string;           // Nombre de la persona relacionada con el error
  field?: string;            // Campo específico que causó el error
}
```

### Ejemplo Real

```json
{
  "status": "error",
  "code": "INVALID_CATALOG_REFERENCE",
  "message": "El registro seleccionado no existe en el catálogo",
  "details": "El parentesco con ID 26 no existe en el catálogo",
  "suggestion": "Verifique que el ID del parentesco sea correcto o seleccione un parentesco válido del catálogo",
  "catalog": "parentescos",
  "invalidId": 26,
  "person": "Lucas Calle Lobo"
}
```

---

## 🔧 Implementación en el Frontend

### 1. **Interfaz en `surveySubmission.ts`**

```typescript
// src/services/surveySubmission.ts

export interface APIErrorResponse {
  status: 'error';
  code: string;
  message: string;
  details: string;
  suggestion: string;
  catalog?: string;
  invalidId?: number | string;
  person?: string;
  field?: string;
}

export interface SurveySubmissionResponse {
  success: boolean;
  message: string;
  data?: any;
  surveyId?: string;
  errorDetails?: APIErrorResponse; // ✨ Nuevo campo
}
```

### 2. **Detección y Formateo de Errores**

```typescript
// src/services/surveySubmission.ts

/**
 * Verifica si la respuesta es un error estructurado del nuevo formato
 */
private static isStructuredError(errorResponse: any): errorResponse is APIErrorResponse {
  return (
    errorResponse &&
    errorResponse.status === 'error' &&
    typeof errorResponse.code === 'string' &&
    typeof errorResponse.message === 'string'
  );
}

/**
 * Formatea un mensaje de error detallado usando la nueva estructura del API
 */
private static formatErrorMessage(errorResponse: APIErrorResponse): string {
  const parts: string[] = [];
  
  // Mensaje principal
  if (errorResponse.message) {
    parts.push(errorResponse.message);
  }
  
  // Detalles específicos
  if (errorResponse.details) {
    parts.push(`\n📋 ${errorResponse.details}`);
  }
  
  // Información de contexto
  if (errorResponse.catalog && errorResponse.invalidId) {
    parts.push(`\n🔍 Catálogo: "${errorResponse.catalog}", ID inválido: ${errorResponse.invalidId}`);
  }
  
  if (errorResponse.person) {
    parts.push(`\n👤 Persona: ${errorResponse.person}`);
  }
  
  if (errorResponse.field) {
    parts.push(`\n📝 Campo: ${errorResponse.field}`);
  }
  
  // Sugerencia de solución
  if (errorResponse.suggestion) {
    parts.push(`\n💡 Sugerencia: ${errorResponse.suggestion}`);
  }
  
  return parts.join('');
}
```

### 3. **Manejo en `submitSurvey()` y `updateSurvey()`**

```typescript
catch (error: any) {
  const errorResponse = error.response?.data;
  const statusCode = error.response?.status || 500;
  
  // ✅ Verificar si es el nuevo formato de error estructurado
  if (this.isStructuredError(errorResponse)) {
    const formattedMessage = this.formatErrorMessage(errorResponse);
    
    console.error('🔴 Error estructurado del API:', {
      code: errorResponse.code,
      catalog: errorResponse.catalog,
      invalidId: errorResponse.invalidId,
      person: errorResponse.person
    });
    
    return {
      success: false,
      message: formattedMessage,
      data: errorResponse,
      errorDetails: errorResponse // ✨ Incluir detalles estructurados
    };
  }
  
  // ❌ Fallback para errores en formato antiguo
  // ...
}
```

---

## 📱 Uso en Componentes

### En `SurveyForm.tsx`

```typescript
const response = await SurveySubmissionService.submitSurvey(structuredSurveyData);

if (!response.success) {
  // Mostrar error con detalles estructurados
  const errorTitle = response.errorDetails?.code 
    ? `❌ ${response.errorDetails.code.replace(/_/g, ' ')}`
    : "❌ Error al enviar al servidor";
  
  const errorDescription = response.errorDetails
    ? `${response.message}\n\nLos datos se guardaron localmente.`
    : `${response.message} - Los datos se guardaron localmente.`;
  
  toast({
    title: errorTitle,
    description: errorDescription,
    variant: "destructive"
  });
  
  // Log adicional para debugging
  if (response.errorDetails) {
    console.error('🔴 Detalles del error:', {
      code: response.errorDetails.code,
      catalog: response.errorDetails.catalog,
      invalidId: response.errorDetails.invalidId,
      person: response.errorDetails.person,
      suggestion: response.errorDetails.suggestion
    });
  }
}
```

---

## 🎯 Beneficios

### **Para Desarrolladores:**
- ✅ **Debugging más rápido**: Información detallada sobre el error (catálogo, ID, persona)
- ✅ **Logs estructurados**: Fácil de filtrar y analizar en consola
- ✅ **Type-safety**: Interfaces TypeScript completas

### **Para Usuarios:**
- ✅ **Mensajes claros**: Explicación del problema + sugerencia de solución
- ✅ **Contexto relevante**: Se indica qué persona o campo causó el error
- ✅ **Mejor UX**: Errores comprensibles sin jerga técnica

---

## 📊 Tipos de Códigos de Error

| Código | Descripción | Ejemplo |
|--------|-------------|---------|
| `INVALID_CATALOG_REFERENCE` | ID no existe en catálogo | Parentesco con ID 26 no existe |
| `MISSING_REQUIRED_FIELD` | Campo requerido faltante | Campo "nombres" es obligatorio |
| `VALIDATION_ERROR` | Error de validación genérico | Email inválido |
| `DUPLICATE_ENTRY` | Registro duplicado | Ya existe una encuesta para esta familia |

---

## 🔍 Ejemplo de Flujo Completo

### 1. Usuario envía encuesta con parentesco inválido

```typescript
// Datos enviados
{
  familyMembers: [
    {
      nombres: "Lucas Calle Lobo",
      parentesco: { id: 26, nombre: "Parentesco Inválido" }
    }
  ]
}
```

### 2. Backend responde con error estructurado

```json
{
  "status": "error",
  "code": "INVALID_CATALOG_REFERENCE",
  "message": "El registro seleccionado no existe en el catálogo",
  "details": "El parentesco con ID 26 no existe en el catálogo",
  "suggestion": "Verifique que el ID del parentesco sea correcto o seleccione un parentesco válido del catálogo",
  "catalog": "parentescos",
  "invalidId": 26,
  "person": "Lucas Calle Lobo"
}
```

### 3. Frontend procesa y formatea el error

```typescript
const formattedMessage = `
El registro seleccionado no existe en el catálogo

📋 El parentesco con ID 26 no existe en el catálogo
🔍 Catálogo: "parentescos", ID inválido: 26
👤 Persona: Lucas Calle Lobo
💡 Sugerencia: Verifique que el ID del parentesco sea correcto o seleccione un parentesco válido del catálogo
`;
```

### 4. Usuario ve toast descriptivo

```
╔════════════════════════════════════════════╗
║ ❌ INVALID CATALOG REFERENCE               ║
╠════════════════════════════════════════════╣
║ El registro seleccionado no existe en el   ║
║ catálogo                                   ║
║                                            ║
║ 📋 El parentesco con ID 26 no existe en    ║
║    el catálogo                             ║
║ 🔍 Catálogo: "parentescos", ID inválido: 26║
║ 👤 Persona: Lucas Calle Lobo               ║
║ 💡 Sugerencia: Verifique que el ID del     ║
║    parentesco sea correcto...              ║
║                                            ║
║ Los datos se guardaron localmente.         ║
╚════════════════════════════════════════════╝
```

---

## 🧪 Testing

### Casos de Prueba

1. **Error con catálogo inválido**
   - ✅ Muestra nombre del catálogo
   - ✅ Muestra ID inválido
   - ✅ Muestra nombre de la persona
   - ✅ Muestra sugerencia de solución

2. **Error sin persona asociada**
   - ✅ No muestra campo "Persona:"
   - ✅ Mantiene resto de información

3. **Error formato antiguo (fallback)**
   - ✅ Detecta formato antiguo
   - ✅ Usa lógica de fallback
   - ✅ Muestra mensaje genérico

---

## 📝 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `src/services/surveySubmission.ts` | ✅ Interfaz `APIErrorResponse`<br>✅ Método `formatErrorMessage()`<br>✅ Método `isStructuredError()`<br>✅ Manejo en catch blocks |
| `src/components/SurveyForm.tsx` | ✅ Detección de `errorDetails`<br>✅ Toast con título dinámico<br>✅ Logging mejorado |

---

## 🚀 Próximos Pasos

1. **Validación preventiva**: Agregar validación en frontend antes del envío
2. **Catálogo de códigos**: Documentar todos los códigos de error posibles
3. **Componente Toast mejorado**: Crear componente específico para errores estructurados
4. **Telemetría**: Enviar errores a servicio de monitoreo

---

## 📚 Referencias

- **Swagger API Docs**: `/api/docs` - Documentación completa del API
- **TypeScript Interfaces**: `src/services/surveySubmission.ts`
- **Ejemplos de Uso**: `src/components/SurveyForm.tsx`

---

**Última actualización**: 19 de noviembre de 2025  
**Versión**: 2.0
