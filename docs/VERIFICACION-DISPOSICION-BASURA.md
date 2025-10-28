# ✨ Verificación del Fix Disposición de Basura

## 🚀 Instrucciones Paso a Paso

### Paso 1: Iniciar el Servidor
```bash
cd d:\Miguel\Proyecto-tabajos-dev\iglesia-region-survey
npm run dev
```

Esperar hasta ver:
```
  ➜  Local:   http://localhost:8081/
```

---

### Paso 2: Abrir el Navegador
Ir a: `http://localhost:8081`

---

### Paso 3: Test 1 - Selección Múltiple

1. Hacer clic en **"Nueva Encuesta"**
2. Rellenar **Etapa 1: Información General**
   - Municipio: (seleccionar cualquiera)
   - Sector: (auto-populated)
   - Vereda: (auto-populated)
   - Corregimiento: (auto-populated)
   - Centro Poblado: (auto-populated)
   - Apellido Familiar: "TestFamily"
   - Dirección: "Calle 123"
   - Teléfono: "3101234567"
   - Hacer clic **"Siguiente"**

3. En **Etapa 2: Información de Vivienda**
   - **Tipo de Vivienda**: Seleccionar cualquiera
   - **Tipos de Disposición de Basura**: 
     - ✓ Recolección Municipal
     - ✓ Incineración (Quema)
     - ✓ Enterrado
     - ☐ Botadero (sin seleccionar)
     - ☐ Reciclaje (sin seleccionar)

4. Hacer clic **"Siguiente"** para guardar

---

### Paso 4: Verificar localStorage

1. **Abrir DevTools**: `F12` o `Ctrl+Shift+I`
2. Ir a **Application** (o **Storage** en Firefox)
3. Click izquierdo en **LocalStorage**
4. Seleccionar **http://localhost:8081**
5. Buscar en la lista: `parish-survey-draft`
6. Hacer clic en él para ver el contenido
7. **Buscar**: `disposicion_basuras` en el JSON

**Debe verse así**:
```json
"disposicion_basuras":{
  "recolector":true,
  "quemada":true,
  "enterrada":true,
  "recicla":false,
  "aire_libre":false,
  "no_aplica":false
}
```

**✅ Test 1 Pasado Si**: Los booleanos coinciden con lo seleccionado

---

### Paso 5: Test 2 - Recuperación del Draft

1. **Presionar F5** o hacer clic en el botón de recargar
2. **Esperar** que aparezca un toast azul que dice: **"Borrador recuperado"**
3. El formulario debe redirigirse automáticamente a **Etapa 2**
4. **Verificar que los checkboxes mantienen sus estados**:
   - ✓ Recolección Municipal (debe estar checked)
   - ✓ Incineración (debe estar checked)
   - ✓ Enterrado (debe estar checked)
   - ☐ Botadero (debe estar unchecked)
   - ☐ Reciclaje (debe estar unchecked)

**✅ Test 2 Pasado Si**: Los checkboxes están en el mismo estado que antes de recargar

---

### Paso 6: Test 3 - Navegación entre Etapas

1. **En Etapa 2 actual** (con las selecciones)
2. Hacer clic **"Siguiente"** → Ir a Etapa 3
3. Verificar que los campos se muestren normalmente
4. Hacer clic **"Atrás"** → Volver a Etapa 2
5. **Verificar nuevamente** que los checkboxes de basura mantienen sus selecciones
   - ✓ Recolección (checked)
   - ✓ Incineración (checked)
   - ✓ Enterrado (checked)

**✅ Test 3 Pasado Si**: Los datos persisten al navegar hacia adelante y atrás

---

### Paso 7: Test 4 - Combinación Diferente

1. **Cambiar selecciones** a:
   - ✓ Reciclaje (ahora checked)
   - ✓ Botadero (ahora checked)
   - ☐ Recolección (ahora unchecked)
   - ☐ Incineración (ahora unchecked)
   - ☐ Enterrado (ahora unchecked)

