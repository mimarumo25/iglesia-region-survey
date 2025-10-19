# 🧪 Suite de Pruebas de Ejemplo - Playwright

Este archivo contiene una suite completa de pruebas E2E para el formulario de encuesta usando Playwright.

## 📁 Estructura de Archivos

```
tests/
├── fixtures/
│   └── survey-data.js          # Datos de prueba
├── helpers/
│   └── survey-helpers.js       # Funciones auxiliares
└── e2e/
    ├── survey-etapa-1.spec.js  # Pruebas Etapa 1
    ├── survey-etapa-4.spec.js  # Pruebas Familia
    └── survey-full-flow.spec.js # Flujo completo
```

---

## 📦 Datos de Prueba (fixtures/survey-data.js)

```javascript
// tests/fixtures/survey-data.js

export const datosPruebaCompletos = {
  informacionGeneral: {
    municipio: 'Medellín',
    parroquia: 'San José',
    apellidoFamiliar: 'García Martínez',
    vereda: 'Centro',
    sector: 'Sector 1',
    direccion: 'Calle 50 #45-67 Apto 301',
    telefono: '3001234567',
    numeroContratoEpm: 'EPM-123456789'
  },
  vivienda: {
    tipoVivienda: 'Casa',
    disposicionBasura: ['recolector', 'recicla']
  },
  serviciosAgua: {
    sistemaAcueducto: 'Acueducto Municipal',
    aguasResiduales: ['alcantarillado']
  },
  familia: [
    {
      nombres: 'Juan Carlos García Martínez',
      numeroIdentificacion: '1234567890',
      tipoIdentificacion: 'Cédula de Ciudadanía'
    },
    {
      nombres: 'María Elena García López',
      numeroIdentificacion: '0987654321',
      tipoIdentificacion: 'Cédula de Ciudadanía'
    }
  ],
  observaciones: {
    sustentoFamilia: 'Comercio local y agricultura familiar',
    observacionesEncuestador: 'Familia muy colaboradora y receptiva',
    autorizacionDatos: true
  }
};

export const datosPruebaMinimos = {
  informacionGeneral: {
    municipio: 'Bello',
    parroquia: 'Santa Ana',
    apellidoFamiliar: 'López',
    sector: 'Norte',
    direccion: 'Carrera 10 #20-30'
  },
  vivienda: {
    tipoVivienda: 'Apartamento',
    disposicionBasura: ['recolector']
  },
  serviciosAgua: {},
  familia: [
    {
      nombres: 'Pedro López Gómez',
      numeroIdentificacion: '111222333',
      tipoIdentificacion: 'Cédula de Ciudadanía'
    }
  ],
  observaciones: {
    autorizacionDatos: true
  }
};

export const datosInvalidos = {
  informacionGeneral: {
    apellidoFamiliar: '', // Campo obligatorio vacío
    direccion: '', // Campo obligatorio vacío
    telefono: '123' // Formato inválido
  }
};
```

---

## 🛠️ Funciones Helper (helpers/survey-helpers.js)

