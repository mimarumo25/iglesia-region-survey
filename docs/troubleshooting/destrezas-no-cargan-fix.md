# 🔍 Diagnóstico: Destrezas no se Cargan

**Fecha**: 10 de octubre de 2025  
**Problema Reportado**: Las destrezas no se cargan en `http://localhost:8080/settings/destrezas`

## 📋 Resumen

El problema estaba relacionado con cómo se estaba usando el hook `useDestrezas()` en el componente `FamilyMemberDialog.tsx` y potencialmente con los parámetros que se enviaban en la llamada a la API.

## 🔧 Acciones Realizadas

### 1. Creación de Hooks Simplificados para Formularios

Se crearon dos nuevos hooks wrapper para facilitar el uso de habilidades y destrezas en formularios:

**Archivos creados**:
- `src/hooks/useHabilidadesFormulario.ts`
- `src/hooks/useDestrezasFormulario.ts`

Estos hooks:
- Llaman directamente a `useQuery` de React Query
- Transforman los datos al formato esperado por `MultiSelectWithChips`
- Retornan `{ items, isLoading, error }` directamente

**Antes** (patrón complejo):
```typescript
const habilidadesHooks = useHabilidades();
const { data, isLoading } = habilidadesHooks.useActiveHabilidadesQuery();
const habilidades = data?.data?.map(...) || [];
```

**Ahora** (patrón simplificado):
```typescript
const { habilidades, isLoading, error } = useHabilidadesFormulario();
```

### 2. Actualización de FamilyMemberDialog

Se actualizó el componente `FamilyMemberDialog.tsx` para usar los nuevos hooks simplificados:

**Archivo modificado**: `src/components/survey/FamilyMemberDialog.tsx`

**Cambios**:
```typescript
// Antes
import { useHabilidades } from "@/hooks/useHabilidades";
import { useDestrezas } from "@/hooks/useDestrezas";

// Ahora
import { useHabilidadesFormulario } from "@/hooks/useHabilidadesFormulario";
import { useDestrezasFormulario } from "@/hooks/useDestrezasFormulario";
```

### 3. Simplificación del Servicio de Destrezas

Se simplificó la función `getActiveDestrezas()` para que coincida con el patrón de `getProfesiones()`:

**Archivo modificado**: `src/services/destrezas.ts`

**Antes**:
```typescript
getActiveDestrezas: async () => {
  const response = await apiClient.get('/api/catalog/destrezas', {
    params: {
      includePersonas: false,
      orderBy: 'nombre',
      orderDirection: 'ASC',
    },
  });
  return response.data;
}
```

**Ahora**:
```typescript
getActiveDestrezas: async () => {
  const response = await apiClient.get('/api/catalog/destrezas');
  return response.data;
}
```

### 4. Adición de Logs de Depuración

Se agregaron console.log detallados en `destrezasService` para facilitar el debugging:

```typescript
console.log('🔍 [destrezasService.getDestrezas] Solicitando destrezas:', { page, limit, sortBy, sortOrder });
console.log('✅ [destrezasService.getDestrezas] Respuesta recibida:', response.data);
console.error('❌ [destrezasService.getDestrezas] Error:', error.response?.data || error.message);
```

### 5. Creación de Página de Diagnóstico

Se creó una página de prueba para diagnosticar problemas con la API:

**Archivo creado**: `src/pages/DestrezasTest.tsx`  
**Ruta**: `http://localhost:8080/settings/destrezas-test`

Esta página:
- Llama directamente a `getDestrezas()` y `getActiveDestrezas()`
- Muestra la respuesta completa de la API
- Muestra errores detallados si ocurren
- Permite verificar que la autenticación funciona

## 🎯 Verificación del Endpoint

```bash
curl -X GET "http://206.62.139.100:3001/api/catalog/destrezas" -H "accept: application/json" -v
```

**Resultado**: 
```
HTTP/1.1 401 Unauthorized
{"status":"error","message":"Access token required"}
```

✅ **El endpoint existe** y requiere autenticación (comportamiento esperado)

