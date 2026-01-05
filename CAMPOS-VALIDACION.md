# 📋 Auditoría de Campos - Sistema MIA

## ✅ Campos Corregidos en la Edición de Encuestas

### 🔧 Problema Identificado
Al editar una encuesta, los siguientes campos se estaban perdiendo:
- ❌ **Número Contrato EPM** - Se seteaba siempre como vacío
- ❌ **Sustento de la Familia** - Se seteaba siempre como vacío
- ⚠️ **Centro Poblado** - Validación mejorada

### 🔨 Cambios Realizados

#### 1. **Interfaz EncuestaListItem** (`src/services/encuestas.ts`)
```typescript
// ✅ AGREGADO:
numero_contrato_epm?: string; // Número de contrato EPM (opcional)
```

#### 2. **Transformador de Encuesta a Formulario** (`src/utils/encuestaToFormTransformer.ts`)

**Etapa 1 - Información General:**
```typescript
// ✅ ANTES: numero_contrato_epm: '', // No disponible
// ✅ AHORA: numero_contrato_epm: encuesta.numero_contrato_epm || '',

// ✅ ANTES: Sin validación de centro_poblado
// ✅ AHORA: Agregado en console.warn de campos no disponibles
```

**Etapa 6 - Observaciones:**
```typescript
// ✅ ANTES: sustento_familia: '',
// ✅ AHORA: sustento_familia: encuesta.observaciones?.sustento_familia || '',

// ✅ ANTES: observaciones_encuestador: encuesta.metadatos?.estado || '',
// ✅ AHORA: observaciones_encuestador: encuesta.observaciones?.observaciones_encuestador || encuesta.metadatos?.estado || '',

// ✅ ANTES: autorizacion_datos: true, // Asumido
// ✅ AHORA: autorizacion_datos: encuesta.observaciones?.autorizacion_datos !== undefined ? encuesta.observaciones.autorizacion_datos : true,
```

---

## 📊 Matriz Completa de Campos por Etapa

### **ETAPA 1: Información General**
| Campo | Tipo | Fuente | Estado |
|-------|------|--------|--------|
| `municipio` | autocomplete | `encuesta.municipio.id` | ✅ Cargado |
| `parroquia` | autocomplete | `encuesta.parroquia.id` | ✅ Cargado |
| `fecha` | date | `encuesta.fecha_ultima_encuesta` | ✅ Cargado |
| `apellido_familiar` | text | `encuesta.apellido_familiar` | ✅ Cargado |
| `corregimiento` | autocomplete | `encuesta.corregimiento.id` | ✅ Cargado |
| `centro_poblado` | autocomplete | `encuesta.centro_poblado.id` | ✅ Cargado |
| `vereda` | autocomplete | `encuesta.vereda.id` | ✅ Cargado |
| `sector` | autocomplete | `encuesta.sector.id` | ✅ Cargado |
| `direccion` | text | `encuesta.direccion_familia` | ✅ Cargado |
| `telefono` | text | `encuesta.telefono` | ✅ Cargado |
| `numero_contrato_epm` | text | `encuesta.numero_contrato_epm` | ✅ **CORREGIDO** |

### **ETAPA 2: Vivienda y Basuras**
| Campo | Tipo | Fuente | Estado |
|-------|------|--------|--------|
| `tipo_vivienda` | autocomplete | `encuesta.tipo_vivienda.id` | ✅ Cargado |
| `disposicion_basura` | multiple-checkbox | `encuesta.basuras[]` (transformado a IDs) | ✅ Cargado |

### **ETAPA 3: Servicios de Agua**
| Campo | Tipo | Fuente | Estado |
|-------|------|--------|--------|
| `sistema_acueducto` | autocomplete | `encuesta.acueducto.id` (primer elemento si es array) | ✅ Cargado |
| `aguas_residuales` | multiple-checkbox | `encuesta.aguas_residuales[]` (transformado a IDs) | ✅ Cargado |

### **ETAPA 4: Miembros de Familia (FamilyGrid)**
| Campo | Tipo | Fuente | Estado |
|-------|------|--------|--------|
| `nombres` | text | `persona.nombre_completo` | ✅ Cargado |
| `tipoIdentificacion` | ConfigItem | `persona.identificacion.tipo` | ✅ Cargado |
| `numeroIdentificacion` | text | `persona.identificacion.numero` | ✅ Cargado |
| `fechaNacimiento` | date | `persona.fecha_nacimiento` | ✅ Cargado |
| `sexo` | ConfigItem | `persona.sexo` | ✅ Cargado |
| `situacionCivil` | ConfigItem | `persona.estado_civil` | ✅ Cargado |
| `parentesco` | ConfigItem | `persona.parentesco` | ✅ Cargado |
| `talla_camisa` | text | `persona.tallas.camisa` | ✅ Cargado |
| `talla_pantalon` | text | `persona.tallas.pantalon` | ✅ Cargado |
| `talla_zapato` | text | `persona.tallas.zapato` | ✅ Cargado |
| `estudio` | ConfigItem | `persona.estudios` | ✅ Cargado |
| `comunidadCultural` | ConfigItem | `persona.comunidad_cultural` | ✅ Cargado |
| `telefono` | text | `persona.telefono` | ✅ Cargado |
| `correoElectronico` | email | `persona.email` | ✅ Cargado |
| `enfermedades` | array | `persona.enfermedades[]` | ✅ Cargado |
| `enQueEresLider` | array | `persona.en_que_eres_lider` | ✅ Cargado |
| `necesidadesEnfermo` | array | `persona.necesidad_enfermo` | ✅ Cargado |
| `profesion` | ConfigItem | `persona.profesion` | ✅ Cargado |
| `celebraciones` | array | `persona.celebraciones[]` | ✅ Cargado |
| `habilidades` | array | `persona.habilidades[]` | ✅ Cargado |
| `destrezas` | array | `persona.destrezas[]` | ✅ Cargado |

