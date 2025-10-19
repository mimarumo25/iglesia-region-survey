# 📋 Referencia de IDs para Automatización de Pruebas

Este documento lista todos los IDs únicos (`data-testid` e `id`) agregados al formulario de encuesta para facilitar la automatización de pruebas.

## 🎯 Convenciones de Nomenclatura

Los IDs siguen un patrón consistente para facilitar su uso:

```
{componente}-{campo}-{tipo}
```

### Ejemplos:
- `input-{nombre_campo}` - Campos de entrada de texto
- `checkbox-{nombre_campo}` - Casillas de verificación
- `autocomplete-{nombre_campo}` - Selectores autocomplete
- `date-picker-{nombre_campo}` - Selectores de fecha
- `textarea-{nombre_campo}` - Áreas de texto
- `{accion}-button` - Botones de acción

---

## 🏗️ Componente: SurveyForm

### Contenedor Principal
```typescript
data-testid="survey-form-container"
```

### Indicador de Etapa
```typescript
data-testid="stage-indicator-{numero}" // 1-6
data-testid="stage-title"
data-testid="stage-description"
```

### Card de Etapa
```typescript
data-testid="survey-stage-{numero}-card" // 1-6
id="survey-stage-{numero}"
```

---

## 🗑️ Acciones de Borrador

### Botón Limpiar Borrador
```typescript
data-testid="draft-actions-container"
data-testid="clear-draft-button"
id="clear-draft-button"
```

### Confirmación de Limpieza
```typescript
data-testid="cancel-clear-draft-button"
data-testid="confirm-clear-draft-button"
```

---

## ✏️ Modo Edición

### Contenedor de Acciones de Edición
```typescript
data-testid="edit-mode-actions-container"
```

### Botón Cancelar Edición
```typescript
data-testid="cancel-edit-button"
id="cancel-edit-button"
```

### Badge de Modo Edición
```typescript
data-testid="edit-mode-badge"
data-testid="edit-survey-id"
```

### Confirmación de Cancelación
```typescript
data-testid="cancel-edit-cancel-button"
data-testid="confirm-cancel-edit-button"
```

---

## 📝 Campos del Formulario (StandardFormField)

### Estructura General
Todos los campos siguen este patrón:

```typescript
// Contenedor del campo
data-testid="field-group-{nombre_campo}"

// Label del campo
data-testid="label-{nombre_campo}"
```

### Campos de Texto e Input
```typescript
// Ejemplo: municipio, parroquia, apellido_familiar, direccion, telefono, etc.
data-testid="input-{nombre_campo}"
id="{nombre_campo}"
name="{nombre_campo}"
```

#### Ejemplos específicos (Etapa 1):
- `input-municipio`
- `input-parroquia`
- `input-apellido_familiar`
- `input-vereda`
- `input-sector`
- `input-direccion`
- `input-telefono`
- `input-numero_contrato_epm`

### Campos de Fecha
```typescript
// Campo fecha principal (solo lectura)
data-testid="field-group-fecha"
data-testid="date-display-fecha"

// Otros campos de fecha
data-testid="date-picker-{nombre_campo}"
```

### Campos Autocomplete
```typescript
data-testid="autocomplete-{nombre_campo}"
```

#### Ejemplos (Etapas 1-3):
- `autocomplete-municipio`
- `autocomplete-parroquia`
- `autocomplete-sector`
- `autocomplete-vereda`
- `autocomplete-tipo_vivienda`
- `autocomplete-sistema_acueducto`

### Campos Boolean (Checkbox Simple)
```typescript
data-testid="checkbox-{nombre_campo}"
```

#### Ejemplo (Etapa 6):
- `checkbox-autorizacion_datos`

### Campos Multiple-Checkbox
```typescript
// Opción individual
data-testid="checkbox-option-{nombre_campo}-{valor}"
data-testid="checkbox-{nombre_campo}-{valor}"
data-testid="label-{nombre_campo}-{valor}"
```

