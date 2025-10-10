# 📊 Componente PersonasTable - Documentación

## 🎯 Resumen

Se ha creado un **sistema completo de reportes de personas** con una tabla reutilizable que muestra **TODOS los 40+ campos** que retorna la API de personas consolidado.

---

## 📁 Archivos Creados/Modificados

### 1. **PersonasTable.tsx** ✅
**Ubicación**: `src/components/personas/PersonasTable.tsx`

**Descripción**: Componente reutilizable de tabla que muestra **todos los campos de personas**.

**Características**:
- ✅ Muestra **40+ campos** en formato tabla horizontal scrollable
- ✅ Formateadores inteligentes para:
  - Booleanos → Badges con íconos (✓ Sí / ✗ No)
  - Fechas → Formato legible en español
  - Arrays → Badges múltiples (destrezas)
  - Valores nulos → Guiones "-"
- ✅ Primera columna sticky (nombre completo) para mejor navegación
- ✅ Estados de loading y empty
- ✅ Indicador de total de registros

**Props**:
```typescript
interface PersonasTableProps {
  personas: PersonaConsolidada[];  // Array de personas
  isLoading: boolean;               // Estado de carga
  total: number;                    // Total de registros encontrados
}
```

**Ejemplo de uso**:
```tsx
<PersonasTable 
  personas={personas} 
  isLoading={isLoading}
  total={total}
/>
```

---

### 2. **PersonasReport.tsx** ✅
**Ubicación**: `src/pages/PersonasReport.tsx`

**Descripción**: Página completa con 6 tabs de reportes de personas, cada uno usando `PersonasTable`.

**Tabs implementados**:
1. **Geográfico** 🗺️ - Filtros por municipio, parroquia, sector, vereda
2. **Familia** 🏠 - Filtros por apellido familiar, tipo vivienda, parentesco
3. **Personal** 👤 - Filtros por estado civil, profesión, estudios, comunidad cultural, liderazgo, destrezas
4. **Tallas** 👕 - Filtros por talla de camisa, pantalón, zapato
5. **Edad** 📅 - Filtros por rango de edad (mínima y máxima)
6. **Reporte General** 📊 - Combina filtros de todos los tabs anteriores

**Funcionalidades por tab**:
- ✅ Consulta con filtros específicos
- ✅ Limpieza de filtros con un click
- ✅ Exportación a Excel
- ✅ Consulta automática al entrar al tab
- ✅ Muestra de resultados con `PersonasTable`

---

### 3. **personas.ts (tipos)** ✅
**Ubicación**: `src/types/personas.ts`

**Modificaciones**:
- ✅ Actualizada interfaz `PersonaConsolidada` con **40+ campos** exactos de la API
- ✅ Agregados campos faltantes:
  - `tipo_identificacion`
  - `direccion_personal`
  - `direccion_familia`
  - `telefono_familia`
  - `pozo_septico`, `letrina`, `campo_abierto` (servicios sanitarios)
  - `basura_recolector`, `basura_quemada`, `basura_enterrada`, `basura_recicla`, `basura_aire_libre`
  - `necesidad_enfermo`
  - `motivo_celebrar`, `dia_celebrar`, `mes_celebrar`
- ✅ Corregido tipo de `liderazgo` en filtros: `boolean | string` (para manejar 'all', 'true', 'false')

---

## 📋 Campos Mostrados en la Tabla

La tabla muestra **40+ campos** organizados en categorías:

### **Información Personal**
- Nombre Completo (sticky column)
- Documento
- Tipo Identificación
- Edad
- Fecha Nacimiento
- Sexo

### **Contacto**
- Teléfono
- Correo Electrónico
- Dirección Personal

### **Ubicación Geográfica**
- Municipio
- Parroquia
- Sector
- Vereda

### **Información Familiar**
- Dirección Familia
- Apellido Familiar
- Parentesco
- Teléfono Familia
- Fecha Registro

### **Vivienda**
- Tipo Vivienda

### **Servicios Sanitarios (Booleanos)**
- Pozo Séptico
- Letrina
- Campo Abierto

### **Manejo de Basura (Booleanos)**
- Recolector Basura
- Basura Quemada
- Basura Enterrada
- Basura Recicla
- Basura Aire Libre

### **Datos Personales**
- Estado Civil
- Profesión
- Estudios
- Comunidad Cultural
- Liderazgo

### **Tallas**
- Talla Camisa
- Talla Pantalón
- Talla Zapato

### **Salud**
- Necesidad Enfermo

### **Celebraciones**
- Motivo Celebrar
- Día Celebrar
- Mes Celebrar

### **Destrezas (Array)**
- Destrezas (badges múltiples)

---

## 🔧 Ejemplo de Respuesta API

