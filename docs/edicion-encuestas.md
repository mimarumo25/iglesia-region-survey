# 📝 Funcionalidad de Edición de Encuestas

## 🎯 Descripción General

El sistema ahora permite **editar encuestas existentes** cargando los datos previamente guardados en el servidor y permitiendo su modificación completa. Esta funcionalidad está completamente integrada con el flujo de creación de encuestas, reutilizando el mismo formulario multi-etapa.

## ✨ Características Principales

### 1. **Carga Automática de Datos**
- Al acceder a `/surveys/:id/edit`, el sistema carga automáticamente los datos de la encuesta
- Transforma la estructura de la API al formato del formulario
- Muestra skeleton loading durante la carga
- Validación de datos antes de cargar al formulario

### 2. **Indicadores Visuales**
- **Badge prominente**: "📝 Modo Edición" en color ámbar
- **ID de encuesta visible**: Muestra el ID en formato monoespaciado
- **Botón "Cancelar Edición"**: Con confirmación de pérdida de cambios
- **Botón de submit actualizado**: Muestra "Guardar Cambios" en lugar de "Enviar al Servidor"

### 3. **Transformación de Datos**
- Maneja dos estructuras de API diferentes:
  - `EncuestaListItem`: Del listado (con objetos anidados completos)
  - `EncuestaCompleta`: Del endpoint individual (solo IDs)
- Convierte datos de API a formato del formulario
- Preserva relaciones (municipio, parroquia, sector, etc.)
- Mapea miembros de familia con todos sus datos
- Carga difuntos de la familia

### 4. **Validación Flexible**
- No requiere campos opcionales en modo edición
- Valida campos críticos: `apellido_familiar`, `direccion`
- Requiere al menos un miembro de familia

## 🔧 Arquitectura Técnica

### Componentes Modificados

#### **1. SurveyForm.tsx**
```typescript
// Detecta modo edición desde URL params
const { id: surveyId } = useParams<{ id: string }>();
const [isEditMode, setIsEditMode] = useState(false);
const [isLoadingEncuesta, setIsLoadingEncuesta] = useState(false);

// Carga encuesta en useEffect
useEffect(() => {
  const loadEncuestaForEdit = async () => {
    if (!surveyId) return;
    
    setIsEditMode(true);
    setIsLoadingEncuesta(true);
    
    const response = await encuestasService.getEncuestaById(surveyId);
    const transformedData = transformEncuestaToFormData(response.data);
    
    setFormData(transformedData.formData);
    setFamilyMembers(transformedData.familyMembers);
    setDeceasedMembers(transformedData.deceasedMembers);
  };
  
  loadEncuestaForEdit();
}, [surveyId]);
```

#### **2. SurveyControls.tsx**
- Nueva prop `isEditMode?: boolean`
- Botón de submit dinámico:
  - Modo creación: "Enviar al Servidor" con icono `Send`
  - Modo edición: "Guardar Cambios" con icono `Save`
- Texto de loading dinámico:
  - Modo creación: "Enviando al servidor..."
  - Modo edición: "Actualizando..."

### Utilidades Nuevas

#### **encuestaToFormTransformer.ts**
Ubicación: `src/utils/encuestaToFormTransformer.ts`

**Funciones principales:**
- `transformEncuestaToFormData()`: Función principal que detecta tipo de encuesta
- `transformEncuestaListItemToFormData()`: Transforma datos del listado
- `transformEncuestaCompletaToFormData()`: Transforma datos del endpoint individual
- `validateTransformedData()`: Valida datos transformados

**Interfaz de retorno:**
```typescript
interface FormDataFromEncuesta {
  formData: Record<string, any>;
  familyMembers: FamilyMember[];
  deceasedMembers: DeceasedFamilyMember[];
}
```

## 📋 Flujo de Usuario

### Modo Edición

1. **Usuario hace clic en "Editar" desde el listado de encuestas**
   - Navega a `/surveys/:id/edit`

2. **Sistema carga datos de la encuesta**
   - Muestra skeleton loading
   - Realiza petición GET a `/api/encuesta/:id`
   - Transforma datos de API a formato de formulario

3. **Usuario ve formulario pre-poblado**
   - Badge "📝 Modo Edición" visible
   - Todos los campos con datos cargados
   - Tabla de familia con miembros existentes
   - Tabla de difuntos (si hay)

4. **Usuario puede:**
   - Modificar cualquier campo
   - Agregar/editar/eliminar miembros de familia
   - Agregar/editar/eliminar difuntos
   - Navegar entre etapas
   - Cancelar edición (con confirmación)

5. **Al hacer submit:**
   - Botón muestra "Guardar Cambios"
   - Envía PATCH request a `/api/encuesta/:id`
   - Toast de confirmación
   - Redirección al dashboard

### Cancelar Edición

1. **Usuario hace clic en "Cancelar Edición"**
2. **Dialog de confirmación aparece:**
   ```
   ¿Cancelar edición?
   
   Si cancelas la edición:
   - Los cambios realizados se perderán
   - La encuesta mantendrá sus datos originales
   - Serás redirigido al listado de encuestas
   
   ⚠️ Los cambios no guardados se descartarán.
   ```