#### Ejemplos (Etapa 2 - Disposición de Basura):
- `checkbox-option-disposicion_basura-recolector`
- `checkbox-disposicion_basura-quemada`
- `checkbox-disposicion_basura-enterrada`
- `checkbox-disposicion_basura-recicla`
- `checkbox-disposicion_basura-aire_libre`

#### Ejemplos (Etapa 3 - Aguas Residuales):
- `checkbox-option-aguas_residuales-{id_opcion}`

### Campos Textarea
```typescript
data-testid="textarea-{nombre_campo}"
id="{nombre_campo}"
name="{nombre_campo}"
```

#### Ejemplos (Etapa 6):
- `textarea-sustento_familia`
- `textarea-observaciones_encuestador`

### Estados de Carga y Error
```typescript
data-testid="loading-{nombre_campo}"
data-testid="error-{nombre_campo}"
```

---

## 🚦 Controles de Navegación (SurveyControls)

### Contenedor
```typescript
data-testid="survey-controls"
```

### Botones de Navegación
```typescript
// Botón Anterior
data-testid="previous-stage-button"
id="previous-stage-button"

// Botón Siguiente
data-testid="next-stage-button"
id="next-stage-button"

// Botón Enviar/Guardar
data-testid="submit-survey-button"
id="submit-survey-button"
```

---

## 👨‍👩‍👧‍👦 Familia (FamilyGrid)

### Contenedores
```typescript
data-testid="family-grid-container"
data-testid="family-grid-header"
```

### Botón Agregar Miembro
```typescript
data-testid="add-family-member-button"
id="add-family-member-button"
```

---

## 💀 Difuntos (DeceasedGrid)

### Contenedores
```typescript
data-testid="deceased-grid-container"
data-testid="deceased-grid-header"
```

### Botón Agregar Difunto
```typescript
data-testid="add-deceased-member-button"
id="add-deceased-member-button"
```

---

## 📋 Diálogo Miembro Familiar (FamilyMemberDialog)

### Campos Principales
```typescript
// Nombres
data-testid="family-member-nombres-input"
id="family-member-nombres"

// Número de Identificación
data-testid="family-member-numero-identificacion-input"
id="family-member-numero-identificacion"
```

### Botones del Diálogo
```typescript
data-testid="family-member-cancel-button"
data-testid="family-member-submit-button"
id="family-member-submit-button"
```

---

## 🧪 Ejemplos de Uso en Automatización

### Playwright/Puppeteer
```javascript
// Rellenar campo de texto
await page.fill('[data-testid="input-apellido_familiar"]', 'García Martínez');

// Click en botón
await page.click('[data-testid="next-stage-button"]');

// Seleccionar checkbox
await page.check('[data-testid="checkbox-autorizacion_datos"]');

// Verificar texto
await expect(page.locator('[data-testid="stage-title"]')).toContainText('Información General');
```

### Selenium
```python
# Encontrar elemento
input_apellido = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-apellido_familiar"]')
input_apellido.send_keys('García Martínez')

# Click en botón
next_button = driver.find_element(By.CSS_SELECTOR, '[data-testid="next-stage-button"]')
next_button.click()

# Verificar checkbox
checkbox = driver.find_element(By.CSS_SELECTOR, '[data-testid="checkbox-autorizacion_datos"]')
checkbox.click()
```

### Cypress
```javascript
// Rellenar formulario
cy.get('[data-testid="input-apellido_familiar"]').type('García Martínez');
cy.get('[data-testid="input-direccion"]').type('Calle 123 #45-67');

// Navegación
cy.get('[data-testid="next-stage-button"]').click();

// Verificaciones
cy.get('[data-testid="stage-title"]').should('contain', 'Información General');
cy.get('[data-testid="stage-indicator-1"]').should('be.visible');
```

---

## 📊 Mapa de Etapas del Formulario

### Etapa 1: Información General
**ID de Card**: `survey-stage-1`

Campos principales:
- `input-municipio` / `autocomplete-municipio`
- `input-parroquia` / `autocomplete-parroquia`
- `date-display-fecha`
- `input-apellido_familiar`
- `input-vereda` / `autocomplete-vereda`
- `input-sector` / `autocomplete-sector`
- `input-direccion`
- `input-telefono`
- `input-numero_contrato_epm`

