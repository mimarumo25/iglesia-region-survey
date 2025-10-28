# 🧪 GUÍA DE TESTING - Funcionalidades Implementadas

## 📋 Pre-requisitos
- ✅ Servidor Vite iniciado (`npm run dev`)
- ✅ Build completado sin errores
- ✅ Base de datos / API accesibles

---

## TEST 1: String Trimming en Campos de Texto

### Objetivo
Verificar que espacios al inicio y final de strings se eliminan automáticamente.

### Pasos

#### 1.1 - Test en Campo de Texto Estándar
1. Abre http://localhost:8081 en el navegador
2. Navega a un formulario con campos de texto (ej: Dirección)
3. En el campo "Dirección", escribe: `  Calle Principal 123  ` (con espacios antes y después)
4. Presiona Tab o Click en otro campo (trigger onBlur)
5. **Resultado esperado**: El valor se trimea automáticamente

#### 1.2 - Test en Textarea
1. Busca un campo textarea (ej: Observaciones o descripción)
2. Escribe: `  Esto es una observación  `
3. Presiona Tab o Click afuera
4. **Resultado esperado**: Los espacios se eliminan

#### 1.3 - Test en Autocomplete con Búsqueda
1. Abre el campo "Municipio" (autocomplete)
2. En la caja de búsqueda, escribe: `  ant  ` (con espacios)
3. **Resultado esperado**: 
   - Debería encontrar "Antioquia" o municipios que contengan "ant"
   - Sin los espacios, la búsqueda funciona correctamente
   - Compara con buscar sin espacios: `ant`

#### 1.4 - Test en Autocomplete Selección
1. Busca un municipio (ej: "Medellín")
2. Selecciona del dropdown
3. **Resultado esperado**: El valor seleccionado no tiene espacios antes/después

#### 1.5 - Test en FamilyGrid (Agregar Persona)
1. Ve a la etapa "Familia" (FamilyGrid)
2. Abre dialog para agregar nuevo miembro
3. En "Nombres y Apellidos", escribe: `  Juan Pérez  `
4. En "Número de Identificación", escribe: `  123456789  `
5. Guarda el miembro
6. **Resultado esperado**: 
   - Los valores se guardan sin espacios al inicio/final
   - En la tabla aparecen trimados

---

## TEST 2: Campo Sector Opcional

### Objetivo
Verificar que el campo Sector es opcional (no tiene asterisco *).

### Pasos

#### 2.1 - Verificar que NO es obligatorio
1. Abre el formulario en la etapa "Información General"
2. Observa los labels de los campos
3. **Resultado esperado**:
   - Municipio tiene asterisco (*) - REQUERIDO
   - Parroquia tiene asterisco (*) - REQUERIDO
   - Sector **NO tiene asterisco** - OPCIONAL ✅

#### 2.2 - Enviar formulario sin Sector
1. Completa todos los campos requeridos (Municipio, Parroquia, Fecha, etc.)
2. **NO selecciones Sector** (dejar en blanco)
3. Intenta avanzar a la siguiente etapa
4. **Resultado esperado**: El formulario acepta el envío sin Sector

#### 2.3 - Comparación visual
1. Contrasta "Sector" con "Municipio" o "Parroquia"
2. **Resultado esperado**: Solo los campos con * son requeridos

---

## TEST 3: Parroquia Dependiente del Municipio

### Objetivo
Verificar que Parroquias se cargan dinámicamente según el Municipio seleccionado.

### Pasos

#### 3.1 - Estado Inicial (Sin Municipio)
1. Abre el formulario en la etapa "Información General"
2. Observa el campo "Parroquia"
3. **Resultado esperado**:
   - Campo Parroquia está vacío
   - Desplegable no muestra opciones
   - Puede estar deshabilitado visualmente (opcional)

#### 3.2 - Seleccionar Municipio (Primera vez)
1. Click en el campo "Municipio"
2. Selecciona un municipio (ej: "Medellín")
3. **Resultado esperado**:
   - El valor "Medellín" se fija en Municipio
   - Campo Parroquia se habilita
   - Aparece indicador de carga (spinner) en Parroquia

#### 3.3 - Cargar Parroquias (Esperar resultado)
1. Espera ~2-3 segundos a que cargue
2. Observa el campo Parroquia
3. **Resultado esperado**:
   - El spinner desaparece
   - Aparecen las parroquias del municipio seleccionado
   - La lista contiene solo parroquias del municipio elegido
   - Ejemplo: Si seleccionas "Medellín", verías: "Robledo", "Arví", "San Alejo", etc.

#### 3.4 - Seleccionar Parroquia
1. Click en el campo Parroquia
2. Selecciona una parroquia de la lista
3. **Resultado esperado**:
   - La parroquia se fija correctamente
   - El formulario continúa funcionando normalmente

#### 3.5 - Cambiar de Municipio (Recargar Parroquias)
1. Click nuevamente en Municipio
2. Selecciona un DIFERENTE municipio (ej: "Bello" en lugar de "Medellín")
3. **Resultado esperado**:
   - La parroquia anterior se limpia automáticamente
   - Campo Parroquia muestra spinner de carga nuevamente
   - Nuevas parroquias (del nuevo municipio) se cargan
   - Las opciones son diferentes a las anteriores

#### 3.6 - Limpiar Municipio
1. En el campo Municipio, usa la opción de limpiar (si existe un botón X)
2. O selecciona Municipio y bórra el texto
3. **Resultado esperado**:
   - Municipio se vacía
   - Parroquia se limpia automáticamente
   - Campo Parroquia se deshabilita de nuevo (sin opciones)