3. **Usuario confirma:**
   - Toast: "Edición cancelada"
   - Navegación a `/surveys`

## 🗂️ Mapeo de Datos API → Formulario

### Información General
| Campo Formulario | Campo API (EncuestaListItem) | Campo API (EncuestaCompleta) |
|-----------------|------------------------------|------------------------------|
| `municipio` | `municipio.id` | `id_municipio` |
| `parroquia` | `parroquia.id` | N/A (no disponible) |
| `sector` | `sector.id` | `id_sector` |
| `vereda` | `vereda.id` | `id_vereda` |
| `fecha` | `fecha_ultima_encuesta` | `fecha_creacion` |
| `apellido_familiar` | `apellido_familiar` | `apellido_familiar` |
| `direccion` | `direccion_familia` | `direccion` |
| `telefono` | `telefono` | N/A |

### Vivienda
| Campo Formulario | Campo API (EncuestaListItem) | Campo API (EncuestaCompleta) |
|-----------------|------------------------------|------------------------------|
| `tipo_vivienda` | `tipo_vivienda.id` | `vivienda.tipo_vivienda` |
| `basuras_recolector` | `basuras[].nombre` (includes "recolector") | `vivienda.manejo_residuos` (includes) |
| `basuras_quemada` | `basuras[].nombre` (includes "quemada") | `vivienda.manejo_residuos` (includes) |
| `basuras_enterrada` | `basuras[].nombre` (includes "enterrada") | `vivienda.manejo_residuos` (includes) |

### Miembros de Familia
| Campo FamilyMember | Campo API (EncuestaListItem.miembros_familia.personas[]) | Campo API (EncuestaCompleta.miembros_familia[]) |
|-------------------|--------------------------------------------------------|------------------------------------------------|
| `nombres` | `nombre_completo` | `nombres + apellidos` |
| `fechaNacimiento` | `fecha_nacimiento` | `fecha_nacimiento` |
| `tipoIdentificacion` | `identificacion.tipo.{id, nombre}` | `tipo_identificacion` |
| `numeroIdentificacion` | `identificacion.numero` | `numero_identificacion` |
| `sexo` | `sexo.{id, descripcion}` | `sexo` |
| `situacionCivil` | `estado_civil.{id, nombre}` | `estado_civil` |
| `talla_camisa` | `tallas.camisa` | N/A |
| `telefono` | `telefono` | N/A |
| `correoElectronico` | `email` | N/A |

### Difuntos
| Campo DeceasedFamilyMember | Campo API (EncuestaListItem.deceasedMembers[]) |
|---------------------------|------------------------------------------------|
| `nombres` | `nombres` |
| `fechaFallecimiento` | `fechaFallecimiento` |
| `sexo` | `sexo.{id, nombre}` |
| `parentesco` | `parentesco.{id, nombre}` |
| `causaFallecimiento` | `causaFallecimiento` |

## 🧪 Casos de Prueba

### Test 1: Cargar encuesta para editar
```typescript
// Dado: Una encuesta existente con ID "123"
// Cuando: Usuario navega a /surveys/123/edit
// Entonces: 
// - Se muestra skeleton loading
// - Se carga la encuesta
// - Formulario se pre-puebla con datos
// - Badge "Modo Edición" es visible
// - Toast de confirmación: "✅ Encuesta cargada"
```

### Test 2: Cancelar edición
```typescript
// Dado: Usuario está editando encuesta
// Cuando: Hace clic en "Cancelar Edición" y confirma
// Entonces:
// - Dialog de confirmación aparece
// - Al confirmar, redirección a /surveys
// - Toast: "Edición cancelada"
```

### Test 3: Guardar cambios
```typescript
// Dado: Usuario modificó campos de la encuesta
// Cuando: Hace clic en "Guardar Cambios" en la última etapa
// Entonces:
// - Botón muestra "Actualizando..."
// - Se envía PATCH request a /api/encuesta/:id
// - Toast de éxito
// - Redirección a /dashboard
```

### Test 4: Error al cargar encuesta
```typescript
// Dado: ID de encuesta inválido
// Cuando: Usuario navega a /surveys/999999/edit
// Entonces:
// - Error capturado
// - Toast destructive: "Error al cargar encuesta"
// - Redirección automática a /surveys después de 2 segundos
```

### Test 5: Validación de datos transformados
```typescript
// Dado: Respuesta de API sin apellido_familiar
// Cuando: transformEncuestaToFormData procesa los datos
// Entonces:
// - validateTransformedData() retorna false
// - Error lanzado: "Los datos de la encuesta están incompletos"
// - Usuario ve toast de error
```

## 🔄 Diferencias con Modo Creación