### Etapa 2: Información de Vivienda y Basuras
**ID de Card**: `survey-stage-2`

Campos principales:
- `autocomplete-tipo_vivienda`
- `checkbox-disposicion_basura-*` (múltiples opciones)

### Etapa 3: Acueducto y Aguas Residuales
**ID de Card**: `survey-stage-3`

Campos principales:
- `autocomplete-sistema_acueducto`
- `checkbox-aguas_residuales-*` (múltiples opciones)

### Etapa 4: Información Familiar
**ID de Card**: `survey-stage-4`

Componentes:
- `family-grid-container`
- `add-family-member-button`
- Diálogo: `family-member-dialog`

### Etapa 5: Difuntos de la Familia
**ID de Card**: `survey-stage-5`

Componentes:
- `deceased-grid-container`
- `add-deceased-member-button`
- Diálogo: `deceased-member-dialog`

### Etapa 6: Observaciones y Consentimiento
**ID de Card**: `survey-stage-6`

Campos principales:
- `textarea-sustento_familia`
- `textarea-observaciones_encuestador`
- `checkbox-autorizacion_datos`

---

## 🎯 Flujo de Prueba Completo Sugerido

```javascript
// 1. Verificar carga inicial
cy.get('[data-testid="survey-form-container"]').should('be.visible');
cy.get('[data-testid="stage-indicator-1"]').should('contain', '1');

// 2. Completar Etapa 1
cy.get('[data-testid="autocomplete-municipio"]').click();
// ... seleccionar opción
cy.get('[data-testid="input-apellido_familiar"]').type('García');
cy.get('[data-testid="input-direccion"]').type('Calle 123');
cy.get('[data-testid="next-stage-button"]').click();

// 3. Verificar transición a Etapa 2
cy.get('[data-testid="stage-indicator-2"]').should('contain', '2');
cy.get('[data-testid="stage-title"]').should('contain', 'Información de Vivienda');

// 4. Completar Etapa 2
cy.get('[data-testid="autocomplete-tipo_vivienda"]').click();
cy.get('[data-testid="checkbox-disposicion_basura-recolector"]').check();
cy.get('[data-testid="next-stage-button"]').click();

// 5. Continuar con etapas restantes...

// 6. Agregar miembro familiar en Etapa 4
cy.get('[data-testid="add-family-member-button"]').click();
cy.get('[data-testid="family-member-nombres-input"]').type('Juan García');
cy.get('[data-testid="family-member-numero-identificacion-input"]').type('123456789');
cy.get('[data-testid="family-member-submit-button"]').click();

// 7. Finalizar y enviar
cy.get('[data-testid="checkbox-autorizacion_datos"]').check();
cy.get('[data-testid="submit-survey-button"]').click();
```

---

## 📝 Notas Importantes

1. **Consistencia**: Todos los IDs siguen el patrón `{componente}-{campo}-{tipo}`
2. **Jerarquía**: Usa `field-group-{nombre}` para contenedores y `{tipo}-{nombre}` para elementos
3. **IDs Dinámicos**: Los checkboxes múltiples usan el valor en minúsculas con guiones
4. **Dual ID**: Los elementos críticos tienen tanto `data-testid` como `id` para flexibilidad
5. **Accesibilidad**: Todos los campos mantienen sus labels y ARIA attributes originales

---

## 🔄 Actualización del Documento

**Última actualización**: 16 de Octubre de 2025  
**Versión**: 1.0.0  
**Autor**: GitHub Copilot  

### Changelog
- **v1.0.0** (2025-10-16): Versión inicial con IDs completos del formulario de encuesta

---

## 📞 Contacto y Soporte

Si necesitas agregar más IDs o modificar los existentes, consulta:
- Archivo de instrucciones: `.github/instructions/documentos.instructions.md`
- Componentes principales: `src/components/SurveyForm.tsx` y `src/components/survey/`
