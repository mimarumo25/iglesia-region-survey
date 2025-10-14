# 🔧 Correcciones Preventivas Sugeridas

## 📋 Análisis Basado en Código

Después de analizar exhaustivamente el código fuente del formulario de encuesta, se identificaron **posibles puntos de mejora** que pueden implementarse **antes** o **después** de la prueba manual.

---

## 🔴 PRIORIDAD ALTA - Correcciones Críticas

### 1. Manejo de Errores en Portal/Dialog

**Ubicación**: `src/components/survey/FamilyMemberDialog.tsx` (líneas 119-150)

**Problema Detectado**:
```typescript
// Código defensivo sugiere problemas previos con cierre de diálogos
if (error.message?.includes('removeChild') || 
    error.message?.includes('Portal') || 
    error.message?.includes('NotFoundError')) {
  // Recovery complejo con requestAnimationFrame
}
```

**Sugerencia de Corrección**:
```typescript
// Simplificar el manejo de cierre de diálogo
const handleDialogClose = () => {
  // Usar un estado de "isClosing" para evitar múltiples cierres
  if (isClosing.current) return;
  
  isClosing.current = true;
  
  try {
    form.reset();
    onCancel();
  } catch (error) {
    console.error('Error al cerrar diálogo:', error);
  } finally {
    setTimeout(() => {
      isClosing.current = false;
    }, 200);
  }
};
```

**Beneficio**: Evita errores de Portal/DOM y mejora estabilidad

---

### 2. Validación de Datos de Configuración

**Ubicación**: `src/components/SurveyForm.tsx` (líneas 440-470)

**Problema Potencial**: 
- Si `configurationData` falla, los autocompletes quedan vacíos
- Usuario puede quedar bloqueado sin poder completar campos requeridos

**Sugerencia de Corrección**:
```typescript
// Agregar datos de fallback para campos críticos
const FALLBACK_DATA = {
  municipios: [
    { id: '1', nombre: 'Medellín' },
    { id: '2', nombre: 'Bello' },
    // ... más municipios comunes
  ],
  tiposVivienda: [
    { id: '1', nombre: 'Casa' },
    { id: '2', nombre: 'Apartamento' },
    // ... más tipos
  ],
  // ... otros campos críticos
};

// En el componente
const municipioOptions = configurationData.municipios || FALLBACK_DATA.municipios;
```

**Beneficio**: Garantiza que el formulario siempre sea usable

---

### 3. Validación de Fechas Futuras

**Ubicación**: `src/components/ui/enhanced-birth-date-picker.tsx` (posiblemente)

**Problema Potencial**: 
- Puede permitir fechas de nacimiento futuras
- Puede permitir fechas de fallecimiento futuras

**Sugerencia de Corrección**:
```typescript
// En el componente de date picker
const validateDate = (date: Date, type: 'birth' | 'death') => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date > today) {
    return {
      isValid: false,
      error: 'La fecha no puede ser futura'
    };
  }
  
  if (type === 'birth') {
    const maxAge = 150;
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - maxAge);
    
    if (date < minDate) {
      return {
        isValid: false,
        error: `La fecha no puede ser anterior a ${minDate.getFullYear()}`
      };
    }
  }
  
  return { isValid: true };
};
```

**Beneficio**: Evita datos inconsistentes en la base de datos

---

## 🟡 PRIORIDAD MEDIA - Mejoras de UX

### 4. Optimizar Timeout de Cierre de Diálogo

**Ubicación**: `src/components/survey/FamilyGrid.tsx` (línea 70)

**Código Actual**:
```typescript
setTimeout(() => {
  closeDialog();
}, 100);
```

**Sugerencia**:
```typescript
// Eliminar timeout innecesario
closeDialog();

// O reducir a mínimo necesario
setTimeout(() => {
  closeDialog();
}, 0); // Ejecutar en siguiente tick
```

**Beneficio**: Respuesta más rápida al usuario

---

### 5. Mensajes de Error Más Descriptivos

**Ubicación**: Validación de formularios (React Hook Form)

**Sugerencia**:
```typescript
// En lugar de:
{ required: true }

// Usar:
{
  required: {
    value: true,
    message: 'Este campo es obligatorio'
  },
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Por favor ingrese un email válido (ejemplo: usuario@dominio.com)'
  },
  minLength: {
    value: 10,
    message: 'El teléfono debe tener al menos 10 dígitos'
  }
}
```

**Beneficio**: Usuario sabe exactamente qué corregir

---