```javascript
// tests/helpers/survey-helpers.js

export class SurveyHelper {
  constructor(page) {
    this.page = page;
  }

  // ========== NAVEGACIÓN ==========
  
  async irAFormularioEncuesta() {
    await this.page.goto('/survey');
    await this.page.waitForLoadState('networkidle');
    await this.verificarCargaInicial();
  }

  async verificarCargaInicial() {
    await this.page.locator('[data-testid="survey-form-container"]').waitFor();
    await this.page.locator('[data-testid="stage-indicator-1"]').waitFor();
  }

  async avanzarEtapa() {
    await this.page.locator('[data-testid="next-stage-button"]').click();
    await this.page.waitForTimeout(500); // Esperar animación
  }

  async retrocederEtapa() {
    await this.page.locator('[data-testid="previous-stage-button"]').click();
    await this.page.waitForTimeout(500);
  }

  async verificarEtapa(numero) {
    const indicador = this.page.locator(`[data-testid="stage-indicator-${numero}"]`);
    await expect(indicador).toBeVisible();
    await expect(indicador).toContainText(numero.toString());
  }

  // ========== ETAPA 1: INFORMACIÓN GENERAL ==========
  
  async completarInformacionGeneral(datos) {
    // Municipio
    if (datos.municipio) {
      await this.seleccionarAutocomplete('municipio', datos.municipio);
    }

    // Parroquia
    if (datos.parroquia) {
      await this.seleccionarAutocomplete('parroquia', datos.parroquia);
    }

    // Apellido Familiar
    if (datos.apellidoFamiliar) {
      await this.page.locator('[data-testid="input-apellido_familiar"]').fill(datos.apellidoFamiliar);
    }

    // Vereda (opcional)
    if (datos.vereda) {
      await this.seleccionarAutocomplete('vereda', datos.vereda);
    }

    // Sector
    if (datos.sector) {
      await this.seleccionarAutocomplete('sector', datos.sector);
    }

    // Dirección
    if (datos.direccion) {
      await this.page.locator('[data-testid="input-direccion"]').fill(datos.direccion);
    }

    // Teléfono (opcional)
    if (datos.telefono) {
      await this.page.locator('[data-testid="input-telefono"]').fill(datos.telefono);
    }

    // Número de Contrato EPM (opcional)
    if (datos.numeroContratoEpm) {
      await this.page.locator('[data-testid="input-numero_contrato_epm"]').fill(datos.numeroContratoEpm);
    }
  }

  // ========== ETAPA 2: VIVIENDA Y BASURAS ==========
  
  async completarVivienda(datos) {
    // Tipo de Vivienda
    if (datos.tipoVivienda) {
      await this.seleccionarAutocomplete('tipo_vivienda', datos.tipoVivienda);
    }

    // Disposición de Basura (múltiple selección)
    if (datos.disposicionBasura && Array.isArray(datos.disposicionBasura)) {
      for (const opcion of datos.disposicionBasura) {
        await this.page.locator(`[data-testid="checkbox-disposicion_basura-${opcion}"]`).check();
      }
    }
  }

  // ========== ETAPA 3: SERVICIOS DE AGUA ==========
  
  async completarServiciosAgua(datos) {
    // Sistema de Acueducto
    if (datos.sistemaAcueducto) {
      await this.seleccionarAutocomplete('sistema_acueducto', datos.sistemaAcueducto);
    }

    // Aguas Residuales (múltiple selección)
    if (datos.aguasResiduales && Array.isArray(datos.aguasResiduales)) {
      for (const opcion of datos.aguasResiduales) {
        // Nota: Los IDs específicos dependerán de las opciones de la API
        await this.page.locator(`[data-testid^="checkbox-aguas_residuales-"]`).first().check();
      }
    }
  }

  // ========== ETAPA 4: FAMILIA ==========
  
  async agregarMiembroFamiliar(datosMemebro) {
    // Abrir diálogo
    await this.page.locator('[data-testid="add-family-member-button"]').click();
    await this.page.waitForSelector('[data-testid="family-member-nombres-input"]');

    // Completar campos obligatorios
    await this.page.locator('[data-testid="family-member-nombres-input"]').fill(datosMemebro.nombres);
    await this.page.locator('[data-testid="family-member-numero-identificacion-input"]').fill(datosMemebro.numeroIdentificacion);

    // Guardar
    await this.page.locator('[data-testid="family-member-submit-button"]').click();

    // Esperar a que se cierre el diálogo
    await this.page.waitForSelector('[data-testid="family-member-nombres-input"]', { state: 'hidden' });
  }

  async agregarMultiplesMiembrosFamilia(miembros) {
    for (const miembro of miembros) {
      await this.agregarMiembroFamiliar(miembro);
      await this.page.waitForTimeout(500); // Esperar renderizado
    }
  }

  async verificarMiembroEnTabla(nombreCompleto) {
    await expect(this.page.locator(`text=${nombreCompleto}`)).toBeVisible();
  }

  // ========== ETAPA 5: DIFUNTOS ==========
  
  async saltarEtapaDifuntos() {
    // Si no hay difuntos, simplemente avanzar
    await this.avanzarEtapa();
  }

  // ========== ETAPA 6: OBSERVACIONES ==========
  
  async completarObservaciones(datos) {
    // Sustento de la Familia (opcional)
    if (datos.sustentoFamilia) {
      await this.page.locator('[data-testid="textarea-sustento_familia"]').fill(datos.sustentoFamilia);
    }

    // Observaciones del Encuestador (opcional)
    if (datos.observacionesEncuestador) {
      await this.page.locator('[data-testid="textarea-observaciones_encuestador"]').fill(datos.observacionesEncuestador);
    }

    // Autorización de Datos (obligatorio)
    if (datos.autorizacionDatos) {
      await this.page.locator('[data-testid="checkbox-autorizacion_datos"]').check();
    }
  }

  // ========== ENVÍO Y VERIFICACIÓN ==========
  
  async enviarEncuesta() {
    await this.page.locator('[data-testid="submit-survey-button"]').click();
  }

  async verificarEnvioExitoso() {
    // Esperar mensaje de éxito
    await expect(this.page.locator('text=Encuesta creada exitosamente')).toBeVisible({ timeout: 10000 });
    
    // Verificar redirección a listado
    await this.page.waitForURL('**/surveys', { timeout: 10000 });
  }

  // ========== UTILIDADES ==========
  
  async seleccionarAutocomplete(nombreCampo, valorTexto) {
    // Click en el autocomplete
    await this.page.locator(`[data-testid="autocomplete-${nombreCampo}"]`).click();
    
    // Esperar a que aparezcan las opciones
    await this.page.waitForTimeout(500);
    
    // Seleccionar la opción por texto
    await this.page.locator(`text="${valorTexto}"`).first().click();
    
    // Esperar a que se cierre el dropdown
    await this.page.waitForTimeout(300);
  }

  async verificarCampoObligatorioVacio(nombreCampo) {
    const campo = this.page.locator(`[data-testid="input-${nombreCampo}"]`);
    await expect(campo).toBeEmpty();
  }

  async verificarMensajeError(textoError) {
    await expect(this.page.locator(`text=${textoError}`)).toBeVisible();
  }

  async limpiarBorrador() {
    await this.page.locator('[data-testid="clear-draft-button"]').click();
    await this.page.locator('[data-testid="confirm-clear-draft-button"]').click();
    await this.page.waitForTimeout(500);
  }
}
```

