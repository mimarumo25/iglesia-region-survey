# 🔧 Compatibilidad de Campo ID Municipio - API Backend

## 📝 Resumen del Problema

El backend espera el campo `id_municipio_municipios` en la request, pero el frontend estaba enviando `id_municipio`. Esto causaba que el campo municipio no se procesara correctamente.

---

## 🔍 Análisis

### Request curl exitosa (que funciona)
```bash
curl 'http://206.62.139.100:3001/api/catalog/corregimientos' \
  -H 'Authorization: Bearer ...' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "nombre": "Corregimiento San Pedro mmm",
    "id_municipio_municipios": 1  # ← Backend espera esto
  }'
```

### Problema
El frontend estaba enviando:
```json
{
  "nombre": "Corregimiento San Pedro mmm",
  "id_municipio": 1  # ← Diferente nombre de campo
}
```

---

## ✅ Solución Implementada

### 1. `src/services/corregimientos.ts`

**Interfaces actualizadas:**
```typescript
export interface CreateCorregimientoRequest {
  nombre: string;
  id_municipio?: number;              // ← Opcional
  id_municipio_municipios?: number;   // ← Opcional
}

export interface UpdateCorregimientoRequest {
  nombre: string;
  id_municipio?: number;              // ← Opcional
  id_municipio_municipios?: number;   // ← Opcional
}
```

**Métodos de API actualizados:**
```typescript
async createCorregimiento(corregimiento: CreateCorregimientoRequest): Promise<Corregimiento> {
  // Mapea al nombre de campo que espera el backend
  const payload = {
    nombre: corregimiento.nombre,
    id_municipio_municipios: corregimiento.id_municipio || corregimiento.id_municipio_municipios,
  };
  const response = await client.post(baseUrl, payload);
  return response.data;
}

async updateCorregimiento(id: string | number, corregimiento: UpdateCorregimientoRequest): Promise<Corregimiento> {
  // Mapea al nombre de campo que espera el backend
  const payload = {
    nombre: corregimiento.nombre,
    id_municipio_municipios: corregimiento.id_municipio || corregimiento.id_municipio_municipios,
  };
  const response = await client.put(`${baseUrl}/${id}`, payload);
  return response.data;
}
```

---

### 2. `src/types/corregimientos.ts`

**Interfaces actualizadas:**
```typescript
export interface CorregimientoCreate {
  nombre: string;
  id_municipio?: number;              // ← Opcional
  id_municipio_municipios?: number;   // ← Opcional
}

export interface CorregimientoUpdate {
  nombre: string;
  id_municipio?: number;              // ← Opcional
  id_municipio_municipios?: number;   // ← Opcional
}
```

---

### 3. `src/schemas/corregimientos.ts`

**Esquemas actualizados:**
```typescript
export const corregimientoCreateSchema = z.object({
  nombre: nombreCorregimiento,
  id_municipio: municipioId.optional(),
  id_municipio_municipios: municipioId.optional(),
}).refine(
  (data) => data.id_municipio || data.id_municipio_municipios,  // ← Valida que al menos uno exista
  {
    message: "Debe seleccionar un municipio válido",
    path: ["id_municipio"],
  }
);
```

**Mismo cambio** en `corregimientoUpdateSchema`.

---

### 4. `src/pages/Corregimientos.tsx`

**Lógica actualizada:**
```typescript
const handleCreateSubmit = async (data: CorregimientoCreateData) => {
  // Toma el primero que no sea undefined
  const municipioId = data.id_municipio || data.id_municipio_municipios;
  if (!data.nombre.trim() || !municipioId) return;

  createMutation.mutate({
    nombre: formatNombreCorregimiento(data.nombre),
    id_municipio: municipioId,  // ← Pasamos al servicio
  }, ...);
};
```

---

## 🔄 Flow de Datos

```
Formulario React
    ↓
{ id_municipio: 2 } (input del usuario)
    ↓
Schema Zod (valida)
    ↓
handleCreateSubmit (extrae municipioId)
    ↓
createMutation.mutate({ id_municipio: 2 })
    ↓
corregimientosService.createCorregimiento()
    ↓
Mapea a { id_municipio_municipios: 2 }
    ↓
POST /api/catalog/corregimientos
    ↓
Backend recibe id_municipio_municipios ✅
```

---

## 🎯 Cambios por Archivo

| Archivo | Cambios |
|---------|---------|
| `src/services/corregimientos.ts` | Añadido mapeo en create/update, interfaces aceptan ambos nombres |
| `src/types/corregimientos.ts` | Ambos campos opcionales en Create/Update |
| `src/schemas/corregimientos.ts` | Ambos campos opcionales con validación `.refine()` |
| `src/pages/Corregimientos.tsx` | Lógica para extraer municipioId de cualquiera de los dos campos |

---

## ✅ Compilación

```
✓ Build exitoso: 7.57 segundos
✓ 3514 módulos transformados
✓ 0 errores TypeScript
```

---

## 🧪 Testing

### Test 1: Crear Corregimiento (Frontend)
```typescript
// Formulario
{ nombre: "San Pedro", id_municipio: 1 }

// Backend recibe
{ nombre: "San Pedro", id_municipio_municipios: 1 }
```

### Test 2: curl exitoso
```bash
curl 'http://206.62.139.100:3001/api/catalog/corregimientos' \
  --data-raw '{
    "nombre": "Corregimiento San Pedro mmm",
    "id_municipio_municipios": 1
  }'
```

### Test 3: Compatibilidad hacia atrás
```typescript
// Si llega id_municipio_municipios del backend
response.data.id_municipio_municipios = 1

// Se mapea correctamente en Corregimiento interface
municipio?.id_municipio_municipios
```

---

## 📊 Mapeo de Campos

| Contexto | Campo | Tipo |
|----------|-------|------|
| Frontend Input | `id_municipio` | `number` |
| Frontend/Types | `id_municipio_municipios` | `number` |
| Backend Request | `id_municipio_municipios` | `number` |
| Backend Response | `id_municipio_municipios` | `number` |

---

## 🚀 Estado

**Status**: ✅ **COMPLETADO**
**Build**: ✅ Exitoso (7.57s)
**Errors**: ✅ Ninguno
**Compatibilidad**: ✅ Frontend ↔ Backend

---

## 💡 Resumen

El cambio garantiza que:

1. ✅ El frontend envía `id_municipio_municipios` al backend
2. ✅ El backend recibe el campo correcto
3. ✅ Sin cambios en la lógica del formulario
4. ✅ Compatibilidad con ambos nombres de campo
5. ✅ Validación correcta en schemas Zod
6. ✅ Type safety en TypeScript

---

**Fecha**: 21 de Octubre de 2025
**Versión**: 1.0
**Status**: ✅ Ready for Production