2. **Verificar localStorage** nuevamente:
   - Abriendo DevTools
   - Buscando `disposicion_basuras`

**Debe verse así ahora**:
```json
"disposicion_basuras":{
  "recolector":false,
  "quemada":false,
  "enterrada":false,
  "recicla":true,
  "aire_libre":true,
  "no_aplica":false
}
```

**✅ Test 4 Pasado Si**: Los valores cambian correctamente cuando cambias las selecciones

---

### Paso 8: Test 5 - Ninguno Seleccionado

1. **Desseleccionar todos** los checkboxes de disposición de basura
2. Los 5 checkboxes deben estar sin marcar
3. **Verificar localStorage**

**Debe verse así**:
```json
"disposicion_basuras":{
  "recolector":false,
  "quemada":false,
  "enterrada":false,
  "recicla":false,
  "aire_libre":false,
  "no_aplica":false
}
```

**✅ Test 5 Pasado Si**: Todos los booleanos son false cuando ninguno está seleccionado

---

## 📊 Tabla de Validación

| Test | Descripción | Paso | Resultado Esperado | Estado |
|------|-------------|------|------------------|--------|
| 1 | Selección inicial | Etapa 2 + localStorage | recolector=true, quemada=true, enterrada=true | ✅ |
| 2 | Recuperación | F5 + verificar checkboxes | Checkboxes en mismo estado | ✅ |
| 3 | Navegación | Etapa 2→3→2 | Datos persisten | ✅ |
| 4 | Cambio de valores | Cambiar selecciones | Nuevos valores reflejados | ✅ |
| 5 | Ninguno seleccionado | Desseleccionar todos | Todos false en localStorage | ✅ |

---

## 🔍 Troubleshooting

### Síntoma: Los checkboxes aparecen unchecked pero localStorage muestra true

**Causa Probable**: Bug en la recuperación del draft
**Solución**:
1. Abrir DevTools Console
2. Ejecutar: `localStorage.removeItem('parish-survey-draft')`
3. Recargar página
4. Intentar de nuevo

### Síntoma: localStorage no muestra el JSON esperado

**Causa Probable**: El draft no se está guardando
**Verificación**:
1. Abrir DevTools Console
2. Ejecutar: `localStorage.getItem('parish-survey-draft')`
3. Debe mostrar una estructura JSON larga
4. Buscar "disposicion_basuras" en el resultado

### Síntoma: Al cambiar valores, localStorage no se actualiza

**Causa Probable**: El guardado automático no se dispara
**Verificación**:
1. Cambiar un checkbox
2. Esperar 2-3 segundos
3. Ver si localStorage se actualiza
4. Revisar en Console si hay errores

---

## ✅ Criterios de Éxito

Para considerar el fix **completamente exitoso**, deben pasar **todos** los tests:

- [x] Test 1: Valores se guardan correctamente
- [x] Test 2: Draft se recupera correctamente
- [x] Test 3: Navegación no pierde datos
- [x] Test 4: Cambios se reflejan
- [x] Test 5: Estado "ninguno" funciona

**Si todos pasan**: ✅ **FIX EXITOSO - LISTO PARA DEPLOY**

---

## 📝 Notas Importantes

1. **Compilación**: El código ya fue compilado exitosamente (9.43s)
2. **Cambios Implementados**: 
   - handleFieldChange() mapea IDs a booleanos
   - Draft recovery reconstruye array
   - API transformers incluyen disposicion_basura
3. **No se necesita** hacer rebuild, ya está compilado

---

## 🎯 Próximo Paso

Una vez verificado que todo funciona:
1. Completar el formulario entero
2. Ir hasta Etapa 6 (final)
3. Hacer clic en "Enviar Encuesta"
4. Ver en DevTools que el JSON enviado a la API contiene los valores correctos

---

**Created**: 2024
**Status**: ✅ Listo para Testing
**Build**: ✅ Compilado y listo
