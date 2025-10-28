# ✅ Checklist de Validación - Data Protection Modal v2

## 📋 Preparación Pre-Testing

### Backend Ready?
- [ ] API endpoint `/encuesta` acepta `autorizacion_datos: true`
- [ ] Validación backend rechaza `autorizacion_datos: false` o `undefined`
- [ ] Logs de auditoría registran aceptaciones
- [ ] Base de datos tiene campo para `autorizacion_datos`

### Frontend Compilado?
- [ ] `npm run build` exitoso (< 10 segundos)
- [ ] Sin TypeScript errors
- [ ] Bundle sizes dentro de límites
- [ ] Assets generados en `/dist`

### Navegador Ready?
- [ ] Chrome/Firefox/Safari actualizado
- [ ] DevTools abierto (Console tab)
- [ ] Local storage limpio: `localStorage.clear()`
- [ ] Network tab monitoreado (opcional)

---

## 🎯 Test 1: Interfaz de Autorización

### Estado Inicial

**Alcance:** Verificar que campo aparece correctamente en Stage 6

```
Pasos:
1. Ir a localhost:8082 (o URL del servidor)
2. Login con credenciales válidas
3. Click en "Crear Encuesta"
4. Completar Etapas 1-5 (datos aleatorios OK)
5. Llegar a Etapa 6
```

**Verificaciones:**

- [ ] **Visible:** Campo "Autorizo el tratamiento de mis datos personales"
- [ ] **Texto correcto:** "Autorizo el tratamiento de mis datos personales"
- [ ] **Checkbox:** Presente pero DESHABILITADO (gris)
- [ ] **Botón link:** "Ver términos de protección de datos" (azul)
- [ ] **Icono:** FileText icon presente antes del botón
- [ ] **Mensaje:** "Debes leer y aceptar los términos" (ámbar)
- [ ] **Color fondo:** Gradiente azul-índigo (light mode)
- [ ] **Espaciado:** Padding generoso alrededor

**Evidencia Fotográfica:**
```
┌─────────────────────────────────────────────┐
│ □ ☑️ Autorizo el tratamiento de mis datos  │
│     personales                              │
│                                             │
│     📄 Ver términos de protección de datos  │
│                                             │
│     ⚠️ Debes leer y aceptar los términos   │
└─────────────────────────────────────────────┘
```

**Estado Esperado:**
- ❌ Checkbox: No se puede clickear
- ✅ Botón: Clickeable
- ✅ Color ámbar: Indica acción requerida

---

## 🎯 Test 2: Abrir Modal

### Acción: Click en "Ver términos..."

```
Pasos continuos desde Test 1:
6. Click en botón azul "Ver términos de protección de datos"
```

**Verificaciones:**

- [ ] **Modal abierto:** Dialog con animación fade-in
- [ ] **Título:** "Términos y Condiciones - Protección de Datos Personales"
- [ ] **Contenido visible:** Primeras líneas del Responsable del Tratamiento
- [ ] **Ancho:** Responsive (max-w-2xl en desktop, full en mobile)
- [ ] **Alto:** Scrollable (max-h-[90vh])
- [ ] **Checkbox bloqueado:** ☑️ Deshabilitado, no se puede clickear
- [ ] **Alert ámbar:** "Debes leer todo el contenido antes de aceptar"
- [ ] **Botón gris:** "Aceptar y continuar" - DESHABILITADO
- [ ] **Close button:** X en esquina (si isRequired = false)

**Estructura Visual:**

```
┌──────────────────────────────────────────┐
│ Términos y Condiciones...            [X] │
├──────────────────────────────────────────┤
│                                          │
│ 1. RESPONSABLE DEL TRATAMIENTO           │
│ La Iglesia Católica y sus delegados...   │
│                                          │
│ 2. FINALIDAD DEL TRATAMIENTO             │
│ Caracterización poblacional mediante...  │
│                                          │
│ [MORE CONTENT - SCROLLABLE]              │
│                                          │
├──────────────────────────────────────────┤
│ ⚠️ Debes leer todo el contenido...       │
│                                          │
│ ☑️ (DESHABILITADO) Acepto los términos   │
│                                          │
│ [ACEPTAR Y CONTINUAR] (GRIS/DESHABILITADO)
│ [CANCELAR]                               │
└──────────────────────────────────────────┘
```

