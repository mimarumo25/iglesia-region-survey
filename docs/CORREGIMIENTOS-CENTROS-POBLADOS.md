# 📋 Documentación - Campos Corregimiento y Centro Poblado

## 🎯 Resumen de Cambios

Se han agregado dos nuevos campos autocomplete en el formulario de encuesta, **antes de la vereda**, que se cargan dinámicamente basándose en el municipio seleccionado.

## 📍 Ubicación en el Formulario

**Etapa 1: Información General**

```
1. Municipio (autocomplete) ⭐
2. Parroquia (autocomplete) ⭐
3. Fecha (date picker)
4. Apellido Familiar (text)
5. 🆕 Corregimiento (autocomplete - NUEVO)
6. 🆕 Centro Poblado (autocomplete - NUEVO)
7. Vereda (autocomplete)
8. Sector (autocomplete)
9. Dirección (text)
10. Teléfono (text, optional)
11. Número Contrato EPM (text, optional)
```

## 🔌 Endpoints API

### Corregimientos
```bash
# Obtener todos los corregimientos
GET /api/catalog/corregimientos

# Obtener corregimientos por municipio
GET /api/catalog/corregimientos/municipio/{id_municipio}
```

**Ejemplo:**
```bash
curl 'http://localhost:3000/api/catalog/corregimientos/municipio/1' \
  -H 'Authorization: Bearer {token}' \
  -H 'accept: application/json'
```

### Centros Poblados
```bash
# Obtener todos los centros poblados
GET /api/catalog/centros-poblados

# Obtener centros poblados por municipio
GET /api/catalog/centros-poblados/municipio/{id_municipio}
```

**Ejemplo:**
```bash
curl 'http://localhost:3000/api/catalog/centros-poblados/municipio/1' \
  -H 'Authorization: Bearer {token}' \
  -H 'accept: application/json'
```

## 📦 Servicios Implementados

### `src/services/corregimientos.ts`
```typescript
interface Corregimiento {
  id_corregimiento: string;
  nombre: string;
  id_municipio: string | number;
  created_at?: string;
  updated_at?: string;
  municipio?: {
    id_municipio: string;
    nombre_municipio: string;
  };
}

class CorregimientosService {
  async getCorregimientos(page?, limit?, sortBy?, sortOrder?);
  async getCorregimientosByMunicipio(municipioId);
  async getCorregimientoById(id);
  async createCorregimiento(corregimiento);
  async updateCorregimiento(id, corregimiento);
  async deleteCorregimiento(id);
}
```

### `src/services/centros-poblados.ts`
```typescript
interface CentroPoblado {
  id_centro_poblado: string;
  nombre: string;
  id_municipio: string | number;
  created_at?: string;
  updated_at?: string;
  municipio?: {
    id_municipio: string;
    nombre_municipio: string;
  };
}

class CentrosPobladosService {
  async getCentrosPoblados(page?, limit?, sortBy?, sortOrder?);
  async getCentrosPobladosByMunicipio(municipioId);
  async getCentroPobladoById(id);
  async createCentroPoblado(centroPoblado);
  async updateCentroPoblado(id, centroPoblado);
  async deleteCentroPoblado(id);
}
```

## 🪝 Hooks Implementados

### `useCorregimientos()` - `src/hooks/useCorregimientos.ts`
```typescript
export const useCorregimientos = () => {
  // Query para obtener corregimientos de un municipio
  const useCorregimientosByMunicipioQuery = (municipioId);
  
  // Query para obtener todos
  const useAllCorregimientosQuery = ();
  
  // Mutaciones CRUD
  const useCreateCorregimientoMutation = ();
  const useUpdateCorregimientoMutation = ();
  const useDeleteCorregimientoMutation = ();
}
```

### `useCentrosPoblados()` - `src/hooks/useCentrosPoblados.ts`
```typescript
export const useCentrosPoblados = () => {
  // Query para obtener centros poblados de un municipio
  const useCentrosPobladosByMunicipioQuery = (municipioId);
  
  // Query para obtener todos
  const useAllCentrosPobladosQuery = ();
  
  // Mutaciones CRUD
  const useCreateCentroPobladoMutation = ();
  const useUpdateCentroPobladoMutation = ();
  const useDeleteCentroPobladoMutation = ();
}
```

### Hooks Dependientes del Municipio

#### `useMunicipioDependentCorregimientos()` - `src/hooks/useMunicipioDependentCorregimientos.ts`
```typescript
export const useMunicipioDependentCorregimientos = (municipioId) => {
  return {
    corregimientos: Corregimiento[],
    corregimientoOptions: AutocompleteOption[], // Formato para autocomplete
    isLoading: boolean,
    error: any
  };
}
```

#### `useMunicipioDependentCentrosPoblados()` - `src/hooks/useMunicipioDependentCentrosPoblados.ts`
```typescript
export const useMunicipioDependentCentrosPoblados = (municipioId) => {
  return {
    centrosPoblados: CentroPoblado[],
    centroPobladoOptions: AutocompleteOption[], // Formato para autocomplete
    isLoading: boolean,
    error: any
  };
}
```

