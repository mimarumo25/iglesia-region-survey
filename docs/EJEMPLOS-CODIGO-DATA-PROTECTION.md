# 💻 Ejemplos de Código - Data Protection Implementation

## 📚 Índice Rápido

1. [DataProtectionCheckbox Props](#dataprotectioncheckbox-props)
2. [DataProtectionModal Scroll Logic](#dataprotectionmodal-scroll-logic)
3. [SurveyForm Integration](#surveyform-integration)
4. [Validation Examples](#validation-examples)
5. [Testing Examples](#testing-examples)
6. [Advanced Patterns](#advanced-patterns)

---

## DataProtectionCheckbox Props

### ✅ Uso Correcto

```typescript
import DataProtectionCheckbox from "@/components/survey/DataProtectionCheckbox";

// En el componente padre
const [showDataProtectionModal, setShowDataProtectionModal] = useState(false);
const [hasAcceptedDataProtection, setHasAcceptedDataProtection] = useState(false);
const [formData, setFormData] = useState({ autorizacion_datos: false });

// Renderizar el componente
<DataProtectionCheckbox
  checked={formData.autorizacion_datos === true}
  onCheckedChange={(checked) => {
    setFormData(prev => ({
      ...prev,
      autorizacion_datos: checked
    }));
  }}
  onOpenModal={() => setShowDataProtectionModal(true)}
  hasAcceptedTerms={hasAcceptedDataProtection}
/>
```

### ❌ Errores Comunes

```typescript
// ❌ MALO: Pasar booleano en lugar de callback
<DataProtectionCheckbox onOpenModal={true} />

// ❌ MALO: No actualizar formData
<DataProtectionCheckbox
  onCheckedChange={() => console.log("Changed")}  // Sin updatear estado
/>

// ❌ MALO: hasAcceptedTerms siempre false
<DataProtectionCheckbox hasAcceptedTerms={false} />  // Checkbox siempre deshabilitado

// ✅ CORRECTO: Todas las props con los tipos correctos
<DataProtectionCheckbox
  checked={boolean}
  onCheckedChange={(checked: boolean) => void}
  onOpenModal={() => void}
  hasAcceptedTerms={boolean}
/>
```

---

## DataProtectionModal Scroll Logic

### Algoritmo de Detección de Scroll

```typescript
// ✅ EJEMPLO CORRECTO
import { useRef, useState, useEffect } from "react";

const DataProtectionModal = ({ open, onOpenChange, onAccept }: Props) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Reset cuando modal abre/cierra
  useEffect(() => {
    if (open) {
      setHasScrolledToEnd(false);
      setHasAccepted(false);
    }
  }, [open]);

  // Handler del scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    
    // Obtener dimensiones
    const scrollHeight = element.scrollHeight;      // Total de contenido
    const scrollTop = element.scrollTop;            // Posición del scroll
    const clientHeight = element.clientHeight;      // Altura visible
    
    // Calcular distancia al final
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    
    // Considerar "al final" si está a < 20px del bottom
    const isAtEnd = distanceFromBottom < 20;
    
    // Actualizar estado (NO es crítico scrollear exactamente a 0)
    setHasScrolledToEnd(isAtEnd);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Términos y Condiciones</DialogTitle>
        
        {/* ScrollArea con ref y handler */}
        <ScrollArea 
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="h-[60vh] w-full"
        >
          {/* Contenido de 8 secciones */}
          <div className="space-y-4 pr-4">
            {/* Sección 1, 2, ... 8 */}
          </div>
        </ScrollArea>

        {/* Alert condicional */}
        {!hasScrolledToEnd && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Debes leer todo el contenido</AlertTitle>
          </Alert>
        )}

        {/* Checkbox - deshabilitado hasta scroll */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="accept-terms"
            checked={hasAccepted}
            onCheckedChange={setHasAccepted}
            disabled={!hasScrolledToEnd}  // 🔑 CLAVE
          />
          <label htmlFor="accept-terms">Acepto los términos</label>
        </div>

        {/* Botón - requiere ambas condiciones */}
        <Button
          onClick={() => {
            if (!hasAccepted || !hasScrolledToEnd) {
              toast.warning("Por favor, acepta los términos");
              return;
            }
            onAccept();
            onOpenChange(false);
          }}
          disabled={!hasAccepted || !hasScrolledToEnd}  // 🔑 CLAVE
          className={
            hasAccepted && hasScrolledToEnd
              ? "bg-green-600 hover:bg-green-700"
              : "opacity-50 cursor-not-allowed"
          }
        >
          Aceptar y Continuar
        </Button>
      </DialogContent>
    </Dialog>
  );
};
```

### Variante: Tolerancia Configurable

```typescript
// ✅ TOLERANCIA PERSONALIZABLE
interface ScrollDetectionOptions {
  tolerance?: number;  // default: 20px
  onReachedEnd?: () => void;
}

const useScrollDetection = (
  ref: React.RefObject<HTMLDivElement>,
  { tolerance = 20, onReachedEnd }: ScrollDetectionOptions = {}
) => {
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const distanceFromBottom = 
      element.scrollHeight - (element.scrollTop + element.clientHeight);
    
    const isAtEnd = distanceFromBottom < tolerance;
    
    if (isAtEnd && !hasReachedEnd) {
      setHasReachedEnd(true);
      onReachedEnd?.();
    } else if (!isAtEnd && hasReachedEnd) {
      setHasReachedEnd(false);
    }
  };

  return { handleScroll, hasReachedEnd };
};

// Uso
const { handleScroll, hasReachedEnd } = useScrollDetection(scrollAreaRef, {
  tolerance: 50,  // Más tolerante
  onReachedEnd: () => console.log("User reached end!")
});
```

---

## SurveyForm Integration

### Implementación Completa en SurveyForm

```typescript
// ✅ IMPLEMENTACIÓN EN SurveyForm.tsx

import { useState } from "react";
import DataProtectionCheckbox from "@/components/survey/DataProtectionCheckbox";
import DataProtectionModal from "@/components/survey/DataProtectionModal";

export const SurveyForm = ({ surveyId }: Props) => {
  // Estados específicos de protección de datos
  const [showDataProtectionModal, setShowDataProtectionModal] = useState(false);
  const [hasAcceptedDataProtection, setHasAcceptedDataProtection] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    // ... otros campos ...
    autorizacion_datos: false,
  });

  // Handler para actualizar campo
  const updateFormField = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Validación en submit
  const handleSubmit = async () => {
    // Validación: Autorización obligatoria
    if (formData.autorizacion_datos !== true) {
      toast.error("Debes aceptar los términos de protección de datos");
      return;
    }

    // Continuar con envío
    try {
      const response = await submitSurvey(formData);
      toast.success("Encuesta guardada correctamente");
      // redirect...
    } catch (error) {
      toast.error("Error al guardar la encuesta");
    }
  };

  // Renderizado del formulario
  return (
    <>
      {/* Etapas 1-5 */}
      <FormSection>
        {/* ... campos anteriores ... */}
      </FormSection>

      {/* Etapa 6 - Con campo especial */}
      <FormSection>
        {formFields.map(field => (
          <div key={field.id}>
            {/* Renderizado condicional */}
            {field.id === "autorizacion_datos" ? (
              // Campo especial: DataProtectionCheckbox
              <DataProtectionCheckbox
                checked={formData.autorizacion_datos === true}
                onCheckedChange={(checked) => {
                  updateFormField("autorizacion_datos", checked);
                }}
                onOpenModal={() => setShowDataProtectionModal(true)}
                hasAcceptedTerms={hasAcceptedDataProtection}
              />
            ) : (
              // Campo estándar
              <StandardFormField
                field={field}
                value={formData[field.id]}
                onChange={(value) => updateFormField(field.id, value)}
              />
            )}
          </div>
        ))}
      </FormSection>

      {/* Modal de términos */}
      <DataProtectionModal
        open={showDataProtectionModal}
        onOpenChange={setShowDataProtectionModal}
        onAccept={() => {
          setHasAcceptedDataProtection(true);
        }}
        isRequired={true}
      />

      {/* Botón Submit */}
      <button onClick={handleSubmit}>
        Guardar Encuesta
      </button>
    </>
  );
};
```

---

## Validation Examples

### Frontend Validation

```typescript
// ✅ VALIDACIÓN EN CLIENTE CON ZOD

import { z } from "zod";

const surveyFormSchema = z.object({
  // ... otros campos ...
  
  autorizacion_datos: z
    .boolean()
    .refine(
      val => val === true,
      {
        message: "Debes aceptar los términos de protección de datos",
      }
    ),
});

type SurveyFormData = z.infer<typeof surveyFormSchema>;

// En el form
const form = useForm<SurveyFormData>({
  resolver: zodResolver(surveyFormSchema),
});

// Validación automática en submit
const onSubmit = (data: SurveyFormData) => {
  // En este punto, autorizacion_datos SIEMPRE es true
  // Si no, el form no envía
  submitSurvey(data);
};
```

### Backend Validation (Express Example)

```typescript
// ✅ VALIDACIÓN EN SERVIDOR CON Express

import { body, validationResult } from "express-validator";

router.post("/encuestas", [
  // Validaciones básicas
  body("nombres").notEmpty().trim(),
  body("apellidos").notEmpty().trim(),
  // ... otros campos ...
  
  // ⭐ VALIDACIÓN CRÍTICA: Autorización
  body("autorizacion_datos")
    .isBoolean()
    .custom(val => val === true)
    .withMessage("La aceptación de términos es obligatoria")
    .bail(),

], (req, res) => {
  // Verificar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  // Si llegamos aquí: autorizacion_datos está validado
  const { autorizacion_datos, ...surveyData } = req.body;
  
  // Guardar encuesta con auditoría
  const survey = createSurvey({
    ...surveyData,
    autorizacion_datos: true,  // Forzar a true
    acceptedAt: new Date(),
    ipAddress: req.ip,
  });

  res.json({ success: true, surveyId: survey.id });
});
```

### Auditoría de Aceptación

```typescript
// ✅ REGISTRAR ACEPTACIONES PARA AUDITORÍA

import { createLogger } from "@/lib/logger";

const auditLog = createLogger("audit");

const logTermsAcceptance = async (userId: string, surveyId: string) => {
  await AuditLog.create({
    event: "DATA_PROTECTION_ACCEPTED",
    userId,
    surveyId,
    timestamp: new Date(),
    ipAddress: getClientIP(),
    userAgent: getUserAgent(),
    version: "2.0",  // Versión de términos
  });

  // También guardar en evento de seguimiento
  auditLog.info("Data protection accepted", {
    userId,
    surveyId,
    timestamp: new Date().toISOString(),
  });
};

// Llamar después de aceptar
const handleAccept = async () => {
  setHasAcceptedDataProtection(true);
  
  // Enviar evento de auditoría al backend
  await fetch("/api/audit/data-protection-accepted", {
    method: "POST",
    body: JSON.stringify({
      surveyId: currentSurveyId,
      timestamp: new Date(),
    }),
  });
};
```

---

## Testing Examples

### Unit Test - DataProtectionCheckbox

```typescript
// ✅ TEST UNITARIO

import { render, screen, fireEvent } from "@testing-library/react";
import DataProtectionCheckbox from "@/components/survey/DataProtectionCheckbox";

describe("DataProtectionCheckbox", () => {
  
  test("should render with disabled checkbox when hasAcceptedTerms is false", () => {
    const mockOnChange = jest.fn();
    const mockOnOpenModal = jest.fn();

    render(
      <DataProtectionCheckbox
        checked={false}
        onCheckedChange={mockOnChange}
        onOpenModal={mockOnOpenModal}
        hasAcceptedTerms={false}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  test("should enable checkbox when hasAcceptedTerms is true", () => {
    const mockOnChange = jest.fn();
    const mockOnOpenModal = jest.fn();

    render(
      <DataProtectionCheckbox
        checked={false}
        onCheckedChange={mockOnChange}
        onOpenModal={mockOnOpenModal}
        hasAcceptedTerms={true}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeDisabled();
  });

  test("should call onOpenModal when button is clicked", () => {
    const mockOnChange = jest.fn();
    const mockOnOpenModal = jest.fn();

    render(
      <DataProtectionCheckbox
        checked={false}
        onCheckedChange={mockOnChange}
        onOpenModal={mockOnOpenModal}
        hasAcceptedTerms={false}
      />
    );

    const button = screen.getByText(/Ver términos/i);
    fireEvent.click(button);

    expect(mockOnOpenModal).toHaveBeenCalledTimes(1);
  });

  test("should call onCheckedChange when checkbox is toggled", () => {
    const mockOnChange = jest.fn();
    const mockOnOpenModal = jest.fn();

    render(
      <DataProtectionCheckbox
        checked={false}
        onCheckedChange={mockOnChange}
        onOpenModal={mockOnOpenModal}
        hasAcceptedTerms={true}  // Habilitado
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  test("should show ámbar alert when not accepted", () => {
    render(
      <DataProtectionCheckbox
        checked={false}
        onCheckedChange={() => {}}
        onOpenModal={() => {}}
        hasAcceptedTerms={false}
      />
    );

    const alert = screen.getByText(/Debes leer y aceptar/i);
    expect(alert).toBeInTheDocument();
  });

  test("should show green alert when accepted", () => {
    render(
      <DataProtectionCheckbox
        checked={false}
        onCheckedChange={() => {}}
        onOpenModal={() => {}}
        hasAcceptedTerms={true}
      />
    );

    const alert = screen.getByText(/aceptados/i);
    expect(alert).toBeInTheDocument();
  });
});
```

### Integration Test - Scroll Detection

```typescript
// ✅ TEST DE INTEGRACIÓN: SCROLL DETECTION

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DataProtectionModal from "@/components/survey/DataProtectionModal";

describe("DataProtectionModal - Scroll Detection", () => {

  test("should prevent checkbox marking until scroll to end", async () => {
    const mockOnAccept = jest.fn();

    render(
      <DataProtectionModal
        open={true}
        onOpenChange={() => {}}
        onAccept={mockOnAccept}
      />
    );

    // Checkbox debe estar deshabilitado al abrir
    const checkbox = screen.getByRole("checkbox", { name: /términos/i });
    expect(checkbox).toBeDisabled();

    // Simular scroll (no al final)
    const scrollArea = screen.getByRole("region");
    Object.defineProperty(scrollArea, "scrollHeight", { value: 3000 });
    Object.defineProperty(scrollArea, "scrollTop", { value: 500 });
    Object.defineProperty(scrollArea, "clientHeight", { value: 600 });
    
    fireEvent.scroll(scrollArea, { target: { scrollY: 500 } });

    // Checkbox aún debe estar deshabilitado
    expect(checkbox).toBeDisabled();
  });

  test("should enable checkbox after scroll to end", async () => {
    const mockOnAccept = jest.fn();

    const { container } = render(
      <DataProtectionModal
        open={true}
        onOpenChange={() => {}}
        onAccept={mockOnAccept}
      />
    );

    const scrollArea = container.querySelector('[data-scroll-area]');

    // Simular scroll al final
    Object.defineProperty(scrollArea, "scrollHeight", { value: 3000 });
    Object.defineProperty(scrollArea, "scrollTop", { value: 2400 });
    Object.defineProperty(scrollArea, "clientHeight", { value: 600 });
    
    fireEvent.scroll(scrollArea);

    // Checkbox debe habilitarse
    const checkbox = screen.getByRole("checkbox", { name: /términos/i });
    expect(checkbox).not.toBeDisabled();
  });

  test("should enable button after scroll + checkbox marked", async () => {
    const mockOnAccept = jest.fn();

    const { container } = render(
      <DataProtectionModal
        open={true}
        onOpenChange={() => {}}
        onAccept={mockOnAccept}
      />
    );

    const scrollArea = container.querySelector('[data-scroll-area]');

    // Scroll to end
    Object.defineProperty(scrollArea, "scrollHeight", { value: 3000 });
    Object.defineProperty(scrollArea, "scrollTop", { value: 2400 });
    Object.defineProperty(scrollArea, "clientHeight", { value: 600 });
    fireEvent.scroll(scrollArea);

    // Marcar checkbox
    const checkbox = screen.getByRole("checkbox", { name: /términos/i });
    fireEvent.click(checkbox);

    // Botón debe habilitarse
    const button = screen.getByRole("button", { name: /Aceptar/i });
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
```

---

## Advanced Patterns

### Custom Hook: useDataProtectionFlow

```typescript
// ✅ HOOK PERSONALIZADO

interface UseDataProtectionFlowResult {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  hasAcceptedTerms: boolean;
  setAccepted: (accepted: boolean) => void;
  hasScrolledToEnd: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const useDataProtectionFlow = (): UseDataProtectionFlowResult => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const distanceFromBottom = 
      element.scrollHeight - (element.scrollTop + element.clientHeight);
    
    setHasScrolledToEnd(distanceFromBottom < 20);
  };

  // Reset cuando modal abre
  useEffect(() => {
    if (isModalOpen) {
      setHasScrolledToEnd(false);
      setHasAcceptedTerms(false);
    }
  }, [isModalOpen]);

  return {
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    hasAcceptedTerms,
    setAccepted: setHasAcceptedTerms,
    hasScrolledToEnd,
    scrollAreaRef,
    handleScroll,
  };
};

// Uso
const MyComponent = () => {
  const {
    isModalOpen,
    openModal,
    closeModal,
    hasAcceptedTerms,
    scrollAreaRef,
    handleScroll,
  } = useDataProtectionFlow();

  return (
    <>
      <button onClick={openModal}>Ver términos</button>
      <Modal open={isModalOpen} onOpenChange={closeModal}>
        <ScrollArea
          ref={scrollAreaRef}
          onScroll={handleScroll}
        >
          {/* ... */}
        </ScrollArea>
      </Modal>
    </>
  );
};
```

### Context Provider Pattern

```typescript
// ✅ CONTEXT PARA MANEJO GLOBAL

import { createContext, useContext } from "react";

interface DataProtectionContextType {
  hasAcceptedDataProtection: boolean;
  setHasAcceptedDataProtection: (accepted: boolean) => void;
  showDataProtectionModal: boolean;
  setShowDataProtectionModal: (show: boolean) => void;
}

const DataProtectionContext = createContext<DataProtectionContextType | undefined>(
  undefined
);

export const DataProtectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasAcceptedDataProtection, setHasAcceptedDataProtection] = useState(false);
  const [showDataProtectionModal, setShowDataProtectionModal] = useState(false);

  return (
    <DataProtectionContext.Provider
      value={{
        hasAcceptedDataProtection,
        setHasAcceptedDataProtection,
        showDataProtectionModal,
        setShowDataProtectionModal,
      }}
    >
      {children}
    </DataProtectionContext.Provider>
  );
};

export const useDataProtection = () => {
  const context = useContext(DataProtectionContext);
  if (!context) {
    throw new Error("useDataProtection must be used inside DataProtectionProvider");
  }
  return context;
};

// En SurveyForm
const SurveyForm = () => {
  const {
    hasAcceptedDataProtection,
    setHasAcceptedDataProtection,
    showDataProtectionModal,
    setShowDataProtectionModal,
  } = useDataProtection();

  // ... resto del código
};
```

### Verificación de Versión de Términos

```typescript
// ✅ VERSIONING DE TÉRMINOS

const TERMS_VERSION = "2.0";

interface UserTermsAcceptance {
  userId: string;
  termsVersion: string;
  acceptedAt: Date;
  ipAddress: string;
}

const hasUserAcceptedCurrentTerms = async (userId: string): Promise<boolean> => {
  const acceptance = await db.userTermsAcceptance.findOne({
    userId,
    termsVersion: TERMS_VERSION,
  });

  return !!acceptance;
};

// Si términos cambian a v3.0, usuarios deben aceptar de nuevo
const checkTermsUpdateRequired = async (userId: string): Promise<boolean> => {
  const latestAcceptance = await db.userTermsAcceptance
    .findOne({ userId })
    .sort({ acceptedAt: -1 });

  if (!latestAcceptance) return true;  // Nunca aceptó
  
  return latestAcceptance.termsVersion !== TERMS_VERSION;
};
```

---

**Documento:** `EJEMPLOS-CODIGO-DATA-PROTECTION.md`
**Versión:** 2.0
**Estado:** ✅ Referencia Completa
**Última actualización:** 2025-01-22
