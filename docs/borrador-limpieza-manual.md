# 🗑️ Funcionalidad de Limpieza Manual de Borrador y Cancelación de Edición

## 📋 Descripción
Se han agregado dos funcionalidades importantes en el formulario de encuestas:

1. **Botón "Limpiar Borrador"**: Permite eliminar manualmente todos los datos guardados en el localStorage durante la creación de una nueva encuesta.
2. **Botón "Cancelar Edición"**: Permite abandonar la edición de una encuesta existente sin guardar cambios y regresar al listado.

## 🎯 Ubicación
- **Componente**: `SurveyForm.tsx`
- **Posición visual**: Debajo del header del formulario
- **Visibilidad condicional**:
  - **Limpiar Borrador**: Solo en modo creación (alineado a la derecha)
  - **Cancelar Edición**: Solo en modo edición (alineado a la izquierda con indicador de ID)

## ✨ Características

### � Botón "Limpiar Borrador" (Modo Creación)

#### �🔒 Seguridad
- **Diálogo de confirmación** con AlertDialog de shadcn/ui
- **Advertencia clara** sobre la irreversibilidad de la acción
- **Detalle de información** que se perderá:
  - Todos los datos ingresados en el formulario
  - Información de familia agregada
  - Información de difuntos agregada
  - El progreso actual de la encuesta

#### 🎨 Diseño
- **Botón destructivo**: Colores rojos para indicar acción peligrosa
- **Icono Trash2**: Icono de papelera de Lucide React
- **Responsive**: Se adapta a dispositivos móviles y desktop
- **Tema oscuro**: Compatible con dark mode

### ❌ Botón "Cancelar Edición" (Modo Edición)

#### 🔒 Seguridad
- **Diálogo de confirmación** para evitar pérdida accidental de cambios
- **Advertencia sobre descarte** de cambios no guardados
- **Información clara** sobre lo que sucederá:
  - Los cambios realizados se perderán
  - La encuesta mantendrá sus datos originales
  - Redirección al listado de encuestas

#### 🎨 Diseño
- **Botón neutral**: Colores grises para indicar acción no destructiva
- **Icono X**: Icono de cerrar para cancelación
- **Indicador de contexto**: Muestra "Editando encuesta #ID" a la derecha
- **Responsive**: Se adapta a dispositivos móviles y desktop
- **Tema oscuro**: Compatible con dark mode

### ⚙️ Funcionalidad Técnica

#### Función `handleClearDraft()` - Limpiar Borrador
```typescript
const handleClearDraft = () => {
  try {
    // 1. Eliminar del localStorage
    localStorage.removeItem('parish-survey-draft');
    
    // 2. Resetear estado del formulario
    setFormData({});
    setFamilyMembers([]);
    setDeceasedMembers([]);
    setCurrentStage(1);
    
    // 3. Restablecer fecha actual
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        fecha: new Date()
      }));
    }, 0);

    // 4. Notificación de éxito
    toast({
      title: "✅ Borrador eliminado",
      description: "El borrador ha sido eliminado completamente...",
      variant: "default"
    });

    // 5. Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    // Manejo de errores
    toast({
      title: "❌ Error",
      description: "No se pudo eliminar el borrador...",
      variant: "destructive"
    });
  }
};
```

#### Función `handleCancelEdit()` - Cancelar Edición
```typescript
const handleCancelEdit = () => {
  toast({
    title: "Edición cancelada",
    description: "Los cambios no guardados se han descartado.",
    variant: "default"
  });
  
  // Redirigir al listado de encuestas
  navigate('/surveys');
};
```

## 🔄 Flujos de Usuario

### Flujo 1: Limpiar Borrador (Modo Creación)

1. **Usuario hace clic** en "Limpiar Borrador"
2. **Se muestra diálogo** de confirmación con advertencias
3. **Usuario confirma** o cancela:
   - **Cancelar**: Cierra el diálogo sin cambios
   - **Confirmar**: Ejecuta `handleClearDraft()`
4. **Limpieza completa**:
   - Borrado del localStorage
   - Reset de todos los estados
   - Notificación toast
   - Scroll al inicio del formulario
5. **Formulario limpio** listo para nueva entrada

### Flujo 2: Cancelar Edición (Modo Edición)

1. **Usuario hace clic** en "Cancelar Edición"
2. **Se muestra diálogo** de confirmación sobre pérdida de cambios
3. **Usuario confirma** o cancela:
   - **Continuar editando**: Cierra el diálogo y permanece en el formulario
   - **Confirmar**: Ejecuta `handleCancelEdit()`
4. **Redirección**:
   - Toast de confirmación
   - Navegación a `/surveys`
5. **Listado de encuestas** sin cambios guardados

## 🚀 Casos de Uso

### Limpiar Borrador

#### Caso 1: Usuario cometió error grave
- Usuario completó varias etapas pero se dio cuenta de que los datos son incorrectos
- Prefiere empezar de nuevo en lugar de corregir campo por campo
- Usa "Limpiar Borrador" para reiniciar completamente

#### Caso 2: Prueba/Testing
- Encuestador está probando el formulario
- Necesita limpiar datos de prueba rápidamente
- Usa "Limpiar Borrador" para resetear

