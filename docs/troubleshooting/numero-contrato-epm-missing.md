# 🐛 Issue: Campo `numero_contrato_epm` no se retorna en API de Encuestas

## 📋 Descripción del Problema

El campo **`numero_contrato_epm`** (Número de Contrato EPM) se envía correctamente al **crear o actualizar** una encuesta, pero **NO se retorna** en las respuestas de consulta de encuestas existentes.

## 🔍 Impacto

### Afectación al Usuario
- ❌ **Al editar una encuesta**: El campo aparece vacío aunque fue ingresado originalmente
- ❌ **Pérdida de datos potencial**: Si el usuario guarda sin volver a ingresar el número, el valor podría perderse
- ⚠️ **Experiencia de usuario degradada**: El usuario debe recordar y volver a ingresar el número de contrato

### Flujo Actual (Problemático)

```
CREAR ENCUESTA
├─ Usuario ingresa: numero_contrato_epm = "12345678"
├─ Frontend envía a POST /api/encuesta
│   └─ Payload incluye: numero_contrato_epm: "12345678"
├─ Backend guarda (presumiblemente)
└─ ✅ Encuesta creada exitosamente

EDITAR ENCUESTA (Días después)
├─ Frontend solicita GET /api/encuesta/:id
├─ Backend responde con EncuestaCompleta
│   └─ ❌ NO incluye campo numero_contrato_epm
├─ Frontend carga formulario
│   └─ Campo numero_contrato_epm aparece VACÍO
├─ Usuario edita otros campos y guarda
├─ Frontend envía PATCH /api/encuesta/:id
│   └─ Payload: numero_contrato_epm: "" (vacío)
└─ ⚠️ Posible pérdida del valor original
```

## 📊 Evidencia Técnica

### Estructura Actual de la API

**Endpoint GET /api/encuesta (Listado)**
```typescript
interface EncuestaListItem {
  id_encuesta: string;
  apellido_familiar: string;
  direccion_familia: string;
  telefono: string;
  // ... otros campos
  // ❌ numero_contrato_epm: NO EXISTE
}
```

**Endpoint GET /api/encuesta/:id (Individual)**
```typescript
interface EncuestaCompleta {
  id_encuesta?: string;
  apellido_familiar: string;
  direccion?: string;
  coordenadas_gps?: string;
  // ... otros campos
  // ❌ numero_contrato_epm: NO EXISTE
}
```

### Estructura Esperada en el Formulario

```typescript
interface FormData {
  // ... otros campos
  numero_contrato_epm: string; // ✅ Requerido en formulario
}
```

### Payload de Envío (Actual)

**POST /api/encuesta** y **PATCH /api/encuesta/:id**
```json
{
  "informacionGeneral": {
    "municipio": { "id": "1", "nombre": "Medellín" },
    "parroquia": { "id": "2", "nombre": "San José" },
    "apellido_familiar": "García Pérez",
    "direccion": "Calle 50 #45-30",
    "telefono": "3001234567",
    "numero_contrato_epm": "12345678", // ✅ SE ENVÍA
    // ...
  }
}
```

## 🔧 Solución Propuesta

### Backend (Requerido)

Agregar el campo `numero_contrato_epm` a las respuestas de consulta:

#### 1. Actualizar interfaz `EncuestaListItem`
```typescript
interface EncuestaListItem {
  id_encuesta: string;
  apellido_familiar: string;
  direccion_familia: string;
  telefono: string;
  numero_contrato_epm: string; // ✅ AGREGAR
  // ... otros campos
}
```

#### 2. Actualizar interfaz `EncuestaCompleta`
```typescript
interface EncuestaCompleta {
  id_encuesta?: string;
  apellido_familiar: string;
  direccion?: string;
  numero_contrato_epm?: string; // ✅ AGREGAR (opcional para compatibilidad)
  // ... otros campos
}
```

#### 3. Incluir en la query SQL/ORM

**Ejemplo SQL:**
```sql
SELECT 
  e.id_encuesta,
  e.apellido_familiar,
  e.direccion,
  e.numero_contrato_epm, -- ✅ AGREGAR
  -- ... otros campos
FROM encuestas e
WHERE e.id_encuesta = ?
```

**Ejemplo TypeORM/Prisma:**
```typescript
// Asegurar que el campo esté en el select
const encuesta = await encuestaRepository.findOne({
  where: { id_encuesta: id },
  select: [
    'id_encuesta',
    'apellido_familiar',
    'direccion',
    'numero_contrato_epm', // ✅ AGREGAR
    // ... otros campos
  ]
});
```