## 🔄 Flujo de Datos

```
SurveyForm.tsx
  ↓
  Selecciona Municipio
  ↓
  useMunicipioDependentCorregimientos(municipioId)
  ↓
  useCorregimientos().useCorregimientosByMunicipioQuery()
  ↓
  corregimientosService.getCorregimientosByMunicipio(municipioId)
  ↓
  GET /api/catalog/corregimientos/municipio/{id}
  ↓
  Retorna array de corregimientos
  ↓
  Mapea a AutocompleteOption[]
  ↓
  Muestra en campo autocomplete
```

## 📝 Propiedades de los Campos en el Formulario

```typescript
// Corregimiento
{
  id: "corregimiento",
  label: "Corregimiento",
  type: "autocomplete",
  required: false,                    // ❌ NO obligatorio
  configKey: "corregimientoOptions"   // Se carga dinámicamente
}

// Centro Poblado
{
  id: "centro_poblado",
  label: "Centro Poblado",
  type: "autocomplete",
  required: false,                      // ❌ NO obligatorio
  configKey: "centroPobladoOptions"     // Se carga dinámicamente
}
```

## ⚙️ Características

✅ **Autocomplete**: Búsqueda y autocompletado de datos
✅ **Carga Dinámica**: Se cargan solo cuando se selecciona municipio
✅ **Loading State**: Muestra indicador de carga mientras obtiene datos
✅ **Error Handling**: Maneja errores y muestra mensajes descriptivos
✅ **Caché**: Los datos se cachean por 5 minutos
✅ **Validación**: Solo se habilitan si hay municipio seleccionado
✅ **TypeScript**: Totalmente tipado

## 🎯 Casos de Uso

### Caso 1: Usuario selecciona municipio
```typescript
formData.municipio = "1"; // ID del municipio
// ↓ Automáticamente se cargan los corregimientos y centros poblados
```

### Caso 2: Usuario cambia de municipio
```typescript
formData.municipio = "2"; // Nuevo municipio
// ↓ Los campos de corregimiento y centro poblado se limpian y recargan
```

### Caso 3: Sin municipio seleccionado
```typescript
formData.municipio = null;
// ↓ Los campos de corregimiento y centro poblado se deshabilitan
```

## 🔍 Estructura de Respuesta de API

### Respuesta GET `/api/catalog/corregimientos/municipio/1`
```json
[
  {
    "id_corregimiento": "1",
    "nombre": "Corregimiento San Pedro",
    "id_municipio": "1",
    "municipio": {
      "id_municipio": "1",
      "nombre_municipio": "Medellín"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id_corregimiento": "2",
    "nombre": "Corregimiento San Cristóbal",
    "id_municipio": "1",
    "municipio": {
      "id_municipio": "1",
      "nombre_municipio": "Medellín"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

## 📊 Diagrama de Componentes

```
SurveyForm
  ├── StandardFormField (Municipio)
  │   └── onChange → Actualiza formData.municipio
  ├── useMunicipioDependentCorregimientos
  │   └── useCorregimientos().useCorregimientosByMunicipioQuery(formData.municipio)
  ├── StandardFormField (Corregimiento)
  │   └── options = corregimientoOptions
  ├── useMunicipioDependentCentrosPoblados
  │   └── useCentrosPoblados().useCentrosPobladosByMunicipioQuery(formData.municipio)
  └── StandardFormField (Centro Poblado)
      └── options = centroPobladoOptions
```

## 🚀 Archivos Creados/Modificados

### ✅ Nuevos Servicios
- `src/services/corregimientos.ts` ⭐
- `src/services/centros-poblados.ts` ⭐

### ✅ Nuevos Hooks
- `src/hooks/useCorregimientos.ts` ⭐
- `src/hooks/useCentrosPoblados.ts` ⭐
- `src/hooks/useMunicipioDependentCorregimientos.ts` ⭐
- `src/hooks/useMunicipioDependentCentrosPoblados.ts` ⭐

### ✅ Archivos Modificados
- `src/components/SurveyForm.tsx` (Agregar importaciones, hooks, y campos)
- `src/config/api.ts` (Agregar endpoints)

## 📈 Build Status

✅ **Compilación exitosa** - Sin errores de TypeScript
✅ **Proyecto integrado** - Listo para uso
✅ **API configurada** - Endpoints correctos

## 🧪 Testing

Para probar los endpoints:

```bash
# Obtener corregimientos del municipio 1
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/catalog/corregimientos/municipio/1

# Obtener centros poblados del municipio 1
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/catalog/centros-poblados/municipio/1
```

## ⚠️ Notas Importantes

1. **Ambos campos son opcionales** (`required: false`)
2. **Se cargan automáticamente** al seleccionar un municipio
3. **El caché expira en 5 minutos** para optimizar rendimiento
4. **Los datos son tipados** con TypeScript
5. **Incluyen validación de errores** y manejo de excepciones

---

**Última actualización**: 21 de Octubre de 2025
**Estado**: ✅ Implementación Completa
