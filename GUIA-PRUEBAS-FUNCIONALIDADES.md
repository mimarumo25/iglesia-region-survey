# 🧪 Guía Completa de Pruebas - Sistema MIA

## 📋 Índice

1. [Preparación del Entorno](#preparación-del-entorno)
2. [Pruebas de Autenticación](#1-pruebas-de-autenticación)
3. [Pruebas de Formulario de Encuesta](#2-pruebas-de-formulario-de-encuesta)
4. [Pruebas de Gestión de Familia](#3-pruebas-de-gestión-de-familia)
5. [Pruebas de Dashboard](#4-pruebas-de-dashboard)
6. [Pruebas de Administración](#5-pruebas-de-administración)
7. [Checklist de Validación](#checklist-de-validación-completa)

---

## Preparación del Entorno

### Requisitos Previos
```bash
# 1. Verificar que el servidor esté corriendo
npm run dev

# 2. Abrir navegador en modo incógnito
# Esto evita conflictos con datos de sesión previos

# 3. Abrir DevTools (F12)
# Tab Console: Para ver logs
# Tab Network: Para ver peticiones HTTP
# Tab Application > Local Storage: Para ver datos guardados
```

### Datos de Prueba
```javascript
// Usuario Admin
{
  email: "admin@mia.com",
  password: "Admin123!"
}

// Usuario Regular
{
  email: "usuario@mia.com",
  password: "User123!"
}
```

---

## 1. Pruebas de Autenticación

### 1.1 Login Exitoso

**Pasos:**
1. Navegar a `http://localhost:8080/login`
2. Ingresar credenciales válidas
3. Click en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Redirección a `/dashboard`
- ✅ Token guardado en cookies
- ✅ Datos de usuario en localStorage
- ✅ Sidebar visible con opciones según rol

**Validación en DevTools:**
```javascript
// Console
localStorage.getItem('user') // Debe retornar objeto usuario
document.cookie.includes('access_token') // Debe ser true

// Network
// Debe haber request POST a /api/login con status 200
```

### 1.2 Login Fallido

**Pasos:**
1. Ingresar credenciales inválidas
2. Click en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Mensaje de error visible
- ✅ No hay redirección
- ✅ Campos permanecen llenos

### 1.3 Recuperación de Contraseña

**Pasos:**
1. Click en "¿Olvidaste tu contraseña?"
2. Ingresar email registrado
3. Click en "Enviar código"

**Resultado Esperado:**
- ✅ Toast de confirmación
- ✅ Request POST a `/api/forgot-password`
- ✅ Navegación a página de verificación

### 1.4 Logout

**Pasos:**
1. Estando logueado, click en avatar (esquina superior derecha)
2. Click en "Cerrar Sesión"

**Resultado Esperado:**
- ✅ Redirección a `/login`
- ✅ Token eliminado de cookies
- ✅ localStorage limpiado
- ✅ No se puede acceder a rutas protegidas

---

## 2. Pruebas de Formulario de Encuesta

### 2.1 Crear Nueva Encuesta - Flujo Completo

**Ubicación:** `/survey` o `/dashboard` → "Nueva Encuesta"

#### Etapa 1: Información General

**Pasos:**
1. **Municipio:** Seleccionar de autocomplete (ej: "Medellín")
2. **Parroquia:** Seleccionar (debe filtrar por municipio)
3. **Fecha:** Usar date picker, seleccionar hoy
4. **Apellido Familiar:** Ingresar "García Pérez"
5. **Corregimiento:** (Opcional) Seleccionar si aplica
6. **Centro Poblado:** (Opcional) Seleccionar
7. **Vereda:** (Opcional) Ingresar nombre
8. **Sector:** (Opcional) Seleccionar
9. **Dirección:** "Calle 50 # 40-30"
10. **Teléfono:** "3001234567"
11. **Número Contrato EPM:** "1234567890"
12. Click "Siguiente"

**Validaciones:**
- ✅ Campos requeridos muestran error si están vacíos
- ✅ Autocompletes filtran correctamente
- ✅ Fecha no permite fechas futuras
- ✅ Botón "Siguiente" habilitado solo si campos requeridos completos

**DevTools - localStorage:**
```javascript
localStorage.getItem('survey-session')
// Debe contener datos de informacionGeneral
```

#### Etapa 2: Información de Vivienda

**Pasos:**
1. **Tipo de Vivienda:** Seleccionar "Casa"
2. **Disposición de Basura:** Marcar checkbox múltiples
   - ✅ Recolección municipal
   - ✅ Reciclaje
3. Click "Siguiente"

**Validaciones:**
- ✅ Tipo de vivienda es requerido
- ✅ Al menos una opción de basura debe estar marcada
- ✅ Datos se guardan automáticamente

#### Etapa 3: Acueducto y Aguas Residuales

**Pasos:**
1. **Sistema de Acueducto:** Seleccionar "Acueducto municipal"
2. **Aguas Residuales:** Marcar opciones
   - ✅ Pozo séptico
3. Click "Siguiente"

**Validaciones:**
- ✅ Sistema de acueducto es requerido
- ✅ Múltiples opciones de aguas residuales permitidas

#### Etapa 4: Integrantes de la Familia

**IMPORTANTE:** Esta es la etapa más compleja

**Pasos:**
1. Click en "Agregar Miembro"
2. **Llenar formulario de primer miembro:**
   - Nombres: "Juan Carlos García"
   - Fecha Nacimiento: Usar date picker
   - Tipo Identificación: "Cédula de Ciudadanía"
   - Número Identificación: "1234567890"
   - Sexo: "Masculino"
   - Situación Civil: "Casado"
   - Parentesco: **"Jefe de Hogar"** (REQUERIDO para primer miembro)
   - Talla Camisa: "M"
   - Talla Pantalón: "32"
   - Talla Zapato: "42"
   - Estudio: "Universitario"
   - Comunidad Cultural: Seleccionar si aplica
   - Teléfono: "3009876543"
   - **En qué eres líder:** Marcar opciones
     - ✅ Líder de oración
     - ✅ Catequista
   - Correo: "juan@example.com"
   - Enfermedades: Buscar y agregar
   - Necesidades enfermo: Marcar si aplica
   - Solicitud comunión casa: Marcar si aplica
   - Profesión: Seleccionar
   - Celebraciones: Agregar si aplica
   - Habilidades: Buscar y agregar
   - Destrezas: Buscar y agregar
3. Click "Guardar"
4. **Validar que aparezca en tabla**

**Validaciones:**
- ✅ Primer miembro DEBE tener "En qué eres líder" con al menos 1 opción
- ✅ Si no se marca, debe mostrar error al intentar avanzar de etapa
- ✅ Miembro aparece en tabla con todos los datos
- ✅ Botones "Editar" y "Eliminar" funcionan

**Agregar Miembros Adicionales:**
5. Repetir proceso para 2-3 miembros más
6. **NOTA:** Miembros adicionales NO requieren ser líderes
7. Click "Siguiente"

#### Etapa 5: Difuntos (Opcional)

**Pasos:**
1. Si hay difuntos en la familia:
   - Click "Agregar Difunto"
   - Llenar datos similares
   - Agregar fecha fallecimiento y causa
2. Si no hay, click "Siguiente"

**Validaciones:**
- ✅ Etapa completamente opcional
- ✅ Se puede omitir sin problemas

#### Etapa 6: Observaciones

**Pasos:**
1. **Sustento de Familia:** Describir actividades económicas
2. **Observaciones del Encuestador:** Notas adicionales
3. **Autorización de Datos:** ✅ **REQUERIDO** - Marcar checkbox
4. Click "Enviar Encuesta"

**Resultado Esperado:**
- ✅ Loading spinner visible
- ✅ Request POST a `/api/encuestas`
- ✅ Toast de éxito
- ✅ Redirección a `/surveys` o `/dashboard`
- ✅ localStorage limpiado

**Validación en Network (DevTools):**
```javascript
// Request Payload debe incluir:
{
  informacion_general: {...},
  vivienda: {...},
  servicios_agua: {...},
  miembros_familia: [...], // Con al menos 1 miembro con liderazgo
  difuntos: [...],
  observaciones: {...}
}
```

### 2.2 Guardado Automático

**Pasos:**
1. Iniciar encuesta
2. Llenar campos en Etapa 1
3. **NO hacer click en "Siguiente"**
4. Cerrar pestaña del navegador
5. Reabrir `http://localhost:8080/survey`

**Resultado Esperado:**
- ✅ Datos previamente ingresados permanecen
- ✅ Etapa actual es la que se había completado
- ✅ Mensaje opcional: "Datos recuperados de sesión anterior"

### 2.3 Validación de Liderazgo

**Prueba de Error:**
1. Crear encuesta hasta Etapa 4
2. Agregar miembro SIN marcar "En qué eres líder"
3. Intentar avanzar a Etapa 5

**Resultado Esperado:**
- ❌ Error visible: "Debe haber al menos un miembro con liderazgo"
- ❌ No permite avanzar
- ✅ Botón "Siguiente" permanece deshabilitado

**Solución:**
1. Editar miembro
2. Marcar al menos 1 opción en "En qué eres líder"
3. Guardar
4. Ahora sí permite avanzar

---

## 3. Pruebas de Gestión de Familia

### 3.1 Agregar Primer Miembro

**Ubicación:** Dentro de formulario de encuesta, Etapa 4

**Pasos:**
1. Click "Agregar Miembro"
2. Llenar todos los campos requeridos
3. **CRÍTICO:** Marcar al menos 1 opción en "En qué eres líder"
4. Click "Guardar"

**Validaciones:**
- ✅ Modal se cierra
- ✅ Miembro aparece en tabla
- ✅ Datos mostrados coinciden con ingresados

### 3.2 Editar Miembro

**Pasos:**
1. En tabla de familia, click ícono "Editar" (lápiz)
2. Modal se abre con datos pre-cargados
3. Modificar algún campo (ej: teléfono)
4. Click "Actualizar"

**Validaciones:**
- ✅ Cambios se reflejan en tabla
- ✅ ID del miembro permanece igual
- ✅ localStorage actualizado

### 3.3 Eliminar Miembro

**Pasos:**
1. Click ícono "Eliminar" (papelera)
2. Confirmar en dialog de alerta

**Validaciones:**
- ✅ Miembro desaparece de tabla
- ✅ localStorage actualizado
- ⚠️ Si era el único líder, debe mostrar warning

### 3.4 Validación de Campos

**Campos a Probar:**

| Campo | Validación | Prueba |
|-------|-----------|--------|
| Nombres | Mínimo 2 caracteres | Ingresar "A" → Error |
| Número Identificación | Solo números | Ingresar "ABC" → Error |
| Fecha Nacimiento | No futuras | Seleccionar año 2030 → Error |
| Email | Formato válido | Ingresar "invalid" → Error |
| Teléfono | 10 dígitos | Ingresar "123" → Error |

---

## 4. Pruebas de Dashboard

### 4.1 Visualización de Estadísticas

**Ubicación:** `/dashboard`

**Elementos a Verificar:**
- ✅ Cards con métricas principales:
  - Total de encuestas
  - Total de familias
  - Total de personas
  - Últimas actualizaciones
- ✅ Gráficos (Recharts):
  - Distribución por municipio
  - Distribución por parroquia
  - Estadísticas de edad
- ✅ Tabla de encuestas recientes

**Acciones:**
1. Hacer hover sobre gráficos → Tooltip visible
2. Click en card → Debe navegar a vista detallada

### 4.2 Búsqueda y Filtros

**Pasos:**
1. Usar barra de búsqueda global (top navbar)
2. Ingresar "García"
3. Revisar resultados

**Validaciones:**
- ✅ Resultados incluyen:
  - Encuestas con apellido "García"
  - Personas con nombre/apellido "García"
  - Filtros aplicables

### 4.3 Navegación Rápida

**Elementos a Probar:**
- ✅ Sidebar colapsible (click en hamburger menu)
- ✅ Tooltips al hacer hover
- ✅ Indicador de página activa
- ✅ Accesos rápidos en dashboard

---

## 5. Pruebas de Administración

**NOTA:** Estas pruebas requieren usuario con rol **admin**

### 5.1 Gestión de Parroquias

**Ubicación:** `/settings/parroquias`

#### Crear Parroquia

**Pasos:**
1. Click "Nueva Parroquia"
2. Llenar formulario:
   - Código: "PAR001"
   - Nombre: "Parroquia San Juan"
   - Teléfono: "3001234567"
   - Email: "parroquia@example.com"
   - Dirección: "Calle 10 # 20-30"
   - Municipio: Seleccionar de lista
3. Click "Guardar"

**Validaciones:**
- ✅ Request POST a `/api/parroquias`
- ✅ Toast de éxito
- ✅ Parroquia aparece en tabla
- ✅ Datos correctos

#### Editar Parroquia

**Pasos:**
1. En tabla, click "Editar"
2. Modificar nombre
3. Click "Actualizar"

**Validaciones:**
- ✅ Request PUT a `/api/parroquias/:id`
- ✅ Cambios reflejados en tabla

#### Eliminar Parroquia

**Pasos:**
1. Click "Eliminar"
2. Confirmar

**Validaciones:**
- ✅ Request DELETE a `/api/parroquias/:id`
- ✅ Parroquia desaparece
- ⚠️ Si está en uso, debe mostrar error

### 5.2 Otros Catálogos

**Repetir pruebas similares para:**
- `/settings/municipios`
- `/settings/veredas`
- `/settings/tipos-vivienda`
- `/settings/estados-civiles`
- `/settings/enfermedades`
- `/settings/habilidades`
- `/settings/destrezas`

**Checklist por Catálogo:**
- [ ] Crear nuevo registro
- [ ] Editar registro existente
- [ ] Eliminar registro
- [ ] Búsqueda funciona
- [ ] Filtros funcionan
- [ ] Paginación funciona

---

## Checklist de Validación Completa

### ✅ Funcionalidades Core

#### Autenticación
- [ ] Login exitoso (admin)
- [ ] Login exitoso (usuario regular)
- [ ] Login fallido (credenciales inválidas)
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Logout limpia sesión
- [ ] Redirección a login si no autenticado
- [ ] Rutas protegidas por rol funcionan

#### Encuestas
- [ ] Crear encuesta completa (6 etapas)
- [ ] Guardado automático funciona
- [ ] Validación de campos requeridos
- [ ] Navegación entre etapas
- [ ] Editar encuesta existente
- [ ] Ver detalles de encuesta
- [ ] Eliminar encuesta
- [ ] Buscar encuestas

#### Familia
- [ ] Agregar primer miembro (con liderazgo)
- [ ] Validación de liderazgo funciona
- [ ] Agregar miembros adicionales
- [ ] Editar miembro existente
- [ ] Eliminar miembro
- [ ] Validación de campos
- [ ] Tallas se guardan correctamente
- [ ] Habilidades/Destrezas funcionan

#### Dashboard
- [ ] Estadísticas se cargan correctamente
- [ ] Gráficos son interactivos
- [ ] Cards muestran datos actualizados
- [ ] Búsqueda global funciona
- [ ] Filtros funcionan
- [ ] Tabla de encuestas recientes

#### Reportes
- [ ] Reporte de personas
- [ ] Reporte de salud
- [ ] Descarga Excel funciona
- [ ] Descarga CSV funciona
- [ ] Filtros de reporte funcionan
- [ ] Gráficos de reporte visibles

#### Administración (Admin)
- [ ] CRUD Parroquias
- [ ] CRUD Municipios
- [ ] CRUD Veredas
- [ ] CRUD Tipos Vivienda
- [ ] CRUD Estados Civiles
- [ ] CRUD Enfermedades
- [ ] CRUD Habilidades
- [ ] CRUD Destrezas
- [ ] CRUD Usuarios
- [ ] Búsqueda en catálogos

### ✅ UI/UX

#### Diseño
- [ ] Colores consistentes (azul católico/dorado)
- [ ] Contraste alto (WCAG AA)
- [ ] Tipografía clara (mínimo 16px)
- [ ] Espaciado generoso (8px grid)
- [ ] Animaciones sutiles

#### Responsive
- [ ] Desktop (>1024px) funciona
- [ ] Tablet (768px-1024px) funciona
- [ ] Mobile (< 768px) funciona
- [ ] Sidebar colapsible en mobile
- [ ] Tablas responsive (cards en mobile)

#### Accesibilidad
- [ ] Navegación por teclado funciona
- [ ] Focus visible en elementos interactivos
- [ ] ARIA labels presentes
- [ ] Mensajes de error claros
- [ ] Loading states visibles

### ✅ Performance

#### Carga
- [ ] Página inicial carga < 3 segundos
- [ ] Lazy loading de componentes funciona
- [ ] Imágenes optimizadas
- [ ] Bundle size razonable

#### Interactividad
- [ ] Autocompletes responden rápido
- [ ] Búsquedas no bloquean UI
- [ ] Formularios no lagean
- [ ] Transiciones suaves

### ✅ Manejo de Errores

#### API
- [ ] Error 400 muestra mensaje claro
- [ ] Error 401 redirige a login
- [ ] Error 403 muestra "sin permisos"
- [ ] Error 404 muestra "no encontrado"
- [ ] Error 500 muestra error genérico
- [ ] Network error muestra mensaje apropiado

#### Validación
- [ ] Campos requeridos muestran error
- [ ] Formato inválido muestra error
- [ ] Errores desaparecen al corregir
- [ ] Toast notifications funcionan

---

## 🐛 Reporte de Bugs

### Template para Reportar

```markdown
**Título:** [Descripción breve]

**Severidad:** [Crítica/Alta/Media/Baja]

**Ubicación:** [URL/Componente]

**Pasos para Reproducir:**
1. ...
2. ...
3. ...

**Resultado Esperado:**
...

**Resultado Actual:**
...

**Screenshots/Logs:**
[Adjuntar si aplica]

**Navegador/OS:**
Chrome 120 / Windows 11

**Usuario:**
admin@mia.com
```

---

## 📊 Resultados de Pruebas

### Formato de Registro

| Funcionalidad | Estado | Bugs Encontrados | Comentarios |
|--------------|--------|------------------|-------------|
| Login | ✅ | 0 | Funciona correctamente |
| Crear Encuesta | ⚠️ | 1 | Ver bug #001 |
| ... | ... | ... | ... |

---

## 🚀 Automatización Futura

### Scripts Recomendados

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage"
  }
}
```

### Tests Prioritarios

1. **Unit Tests:**
   - `utils/sessionDataTransformer.test.ts`
   - `hooks/useFamilyGrid.test.ts`
   - `utils/formDataTransformer.test.ts`

2. **Integration Tests:**
   - `auth-flow.test.tsx`
   - `survey-submission.test.tsx`

3. **E2E Tests:**
   - `complete-survey.spec.ts`
   - `admin-crud.spec.ts`

---

*Documento creado para facilitar pruebas manuales y automatizadas del Sistema MIA*