```json
{
  "total": 1,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id_personas": "40",
      "nombre_completo": "Carlos Andrés Rodríguez García",
      "documento": "12345678",
      "tipo_identificacion": "Cédula de Ciudadanía",
      "edad": "40",
      "fecha_nacimiento": "1985-03-14",
      "sexo": "Masculino",
      "telefono": "32066666666",
      "correo_electronico": "carlos@temp.com",
      "direccion_personal": "Carrera 45 # 23-67",
      "municipio": "Abejorral",
      "parroquia": "Parroquia San José",
      "sector": "Sector Centro",
      "vereda": "Vereda Central Abejorral",
      "direccion_familia": "Carrera 45 # 23-67",
      "apellido_familiar": "Rodríguez García",
      "parentesco": "Abuelo",
      "telefono_familia": "3001234567",
      "fecha_registro": "2025-08-25",
      "tipo_vivienda": "Casa",
      "pozo_septico": true,
      "letrina": true,
      "campo_abierto": false,
      "basura_recolector": true,
      "basura_quemada": false,
      "basura_enterrada": false,
      "basura_recicla": true,
      "basura_aire_libre": false,
      "estado_civil": "Soltero(a)",
      "profesion": "Ingeniero",
      "estudios": "Universitario",
      "comunidad_cultural": "Afrodescendiente",
      "liderazgo": "Líder comunitario del sector",
      "talla_camisa": "L",
      "talla_pantalon": "32",
      "talla_zapato": "42",
      "necesidad_enfermo": "Diabetes",
      "motivo_celebrar": "Cumpleaños",
      "dia_celebrar": 15,
      "mes_celebrar": 3,
      "destrezas": ["Carpintería", "Electricidad"]
    }
  ]
}
```

---

## 🚀 Cómo Usar

### Opción 1: Como página independiente
```tsx
// En src/App.tsx o tu router
import PersonasReport from "@/pages/PersonasReport";

<Route path="/reportes/personas" element={<PersonasReport />} />
```

### Opción 2: Integrar en Reports.tsx existente
```tsx
// En src/pages/Reports.tsx
import PersonasReport from "@/pages/PersonasReport";

// Agregar tab en TabsList
<TabsTrigger value="personas">
  <Users className="h-4 w-4" />
  Personas
</TabsTrigger>

// Agregar TabsContent
<TabsContent value="personas">
  <PersonasReport />
</TabsContent>
```

### Opción 3: Usar solo el componente PersonasTable
```tsx
import PersonasTable from "@/components/personas/PersonasTable";
import { useState } from "react";
import { apiClient } from "@/interceptors/axios";

const MyCustomReport = () => {
  const [personas, setPersonas] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/api/personas/consolidado/geografico');
      setPersonas(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Consultar</button>
      <PersonasTable 
        personas={personas} 
        isLoading={isLoading}
        total={total}
      />
    </div>
  );
};
```

---

## ✨ Características Destacadas

### 1. **Tabla Horizontal Scrollable**
- Primera columna (nombre completo) es sticky para mantener referencia
- Desplazamiento horizontal suave para ver todos los campos
- Min-width configurable por columna para legibilidad

### 2. **Formateadores Inteligentes**
```typescript
// Booleanos
formatBoolean(true)  → Badge verde "✓ Sí"
formatBoolean(false) → Badge gris "✗ No"
formatBoolean(null)  → "-"

// Fechas
formatDate("1985-03-14") → "14 de marzo de 1985"

// Arrays
formatArray(["Carpintería", "Electricidad"]) → 2 badges

// Valores nulos
formatValue(null) → "-"
formatValue("") → "-"
formatValue("Texto") → "Texto"
```

### 3. **Estados Visuales**
- **Loading**: Spinner centrado con mensaje "Cargando datos de personas..."
- **Empty**: Ícono de usuarios con mensaje "No se encontraron registros..."
- **Success**: Tabla completa con indicador "X de Y resultados"

### 4. **Exportación a Excel**
- Cada tab puede exportar sus resultados filtrados
- Nombre de archivo automático: `personas-{tab}-{fecha}.xlsx`
- Descarga directa del blob desde la API
- Toast notifications para feedback

---

## 📊 Endpoints API Soportados

1. `/api/personas/consolidado/geografico`
2. `/api/personas/consolidado/familia`
3. `/api/personas/consolidado/personal`
4. `/api/personas/consolidado/tallas`
5. `/api/personas/consolidado/edad`
6. `/api/personas/consolidado/reporte`

Todos retornan el mismo formato `PersonasResponse` con 40+ campos.

---

## 🎨 Mejoras Futuras (Opcional)

- [ ] Agregar paginación en la tabla (actualmente muestra todos los resultados de la API)
- [ ] Permitir ordenar columnas (sort by column)
- [ ] Agregar búsqueda/filtro local en la tabla
- [ ] Permitir ocultar/mostrar columnas según necesidad del usuario
- [ ] Exportar a PDF además de Excel
- [ ] Agregar gráficas estadísticas por tab

---

## 📝 Notas Técnicas

### Manejo del campo `liderazgo`
El campo `liderazgo` en la API es booleano, pero en el UI se maneja como string para permitir el estado "Todos":
- `'all'` → No se envía filtro a la API (muestra todos)
- `'true'` → Se convierte a `true` booleano
- `'false'` → Se convierte a `false` booleano

### Limpieza de parámetros
Antes de enviar a la API, se eliminan parámetros:
- `undefined`
- `''` (string vacío)
- `'all'` (valor especial del UI)

### Integración con useConfigurationData
Se usan los hooks centralizados para autocompletados:
- `municipioOptions`, `parroquiaOptions`, `sectorOptions`, `veredaOptions`
- `estadoCivilOptions`, `profesionesOptions`, `estudiosOptions`
- `comunidadesCulturalesOptions`, `tipoViviendaOptions`, `parentescosOptions`

---

## ✅ Estado Actual

- ✅ Componente PersonasTable creado y funcional
- ✅ PersonasReport con 6 tabs implementado
- ✅ Tipos TypeScript actualizados con todos los campos
- ✅ 0 errores de compilación
- ✅ Integración completa con API
- ✅ Exportación a Excel funcionando
- ✅ Filtros inteligentes con autocompletado
- ✅ Consultas automáticas al cambiar de tab

**Listo para usar en producción** 🚀
