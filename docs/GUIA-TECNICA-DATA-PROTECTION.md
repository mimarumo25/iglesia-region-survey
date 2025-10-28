# 🔧 Guía Técnica - DataProtectionCheckbox & Modal

## 📚 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Componentes](#componentes)
3. [Flujo de Datos](#flujo-de-datos)
4. [Scroll Detection](#scroll-detection)
5. [Validación](#validación)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Extensiones Futuras](#extensiones-futuras)

---

## 🏗️ Arquitectura General

### Principios de Diseño

```
┌─────────────────────────────────────────────────────┐
│ Two-Stage Consent Pattern                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Stage 1: Modal Acceptance (Lee + Acepta)          │
│   ├─ User scrollea al final del contenido          │
│   ├─ Checkbox en modal se habilita                 │
│   ├─ User marca checkbox                           │
│   ├─ User clickea "Aceptar y continuar"            │
│   └─ State: hasAcceptedDataProtection = true       │
│                                                     │
│ Stage 2: Form Checkbox (Reconfirma)                │
│   ├─ Checkbox en formulario se habilita            │
│   ├─ User marca checkbox                           │
│   ├─ formData.autorizacion_datos = true            │
│   └─ Permite envío del formulario                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Arquitectura en Capas

```
┌──────────────────────────────────┐
│ SurveyForm (Orquestador)         │
│ - Manage global states           │
│ - Handle form validation         │
│ - Coordinate components          │
└────────────┬─────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────────────┐  ┌──────────────────────┐
│DataProtection    │  │ DataProtection       │
│Checkbox         │  │ Modal                │
│(Field Component) │  │ (Dialog Component)   │
├──────────────────┤  ├──────────────────────┤
│- Props UI        │  │- Props UI            │
│- Disabled logic  │  │- Scroll detection    │
│- Link button     │  │- Checkbox locking    │
│- Conditional msg │  │- Accept handler      │
└──────────────────┘  └──────────────────────┘
```

---

## 📦 Componentes

### 1. DataProtectionCheckbox.tsx

**Ubicación:** `src/components/survey/DataProtectionCheckbox.tsx`

**Propósito:** Renderizar el campo de autorización en Stage 6 del formulario

**Props Interface:**

```typescript
interface DataProtectionCheckboxProps {
  checked: boolean;                    // ¿Checkbox marcado?
  onCheckedChange: (checked: boolean) => void;  // Handler de cambio
  onOpenModal: () => void;            // Callback para abrir modal
  hasAcceptedTerms: boolean;          // ¿Modal fue aceptado?
}
```

**Estructura JSX:**

```tsx
<div className="space-y-2 rounded-lg border border-blue-200 bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
  {/* Header con info */}
  
  {/* Checkbox + Button */}
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
    <Checkbox
      id="autorizacion_datos"
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={!hasAcceptedTerms}  // 🔑 CLAVE: Deshabilitado hasta aceptar
    />
    
    <button
      onClick={onOpenModal}  // 🔑 CLAVE: Abre el modal
      className="text-sm font-semibold text-blue-600..."
    >
      <FileText className="h-4 w-4" />
      Ver términos de protección de datos
    </button>
  </div>
  
  {/* Mensaje condicional */}
  {hasAcceptedTerms ? (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle>Términos de protección aceptados</AlertTitle>
    </Alert>
  ) : (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle>Debes leer y aceptar los términos</AlertTitle>
    </Alert>
  )}
</div>
```

**Lógica de Estados:**

```
hasAcceptedTerms?
├─ true → Checkbox habilitado + Mensaje verde ✅
└─ false → Checkbox deshabilitado + Mensaje ámbar ⚠️
```

---

### 2. DataProtectionModal.tsx

**Ubicación:** `src/components/survey/DataProtectionModal.tsx`

**Propósito:** Mostrar términos y condiciones con scroll obligatorio

**Props Interface:**

```typescript
interface DataProtectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;  // Callback cuando usuario acepta
  isRequired?: boolean;  // Si no se puede cerrar sin aceptar (default: true)
}
```

**Key Features:**

#### A. Scroll Detection

```typescript
const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
const scrollAreaRef = useRef<HTMLDivElement>(null);

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const element = e.currentTarget;
  const scrollHeight = element.scrollHeight;
  const scrollTop = element.scrollTop;
  const clientHeight = element.clientHeight;
  
  // 🔑 CLAVE: Detectar si llegó al final (20px tolerance)
  const isAtEnd = scrollHeight - (scrollTop + clientHeight) < 20;
  setHasScrolledToEnd(isAtEnd);
};
```

**Cálculo:**
```
Posición relativa desde el final:
= scrollHeight - (scrollTop + clientHeight)

Si < 20px → Considerado "final"
Si >= 20px → Aún falta por leer
```

**Visual:**
```
┌──────────────────────────┐
│                          │ ← scrollTop (posición actual)
│      CONTENIDO           │
│      ...                 │
│      ...                 │
├──────────────────────────┤ ← scrollTop + clientHeight
│      VISIBLE AREA        │   (fin de lo visible)
│      (clientHeight)      │
├──────────────────────────┤ ← scrollHeight (fin del contenido)
│      NO VISIBLE          │   distancia < 20px?
│      (resta)             │
└──────────────────────────┘
```

#### B. Checkbox Locking

```typescript
<Checkbox
  id="terms-agreement"
  checked={hasAccepted}
  onCheckedChange={setHasAccepted}
  disabled={!hasScrolledToEnd}  // 🔑 CLAVE: Bloqueado hasta scroll
/>
```

#### C. Alert Condicional

```typescript
{!hasScrolledToEnd && (
  <Alert className="border-amber-200 bg-amber-50">
    <AlertCircle className="h-4 w-4 text-amber-600" />
    <AlertTitle className="text-amber-800">
      Debes leer todo el contenido antes de aceptar
    </AlertTitle>
  </Alert>
)}
```

#### D. Button State

```typescript
<Button
  onClick={handleAccept}
  disabled={!hasAccepted || !hasScrolledToEnd}  // Ambas condiciones
  className={cn(
    // Si habilitado: verde
    !(!hasAccepted || !hasScrolledToEnd) && "bg-green-600 hover:bg-green-700",
    // Si deshabilitado: gris
    (!hasAccepted || !hasScrolledToEnd) && "opacity-50 cursor-not-allowed"
  )}
>
  {hasAccepted ? "Aceptar y continuar" : "Por favor, acepta los términos"}
</Button>
```

#### E. Reset on Open

```typescript
useEffect(() => {
  if (open) {
    // Reset states cuando el modal se abre
    setHasScrolledToEnd(false);
    setHasAccepted(false);
  }
}, [open]);
```

---

### 3. SurveyForm.tsx (Cambios Relevantes)

**Ubicación:** `src/components/SurveyForm.tsx`

#### Estado Global de Protección de Datos

```typescript
const [showDataProtectionModal, setShowDataProtectionModal] = useState(false);
const [hasAcceptedDataProtection, setHasAcceptedDataProtection] = useState(false);
```

#### Conditional Rendering del Campo

```typescript
{field.id === "autorizacion_datos" ? (
  <DataProtectionCheckbox
    checked={formData.autorizacion_datos === true}
    onCheckedChange={(checked) => {
      updateFormField("autorizacion_datos", checked);
    }}
    onOpenModal={() => setShowDataProtectionModal(true)}
    hasAcceptedTerms={hasAcceptedDataProtection}
  />
) : (
  <StandardFormField field={field} /* ... */ />
)}
```

#### Validación en Submit

```typescript
const handleSubmit = (data: FormData) => {
  // Validación específica para autorizacion_datos
  if (data.autorizacion_datos !== true) {
    toast.error("Debes aceptar los términos de protección de datos");
    return;
  }
  
  // Continuar con envío...
};
```

---

## 🔄 Flujo de Datos

### 1. User inicia

```javascript
showDataProtectionModal = false
hasAcceptedDataProtection = false
formData.autorizacion_datos = false
```

### 2. Usuario hace click en "Ver términos..."

```
onClick={onOpenModal}
  └─> setShowDataProtectionModal(true)
      └─> Modal se abre
          ├─ hasScrolledToEnd = false
          ├─ hasAccepted = false
          └─ Checkbox bloqueado ❌
```

### 3. Usuario scrollea en modal

```
onScroll={handleScroll}
  └─ if (scrollHeight - (scrollTop + clientHeight) < 20)
      └─> setHasScrolledToEnd(true)
          ├─ Checkbox se habilita ✅
          ├─ Alert cambia a verde ✅
          └─ Botón se habilita 🟢
```

### 4. Usuario marca checkbox en modal

```
onCheckedChange(true)
  └─> setHasAccepted(true)
      └─ Botón "Aceptar..." activado (si también scrolledToEnd)
```

### 5. Usuario clickea "Aceptar y continuar"

```
onClick={handleAccept}
  ├─> onAccept()
  │   └─> setHasAcceptedDataProtection(true)  // Sube al padre
  │
  └─> onOpenChange(false)
      └─> Modal se cierra
          └─> DataProtectionCheckbox ahora tiene hasAcceptedTerms=true
              └─ Checkbox del formulario se habilita ✅
```

### 6. Usuario marca checkbox en formulario

```
onCheckedChange(true)
  └─> updateFormField("autorizacion_datos", true)
      └─> formData.autorizacion_datos = true
          └─ Listo para enviar ✅
```

### 7. Usuario clickea "Guardar Encuesta"

```
handleSubmit()
  ├─ if (formData.autorizacion_datos !== true)
  │   └─> ERROR: "Debes aceptar..."
  │
  └─ else
      └─> submitSurvey()
          └─ Encuesta enviada a API ✅
```

---

## 🔍 Scroll Detection Deep Dive

### Algoritmo de Detección

```typescript
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const element = e.currentTarget;
  
  // 1. Obtener dimensiones
  const scrollHeight = element.scrollHeight;    // Total de contenido
  const scrollTop = element.scrollTop;          // Posición actual del scroll
  const clientHeight = element.clientHeight;    // Alto visible
  
  // 2. Calcular distancia al final
  const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
  
  // 3. Comparar con tolerancia
  const isAtEnd = distanceFromBottom < 20;  // 20px threshold
  
  // 4. Actualizar estado
  setHasScrolledToEnd(isAtEnd);
};
```

### Ejemplo Numérico

```
ScrollArea que contiene 3000px de texto
Usuario aún está en la mitad (1500px)