### 6. Indicador Visual de Guardado Automático

**Ubicación**: `src/components/SurveyForm.tsx`

**Problema**: 
- El guardado automático es silencioso
- Usuario no sabe si sus datos están seguros

**Sugerencia**:
```typescript
// Agregar indicador visual
const [lastSaved, setLastSaved] = useState<Date | null>(null);

useEffect(() => {
  // ... código de guardado existente
  
  setLastSaved(new Date());
  
  // Opcional: Toast discreto
  toast({
    title: "💾 Borrador guardado",
    description: "Tus datos están seguros",
    duration: 2000,
    variant: "default"
  });
}, [currentStage, formData, familyMembers, deceasedMembers]);

// En el UI
{lastSaved && (
  <p className="text-xs text-muted-foreground">
    Guardado automáticamente a las {lastSaved.toLocaleTimeString()}
  </p>
)}
```

**Beneficio**: Mayor confianza del usuario

---

## 🔵 PRIORIDAD BAJA - Optimizaciones

### 7. Lazy Loading de Componentes Pesados

**Ubicación**: `src/components/SurveyForm.tsx`

**Sugerencia**:
```typescript
import { lazy, Suspense } from 'react';

const FamilyGrid = lazy(() => import('./survey/FamilyGrid'));
const DeceasedGrid = lazy(() => import('./survey/DeceasedGrid'));

// En el render
<Suspense fallback={<LoadingSkeleton />}>
  <FamilyGrid 
    familyMembers={familyMembers}
    setFamilyMembers={setFamilyMembers}
  />
</Suspense>
```

**Beneficio**: Carga inicial más rápida

---

### 8. Memoización de Opciones de Configuración

**Ubicación**: Componentes que usan `useConfigurationData`

**Sugerencia**:
```typescript
import { useMemo } from 'react';

const municipioOptions = useMemo(() => 
  configurationData.municipios?.map(m => ({
    value: m.id,
    label: m.nombre
  })) || [],
  [configurationData.municipios]
);
```

**Beneficio**: Menos re-renderizados innecesarios

---

### 9. Debounce en Búsquedas de Autocomplete

**Ubicación**: `src/components/ui/autocomplete-with-loading.tsx` (posiblemente)

**Sugerencia**:
```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (searchTerm: string) => {
    // Lógica de búsqueda
    performSearch(searchTerm);
  },
  300 // Esperar 300ms después de que el usuario deje de escribir
);
```

**Beneficio**: Menos llamadas innecesarias, mejor performance

---

## 📊 Validaciones Adicionales Sugeridas

### 10. Validación de Número de Identificación

**Ubicación**: `FamilyMemberDialog`

**Sugerencia**:
```typescript
const validateIdentificacion = (tipo: string, numero: string) => {
  // Cédula de Ciudadanía (Colombia): 6-10 dígitos
  if (tipo === 'CC' && !/^\d{6,10}$/.test(numero)) {
    return 'La cédula debe tener entre 6 y 10 dígitos';
  }
  
  // Tarjeta de Identidad: 10-11 dígitos
  if (tipo === 'TI' && !/^\d{10,11}$/.test(numero)) {
    return 'La tarjeta de identidad debe tener entre 10 y 11 dígitos';
  }
  
  return true;
};
```

**Beneficio**: Datos más consistentes

---

### 11. Validación de Edad Coherente

**Ubicación**: Validación de fechas de nacimiento

**Sugerencia**:
```typescript
const validateAge = (fechaNacimiento: Date, parentesco: string) => {
  const edad = calcularEdad(fechaNacimiento);
  
  // Jefe de familia debe ser mayor de edad
  if (parentesco === 'Jefe de Familia' && edad < 18) {
    return 'El jefe de familia debe ser mayor de edad';
  }
  
  // Hijos menores de 100 años
  if (parentesco === 'Hijo' && edad > 100) {
    return 'Edad inusual para un hijo, por favor verifique la fecha';
  }
  
  return true;
};
```

**Beneficio**: Detecta errores de captura

---

### 12. Validación de Duplicados

**Ubicación**: `useFamilyGrid`

**Sugerencia**:
```typescript
const checkDuplicateIdentificacion = (numeroId: string, currentMemberId?: string) => {
  const duplicate = familyMembers.find(member => 
    member.numeroIdentificacion === numeroId && 
    member.id !== currentMemberId
  );
  
  if (duplicate) {
    return {
      isDuplicate: true,
      message: `Ya existe un miembro con esta identificación: ${duplicate.nombres}`
    };
  }
  
  return { isDuplicate: false };
};
```