### Frontend (Ya implementado como workaround)

Actualizar transformador una vez el backend retorne el campo:

**Archivo:** `src/utils/encuestaToFormTransformer.ts`

```typescript
const transformEncuestaListItemToFormData = (encuesta: EncuestaListItem): FormDataFromEncuesta => {
  const formData: Record<string, any> = {
    // ... otros campos
    numero_contrato_epm: encuesta.numero_contrato_epm || '', // ✅ ACTUALIZAR
  };
  // ...
};

const transformEncuestaCompletaToFormData = (encuesta: EncuestaCompleta): FormDataFromEncuesta => {
  const formData: Record<string, any> = {
    // ... otros campos
    numero_contrato_epm: encuesta.numero_contrato_epm || '', // ✅ ACTUALIZAR
  };
  // ...
};
```

## 🧪 Casos de Prueba

### Test 1: Campo se retorna correctamente
```typescript
// DADO: Encuesta con numero_contrato_epm = "87654321"
// CUANDO: GET /api/encuesta/123
// ENTONCES: Response incluye numero_contrato_epm: "87654321"
```

### Test 2: Campo vacío no rompe la aplicación
```typescript
// DADO: Encuesta sin numero_contrato_epm (null o vacío)
// CUANDO: GET /api/encuesta/456
// ENTONCES: Response incluye numero_contrato_epm: "" o null
```

### Test 3: Edición preserva el valor
```typescript
// DADO: Encuesta con numero_contrato_epm = "11111111"
// CUANDO: GET /api/encuesta/789 → formulario carga → usuario edita otros campos → PATCH
// ENTONCES: numero_contrato_epm sigue siendo "11111111" en la base de datos
```

## 📝 Checklist de Implementación

### Backend
- [ ] Agregar campo `numero_contrato_epm` a tabla/modelo de encuestas (si no existe)
- [ ] Actualizar interfaz `EncuestaListItem` en respuesta de `/api/encuesta`
- [ ] Actualizar interfaz `EncuestaCompleta` en respuesta de `/api/encuesta/:id`
- [ ] Incluir campo en queries SELECT de ambos endpoints
- [ ] Verificar que el campo se guarde correctamente en POST y PATCH
- [ ] Ejecutar tests de integración

### Frontend (Post-Backend Fix)
- [ ] Actualizar `src/services/encuestas.ts` agregando el campo a las interfaces
- [ ] Actualizar `src/utils/encuestaToFormTransformer.ts` para mapear el campo
- [ ] Remover console.warn temporal
- [ ] Ejecutar tests de carga de encuesta en modo edición
- [ ] Verificar que el valor se preserve al editar

### Documentación
- [ ] Actualizar `docs/edicion-encuestas.md` removiendo la limitación
- [ ] Agregar nota en changelog sobre el fix

## 🔗 Referencias

- **Archivo del transformador**: `src/utils/encuestaToFormTransformer.ts` líneas 49 y 172
- **Servicio de encuestas**: `src/services/encuestas.ts`
- **Documentación de edición**: `docs/edicion-encuestas.md`
- **Tipo de formulario**: `src/types/survey.ts` línea 77

## 📅 Metadata

- **Fecha de reporte**: 10 de octubre de 2025
- **Reportado por**: Frontend Team
- **Prioridad**: 🟡 Media (afecta funcionalidad pero no bloquea)
- **Severity**: 🟠 Moderada (pérdida de datos potencial)
- **Componente afectado**: API de Encuestas - Consulta
- **Versión afectada**: Actual

## 💡 Notas Adicionales

### ¿Por qué no se nota hasta ahora?
- El formulario de **creación** funciona correctamente
- El problema solo aparece al **editar** encuestas existentes
- Si el usuario no había usado la funcionalidad de edición, el bug pasa desapercibido

### ¿Se están perdiendo datos actualmente?
- **Posiblemente NO**: Si el backend está guardando el campo correctamente en POST/PATCH, solo hay un problema de visualización
- **Para verificar**: Ejecutar query directa en la base de datos:
  ```sql
  SELECT id_encuesta, apellido_familiar, numero_contrato_epm 
  FROM encuestas 
  WHERE numero_contrato_epm IS NOT NULL AND numero_contrato_epm != '';
  ```

### Workaround temporal para usuarios
Mientras se implementa el fix:
1. Mantener registro externo de números de contrato EPM
2. Al editar una encuesta, volver a ingresar el número de contrato
3. Verificar el campo antes de guardar

---

**Status**: 🔴 PENDIENTE DE IMPLEMENTACIÓN EN BACKEND