scrollHeight = 3000
scrollTop = 1500
clientHeight = 600
distanceFromBottom = 3000 - (1500 + 600) = 900px

900 < 20? → false → hasScrolledToEnd = false ❌


Usuario scrollea al final

scrollHeight = 3000
scrollTop = 2400
clientHeight = 600
distanceFromBottom = 3000 - (2400 + 600) = 0px

0 < 20? → true → hasScrolledToEnd = true ✅
```

### Por qué 20px de tolerancia?

- **10px**: Muy estricto, browser puede no permitir scroll exacto a 0
- **20px**: Equilibrio - permite pequeños errores de rendering
- **50px**: Muy tolerante, usuario puede no estar realmente al final

**Recomendación**: 20px es estándar en industria

---

## ✅ Validación

### 1. Frontend (Client-Side)

```typescript
// En SurveyForm.tsx
if (formData.autorizacion_datos !== true) {
  toast.error("Debes aceptar los términos de protección de datos");
  return; // No procede al backend
}
```

**Propósito:** UX feedback inmediato

### 2. Backend (Server-Side - Recomendado)

```typescript
// En API endpoint (ejemplo pseudo-código)
if (!surveyData.autorizacion_datos) {
  throw new HttpException(
    "La aceptación de términos es requerida",
    HttpStatus.UNPROCESSABLE_ENTITY
  );
}
```

**Propósito:** Seguridad, auditoría legal

### 3. Validación de Scroll (Modal)

```typescript
// En DataProtectionModal.tsx
const handleAccept = () => {
  if (!hasScrolledToEnd) {
    toast.warning("Debes leer todo el contenido");
    return;
  }
  
  if (!hasAccepted) {
    toast.warning("Debes aceptar los términos");
    return;
  }
  
  onAccept();
};
```

---

## 🧪 Testing

### Unit Tests

```typescript
// DataProtectionCheckbox.test.tsx
describe("DataProtectionCheckbox", () => {
  it("should render checkbox disabled when hasAcceptedTerms is false", () => {
    render(
      <DataProtectionCheckbox
        checked={false}
        onCheckedChange={() => {}}
        onOpenModal={() => {}}
        hasAcceptedTerms={false}
      />
    );
    
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });
  
  it("should enable checkbox when hasAcceptedTerms is true", () => {
    render(
      <DataProtectionCheckbox
        checked={false}
        onCheckedChange={() => {}}
        onOpenModal={() => {}}
        hasAcceptedTerms={true}
      />
    );
    
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeDisabled();
  });
  
  it("should call onOpenModal when button is clicked", () => {
    const handleOpenModal = jest.fn();
    render(
      <DataProtectionCheckbox
        checked={false}
        onCheckedChange={() => {}}
        onOpenModal={handleOpenModal}
        hasAcceptedTerms={false}
      />
    );
    
    fireEvent.click(screen.getByText(/Ver términos/i));
    expect(handleOpenModal).toHaveBeenCalled();
  });
});
```

### Integration Tests

```typescript
// SurveyForm.test.tsx
describe("SurveyForm - Data Protection Flow", () => {
  it("should prevent submission without data protection acceptance", async () => {
    render(<SurveyForm surveyId="test-123" />);
    
    // Llenar todos los campos excepto autorización
    // ...
    
    // Intentar enviar
    fireEvent.click(screen.getByText(/Guardar Encuesta/i));
    
    // Debe mostrar error
    expect(
      screen.getByText(/Debes aceptar los términos/i)
    ).toBeInTheDocument();
  });
  
  it("should allow submission after data protection acceptance", async () => {
    render(<SurveyForm surveyId="test-123" />);
    
    // Abrir modal
    fireEvent.click(screen.getByText(/Ver términos/i));
    
    // Scrollear modal
    const scrollArea = screen.getByRole("region", { hidden: false });
    // Simular scroll al final
    Object.defineProperty(scrollArea, "scrollHeight", { value: 3000 });
    Object.defineProperty(scrollArea, "scrollTop", { value: 2400 });
    Object.defineProperty(scrollArea, "clientHeight", { value: 600 });
    fireEvent.scroll(scrollArea, { target: { scrollY: 2400 } });
    
    // Marcar checkbox del modal
    fireEvent.click(screen.getByRole("checkbox", { name: /términos/i }));
    
    // Aceptar
    fireEvent.click(screen.getByText(/Aceptar y continuar/i));
    
    // Marcar checkbox del formulario
    fireEvent.click(screen.getByRole("checkbox", { name: /autorizacion/i }));
    
    // Enviar
    fireEvent.click(screen.getByText(/Guardar Encuesta/i));
    
    // Debe proceder sin error
    await waitFor(() => {
      expect(screen.queryByText(/Debes aceptar/i)).not.toBeInTheDocument();
    });
  });
});
```

---

## 🐛 Troubleshooting

### Problema: Checkbox no se habilita después de scrollear

**Posibles Causas:**
1. Event handler no dispara
2. Cálculo de distancia incorrecto
3. State no se actualiza

**Solución:**

```typescript
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const element = e.currentTarget;
  console.log({
    scrollHeight: element.scrollHeight,
    scrollTop: element.scrollTop,
    clientHeight: element.clientHeight,
    distanceFromBottom: element.scrollHeight - (element.scrollTop + element.clientHeight),
  });
  
  const isAtEnd = element.scrollHeight - (element.scrollTop + element.clientHeight) < 20;
  console.log("isAtEnd:", isAtEnd);
  setHasScrolledToEnd(isAtEnd);
};
```

### Problema: Modal se puede cerrar sin aceptar

**Posibles Causas:**
1. `isRequired` prop no está configurado
2. `onOpenChange` no valida antes de cerrar

**Solución:**

```typescript
<Dialog
  open={open}
  onOpenChange={(newOpen) => {
    // No permitir cerrar sin aceptar si es required
    if (!newOpen && isRequired && !hasAccepted) {
      toast.warning("Debes aceptar los términos para continuar");
      return;
    }
    onOpenChange(newOpen);
  }}
