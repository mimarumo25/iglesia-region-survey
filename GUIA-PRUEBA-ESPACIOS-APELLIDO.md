# 🧪 Guía de Prueba: Espacios en Apellido Familiar

## 📋 Objetivo

Verificar que el campo **Apellido Familiar** permite agregar espacios entre caracteres correctamente.

## 🔄 Pasos de Prueba

### 1️⃣ Acceder al Formulario de Encuesta

1. Abre la aplicación
2. Navega a **"Nueva Encuesta"** o **"Crear Encuesta"**
3. Llegas a la **ETAPA 1: Información General**

### 2️⃣ Prueba Básica: Apellido Simple con Espacios

**Objetivo**: Verificar que se preservan espacios internos

**Entrada**:
```
García Rodríguez
```

**Pasos**:
1. Click en el campo "Apellido Familiar"
2. Escribe: `García`
3. **Pausa y verifica**: El texto se ve correcto ✅
4. Escribe: ` ` (espacio)
5. **Pausa y verifica**: El espacio se ve ✅
6. Escribe: `Rodríguez`
7. **Pausa y verifica**: Todo junto "García Rodríguez" ✅
8. Click fuera del campo (onBlur)
9. **Verifica**: El valor final es "García Rodríguez" ✅

**Resultado esperado**: ✅ "García Rodríguez"

---

### 3️⃣ Prueba de Espacios Extremos

**Objetivo**: Verificar trimming en onBlur

**Entrada**:
```
  García Rodríguez  
```
(con espacios al inicio y final)

**Pasos**:
1. Click en el campo "Apellido Familiar"
2. Escribe: `  García Rodríguez  ` (2 espacios inicio, 2 fin)
3. **Pausa y verifica**: Se ve exactamente como escribiste ✅
4. Click fuera del campo (onBlur)
5. **Verifica**: Se convierte a "García Rodríguez" (trimado) ✅

**Resultado esperado**: ✅ "García Rodríguez" (sin espacios extremos)

---

### 4️⃣ Prueba de Múltiples Palabras

**Objetivo**: Verificar que funciona con nombres compuestos

**Entrada**:
```
García López Rodríguez Martínez
```

**Pasos**:
1. Escribe el nombre completo
2. **Verifica mientras escribes**: Cada palabra se separa con espacios ✅
3. Click fuera del campo
4. **Verifica**: Se mantienen todos los espacios internos ✅

**Resultado esperado**: ✅ "García López Rodríguez Martínez"

---

### 5️⃣ Prueba de Espacios Dobles (Edge Case)

**Objetivo**: Verificar que se preservan espacios múltiples internos

**Entrada**:
```
García  Rodríguez
```
(con 2 espacios entre palabras)

**Pasos**:
1. Escribe: `García  Rodríguez` (dos espacios)
2. **Verifica mientras escribes**: Se ven los dos espacios ✅
3. Click fuera del campo
4. **Verifica**: Se mantienen los dos espacios ✅

**Resultado esperado**: ✅ "García  Rodríguez" (con 2 espacios)

**Nota**: Este es el comportamiento esperado. Si quieres normalizar espacios múltiples, eso sería una validación adicional.

---

## ✅ Checklist de Validación

- [ ] Test 1: "García Rodríguez" - Funciona con espacios normales
- [ ] Test 2: "  García Rodríguez  " - Se trimean espacios extremos
- [ ] Test 3: "García López Rodríguez Martínez" - Funciona con múltiples palabras
- [ ] Test 4: "García  Rodríguez" - Se preservan espacios múltiples
- [ ] Test 5: El formulario se puede enviar con estos valores
- [ ] Test 6: Los datos se guardan correctamente en la encuesta

---

## 🔧 Otros Campos de Tipo Text Afectados

También puedes verificar que estos campos funcionan igual:

| Campo | Ubicación | Prueba Recomendada |
|-------|-----------|-------------------|
| Dirección | Etapa 1 | Escribe "Calle 10 #45-67 Apto 201" |
| Teléfono | Etapa 1 | Escribe "300 123 4567" |
| Contrato EPM | Etapa 1 | Escribe "123 456 789" |

---

## 📊 Resultado

| Prueba | Estado | Notas |
|--------|--------|-------|
| Test 1 | [ ] | |
| Test 2 | [ ] | |
| Test 3 | [ ] | |
| Test 4 | [ ] | |
| Test 5 | [ ] | |
| Test 6 | [ ] | |

---

## 🚨 Si Algo No Funciona

Si encuentras que los espacios **siguen sin funcionar**:

1. **Limpia el caché del navegador**: Presiona `Ctrl+Shift+R`
2. **Recarga la página**: `F5`
3. **Verifica la consola**: Presiona `F12` y mira si hay errores
4. **Revisa que sea el archivo modificado**: Busca `SOLUCION-ESPACIOS-APELLIDO-FAMILIAR.md`

---

## 💡 Información Técnica

**Archivo modificado**: `src/components/survey/StandardFormField.tsx`

**Cambio realizado**:
- Removió `trimString()` del evento `onChange` 
- Mantiene `trimString()` en el evento `onBlur`

**Beneficio**:
- Los espacios se preservan mientras se escribe
- Los espacios extremos se eliminan cuando sales del campo
- UX más predecible

---

**Fecha de Prueba**: _______________  
**Tester**: _______________________  
**Estado Final**: [ ] Pasado [ ] Fallido