| Aspecto | Modo Creación | Modo Edición |
|---------|--------------|--------------|
| **Ruta** | `/survey` | `/surveys/:id/edit` |
| **Datos iniciales** | Vacíos + fecha actual | Pre-poblados desde API |
| **Badge** | No visible | "📝 Modo Edición" |
| **Botón cancelar** | "Limpiar Borrador" | "Cancelar Edición" |
| **Botón submit** | "Enviar al Servidor" | "Guardar Cambios" |
| **Loading** | "Enviando al servidor..." | "Actualizando..." |
| **HTTP Method** | POST `/api/encuesta` | PATCH `/api/encuesta/:id` |
| **Toast éxito** | "Encuesta enviada" | "Encuesta actualizada" |
| **Borrador localStorage** | Se guarda y recupera | No se usa |

## 🚨 Limitaciones Conocidas

### 1. **Campo "Número Contrato EPM" no disponible en API** ⚠️
El campo `numero_contrato_epm` **NO está siendo devuelto por el backend** en las respuestas de encuestas existentes.

**Impacto:**
- Al editar una encuesta, este campo aparecerá vacío aunque haya sido ingresado originalmente
- El usuario deberá volver a ingresar el número de contrato EPM si desea modificarlo o mantenerlo

**Causa:**
- El backend no incluye este campo en las interfaces `EncuestaListItem` ni `EncuestaCompleta`
- El campo solo se envía al crear/actualizar, pero no se retorna en las consultas

**Solución recomendada:**
- **Backend**: Agregar campo `numero_contrato_epm` a la respuesta de `/api/encuesta` y `/api/encuesta/:id`
- **Frontend**: Una vez agregado al backend, actualizar el transformador:
  ```typescript
  numero_contrato_epm: encuesta.numero_contrato_epm || '',
  ```

**Workaround temporal:**
- El sistema muestra advertencia en consola: `"⚠️ Campo numero_contrato_epm no disponible en respuesta de API"`
- El campo queda editable pero vacío
- Al guardar, si el usuario lo deja vacío, el backend debería conservar el valor original

### 2. **Campos no disponibles en EncuestaCompleta**
Al usar el endpoint individual (`GET /api/encuesta/:id`), algunos campos no están disponibles:
- `parroquia` (solo disponible en listado)
- `telefono` (solo disponible en listado)
- Tallas de miembros de familia
- Información de líderes y habilidades

**Solución temporal:** Se usan valores por defecto vacíos. El usuario deberá volver a ingresar estos datos si desea modificarlos.

### 3. **Disposición de basuras**
La estructura de basuras varía entre endpoints:
- **Listado**: Array de objetos `{id, nombre}`
- **Individual**: String `manejo_residuos`

**Solución:** Se parsea el string buscando keywords.

### 4. **Difuntos en EncuestaCompleta**
Solo está disponible en `EncuestaListItem`, por lo que al usar el endpoint individual, la lista de difuntos estará vacía.

**Solución:** Usar endpoint de listado filtrado por ID o agregar difuntos al endpoint individual.

## 🔮 Mejoras Futuras

### Corto Plazo
- [ ] **Endpoint unificado**: Crear `/api/encuesta/:id/full` que devuelva todos los datos necesarios
- [ ] **Diff visual**: Mostrar qué campos fueron modificados antes de guardar
- [ ] **Historial de cambios**: Registrar quién y cuándo modificó la encuesta

### Mediano Plazo
- [ ] **Edición en línea**: Permitir editar campos directamente desde el listado
- [ ] **Auto-guardado**: Guardar cambios automáticamente cada X segundos
- [ ] **Conflictos de edición**: Detectar si otro usuario está editando la misma encuesta

### Largo Plazo
- [ ] **Versioning**: Mantener versiones históricas de la encuesta
- [ ] **Rollback**: Permitir revertir a versiones anteriores
- [ ] **Auditoría completa**: Log detallado de todos los cambios

## 📚 Referencias

- **Componente principal**: `src/components/SurveyForm.tsx`
- **Controles**: `src/components/survey/SurveyControls.tsx`
- **Transformador**: `src/utils/encuestaToFormTransformer.ts`
- **Servicio API**: `src/services/encuestas.ts`
- **Tipos**: `src/types/survey.ts`
- **Servicio de submit**: `src/services/surveySubmission.ts`

## 🎓 Guía para Desarrolladores

### Para agregar nuevos campos editables:

1. **Actualizar transformador** (`encuestaToFormTransformer.ts`):
   ```typescript
   const formData: Record<string, any> = {
     // ... campos existentes
     nuevo_campo: encuesta.nuevo_campo || '',
   };
   ```

2. **Verificar disponibilidad** en ambas estructuras de API

3. **Actualizar documentación** de mapeo de datos

4. **Probar transformación** con datos reales de la API

### Para agregar validaciones específicas de edición:

```typescript
// En SurveyForm.tsx, función handleSubmit
if (isEditMode) {
  // Validaciones específicas para edición
  if (!formData.campo_requerido_en_edicion) {
    toast({ title: "Campo requerido", variant: "destructive" });
    return;
  }
}
```

---

**Fecha de creación**: 10 de octubre de 2025  
**Última actualización**: 10 de octubre de 2025  
**Autor**: Sistema MIA - Gestión Integral de Iglesias