#### Caso 3: Cambio de familia encuestada
- Encuestador empezó encuesta de familia incorrecta
- Necesita cambiar completamente de contexto
- Usa "Limpiar Borrador" para comenzar nueva encuesta

### Cancelar Edición

#### Caso 1: Cambios no deseados
- Usuario realizó modificaciones a una encuesta pero se arrepintió
- No quiere guardar los cambios realizados
- Usa "Cancelar Edición" para descartar y volver al listado

#### Caso 2: Vista/Revisión únicamente
- Usuario entró a modo edición solo para revisar datos
- No realizó cambios o fueron cambios accidentales
- Usa "Cancelar Edición" para salir sin afectar datos originales

#### Caso 3: Edición de encuesta incorrecta
- Usuario abrió la encuesta equivocada para editar
- Necesita regresar y seleccionar la correcta
- Usa "Cancelar Edición" para volver al listado rápidamente

## ⚠️ Consideraciones Importantes

### Restricciones
- **Limpiar Borrador**: Solo visible en modo creación, no afecta datos en servidor
- **Cancelar Edición**: Solo visible en modo edición, no guarda cambios pendientes
- **Acción irreversible (Limpiar)**: No hay forma de recuperar el borrador después de eliminarlo
- **Descarte de cambios (Cancelar)**: Los cambios no guardados se pierden permanentemente

### Mensajes al Usuario

#### Limpiar Borrador
```
Título: "¿Eliminar borrador?"
Advertencia: "⚠️ Esta acción no se puede deshacer. El borrador no podrá ser recuperado."
```

#### Cancelar Edición
```
Título: "¿Cancelar edición?"
Advertencia: "⚠️ Los cambios no guardados se descartarán."
```

## 🎨 Componentes Utilizados

### Componentes Comunes
- **AlertDialog** (shadcn/ui): Diálogo de confirmación modal
- **AlertDialogTrigger**: Botón disparador
- **AlertDialogContent**: Contenido del diálogo
- **AlertDialogHeader**: Encabezado con título
- **AlertDialogDescription**: Descripción detallada
- **AlertDialogFooter**: Botones de acción
- **AlertDialogCancel**: Botón cancelar
- **AlertDialogAction**: Botón confirmar
- **Button** (shadcn/ui): Botón con variant="outline"

### Iconos (Lucide React)
- **Trash2**: Papelera para "Limpiar Borrador"
- **X**: Cruz para "Cancelar Edición"
- **ArrowLeft**: Flecha izquierda para indicar regreso

## 📝 Código Relevante

### Imports
```typescript
import { Trash2, X, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
```

### Renderizado Condicional - Limpiar Borrador
```typescript
{!isEditMode && (
  <div className="mb-6 flex justify-end">
    <AlertDialog>
      {/* Botón y diálogo de limpiar borrador */}
    </AlertDialog>
  </div>
)}
```

### Renderizado Condicional - Cancelar Edición
```typescript
{isEditMode && (
  <div className="mb-6 flex justify-between items-center">
    <AlertDialog>
      {/* Botón de cancelar edición */}
    </AlertDialog>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="font-medium">Editando encuesta #{surveyId}</span>
    </div>
  </div>
)}
```

## 🧪 Testing Manual

### Escenario 1: Limpieza exitosa de borrador
1. Llenar formulario con datos
2. Agregar miembros de familia
3. Hacer clic en "Limpiar Borrador"
4. Confirmar en el diálogo
5. **Verificar**: Formulario completamente limpio, etapa 1, toast de éxito

### Escenario 2: Cancelación de limpieza
1. Llenar formulario con datos
2. Hacer clic en "Limpiar Borrador"
3. Hacer clic en "Cancelar"
4. **Verificar**: Datos intactos, diálogo cerrado

### Escenario 3: Visibilidad en modo edición
1. Navegar a `/surveys/23/edit`
2. **Verificar**: Botón "Limpiar Borrador" NO visible
3. **Verificar**: Botón "Cancelar Edición" SÍ visible

### Escenario 4: Cancelación de edición con confirmación
1. Navegar a `/surveys/23/edit`
2. Modificar algunos campos
3. Hacer clic en "Cancelar Edición"
4. Confirmar en el diálogo
5. **Verificar**: Redirección a `/surveys`, toast de confirmación

### Escenario 5: Continuar editando
1. Navegar a `/surveys/23/edit`
2. Modificar algunos campos
3. Hacer clic en "Cancelar Edición"
4. Hacer clic en "Continuar editando"
5. **Verificar**: Permanece en formulario, cambios intactos

### Escenario 6: Indicador de contexto en edición
1. Navegar a `/surveys/23/edit`
2. **Verificar**: Se muestra "Editando encuesta #23" a la derecha del botón cancelar

## 📚 Referencias
- [shadcn/ui AlertDialog](https://ui.shadcn.com/docs/components/alert-dialog)
- [Lucide React Icons](https://lucide.dev/)
- Patrón de confirmación destructiva en Material Design

---

**Fecha de implementación**: 10 de octubre de 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Implementado y funcional