>
  {/* ... */}
</Dialog>
```

### Problema: Scroll no funciona en mobile

**Posibles Causas:**
1. ScrollArea overflow no configurado
2. Touch events no capturados

**Solución:**

```typescript
<ScrollArea className="h-[60vh] w-full overflow-y-auto touch-pan-y">
  {/* Contenido */}
</ScrollArea>
```

### Problema: Tolerancia de 20px muy restrictiva

**Síntoma:** Usuarios reportan que no pueden marcar checkbox aunque scrollearon

**Solución:** Aumentar tolerancia

```typescript
// De 20px a 50px
const isAtEnd = scrollHeight - (scrollTop + clientHeight) < 50;
```

---

## 🚀 Extensiones Futuras

### 1. LocalStorage Persistence

```typescript
// DataProtectionModal.tsx
useEffect(() => {
  const stored = localStorage.getItem("dataProtectionAccepted");
  if (stored) {
    const { timestamp, accepted } = JSON.parse(stored);
    // Si fue aceptado hace menos de 30 días, no volver a mostrar
    if (accepted && Date.now() - timestamp < 30 * 24 * 60 * 60 * 1000) {
      setHasAcceptedDataProtection(true);
    }
  }
}, []);

const handleAccept = () => {
  localStorage.setItem(
    "dataProtectionAccepted",
    JSON.stringify({ accepted: true, timestamp: Date.now() })
  );
  onAccept();
};
```

### 2. Analytics Tracking

```typescript
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  // ... código existente ...
  
  if (isAtEnd) {
    // Track evento de lectura completada
    analytics.track("DataProtectionTermsRead", {
      timestamp: new Date(),
      surveyId: props.surveyId,
    });
  }
};