### **ETAPA 5: Miembros Difuntos (DeceasedGrid)**
| Campo | Tipo | Fuente | Estado |
|-------|------|--------|--------|
| `nombres` | text | `difunto.nombres` | ✅ Cargado |
| `fechaFallecimiento` | date | `difunto.fechaFallecimiento` | ✅ Cargado |
| `sexo` | ConfigItem | `difunto.sexo` | ✅ Cargado |
| `parentesco` | ConfigItem | `difunto.parentesco` | ✅ Cargado |
| `causaFallecimiento` | text | `difunto.causaFallecimiento` | ✅ Cargado |

### **ETAPA 6: Observaciones y Consentimiento**
| Campo | Tipo | Fuente | Estado |
|-------|------|--------|--------|
| `sustento_familia` | textarea | `encuesta.observaciones.sustento_familia` | ✅ **CORREGIDO** |
| `observaciones_encuestador` | textarea | `encuesta.observaciones.observaciones_encuestador` \| `encuesta.metadatos.estado` | ✅ **MEJORADO** |
| `autorizacion_datos` | boolean | `encuesta.observaciones.autorizacion_datos` | ✅ **CORREGIDO** |

---

## 🧪 Cómo Verificar los Cambios

### En el Navegador (DevTools)
1. Abre las Herramientas de Desarrollador (F12)
2. Ve a la pestaña **Consola**
3. Abre una encuesta para editar
4. Busca el log: **`🔄 Transformando encuesta a formulario`**
5. Expande y verifica que los campos se muestren correctamente:
   ```
   📥 Datos de entrada:
   - numero_contrato_epm: "xxxxx" (NO VACÍO) ✅
   - centro_poblado: {...} (CON DATOS) ✅
   
   📤 Resultado de la transformación:
   - numero_contrato_epm: "xxxxx" ✅
   - sustento_familia: "xxxxx" ✅
   - centro_poblado: "x" (ID) ✅
   ```

### En el Formulario
1. **Etapa 1:** Verifica que "Número Contrato EPM" muestre el valor guardado
2. **Etapa 1:** Verifica que "Centro Poblado" muestre el valor guardado
3. **Etapa 6:** Verifica que "Sustento de la Familia" muestre el valor guardado
4. **Etapa 6:** Verifica que "Autorizo..." esté marcado si se autorizó originalmente

---

## 🔍 Diagnóstico Completo

### Campos que SE Estaban Perdiendo (FIXED)
```typescript
// ❌ ANTES
numero_contrato_epm: '', // Siempre vacío
sustento_familia: '', // Siempre vacío
autorizacion_datos: true, // Asumido, no leído de la API

// ✅ AHORA
numero_contrato_epm: encuesta.numero_contrato_epm || '',
sustento_familia: encuesta.observaciones?.sustento_familia || '',
autorizacion_datos: encuesta.observaciones?.autorizacion_datos !== undefined 
  ? encuesta.observaciones.autorizacion_datos 
  : true,
```

### Campos que Funcionaban Correctamente
- ✅ Todos los datos de **Etapa 1** (excepto `numero_contrato_epm`)
- ✅ Todos los datos de **Etapa 2**
- ✅ Todos los datos de **Etapa 3**
- ✅ Todos los datos de **Etapa 4** (Miembros de familia)
- ✅ Todos los datos de **Etapa 5** (Miembros difuntos)
- ✅ `observaciones_encuestador` (parcialmente)

---

## 📝 Recomendaciones

1. **Prueba la edición** de una encuesta existente para verificar:
   - Que `numero_contrato_epm` se cargue correctamente
   - Que `sustento_familia` se cargue correctamente
   - Que `centro_poblado` se cargue correctamente

2. **Verifica la persistencia** al guardar:
   - Los cambios en estos campos deben persistir en la BD
   - El JSON enviado al API debe contener estos campos

3. **Revisa los logs** en consola:
   - Busca advertencias de campos no disponibles
   - Verifica que el resumen final muestre todos los campos

---

## 📌 Notas Técnicas

### Estructura de Datos de la API
La respuesta de `GET /api/encuesta/{id}` tiene:
```typescript
{
  // ... otros campos
  numero_contrato_epm?: string, // ✅ NUEVO
  observaciones: {
    sustento_familia: string,
    observaciones_encuestador: string,
    autorizacion_datos: boolean
  },
  // ... otros campos
}
```

### Transformación Actual
- **Entrada:** `EncuestaListItem` (del endpoint de lista)
- **Salida:** `FormDataFromEncuesta` (formato del formulario)
- **Conversión:** Los campos se normalizan de IDs a objetos ConfigurationItem

---

**Última actualización:** 22/12/2024
**Estado:** ✅ Todos los campos corregidos