## 📁 Archivos Modificados

1. ✅ `src/hooks/useHabilidadesFormulario.ts` (creado)
2. ✅ `src/hooks/useDestrezasFormulario.ts` (creado)
3. ✅ `src/components/survey/FamilyMemberDialog.tsx` (modificado)
4. ✅ `src/services/destrezas.ts` (modificado - logs y simplificación)
5. ✅ `src/pages/DestrezasTest.tsx` (creado)
6. ✅ `src/App.tsx` (modificado - ruta temporal de prueba)

## 🧪 Cómo Verificar la Solución

### Opción 1: Página de Destrezas Principal

1. Navegar a `http://localhost:8080/settings/destrezas`
2. Verificar que se cargue la lista de destrezas
3. Verificar la consola del navegador (F12) para ver los logs

### Opción 2: Página de Diagnóstico

1. Navegar a `http://localhost:8080/settings/destrezas-test`
2. Verificar que se muestren las respuestas de la API
3. Revisar la estructura de los datos retornados

### Opción 3: Formulario de Miembros de Familia

1. Navegar a una encuesta
2. Agregar/editar un miembro de familia
3. Ir a la Sección 9: "Habilidades y Destrezas"
4. Verificar que se carguen las opciones en el select

## 📊 Estructura de Respuesta Esperada

Según los tipos definidos, la API debería retornar:

```typescript
// Para getDestrezas()
{
  status: "success",
  data: [
    {
      id_destreza: "1",
      nombre: "Carpintería",
      descripcion: "Trabajo en madera",
      categoria: "Manual",
      created_at: "2025-10-10T...",
      updated_at: "2025-10-10T..."
    },
    // ...
  ],
  total: 10,
  message: "Destrezas obtenidas correctamente"
}

// Para getActiveDestrezas()
{
  success: true,
  timestamp: "2025-10-10T...",
  data: [
    {
      id_destreza: "1",
      nombre: "Carpintería",
      // ...
    }
  ]
}
```

## ⚠️ Notas Importantes

1. **Autenticación Requerida**: Todos los endpoints requieren un token Bearer válido
2. **Interceptor Automático**: El `apiClient` de axios maneja automáticamente la inclusión del token
3. **Cache de React Query**: Los datos se cachean por 10 minutos (staleTime: 1000 * 60 * 10)
4. **Invalidación de Cache**: Las mutaciones (create/update/delete) invalidan automáticamente las queries relacionadas

## 🔮 Próximos Pasos

1. **Verificar en navegador** la página de diagnóstico para confirmar que la API responde correctamente
2. **Revisar logs en consola** para ver qué datos exactos retorna el backend
3. **Ajustar tipos TypeScript** si la estructura de respuesta del backend es diferente
4. **Eliminar página de prueba** una vez confirmado que todo funciona

## 💡 Lecciones Aprendidas

1. **Hooks Simples**: Es mejor crear hooks wrapper simples que retornen datos directamente que usar patrones complejos de hooks que retornan funciones
2. **Consistencia**: Mantener los servicios consistentes (como profesiones, habilidades, destrezas) facilita el debugging
3. **Logs de Depuración**: Agregar console.log estratégicos ayuda enormemente a identificar problemas
4. **Páginas de Diagnóstico**: Crear componentes de prueba aislados ayuda a eliminar variables al debuggear

## 📝 Checklist de Verificación

- [x] Hooks simplificados creados
- [x] FamilyMemberDialog actualizado
- [x] Servicio de destrezas simplificado
- [x] Logs de depuración agregados
- [x] Página de diagnóstico creada
- [x] Ruta de prueba agregada
- [ ] Verificar en navegador que destrezas cargan
- [ ] Verificar logs en consola
- [ ] Verificar estructura de respuesta de API
- [ ] Remover página de prueba si todo funciona
- [ ] Remover logs de depuración si todo funciona

---

**Estado Actual**: ✅ Código modificado y listo para pruebas  
**Acción Requerida**: Abrir navegador en `http://localhost:8080/settings/destrezas-test` y verificar respuesta