#### 3.7 - API Endpoint Verification (Dev Console)
1. Abre Developer Tools (F12)
2. Ve a la pestaña "Network"
3. Limpia los logs de red
4. Selecciona un Municipio en el formulario
5. **Resultado esperado**:
   - Ver request GET a: `/api/catalog/parroquias/municipio/{id}`
   - Status: 200 OK
   - Response contiene array de parroquias
   - Ejemplo: `{"data": [{"id": 1, "nombre": "Parroquia 1"}, ...]}`

---

## TEST 4: Integración de Todos los Cambios

### Objetivo
Verificar que los 3 cambios funcionan juntos sin conflictos.

### Pasos

#### 4.1 - Flujo Completo
1. Abre formulario en etapa "Información General"
2. Rellena "Dirección" con: `  Calle con espacios  ` (trimming)
3. Selecciona Municipio (parroquia se carga dinámicamente)
4. Espera a que se carguen parroquias
5. Selecciona una Parroquia
6. **NO selecciones Sector** (campo opcional)
7. Rellena otros campos requeridos
8. Avanza a la siguiente etapa
9. **Resultado esperado**:
   - Todo funciona sin errores
   - Los valores trimados se guardan correctamente
   - Parroquias dinámicas se cargaron correctamente
   - Sector fue omitido sin problemas

#### 4.2 - Guardado en LocalStorage
1. Completa el formulario con datos
2. Recarga la página (F5)
3. **Resultado esperado**:
   - Los datos se cargan desde localStorage
   - Dirección muestra el valor trimado
   - Municipio y Parroquia recuperan sus valores
   - Sector permanece vacío (si no lo llenaste)

#### 4.3 - Envío de Formulario
1. Completa todo el formulario correctamente
2. Envía el formulario
3. **Resultado esperado**:
   - Los datos trimados se envían a la API
   - No hay duplicados o espacios extras en la base de datos
   - Confirmación de envío exitoso

---

## 🐛 Troubleshooting

### Problema: Parroquia no se carga
**Solución**:
- Verifica que el Municipio esté correctamente seleccionado
- Abre Dev Tools → Network y busca el request a `/api/catalog/parroquias/municipio/`
- Verifica que la API esté respondiendo (Status 200)
- Revisa la consola para errores

### Problema: Trimming no funciona
**Solución**:
- Verifica que `stringTrimHelpers.ts` existe
- Comprueba que los imports están en los componentes (busca `trimString`)
- Abre consola y prueba: `"  test  ".trim()` debería retornar `"test"`

### Problema: Sector sigue siendo requerido
**Solución**:
- Verifica línea 47 de SurveyForm.tsx: debe tener `required: false`
- Limpia caché del navegador (Ctrl+Shift+Delete)
- Recarga la página (Ctrl+F5 hard refresh)

### Problema: Formulario no se envía
**Solución**:
- Verifica que completaste todos los campos **requeridos** (con *)
- Abre Dev Tools → Console para ver si hay errores
- Prueba sin cambios: envía formulario original primero
- Luego revisa qué cambio causó el problema

---

## ✅ Criterios de Aceptación

| Funcionalidad | Test | Status |
|---|---|---|
| String Trimming - Inputs | 1.1 | ✅ Pasa si espacios se eliminan |
| String Trimming - Textareas | 1.2 | ✅ Pasa si espacios se eliminan |
| String Trimming - Búsqueda Autocomplete | 1.3 | ✅ Pasa si encuentra con espacios |
| String Trimming - Selección Autocomplete | 1.4 | ✅ Pasa si valor se trimea |
| String Trimming - FamilyGrid | 1.5 | ✅ Pasa si tabla muestra datos trimados |
| Sector Optional - Sin asterisco | 2.1 | ✅ Pasa si no aparece * |
| Sector Optional - Envío sin valor | 2.2 | ✅ Pasa si acepta envío vacío |
| Parroquia Dependiente - Sin municipio | 3.1 | ✅ Pasa si está vacío al inicio |
| Parroquia Dependiente - Carga | 3.2-3.3 | ✅ Pasa si muestra opciones tras municipio |
| Parroquia Dependiente - Cambio | 3.5 | ✅ Pasa si reloading funciona |
| Parroquia Dependiente - Limpieza | 3.6 | ✅ Pasa si se vacía al limpiar municipio |
| Parroquia Dependiente - API | 3.7 | ✅ Pasa si request es correcto |
| Integración Completa | 4.1-4.3 | ✅ Pasa si todo funciona junto |

---

## 📊 Resultados

Después de completar todos los tests, completa esta tabla:

| Test | Resultado | Notas |
|---|---|---|
| 1.1 - Text Trimming | ✅ PASS / ❌ FAIL | |
| 1.2 - Textarea Trimming | ✅ PASS / ❌ FAIL | |
| 1.3 - Autocomplete Search | ✅ PASS / ❌ FAIL | |
| 1.4 - Autocomplete Select | ✅ PASS / ❌ FAIL | |
| 1.5 - FamilyGrid Trimming | ✅ PASS / ❌ FAIL | |
| 2.1 - Sector No Asterisk | ✅ PASS / ❌ FAIL | |
| 2.2 - Sector Optional Submit | ✅ PASS / ❌ FAIL | |
| 3.1 - Parroquia Initial | ✅ PASS / ❌ FAIL | |
| 3.2-3.3 - Parroquia Loading | ✅ PASS / ❌ FAIL | |
| 3.5 - Parroquia Change | ✅ PASS / ❌ FAIL | |
| 3.6 - Parroquia Clear | ✅ PASS / ❌ FAIL | |
| 3.7 - Parroquia API | ✅ PASS / ❌ FAIL | |
| 4.1-4.3 - Full Integration | ✅ PASS / ❌ FAIL | |

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0