**Debug Tips:**
```javascript
// En Console (F12)
// Verificar estado del modal
console.log({
  hasScrolledToEnd: "false esperado",
  hasAccepted: "false esperado",
  checkboxDisabled: "true esperado"
});
```

---

## 🎯 Test 3: Scroll Detection

### Acción: Scrollear contenido del modal

```
Pasos continuos desde Test 2:
7. Scrollear manualmente en modal (mouse wheel o drag)
8. Observar cambios en UI
9. Continuar scrolleando hasta el final
```

**Fase 1: Scrolleando (No al final)**

- [ ] **Alert sigue ámbar:** "Debes leer todo..."
- [ ] **Checkbox sigue bloqueado:** No se puede clickear
- [ ] **Botón sigue gris:** "Aceptar..." DESHABILITADO
- [ ] **No hay errores:** Console limpia (F12)

**Fase 2: Llegó al final (< 20px desde bottom)**

- [ ] **Alert cambia a VERDE:** "Términos leídos correctamente" ✅
- [ ] **Icono cambia:** De AlertCircle ⚠️ a CheckCircle2 ✅
- [ ] **Checkbox se HABILITA:** Ahora se puede clickear
- [ ] **Botón se HABILITA:** Cambia a azul/verde, clickeable

**Visual del cambio:**

```
ANTES (Scrolleando):
┌─────────────────────────────┐
│ ⚠️ Debes leer todo...        │
│                             │
│ ☑️ (BLOQUEADO)              │
│ [ACEPTAR...] (GRIS)        │
└─────────────────────────────┘

DESPUÉS (Al final):
┌─────────────────────────────┐
│ ✅ Términos leídos bien      │
│                             │
│ ☑️ (HABILITADO)             │
│ [ACEPTAR Y CONTINUAR] 🟢   │
└─────────────────────────────┘
```

**Test de precisión:**

```javascript
// En Console (F12) mientras scrolleas
setInterval(() => {
  const scrollArea = document.querySelector('[data-scroll-area]');
  if (scrollArea) {
    console.log({
      scrollHeight: scrollArea.scrollHeight,
      scrollTop: scrollArea.scrollTop,
      clientHeight: scrollArea.clientHeight,
      distanceFromBottom: scrollArea.scrollHeight - (scrollArea.scrollTop + scrollArea.clientHeight),
      shouldEnable: (scrollArea.scrollHeight - (scrollArea.scrollTop + scrollArea.clientHeight)) < 20
    });
  }
}, 500);

// Buscar distancia < 20
```

---

## 🎯 Test 4: Marcar Checkbox en Modal

### Acción: Checkbox + Botón Accept

```
Pasos continuos desde Test 3:
10. Marcar checkbox en modal (☐ → ☑️)
11. Observar cambios
```

**Verificaciones:**

- [ ] **Checkbox marcado:** ☑️ (visual change)
- [ ] **Botón activado:** Texto y color cambian a verde/azul
- [ ] **Botón clickeable:** No más `disabled` class
- [ ] **Tooltip/Hint:** Aparece si existe

**Validación lógica:**

```
Condiciones para botón habilitado:
✓ hasScrolledToEnd === true
✓ hasAccepted === true
→ Botón HABILITADO 🟢
```

**Debug:**

```javascript
// Verificar estados
console.log({
  checkboxMarked: "true esperado",
  buttonDisabled: "false esperado",
  hasAccepted: "true esperado"
});
```

---

## 🎯 Test 5: Aceptar Modal

### Acción: Click en "Aceptar y continuar"