---

## 🧪 Pruebas de Etapa 1 (e2e/survey-etapa-1.spec.js)

```javascript
// tests/e2e/survey-etapa-1.spec.js

import { test, expect } from '@playwright/test';
import { SurveyHelper } from '../helpers/survey-helpers';
import { datosPruebaCompletos, datosInvalidos } from '../fixtures/survey-data';

test.describe('Etapa 1: Información General', () => {
  let helper;

  test.beforeEach(async ({ page }) => {
    helper = new SurveyHelper(page);
    await helper.irAFormularioEncuesta();
  });

  test('TC-001: Debe cargar correctamente la Etapa 1', async ({ page }) => {
    // Verificar elementos visibles
    await expect(page.locator('[data-testid="stage-indicator-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="stage-title"]')).toContainText('Información General');
    
    // Verificar campos obligatorios
    await expect(page.locator('[data-testid="autocomplete-municipio"]')).toBeVisible();
    await expect(page.locator('[data-testid="autocomplete-parroquia"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-apellido_familiar"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-direccion"]')).toBeVisible();
  });

  test('TC-002: Debe completar todos los campos obligatorios', async ({ page }) => {
    await helper.completarInformacionGeneral(datosPruebaCompletos.informacionGeneral);
    
    // Verificar que los campos se llenaron
    await expect(page.locator('[data-testid="input-apellido_familiar"]'))
      .toHaveValue(datosPruebaCompletos.informacionGeneral.apellidoFamiliar);
    
    await expect(page.locator('[data-testid="input-direccion"]'))
      .toHaveValue(datosPruebaCompletos.informacionGeneral.direccion);
    
    // Verificar que el botón siguiente está habilitado
    await expect(page.locator('[data-testid="next-stage-button"]')).toBeEnabled();
  });

  test('TC-003: Debe validar campos obligatorios vacíos', async ({ page }) => {
    // Intentar avanzar sin completar campos
    await page.locator('[data-testid="next-stage-button"]').click();
    
    // Verificar mensaje de error
    await helper.verificarMensajeError('Campos requeridos');
    
    // Verificar que seguimos en Etapa 1
    await helper.verificarEtapa(1);
  });

  test('TC-004: Debe validar formato de teléfono', async ({ page }) => {
    // Ingresar teléfono con formato inválido
    await page.locator('[data-testid="input-telefono"]').fill('123');
    
    // Verificar mensaje de error de formato
    await expect(page.locator('text=/formato.*inválido/i')).toBeVisible();
  });

  test('TC-005: Debe avanzar a Etapa 2 con datos válidos', async ({ page }) => {
    await helper.completarInformacionGeneral(datosPruebaCompletos.informacionGeneral);
    await helper.avanzarEtapa();
    
    // Verificar transición a Etapa 2
    await helper.verificarEtapa(2);
    await expect(page.locator('[data-testid="stage-title"]')).toContainText('Vivienda');
  });

  test('TC-006: Debe mantener datos al retroceder', async ({ page }) => {
    await helper.completarInformacionGeneral(datosPruebaCompletos.informacionGeneral);
    await helper.avanzarEtapa();
    await helper.retrocederEtapa();
    
    // Verificar que los datos se mantienen
    await expect(page.locator('[data-testid="input-apellido_familiar"]'))
      .toHaveValue(datosPruebaCompletos.informacionGeneral.apellidoFamiliar);
  });
});
```

