# 📊 Diagrama Visual del Nuevo Flujo de Autorización

## 🔀 Comparativa: Antes vs Después

### ❌ ANTES (V1)
```
┌─────────────────────────────────────┐
│ Usuario entra a crear encuesta      │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────────────┐
        │ Modal ABIERTO│ ← Automático, invasivo
        │ (Forzado)    │
        └──────┬───────┘
               │
               ├─ Usuario scrollea
               │
               ├─ Puede marcar checkbox
               │  en cualquier momento
               │
               └─ Aceptar y continuar
               
               │
               ▼
        ┌──────────────────┐
        │ Encuesta normal  │
        │ Etapas 1-6       │
        └──────────────────┘
```

### ✅ AHORA (V2)
```
┌──────────────────────────────────┐
│ Usuario entra a crear encuesta   │
└────────────┬─────────────────────┘
             │
   ┌─────────▼──────────┐
   │ Etapas 1-5 Normales│
   └─────────┬──────────┘
             │
             ▼
   ┌────────────────────────────────────┐
   │ ETAPA 6: Observaciones             │
   │                                    │
   │ • Campo 1: Sustento de familia     │
   │ • Campo 2: Observaciones           │
   │ • Campo 3: [AUTORIZACIÓN] ← NUEVO │
   │            - Checkbox: DESHABILITADO
   │            - Botón: "Ver términos..." 🔗
   │            - Mensaje: ⚠️ Debes leer
   └────────────┬─────────────────────┘
                │
            Usuario
              hace
              click
                │
                ▼
      ┌────────────────────────────────┐
      │ MODAL DE TÉRMINOS SE ABRE      │
      │                                │
      │ ┌──────────────────────────────┤
      │ │ Sección 1: Responsable       │
      │ │ Sección 2: Finalidad         │
      │ │ Sección 3: Datos             │
      │ │ Sección 4: Legitimación      │
      │ │ Sección 5: Seguridad         │
      │ │ Sección 6: Derechos          │
      │ │ Sección 7: Duración          │
      │ │ Sección 8: Contacto          │
      │ └──────────────────────────────┤
      │ Checkbox: BLOQUEADO 🔒         │
      │ Alert: ⚠️ Lee todo              │
      │ Botón: Gris (deshabilitado)   │
      └────────────┬───────────────────┘
                   │
              Usuario
             scrollea
                   │
          ¿Llegó al fin?
                   │
            ┌──────┴──────┐
            │             │
           NO             YES
            │             │
            │    ┌────────▼──────────────┐
            │    │ Checkbox: HABILITADO ✅
            │    │ Alert: ✅ Términos...│
            │    │ Botón: Verde 🟢      │
            │    └────────┬──────────────┘
            │             │
            │         Usuario
            │         marca &
            │         click
            │             │
            ▼             ▼
      Mensaje:     ┌──────────────┐
      ⚠️ Lee todo   │ Modal cierra │
                    └──────┬───────┘
                           │
                           ▼
      ┌──────────────────────────────────┐
      │ ETAPA 6: Vuelve al formulario   │
      │                                 │
      │ • Checkbox: HABILITADO ✅       │
      │ • Mensaje: ✅ Términos...       │
      │ • Usuario marca checkbox        │
      │ • Completa resto de campos      │
      │ • Click "Guardar Encuesta"      │
      │                                 │
      │ ✅ ENCUESTA ENVIADA             │
      └──────────────────────────────────┘
```

---

## 🎯 Estados del Checkbox

```
┌─────────────────────────────────────────────────────┐
│ COMPONENTE: DataProtectionCheckbox                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ESTADO 1: Inicial (Antes de leer)                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ☑️  Checkbox: [disabled] ❌                        │
│ 📄  Botón: "Ver términos..." (AZUL)                │
│ ⚠️  Mensaje: "Debes leer y aceptar"               │
│                                                     │
│ ESTADO 2: Leyendo en Modal                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ☑️  Checkbox del modal: [disabled] 🔒              │
│ ⬇️  Usuario scrollea...                             │
│ ⚠️  Alert: "Lee todo el contenido"                │
│                                                     │
│ ESTADO 3: Llegó al final                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ☑️  Checkbox del modal: [enabled] ✅               │
│ ✅  Alert: "Términos aceptados"                    │
│ 🟢  Botón: "Aceptar y continuar" (VERDE)           │
│                                                     │
│ ESTADO 4: Aceptó y volvió al form                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ☑️  Checkbox: [enabled] ✅                         │
│ ✅  Mensaje: "Términos de protección aceptados"   │
│ 📄  Botón: "Ver términos..." (AZUL)                │
│                                                     │
│ ESTADO 5: Usuario marca y envía                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ☑️  Checkbox: [x] MARCADO                          │
│ 🎉  Encuesta lista para enviar                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Componentes

```
SurveyForm.tsx
    ├─ Estado: showDataProtectionModal (false/true)
    ├─ Estado: hasAcceptedDataProtection (false/true)
    │
    ├─ Etapas 1-5: StandardFormField (normal)
    │
    ├─ Etapa 6: Renderizado condicional
    │    │
    │    ├─ Si field.id === "autorizacion_datos"
    │    │    └─> DataProtectionCheckbox
    │    │         ├─ Props: checked, onCheckedChange, onOpenModal, hasAcceptedTerms
    │    │         ├─ Botón link → setShowDataProtectionModal(true)
    │    │         └─ Checkbox disabled={!hasAcceptedDataProtection}
    │    │
    │    └─ Si field.id !== "autorizacion_datos"
    │         └─> StandardFormField (normal)
    │
    └─ Modal: DataProtectionModal
         ├─ Props: open, onOpenChange, onAccept, isRequired
         ├─ Estado: hasScrolledToEnd (detectado en handleScroll)
         ├─ Checkbox bloqueado hasta scroll al final
         ├─ Botón "Aceptar..." se habilita cuando:
         │  - hasScrolledToEnd === true
         │  - hasAccepted === true
         │
         └─ onAccept() → setHasAcceptedDataProtection(true)
                        → Modal se cierra
                        → Checkbox del formulario se habilita