```
Pasos continuos desde Test 4:
12. Click en botón verde "Aceptar y continuar"
```

**Verificaciones Inmediatas:**

- [ ] **Modal cierra:** Fade out animation
- [ ] **Sin errores:** Console limpia
- [ ] **Vuelve a formulario:** Stage 6 visible nuevamente

**Verificaciones en Formulario:**

- [ ] **Checkbox ahora HABILITADO:** ☑️ Ya no está gris
- [ ] **Mensaje cambia a VERDE:** "Términos aceptados" ✅
- [ ] **Botón link:** Sigue visible "Ver términos..." (para re-abrir si lo necesita)
- [ ] **Fondo:** Sigue con gradiente azul

**Visual esperado:**

```
┌──────────────────────────────────────────┐
│ ☑️ Autorizo el tratamiento de mis datos  │
│    personales                            │
│                                          │
│    📄 Ver términos de protección de datos│
│                                          │
│    ✅ Términos de protección aceptados   │
└──────────────────────────────────────────┘
```

**Debug:**

```javascript
// Verificar estado guardado
console.log({
  hasAcceptedDataProtection: "true esperado",
  formDataAutorizacion: "undefined o false (aún no marca)",
  checkboxDisabled: "false esperado"
});
```

---

## 🎯 Test 6: Marcar Checkbox en Formulario

### Acción: Segunda confirmación

```
Pasos continuos desde Test 5:
13. Marcar checkbox en formulario (☐ → ☑️)
```

**Verificaciones:**

- [ ] **Checkbox se marca:** ☑️ Visual feedback
- [ ] **Sin validación:** Permite marcar sin problemas
- [ ] **Estado guardia:** `formData.autorizacion_datos = true`

**Debug:**

```javascript
// Verificar estado del formulario
console.log({
  formData: {
    autorizacion_datos: "true esperado"
  }
});
```

---

## 🎯 Test 7: Envío del Formulario (ÉXITO)

### Acción: Click en "Guardar Encuesta"

```
Pasos continuos desde Test 6:
14. Completar resto de campos Stage 6 si es necesario
15. Click en "Guardar Encuesta"
```

**Verificaciones:**

- [ ] **Sin error de validación:** No aparece toast rojo
- [ ] **Spinner/Loading:** Aparece mientras se procesa
- [ ] **API call exitoso:** Network tab muestra 200/201
- [ ] **Confirmación:** Toast verde "Encuesta guardada"
- [ ] **Redirect:** Vuelve a pantalla anterior o muestra confirmación

**Network Verification:**

```
POST /api/encuestas
Payload:
{
  ...otros campos...
  autorizacion_datos: true  ← IMPORTANTE
}

Response: 200 OK
{
  success: true,
  surveyId: "xxx-xxx-xxx"
}
```

---

## 🎯 Test 8: Rechazo (SIN MARCAR)

### Acción: Intentar enviar sin aceptar

```
Pasos (vuelta atrás):
1. Cargar Stage 6 nuevamente en nueva encuesta
2. NO hacer click en "Ver términos..."
3. NO marcar checkbox
4. Click en "Guardar Encuesta"
```

**Verificaciones:**

- [ ] **Error mostrado:** Toast rojo "Debes aceptar..."
- [ ] **Formulario NO enviado:** Sigue en Stage 6
- [ ] **Foco:** Vuelve al campo de autorización
- [ ] **Checkbox rojo/ámbar:** Resaltado como error

**Mensaje esperado:**

```
❌ "Debes aceptar los términos de protección de datos"
```

---

## 🎯 Test 9: Modal + Rechazo

### Acción: Abrir modal pero NO scrollear

```
Pasos:
1. Stage 6 nuevo
2. Click "Ver términos..."
3. NO scrollear
4. Intentar marcar checkbox (estará bloqueado)
5. Intentar clickear botón (estará bloqueado)
6. Cerrar modal sin aceptar
7. Intentar enviar
```

