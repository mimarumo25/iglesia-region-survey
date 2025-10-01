# 📋 Actualización Parámetros API Difuntos

## 🎯 Cambios Implementados

Se actualizaron los parámetros de consulta para la API de difuntos para usar los IDs específicos en lugar de nombres o valores genéricos.

## 🔧 Parámetros Actualizados

### ✅ Antes vs Después:

| Campo Anterior | Parámetro Nuevo | Descripción |
|---------------|-----------------|-------------|
| `parentesco` | `id_parentesco` | ID del tipo de parentesco |
| `municipio` | `id_municipio` | ID del municipio |
| `parroquia` | `id_parroquia` | ID de la parroquia |
| `sector` | `id_sector` | ID del sector |
| `fecha_inicio` | `fecha_inicio` | Sin cambios |
| `fecha_fin` | `fecha_fin` | Sin cambios |

### ✅ Nuevo parámetro agregado:
- `id_vereda` - ID de la vereda

## 🌐 Endpoint de Ejemplo

```
GET http://localhost:3000/api/difuntos?id_parroquia=1&id_municipio=1&id_sector=1&id_parentesco=1&fecha_inicio=2020-01-01&fecha_fin=2023-12-31
```

## 📝 Interfaz TypeScript Actualizada

```typescript
export interface DifuntosFilters {
  id_parentesco?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_sector?: string;
  id_municipio?: string;
  id_parroquia?: string;
  id_vereda?: string;
  pagina?: number;
  limite?: number;
}
```

## 🔄 Mapeo en DifuntosForm

El formulario mantiene los nombres originales para la UX del usuario, pero los mapea a los IDs correctos:

```typescript
// Formulario (UI)          // API (Backend)
parentesco     →           id_parentesco
municipio      →           id_municipio  
parroquia      →           id_parroquia
sector         →           id_sector
fecha_inicio   →           fecha_inicio  (sin cambios)
fecha_fin      →           fecha_fin     (sin cambios)
```

## 💡 Ejemplos de Uso

### React Hook Form (UI)
```typescript
const form = useForm({
  defaultValues: {
    parentesco: "",
    municipio: "",
    parroquia: "", 
    sector: "",
    fecha_inicio: null,
    fecha_fin: null
  }
})
```

### Llamada a la API
```typescript
const filters: DifuntosFilters = {
  id_parentesco: "1",
  id_municipio: "1", 
  id_parroquia: "1",
  id_sector: "1",
  fecha_inicio: "2020-01-01",
  fecha_fin: "2023-12-31"
}

const response = await getDifuntos(filters)
```

## ✅ Archivos Modificados

1. **`src/types/difuntos.ts`**
   - ✅ Actualizada interfaz `DifuntosFilters`
   - ✅ Agregado campo `id_vereda`

2. **`src/services/difuntos.ts`**  
   - ✅ Actualizado ejemplo de documentación
   - ✅ Parámetros correctos en query string

3. **`src/hooks/useDifuntosConsulta.ts`**
   - ✅ Actualizado ejemplo de uso
   - ✅ Documentación corregida

4. **`src/components/difuntos/DifuntosForm.tsx`**
   - ✅ Mapeo correcto de campos UI → API
   - ✅ Validación de valores especiales mantenida

## 🎯 Compatibilidad

- ✅ **Formulario UI**: Sin cambios visibles para el usuario
- ✅ **Validación**: Mantiene lógica de filtros especiales (`__ALL__`, `__EMPTY__`)  
- ✅ **API**: Envía parámetros correctos al servidor
- ✅ **TypeScript**: Tipado estricto actualizado

---

**Endpoint actualizado:** `http://localhost:3000/api/difuntos?id_parroquia=1&id_municipio=1&id_sector=1&id_parentesco=1&fecha_inicio=1&fecha_fin=1`

**Fecha:** 23 de septiembre, 2025  
**Estado:** ✅ Completado