**Beneficio**: Evita duplicados accidentales

---

## 🎨 Mejoras de Accesibilidad

### 13. ARIA Labels y Roles

**Ubicación**: Todos los componentes de formulario

**Sugerencia**:
```typescript
<Input
  {...field}
  aria-label="Nombres y apellidos del miembro familiar"
  aria-required="true"
  aria-invalid={!!errors.nombres}
  aria-describedby={errors.nombres ? "nombres-error" : undefined}
/>

{errors.nombres && (
  <span id="nombres-error" role="alert" className="text-destructive">
    {errors.nombres.message}
  </span>
)}
```

**Beneficio**: Mejor experiencia para usuarios con lectores de pantalla

---

### 14. Focus Management

**Ubicación**: Modales de FamilyMemberDialog

**Sugerencia**:
```typescript
useEffect(() => {
  if (showFamilyDialog) {
    // Enfocar primer campo al abrir modal
    const firstInput = document.querySelector('[name="nombres"]') as HTMLInputElement;
    firstInput?.focus();
  }
}, [showFamilyDialog]);
```

**Beneficio**: Navegación por teclado más eficiente

---

## 📱 Mejoras Responsive

### 15. Optimizar Tabla de Miembros en Móvil

**Ubicación**: `FamilyMemberTable`

**Sugerencia**:
```typescript
// Usar diseño de cards en móvil en lugar de tabla
<div className="hidden md:block">
  {/* Tabla para desktop */}
  <Table>...</Table>
</div>

<div className="md:hidden space-y-4">
  {/* Cards para móvil */}
  {familyMembers.map(member => (
    <Card key={member.id}>
      <CardHeader>
        <CardTitle>{member.nombres}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Datos en formato lista */}
      </CardContent>
    </Card>
  ))}
</div>
```

**Beneficio**: Mejor experiencia en dispositivos móviles

---

## 🔒 Seguridad y Validación

### 16. Sanitización de Inputs

**Ubicación**: Todos los campos de texto

**Sugerencia**:
```typescript
import DOMPurify from 'dompurify';

const sanitizeInput = (value: string) => {
  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

// En el onChange
onChange={(e) => {
  const sanitized = sanitizeInput(e.target.value);
  field.onChange(sanitized);
}}
```

**Beneficio**: Previene XSS y otros ataques

---

### 17. Validación de Tamaño de Datos

**Ubicación**: Antes del envío

**Sugerencia**:
```typescript
const MAX_OBSERVATION_LENGTH = 5000;
const MAX_FAMILY_MEMBERS = 50;

const validateDataSize = (data: SurveySessionData) => {
  if (data.observaciones.sustento_familia.length > MAX_OBSERVATION_LENGTH) {
    return {
      isValid: false,
      error: 'Las observaciones son demasiado largas'
    };
  }
  
  if (data.familyMembers.length > MAX_FAMILY_MEMBERS) {
    return {
      isValid: false,
      error: 'Número máximo de miembros de familia excedido'
    };
  }
  
  return { isValid: true };
};
```

**Beneficio**: Previene problemas con la base de datos

---

## 🎯 Plan de Implementación Sugerido

### Fase 1: Antes de la Prueba (PREVENTIVO)
1. ✅ Implementar correcciones críticas (1-3)
2. ✅ Agregar validaciones de fechas
3. ✅ Mejorar manejo de errores de diálogo

### Fase 2: Después de la Prueba (REACTIVO)
1. ⏳ Implementar correcciones basadas en problemas reales encontrados
2. ⏳ Priorizar según severidad
3. ⏳ Re-ejecutar prueba para validar

### Fase 3: Optimizaciones (MEJORAS)
1. ⏳ Implementar mejoras de UX (4-6)
2. ⏳ Optimizar performance (7-9)
3. ⏳ Mejorar accesibilidad (13-14)

---

## 📝 Conclusión

Este documento proporciona un **conjunto proactivo de mejoras** que pueden:

✅ **Prevenir errores** antes de que ocurran  
✅ **Mejorar la experiencia** del usuario  
✅ **Optimizar el rendimiento** del formulario  
✅ **Aumentar la accesibilidad** de la aplicación  
✅ **Fortalecer la seguridad** de los datos  

**Recomendación**: Implementar al menos las correcciones de **Prioridad Alta** antes de producción.

---

**Documento Creado**: 12 de octubre de 2025  
**Versión**: 1.0  
**Tipo**: Correcciones Preventivas
