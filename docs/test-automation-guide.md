# 🤖 Guía de Automatización de Pruebas - Sistema MIA

Esta guía proporciona casos de prueba específicos y ejemplos de código para automatizar las pruebas del formulario de encuesta.

## 📑 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Casos de Prueba por Etapa](#casos-de-prueba-por-etapa)
3. [Pruebas de Navegación](#pruebas-de-navegación)
4. [Pruebas de Validación](#pruebas-de-validación)
5. [Pruebas de Integración](#pruebas-de-integración)
6. [Datos de Prueba](#datos-de-prueba)

---

## 🚀 Configuración Inicial

### Playwright Setup

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:8081',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
```

### Cypress Setup

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    screenshotOnRunFailure: true,
  },
});
```

---

## 📋 Casos de Prueba por Etapa

### Etapa 1: Información General

#### TC-001: Completar campos obligatorios correctamente

**Playwright:**
```javascript
import { test, expect } from '@playwright/test';

test('TC-001: Completar Etapa 1 con datos válidos', async ({ page }) => {
  await page.goto('/survey');
  
  // Verificar carga inicial
  await expect(page.locator('[data-testid="survey-form-container"]')).toBeVisible();
  await expect(page.locator('[data-testid="stage-indicator-1"]')).toContainText('1');
  
  // Completar Municipio (Autocomplete)
  await page.locator('[data-testid="autocomplete-municipio"]').click();
  await page.locator('text=Medellín').click();
  
  // Completar Parroquia (Autocomplete)
  await page.locator('[data-testid="autocomplete-parroquia"]').click();
  await page.locator('text=San José').click();
  
  // Apellido Familiar
  await page.locator('[data-testid="input-apellido_familiar"]').fill('García Martínez');
  
  // Sector
  await page.locator('[data-testid="autocomplete-sector"]').click();
  await page.locator('text=Centro').click();
  
  // Dirección
  await page.locator('[data-testid="input-direccion"]').fill('Calle 50 #45-67');
  
  // Teléfono (opcional)
  await page.locator('[data-testid="input-telefono"]').fill('3001234567');
  
  // Verificar que el botón siguiente esté habilitado
  await expect(page.locator('[data-testid="next-stage-button"]')).toBeEnabled();
  
  // Avanzar a la siguiente etapa
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // Verificar transición a Etapa 2
  await expect(page.locator('[data-testid="stage-indicator-2"]')).toContainText('2');
});
```

**Cypress:**
```javascript
describe('TC-001: Etapa 1 - Información General', () => {
  beforeEach(() => {
    cy.visit('/survey');
  });

  it('Debe completar todos los campos obligatorios correctamente', () => {
    // Verificar carga inicial
    cy.get('[data-testid="survey-form-container"]').should('be.visible');
    cy.get('[data-testid="stage-indicator-1"]').should('contain', '1');
    
    // Completar campos con autocomplete
    cy.get('[data-testid="autocomplete-municipio"]').click();
    cy.contains('Medellín').click();
    
    cy.get('[data-testid="autocomplete-parroquia"]').click();
    cy.contains('San José').click();
    
    // Campos de texto
    cy.get('[data-testid="input-apellido_familiar"]').type('García Martínez');
    
    cy.get('[data-testid="autocomplete-sector"]').click();
    cy.contains('Centro').click();
    
    cy.get('[data-testid="input-direccion"]').type('Calle 50 #45-67');
    cy.get('[data-testid="input-telefono"]').type('3001234567');
    
    // Avanzar
    cy.get('[data-testid="next-stage-button"]').click();
    
    // Verificar transición
    cy.get('[data-testid="stage-indicator-2"]').should('contain', '2');
    cy.get('[data-testid="stage-title"]').should('contain', 'Vivienda');
  });
});
```

#### TC-002: Validar campos obligatorios vacíos

**Playwright:**
```javascript
test('TC-002: Validar campos obligatorios en Etapa 1', async ({ page }) => {
  await page.goto('/survey');
  
  // Intentar avanzar sin completar campos
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // Verificar que aparece el toast de error
  await expect(page.locator('text=Campos requeridos')).toBeVisible();
  
  // Verificar que seguimos en Etapa 1
  await expect(page.locator('[data-testid="stage-indicator-1"]')).toContainText('1');
});
```

---

### Etapa 2: Información de Vivienda y Basuras

#### TC-003: Seleccionar tipo de vivienda y disposición de basuras

**Playwright:**
```javascript
test('TC-003: Completar Etapa 2 - Vivienda', async ({ page }) => {
  // Navegar a Etapa 2 (asumiendo que Etapa 1 está completa)
  await page.goto('/survey');
  await completarEtapa1(page); // Función helper
  
  // Verificar que estamos en Etapa 2
  await expect(page.locator('[data-testid="stage-indicator-2"]')).toContainText('2');
  
  // Seleccionar tipo de vivienda
  await page.locator('[data-testid="autocomplete-tipo_vivienda"]').click();
  await page.locator('text=Casa').click();
  
  // Seleccionar múltiples opciones de disposición de basura
  await page.locator('[data-testid="checkbox-disposicion_basura-recolector"]').check();
  await page.locator('[data-testid="checkbox-disposicion_basura-recicla"]').check();
  
  // Verificar que los checkboxes están marcados
  await expect(page.locator('[data-testid="checkbox-disposicion_basura-recolector"]')).toBeChecked();
  await expect(page.locator('[data-testid="checkbox-disposicion_basura-recicla"]')).toBeChecked();
  
  // Avanzar a Etapa 3
  await page.locator('[data-testid="next-stage-button"]').click();
  await expect(page.locator('[data-testid="stage-indicator-3"]')).toContainText('3');
});
```

---

### Etapa 4: Información Familiar

#### TC-004: Agregar miembro de familia

**Playwright:**
```javascript
test('TC-004: Agregar miembro familiar', async ({ page }) => {
  await page.goto('/survey');
  
  // Navegar hasta Etapa 4
  await navegarHastaEtapa4(page); // Función helper
  
  // Verificar que estamos en Etapa 4
  await expect(page.locator('[data-testid="family-grid-container"]')).toBeVisible();
  
  // Click en agregar miembro
  await page.locator('[data-testid="add-family-member-button"]').click();
  
  // Esperar a que el diálogo se abra
  await page.waitForSelector('[data-testid="family-member-nombres-input"]');
  
  // Completar información del miembro
  await page.locator('[data-testid="family-member-nombres-input"]').fill('Juan Carlos García');
  await page.locator('[data-testid="family-member-numero-identificacion-input"]').fill('1234567890');
  
  // Guardar miembro
  await page.locator('[data-testid="family-member-submit-button"]').click();
  
  // Verificar que el diálogo se cerró
  await expect(page.locator('[data-testid="family-member-nombres-input"]')).not.toBeVisible();
  
  // Verificar que el miembro aparece en la tabla
  await expect(page.locator('text=Juan Carlos García')).toBeVisible();
});
```

**Cypress:**
```javascript
describe('TC-004: Gestión de Familia', () => {
  it('Debe agregar un miembro familiar correctamente', () => {
    cy.visit('/survey');
    
    // Navegar a Etapa 4
    navegarHastaEtapa4(); // Custom command
    
    // Verificar tabla vacía inicial
    cy.get('[data-testid="family-grid-container"]').should('be.visible');
    
    // Abrir diálogo
    cy.get('[data-testid="add-family-member-button"]').click();
    
    // Completar formulario
    cy.get('[data-testid="family-member-nombres-input"]')
      .should('be.visible')
      .type('Juan Carlos García');
    
    cy.get('[data-testid="family-member-numero-identificacion-input"]')
      .type('1234567890');
    
    // Guardar
    cy.get('[data-testid="family-member-submit-button"]').click();
    
    // Verificar que aparece en la tabla
    cy.contains('Juan Carlos García').should('be.visible');
    cy.contains('1234567890').should('be.visible');
  });
});
```

---

## 🔄 Pruebas de Navegación

### TC-005: Navegación adelante y atrás entre etapas

**Playwright:**
```javascript
test('TC-005: Navegación entre etapas', async ({ page }) => {
  await page.goto('/survey');
  
  // Completar Etapa 1
  await completarEtapa1(page);
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // Verificar Etapa 2
  await expect(page.locator('[data-testid="stage-indicator-2"]')).toContainText('2');
  
  // Regresar a Etapa 1
  await page.locator('[data-testid="previous-stage-button"]').click();
  await expect(page.locator('[data-testid="stage-indicator-1"]')).toContainText('1');
  
  // Verificar que los datos se mantienen
  await expect(page.locator('[data-testid="input-apellido_familiar"]')).toHaveValue('García Martínez');
  
  // Avanzar nuevamente
  await page.locator('[data-testid="next-stage-button"]').click();
  await expect(page.locator('[data-testid="stage-indicator-2"]')).toContainText('2');
});
```

---

## ✅ Pruebas de Validación

### TC-006: Validar formato de teléfono

**Cypress:**
```javascript
it('TC-006: Validar formato de teléfono', () => {
  cy.visit('/survey');
  
  // Ingresar teléfono inválido
  cy.get('[data-testid="input-telefono"]').type('123');
  
  // Verificar mensaje de error
  cy.contains('formato inválido').should('be.visible');
  
  // Corregir con formato válido
  cy.get('[data-testid="input-telefono"]').clear().type('3001234567');
  
  // Verificar que el error desapareció
  cy.contains('formato inválido').should('not.exist');
});
```

### TC-007: Validar campo obligatorio de autorización

**Playwright:**
```javascript
test('TC-007: Validar autorización de datos en Etapa 6', async ({ page }) => {
  await page.goto('/survey');
  
  // Navegar hasta Etapa 6
  await navegarHastaEtapa6(page);
  
  // Intentar enviar sin marcar autorización
  await page.locator('[data-testid="submit-survey-button"]').click();
  
  // Verificar mensaje de error
  await expect(page.locator('text=Campos requeridos')).toBeVisible();
  await expect(page.locator('text=Autorización')).toBeVisible();
  
  // Marcar autorización
  await page.locator('[data-testid="checkbox-autorizacion_datos"]').check();
  
  // Verificar que ahora se puede enviar
  await expect(page.locator('[data-testid="checkbox-autorizacion_datos"]')).toBeChecked();
});
```

---

## 🔗 Pruebas de Integración

### TC-008: Flujo completo de creación de encuesta

**Playwright:**
```javascript
test('TC-008: Flujo completo de encuesta', async ({ page }) => {
  await page.goto('/survey');
  
  // === ETAPA 1 ===
  await completarEtapa1Completa(page);
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // === ETAPA 2 ===
  await page.locator('[data-testid="autocomplete-tipo_vivienda"]').click();
  await page.locator('text=Casa').click();
  await page.locator('[data-testid="checkbox-disposicion_basura-recolector"]').check();
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // === ETAPA 3 ===
  await page.locator('[data-testid="autocomplete-sistema_acueducto"]').click();
  await page.locator('text=Acueducto').first().click();
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // === ETAPA 4 - Agregar familia ===
  await page.locator('[data-testid="add-family-member-button"]').click();
  await page.locator('[data-testid="family-member-nombres-input"]').fill('Juan García');
  await page.locator('[data-testid="family-member-numero-identificacion-input"]').fill('123456789');
  await page.locator('[data-testid="family-member-submit-button"]').click();
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // === ETAPA 5 - Saltar difuntos ===
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // === ETAPA 6 - Finalizar ===
  await page.locator('[data-testid="textarea-sustento_familia"]').fill('Comercio local');
  await page.locator('[data-testid="checkbox-autorizacion_datos"]').check();
  
  // Enviar encuesta
  await page.locator('[data-testid="submit-survey-button"]').click();
  
  // Verificar mensaje de éxito
  await expect(page.locator('text=Encuesta creada exitosamente')).toBeVisible({ timeout: 10000 });
  
  // Verificar redirección
  await page.waitForURL('**/surveys', { timeout: 10000 });
});
```

---

## 📊 Datos de Prueba

### Conjunto de Datos de Prueba #1 - Familia Completa

```javascript
const datosPruebaFamiliaCompleta = {
  etapa1: {
    municipio: 'Medellín',
    parroquia: 'San José',
    apellido_familiar: 'García Martínez',
    sector: 'Centro',
    direccion: 'Calle 50 #45-67',
    telefono: '3001234567',
    numero_contrato_epm: 'EPM-12345'
  },
  etapa2: {
    tipo_vivienda: 'Casa',
    disposicion_basura: ['recolector', 'recicla']
  },
  etapa3: {
    sistema_acueducto: 'Acueducto Municipal',
    aguas_residuales: ['alcantarillado']
  },
  etapa4: {
    miembros: [
      {
        nombres: 'Juan Carlos García Martínez',
        numero_identificacion: '1234567890',
        tipo_identificacion: 'Cédula de Ciudadanía'
      },
      {
        nombres: 'María Elena García López',
        numero_identificacion: '0987654321',
        tipo_identificacion: 'Cédula de Ciudadanía'
      }
    ]
  },
  etapa5: {
    difuntos: []
  },
  etapa6: {
    sustento_familia: 'Comercio local y agricultura',
    observaciones_encuestador: 'Familia colaboradora',
    autorizacion_datos: true
  }
};
```

### Conjunto de Datos de Prueba #2 - Datos Mínimos

```javascript
const datosPruebaMinimos = {
  etapa1: {
    municipio: 'Bello',
    parroquia: 'Santa Ana',
    apellido_familiar: 'López',
    sector: 'Norte',
    direccion: 'Carrera 10 #20-30'
  },
  etapa2: {
    tipo_vivienda: 'Apartamento',
    disposicion_basura: ['recolector']
  },
  etapa3: {
    sistema_acueducto: null,
    aguas_residuales: []
  },
  etapa4: {
    miembros: [
      {
        nombres: 'Pedro López',
        numero_identificacion: '111222333',
        tipo_identificacion: 'Cédula de Ciudadanía'
      }
    ]
  },
  etapa5: {
    difuntos: []
  },
  etapa6: {
    sustento_familia: '',
    observaciones_encuestador: '',
    autorizacion_datos: true
  }
};
```

---

## 🛠️ Funciones Helper

### Playwright Helpers

```javascript
// helpers/survey.helpers.js

export async function completarEtapa1(page) {
  await page.locator('[data-testid="autocomplete-municipio"]').click();
  await page.locator('text=Medellín').click();
  
  await page.locator('[data-testid="autocomplete-parroquia"]').click();
  await page.locator('text=San José').click();
  
  await page.locator('[data-testid="input-apellido_familiar"]').fill('García Martínez');
  
  await page.locator('[data-testid="autocomplete-sector"]').click();
  await page.locator('text=Centro').click();
  
  await page.locator('[data-testid="input-direccion"]').fill('Calle 50 #45-67');
}

export async function navegarHastaEtapa4(page) {
  await completarEtapa1(page);
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // Etapa 2
  await page.locator('[data-testid="autocomplete-tipo_vivienda"]').click();
  await page.locator('text=Casa').click();
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // Etapa 3
  await page.locator('[data-testid="next-stage-button"]').click();
  
  // Ahora en Etapa 4
}

export async function agregarMiembroFamiliar(page, datos) {
  await page.locator('[data-testid="add-family-member-button"]').click();
  await page.locator('[data-testid="family-member-nombres-input"]').fill(datos.nombres);
  await page.locator('[data-testid="family-member-numero-identificacion-input"]').fill(datos.numero_identificacion);
  await page.locator('[data-testid="family-member-submit-button"]').click();
}
```

### Cypress Custom Commands

```javascript
// cypress/support/commands.js

Cypress.Commands.add('completarEtapa1', () => {
  cy.get('[data-testid="autocomplete-municipio"]').click();
  cy.contains('Medellín').click();
  
  cy.get('[data-testid="autocomplete-parroquia"]').click();
  cy.contains('San José').click();
  
  cy.get('[data-testid="input-apellido_familiar"]').type('García Martínez');
  
  cy.get('[data-testid="autocomplete-sector"]').click();
  cy.contains('Centro').click();
  
  cy.get('[data-testid="input-direccion"]').type('Calle 50 #45-67');
});

Cypress.Commands.add('navegarHastaEtapa', (etapaNumero) => {
  for (let i = 1; i < etapaNumero; i++) {
    cy.get('[data-testid="next-stage-button"]').click();
    cy.get(`[data-testid="stage-indicator-${i + 1}"]`).should('be.visible');
  }
});

Cypress.Commands.add('agregarMiembroFamiliar', (datos) => {
  cy.get('[data-testid="add-family-member-button"]').click();
  cy.get('[data-testid="family-member-nombres-input"]').type(datos.nombres);
  cy.get('[data-testid="family-member-numero-identificacion-input"]').type(datos.numero_identificacion);
  cy.get('[data-testid="family-member-submit-button"]').click();
});
```

---

## 📝 Checklist de Pruebas

### ✅ Funcionalidad Básica
- [ ] TC-001: Completar Etapa 1 con datos válidos
- [ ] TC-002: Validar campos obligatorios vacíos
- [ ] TC-003: Completar Etapa 2 - Vivienda
- [ ] TC-004: Agregar miembro familiar
- [ ] TC-005: Navegación entre etapas

### ✅ Validaciones
- [ ] TC-006: Validar formato de teléfono
- [ ] TC-007: Validar autorización de datos
- [ ] TC-008: Validar número de identificación único

### ✅ Integración
- [ ] TC-009: Flujo completo de creación de encuesta
- [ ] TC-010: Editar encuesta existente
- [ ] TC-011: Limpiar borrador
- [ ] TC-012: Recuperar sesión interrumpida

### ✅ Accesibilidad
- [ ] TC-013: Navegación por teclado
- [ ] TC-014: Lectores de pantalla
- [ ] TC-015: Contraste de colores

### ✅ Responsive
- [ ] TC-016: Vista móvil (375px)
- [ ] TC-017: Vista tablet (768px)
- [ ] TC-018: Vista desktop (1920px)

---

## 🎯 Métricas de Calidad

### Cobertura Esperada
- **Cobertura de Código**: > 80%
- **Cobertura de Funcionalidad**: 100% de flujos principales
- **Tasa de Éxito**: > 95% en CI/CD

### Tiempos de Ejecución Esperados
- Suite completa: < 10 minutos
- Suite de humo: < 2 minutos
- Prueba individual: < 30 segundos

---

## 📚 Referencias

- [Documentación de IDs de Prueba](./test-ids-reference.md)
- [Playwright Documentation](https://playwright.dev/)
- [Cypress Documentation](https://www.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Última actualización**: 16 de Octubre de 2025  
**Versión**: 1.0.0  
**Autor**: GitHub Copilot