const handleAccept = () => {
  // Track aceptación
  analytics.track("DataProtectionTermsAccepted", {
    timestamp: new Date(),
    surveyId: props.surveyId,
    scrolledToEnd: hasScrolledToEnd,
  });
  onAccept();
};
```

### 3. Multi-Language Support

```typescript
// Crear una configuración i18n
const TERMS_CONTENT = {
  es: {
    title: "Términos de Protección de Datos",
    section1: { title: "Responsable", content: "..." },
    // ...
  },
  en: {
    title: "Data Protection Terms",
    section1: { title: "Responsible", content: "..." },
    // ...
  },
};

const DataProtectionModal = ({ language = "es", ...props }) => {
  const content = TERMS_CONTENT[language];
  return (
    <Dialog {...props}>
      <DialogTitle>{content.title}</DialogTitle>
      {/* ... */}
    </Dialog>
  );
};
```

### 4. Version Control para Términos

```typescript
interface TermsVersion {
  version: string;      // "1.0", "2.0", etc
  effectiveDate: Date;
  content: string;
  language: string;
}

// Backend debe almacenar qué versión aceptó cada usuario
const storeUserAcceptance = async (userId: string, termsVersion: string) => {
  await db.userTermsAcceptance.create({
    userId,
    termsVersion,
    acceptedAt: new Date(),
    ipAddress: request.ip,
  });
};
```

### 5. Audit Logging

```typescript
const handleAccept = async () => {
  // Log en backend para auditoría
  await AuditService.log({
    action: "DATA_PROTECTION_ACCEPTED",
    userId: currentUser.id,
    surveyId: surveyId,
    timestamp: new Date(),
    ipAddress: getUserIP(),
    userAgent: navigator.userAgent,
  });
  
  onAccept();
};
```

---

## 📋 Checklist para Mantenimiento

- [ ] Verificar scroll tolerance en diferentes navegadores
- [ ] Testear en mobile (iOS Safari, Android Chrome)
- [ ] Revisar términos anualmente
- [ ] Auditar logs de aceptaciones
- [ ] Validar cumplimiento GDPR/RGPD
- [ ] Documentar cualquier cambio en términos
- [ ] Actualizar versión de términos
- [ ] Notificar usuarios de cambios importantes
- [ ] Backup de aceptaciones
- [ ] Monitor de rendimiento (scroll events)

---

**Documento:** `GUIA-TECNICA-DATA-PROTECTION.md`
**Versión:** 2.0
**Última actualización:** 2025-01-22
**Autor:** Sistema MIA
**Estado:** ✅ Producción