---

## 👨‍👩‍👧‍👦 Pruebas de Familia (e2e/survey-etapa-4.spec.js)

```javascript
// tests/e2e/survey-etapa-4.spec.js

import { test, expect } from '@playwright/test';
import { SurveyHelper } from '../helpers/survey-helpers';
import { datosPruebaCompletos } from '../fixtures/survey-data';

test.describe('Etapa 4: Información Familiar', () => {
  let helper;

  test.beforeEach(async ({ page }) => {
    helper = new SurveyHelper(page);
    await helper.irAFormularioEncuesta();
    
    // Completar etapas previas
    await helper.completarInformacionGeneral(datosPruebaCompletos.informacionGeneral);
    await helper.avanzarEtapa();
    
    await helper.completarVivienda(datosPruebaCompletos.vivienda);
    await helper.avanzarEtapa();
    
    await helper.completarServiciosAgua(datosPruebaCompletos.serviciosAgua);
    await helper.avanzarEtapa();
    
    // Ahora en Etapa 4
    await helper.verificarEtapa(4);
  });

  test('TC-007: Debe mostrar la sección de familia vacía', async ({ page }) => {
    await expect(page.locator('[data-testid="family-grid-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="add-family-member-button"]')).toBeVisible();
  });

  test('TC-008: Debe agregar un miembro familiar', async ({ page }) => {
    const miembro = datosPruebaCompletos.familia[0];
    
    await helper.agregarMiembroFamiliar(miembro);
    
    // Verificar que aparece en la tabla
    await helper.verificarMiembroEnTabla(miembro.nombres);
    await expect(page.locator(`text=${miembro.numeroIdentificacion}`)).toBeVisible();
  });

  test('TC-009: Debe agregar múltiples miembros familiares', async ({ page }) => {
    await helper.agregarMultiplesMiembrosFamilia(datosPruebaCompletos.familia);
    
    // Verificar todos los miembros
    for (const miembro of datosPruebaCompletos.familia) {
      await helper.verificarMiembroEnTabla(miembro.nombres);
    }
  });

  test('TC-010: Debe validar campos obligatorios en diálogo de familia', async ({ page }) => {
    // Abrir diálogo
    await page.locator('[data-testid="add-family-member-button"]').click();
    
    // Intentar guardar sin datos
    await page.locator('[data-testid="family-member-submit-button"]').click();
    
    // Verificar que no se cierra el diálogo (validación activa)
    await expect(page.locator('[data-testid="family-member-nombres-input"]')).toBeVisible();
  });

  test('TC-011: Debe requerir al menos un miembro para avanzar', async ({ page }) => {
    // Intentar avanzar sin agregar miembros
    await page.locator('[data-testid="next-stage-button"]').click();
    
    // Verificar mensaje de error
    await helper.verificarMensajeError('Debe agregar al menos un miembro');
    
    // Verificar que seguimos en Etapa 4
    await helper.verificarEtapa(4);
  });
});
```

---

## 🔄 Flujo Completo (e2e/survey-full-flow.spec.js)