**Verificaciones:**

- [ ] **Checkbox bloqueado:** No se puede marcar (durante scroll incompleto)
- [ ] **Botón bloqueado:** No se puede clickear
- [ ] **Modal se cierra:** X button o cancelar
- [ ] **Vuelve al form:** Checkbox aún deshabilitado
- [ ] **Envío bloqueado:** Error de validación

**Flujo esperado:**

```
Modal Abierto → (No scrollea) → Cierra Modal → 
Formulario → Intenta Enviar → ERROR ❌
```

---

## 🎯 Test 10: Responsive Design

### Desktop (1024px+)

```
1. Maximizar ventana del navegador
2. F12 DevTools → Responsive mode OFF
```

**Verificaciones:**

- [ ] **Campo**: Tamaño legible, espaciado correcto
- [ ] **Modal**: max-w-2xl (672px), centrado
- [ ] **Botón link**: Inline con checkbox
- [ ] **Scroll**: Funciona suave, sin twitching
- [ ] **Alert**: Mensaje completo visible

### Tablet (768px - 1023px)

```
2. F12 DevTools → Responsive mode
3. Select "iPad" o 768x1024
```

**Verificaciones:**

- [ ] **Campo**: Adaptado al ancho, legible
- [ ] **Modal**: Ancho menor (responsive)
- [ ] **Botón**: Link o stacked (dependiendo diseño)
- [ ] **Scroll**: Función correcta en touch
- [ ] **Altura modal**: No tapa botones de acción

### Mobile (< 768px)

```
3. F12 DevTools → Select "iPhone 12" o 375x812
```

**Verificaciones:**

- [ ] **Campo**: Full width, largo pero legible
- [ ] **Modal**: Full width o casi
- [ ] **Botón**: Full width o stacked
- [ ] **Scroll**: Smooth en touch devices
- [ ] **Altura**: Modal no tapa keyboard (importante)
- [ ] **Alert**: Mensaje truncado con ellipsis OK

**Visual Mobile:**

```
┌─────────────────────┐
│ ☑ Autorizo...      │
│                    │
│ 📄 Ver términos... │
│                    │
│ ⚠ Debes leer...   │
└─────────────────────┘

[Modal Full Width]
```

---

## 🎯 Test 11: Re-Abrir Modal

### Acción: Abrir nuevamente después de aceptar

```
Pasos desde Test 5:
16. Modal aceptado, vuelta a formulario
17. Click nuevamente en "Ver términos..."
18. Modal se abre RESET
```

**Verificaciones:**

- [ ] **Modal abre nuevamente:** Sin problemas
- [ ] **Estados reseteados:** 
  - hasScrolledToEnd = false (no scrolleado)
  - hasAccepted = false (no marcado)
- [ ] **Checkbox modal bloqueado:** Nuevamente
- [ ] **Alert ámbar:** Vuelve a mostrar
- [ ] **Botón gris:** Vuelve a deshabilitarse
- [ ] **Content**: Vuelve a mostrar desde arriba (no mantiene scroll)

**Debug:**

```javascript
// Verificar reset al abrir
console.log({
  hasScrolledToEnd: "false esperado en re-open",
  hasAccepted: "false esperado en re-open"
});
```

---

## 🎯 Test 12: Navegación Entre Etapas

### Acción: Ir atrás y adelante en etapas

```
Pasos:
1. Completar Etapa 6 con autorización ✅
2. Click "Siguiente" (ir a Etapa siguiente si existe)
3. Click "Anterior" (volver a Etapa 6)
```

**Verificaciones:**

- [ ] **Estado se mantiene:** Checkbox marca persiste
- [ ] **Datos guardados:** FormData no se pierde
- [ ] **Modal cerrado:** No se abre automáticamente
- [ ] **Sin loops infinitos:** Navegación normal
- [ ] **LocalStorage**: Datos persisten si hay auto-save

---