```

---

## 🎨 Colores y Estados

```
CHECKBOX INITIAL:
┌─ ☐ DISABLED (gris, opacity 60%)
│  └─ No se puede clickear

CHECKBOX HABILITADO:
├─ ☐ ENABLED (color normal)
│  └─ Se puede clickear

CHECKBOX MARCADO:
├─ ☑ MARKED (azul)
│  └─ Listo para enviar


BOTÓN LINK:
├─ 📄 Blue Outline (text-blue-600)
│  ├─ Border: blue-300
│  └─ Hover: bg-blue-50

ALERTAS:
├─ ⚠️ Ámbar (before scroll)
│  ├─ Border: amber-200
│  ├─ Background: amber-50
│  └─ Text: amber-800
│
└─ ✅ Verde (after scroll)
   ├─ Border: green-200
   ├─ Background: green-50
   └─ Text: green-800
```

---

## 📱 Responsive Design

```
DESKTOP (1024px+)
┌──────────────────────────────────────┐
│ ✅ Checkbox con texto completo      │
│ 📄 Botón link en nueva línea        │
│ ⚠️ Mensaje informativo              │
│                                     │
│ Modal: max-w-2xl (672px)           │
│        max-h-[90vh]                 │
└──────────────────────────────────────┘

TABLET (768px - 1023px)
┌─────────────────────────────┐
│ ✅ Checkbox con texto       │
│ 📄 Botón inline            │
│ ⚠️ Mensaje                 │
│                             │
│ Modal: max-w-2xl (responsive)
└─────────────────────────────┘

MOBILE (< 768px)
┌────────────────────┐
│ ✅ Checkbox       │
│ 📄 Botón full     │
│ ⚠️ Mensaje corto  │
│                  │
│ Modal: full width │
└────────────────────┘
```

---

## ✨ Interactividad

### Click en Botón "Ver términos..."
```
User Click
    │
    └─> onOpenModal() 
         └─> setShowDataProtectionModal(true)
              └─> Modal aparece con animación fade-in
```

### Scroll en Modal
```
User Scrolls
    │
    └─> handleScroll(e)
         └─> Calcula: scrollHeight - (scrollTop + clientHeight) < 20
              ├─ Si NO < 20: hasScrolledToEnd = false (⚠️ Alert)
              └─ Si < 20: hasScrolledToEnd = true (✅ Alert + Botón verde)
```

### Click en "Aceptar y Continuar"
```
User Click (si hasAccepted && hasScrolledToEnd)
    │
    └─> handleAccept()
         ├─> onAccept() 
         │    └─> setHasAcceptedDataProtection(true)
         │         └─> DataProtectionCheckbox se habilita
         │
         └─> onOpenChange(false)
              └─> Modal cierra
```

### Marcar Checkbox en Formulario
```
User Click Checkbox
    │
    └─> onCheckedChange(true)
         └─> formData.autorizacion_datos = true
              └─> Listo para enviar
```

---

## 🚦 Validación en Envío

```
handleSubmit()
    │
    ├─ ¿formData.autorizacion_datos === true?
    │  │
    │  NO → Toast Error: "Debes aceptar..."
    │  │    RETURN (no continúa)
    │  │
    │  YES → Continúa
    │         │
    │         └─> transformFormDataToSurveySession()
    │              └─> SurveySubmissionService.submitSurvey()
    │                   └─> API /encuesta
    │                        └─> ✅ Encuesta enviada
```

---

**Versión**: 2.0
**Estado**: ✅ COMPLETAMENTE IMPLEMENTADO
**Build**: 7.53 segundos sin errores
**Listo para**: Producción