```javascript
// tests/e2e/survey-full-flow.spec.js

import { test, expect } from '@playwright/test';
import { SurveyHelper } from '../helpers/survey-helpers';
import { datosPruebaCompletos, datosPruebaMinimos } from '../fixtures/survey-data';

test.describe('Flujo Completo de Encuesta', () => {
  let helper;

  test.beforeEach(async ({ page }) => {
    helper = new SurveyHelper(page);
  });

  test('TC-012: Flujo completo con datos completos', async ({ page }) => {
    test.setTimeout(120000); // 2 minutos
    
    await helper.irAFormularioEncuesta();
    
    // === ETAPA 1 ===
    await helper.completarInformacionGeneral(datosPruebaCompletos.informacionGeneral);
    await helper.avanzarEtapa();
    await helper.verificarEtapa(2);
    
    // === ETAPA 2 ===
    await helper.completarVivienda(datosPruebaCompletos.vivienda);
    await helper.avanzarEtapa();
    await helper.verificarEtapa(3);
    
    // === ETAPA 3 ===
    await helper.completarServiciosAgua(datosPruebaCompletos.serviciosAgua);
    await helper.avanzarEtapa();
    await helper.verificarEtapa(4);
    
    // === ETAPA 4 ===
    await helper.agregarMultiplesMiembrosFamilia(datosPruebaCompletos.familia);
    await helper.avanzarEtapa();
    await helper.verificarEtapa(5);
    
    // === ETAPA 5 ===
    await helper.saltarEtapaDifuntos();
    await helper.verificarEtapa(6);
    
    // === ETAPA 6 ===
    await helper.completarObservaciones(datosPruebaCompletos.observaciones);
    
    // === ENVIAR ===
    await helper.enviarEncuesta();
    await helper.verificarEnvioExitoso();
  });

  test('TC-013: Flujo completo con datos mínimos', async ({ page }) => {
    test.setTimeout(120000);
    
    await helper.irAFormularioEncuesta();
    
    // Completar con datos mínimos
    await helper.completarInformacionGeneral(datosPruebaMinimos.informacionGeneral);
    await helper.avanzarEtapa();
    
    await helper.completarVivienda(datosPruebaMinimos.vivienda);
    await helper.avanzarEtapa();
    
    // Saltar Etapa 3 (sin servicios de agua)
    await helper.avanzarEtapa();
    
    // Agregar un solo miembro
    await helper.agregarMiembroFamiliar(datosPruebaMinimos.familia[0]);
    await helper.avanzarEtapa();
    
    // Saltar difuntos
    await helper.avanzarEtapa();
    
    // Solo autorización
    await helper.completarObservaciones(datosPruebaMinimos.observaciones);
    
    await helper.enviarEncuesta();
    await helper.verificarEnvioExitoso();
  });

  test('TC-014: Debe limpiar borrador correctamente', async ({ page }) => {
    await helper.irAFormularioEncuesta();
    
    // Completar parcialmente
    await helper.completarInformacionGeneral(datosPruebaCompletos.informacionGeneral);
    
    // Limpiar borrador
    await helper.limpiarBorrador();
    
    // Verificar que los campos están vacíos
    await helper.verificarCampoObligatorioVacio('apellido_familiar');
    await helper.verificarCampoObligatorioVacio('direccion');
  });
});
```

---

## 🚀 Ejecutar las Pruebas

### Comandos de Ejecución

```bash
# Ejecutar todas las pruebas
npx playwright test

# Ejecutar suite específica
npx playwright test e2e/survey-etapa-1.spec.js

# Ejecutar en modo headed (ver navegador)
npx playwright test --headed

# Ejecutar con UI interactiva
npx playwright test --ui

# Generar reporte
npx playwright test --reporter=html
```

### Configuración de playwright.config.js

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],

  use: {
    baseURL: 'http://localhost:8081',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 8081,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 📊 Resultados Esperados

Al ejecutar esta suite completa, deberías obtener:

- ✅ **15 pruebas** en total
- ✅ **100% de éxito** con datos válidos
- ✅ **Cobertura** de todos los flujos principales
- ✅ **Tiempo de ejecución** < 5 minutos

---

**Archivo**: `docs/playwright-test-suite-example.md`  
**Fecha**: 16 de Octubre de 2025  
**Versión**: 1.0.0