## 🐛 Troubleshooting Durante Testing

### Problema: Checkbox no se habilita al scrollear

**Síntomas:**
- Scrolleo al final pero checkbox sigue bloqueado
- Alert sigue ámbar

**Soluciones:**
1. Abre DevTools Console (F12)
2. Ejecuta:
```javascript
const area = document.querySelector('[data-scroll-area]');
console.log({
  scrollHeight: area?.scrollHeight,
  scrollTop: area?.scrollTop,
  clientHeight: area?.clientHeight
});
```
3. Verifica que `scrollHeight - (scrollTop + clientHeight) < 20`
4. Si no: aumentar tolerancia a 50px (en código)

### Problema: Modal no abre

**Síntomas:**
- Click en "Ver términos..." no hace nada
- No hay errores en console

**Soluciones:**
1. Verificar que `onOpenModal` se llama:
```javascript
// En DataProtectionCheckbox.tsx
const handleButtonClick = () => {
  console.log("Button clicked, calling onOpenModal");
  onOpenModal();
};
```
2. Verificar que `setShowDataProtectionModal` existe en SurveyForm
3. Revisar Console por errores JavaScript

### Problema: No se puede enviar encuesta después de aceptar

**Síntomas:**
- Modal aceptado ✅
- Checkbox marcado ☑️
- Click "Guardar" → Error

**Soluciones:**
1. Verificar validación backend:
```bash
# Ver logs del servidor
npm run server:logs
```
2. Verificar Network tab (F12):
   - Payload tiene `autorizacion_datos: true`?
   - Backend responde 200 o error 4xx/5xx?
3. Verificar base de datos:
   - Campo existe?
   - Tipo correcto?

---

## 📊 Resumen de Checklist

### Secciones Completadas ✅
- [ ] Test 1: Interfaz inicial
- [ ] Test 2: Abrir modal
- [ ] Test 3: Scroll detection
- [ ] Test 4: Checkbox en modal
- [ ] Test 5: Aceptar modal
- [ ] Test 6: Checkbox en formulario
- [ ] Test 7: Envío exitoso
- [ ] Test 8: Rechazo sin aceptar
- [ ] Test 9: Modal sin scrollear
- [ ] Test 10: Responsive design
- [ ] Test 11: Re-abrir modal
- [ ] Test 12: Navegación

### Secciones Opacionales ✓
- [ ] Troubleshooting ejecutado (si aplica)
- [ ] Performance monitoreado (DevTools)
- [ ] Accesibilidad verificada (Tab key, screen reader)
- [ ] Localización correcta (idioma español)

---

## 📝 Notas de Testing

```
Fecha: ________________
Tester: ________________
Navegador: ________________ Versión: ________________
Dispositivo: ________________
Servidor: ________________

Observaciones:
_________________________________________
_________________________________________
_________________________________________

Issues Encontrados:
_________________________________________
_________________________________________

Bugs:
[ ] Crítico  [ ] Mayor  [ ] Menor  [ ] Trivial

Recomendaciones:
_________________________________________
_________________________________________
```

---

## ✅ FINAL SIGN-OFF

Cuando todos los tests pasen:

```
┌────────────────────────────────────────┐
│ DATA PROTECTION MODAL - READY FOR PROD │
├────────────────────────────────────────┤
│                                        │
│ ✅ All functional tests passed         │
│ ✅ All UI tests passed                 │
│ ✅ Responsive design verified          │
│ ✅ Error handling verified             │
│ ✅ Performance acceptable              │
│ ✅ No console errors                   │
│ ✅ Backend integration working         │
│                                        │
│ Status: READY TO DEPLOY ✨             │
│ Date: ________________                 │
│ Tester: ________________                │
└────────────────────────────────────────┘
```

---

**Documento:** `CHECKLIST-VALIDACION-DATA-PROTECTION.md`
**Versión:** 2.0
**Estado:** ✅ Listo para Testing
**Última actualización:** 2025-01-22
