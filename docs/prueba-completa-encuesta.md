# 🧪 Prueba Completa de Encuesta - Sistema MIA

## 📋 Información de la Prueba
- **Fecha de Prueba**: 12 de octubre de 2025
- **Objetivo**: Validar el flujo completo de creación de encuesta con TODOS los campos completos
- **Tipo de Prueba**: Prueba de integración end-to-end
- **URL de Prueba**: http://localhost:8081/survey

---

## 📝 Plan de Prueba por Etapas

### ✅ ETAPA 1: Información General
**Objetivo**: Llenar todos los campos básicos del hogar y ubicación

#### Campos a Completar:
| Campo | Tipo | Requerido | Valor de Prueba | Estado |
|-------|------|-----------|-----------------|--------|
| Municipio | Autocomplete | ✅ Sí | "Medellín" | ⏳ Pendiente |
| Parroquia | Autocomplete | ✅ Sí | "San Antonio de Padua" | ⏳ Pendiente |
| Fecha | Date Picker | ✅ Sí | 12/10/2025 (Hoy) | ⏳ Pendiente |
| Apellido Familiar | Text | ✅ Sí | "García Rodríguez" | ⏳ Pendiente |
| Vereda | Autocomplete | ❌ No | "La Pradera" | ⏳ Pendiente |
| Sector | Autocomplete | ✅ Sí | "Centro" | ⏳ Pendiente |
| Dirección | Text | ✅ Sí | "Calle 45 # 67-89 Apto 301" | ⏳ Pendiente |
| Teléfono | Text | ❌ No | "3001234567" | ⏳ Pendiente |
| Número Contrato EPM | Text | ❌ No | "123456789" | ⏳ Pendiente |

#### ✅ Validaciones a Verificar:
- [ ] El selector de municipio carga opciones correctamente
- [ ] El selector de parroquia filtra por municipio seleccionado
- [ ] El date picker permite seleccionar fechas y tiene localizacion española
- [ ] Los campos requeridos muestran error si están vacíos
- [ ] No permite avanzar a siguiente etapa sin campos requeridos
- [ ] El botón "Siguiente" está habilitado solo cuando todo es válido

#### 🐛 Problemas Detectados - Etapa 1:
_Se documentarán aquí los errores encontrados_

---

### ✅ ETAPA 2: Información de Vivienda y Basuras
**Objetivo**: Completar datos sobre tipo de vivienda y manejo de basuras

#### Campos a Completar:
| Campo | Tipo | Requerido | Valor de Prueba | Estado |
|-------|------|-----------|-----------------|--------|
| Tipo de Vivienda | Autocomplete | ✅ Sí | "Casa" | ⏳ Pendiente |
| Disposición de Basura | Multiple Checkbox | ❌ No | Ver detalles abajo | ⏳ Pendiente |

**Disposición de Basura - Opciones a Seleccionar**:
- ✅ Recolector municipal
- ✅ Recicla
- ❌ Quemada
- ❌ Enterrada
- ❌ Aire libre
- ❌ No aplica

#### ✅ Validaciones a Verificar:
- [ ] El selector de tipo de vivienda muestra todas las opciones
- [ ] Los checkboxes de basura permiten selección múltiple
- [ ] Se pueden deseleccionar opciones ya marcadas
- [ ] Los datos se persisten al cambiar de etapa

#### 🐛 Problemas Detectados - Etapa 2:
_Se documentarán aquí los errores encontrados_

---

### ✅ ETAPA 3: Acueducto y Aguas Residuales
**Objetivo**: Completar información sobre servicios de agua y saneamiento

#### Campos a Completar:
| Campo | Tipo | Requerido | Valor de Prueba | Estado |
|-------|------|-----------|-----------------|--------|
| Sistema de Acueducto | Autocomplete | ❌ No | "Acueducto Público" | ⏳ Pendiente |
| Tipos de Aguas Residuales | Multiple Checkbox | ❌ No | Ver detalles abajo | ⏳ Pendiente |

**Aguas Residuales - Opciones a Seleccionar**:
- ✅ Pozo Séptico
- ❌ Letrina
- ❌ Campo Abierto

#### ✅ Validaciones a Verificar:
- [ ] El selector de sistema de acueducto carga correctamente
- [ ] Los checkboxes de aguas residuales funcionan correctamente
- [ ] Es posible avanzar sin llenar estos campos (no son requeridos)

#### 🐛 Problemas Detectados - Etapa 3:
_Se documentarán aquí los errores encontrados_

---

### ✅ ETAPA 4: Información Familiar (FamilyGrid)
**Objetivo**: Agregar múltiples miembros de familia con TODOS los campos completos

#### 👨‍👩‍👧‍👦 Miembro 1 - Jefe de Familia (Padre)
| Campo | Tipo | Requerido | Valor de Prueba | Estado |
|-------|------|-----------|-----------------|--------|
| Nombres | Text | ✅ Sí | "Juan Carlos García Rodríguez" | ⏳ Pendiente |
| Fecha de Nacimiento | Date | ✅ Sí | 15/03/1980 | ⏳ Pendiente |
| Tipo Identificación | Autocomplete | ✅ Sí | "Cédula de Ciudadanía" | ⏳ Pendiente |
| Número Identificación | Text | ✅ Sí | "1234567890" | ⏳ Pendiente |
| Sexo | Autocomplete | ✅ Sí | "Masculino" | ⏳ Pendiente |
| Situación Civil | Autocomplete | ❌ No | "Casado" | ⏳ Pendiente |
| Parentesco | Autocomplete | ✅ Sí | "Jefe de Familia" | ⏳ Pendiente |
| Talla Camisa | Select | ❌ No | "L" | ⏳ Pendiente |
| Talla Pantalón | Select | ❌ No | "34" | ⏳ Pendiente |
| Talla Zapato | Select | ❌ No | "42" | ⏳ Pendiente |
| Estudio | Autocomplete | ❌ No | "Profesional" | ⏳ Pendiente |
| Comunidad Cultural | Autocomplete | ❌ No | "Ninguna" | ⏳ Pendiente |
| Teléfono | Text | ❌ No | "3001234567" | ⏳ Pendiente |
| En Qué Eres Líder | Text | ❌ No | "Líder de Jóvenes" | ⏳ Pendiente |
| Correo Electrónico | Email | ❌ No | "juan.garcia@example.com" | ⏳ Pendiente |
| Enfermedad | Autocomplete | ❌ No | "Diabetes" | ⏳ Pendiente |
| Necesidades Enfermo | Textarea | ❌ No | "Insulina diaria" | ⏳ Pendiente |
| Solicitud Comunión Casa | Boolean | ❌ No | ✅ Sí | ⏳ Pendiente |
| Profesión | Autocomplete | ❌ No | "Ingeniero" | ⏳ Pendiente |
| Motivo Celebrar | Text | ❌ No | "Cumpleaños" | ⏳ Pendiente |
| Día Celebrar | Text | ❌ No | "15" | ⏳ Pendiente |
| Mes Celebrar | Text | ❌ No | "Marzo" | ⏳ Pendiente |
| Habilidades | Multi-Select | ❌ No | "Carpintería, Electricidad" | ⏳ Pendiente |
| Destrezas | Multi-Select | ❌ No | "Liderazgo, Canto" | ⏳ Pendiente |

#### 👩 Miembro 2 - Madre
| Campo | Valor de Prueba | Estado |
|-------|-----------------|--------|
| Nombres | "María Fernanda Rodríguez López" | ⏳ Pendiente |
| Fecha de Nacimiento | 20/08/1982 | ⏳ Pendiente |
| Tipo Identificación | "Cédula de Ciudadanía" | ⏳ Pendiente |
| Número Identificación | "9876543210" | ⏳ Pendiente |
| Sexo | "Femenino" | ⏳ Pendiente |
| Situación Civil | "Casada" | ⏳ Pendiente |
| Parentesco | "Esposa" | ⏳ Pendiente |
| Talla Camisa | "M" | ⏳ Pendiente |
| Talla Pantalón | "10" | ⏳ Pendiente |
| Talla Zapato | "37" | ⏳ Pendiente |
| Estudio | "Técnico" | ⏳ Pendiente |
| Comunidad Cultural | "Ninguna" | ⏳ Pendiente |
| Teléfono | "3009876543" | ⏳ Pendiente |
| En Qué Eres Líder | "Catequesis de Niños" | ⏳ Pendiente |
| Correo Electrónico | "maria.rodriguez@example.com" | ⏳ Pendiente |
| Enfermedad | "Ninguna" | ⏳ Pendiente |
| Necesidades Enfermo | "" (vacío) | ⏳ Pendiente |
| Solicitud Comunión Casa | ❌ No | ⏳ Pendiente |
| Profesión | "Enfermera" | ⏳ Pendiente |
| Motivo Celebrar | "Santo" | ⏳ Pendiente |
| Día Celebrar | "20" | ⏳ Pendiente |
| Mes Celebrar | "Agosto" | ⏳ Pendiente |
| Habilidades | "Cocina, Costura" | ⏳ Pendiente |
| Destrezas | "Enseñanza, Paciencia" | ⏳ Pendiente |

#### 👧 Miembro 3 - Hija Mayor
| Campo | Valor de Prueba | Estado |
|-------|-----------------|--------|
| Nombres | "Ana Sofía García Rodríguez" | ⏳ Pendiente |
| Fecha de Nacimiento | 10/05/2010 | ⏳ Pendiente |
| Tipo Identificación | "Tarjeta de Identidad" | ⏳ Pendiente |
| Número Identificación | "1122334455" | ⏳ Pendiente |
| Sexo | "Femenino" | ⏳ Pendiente |
| Situación Civil | "Soltera" | ⏳ Pendiente |
| Parentesco | "Hija" | ⏳ Pendiente |
| Talla Camisa | "S" | ⏳ Pendiente |
| Talla Pantalón | "6" | ⏳ Pendiente |
| Talla Zapato | "35" | ⏳ Pendiente |
| Estudio | "Secundaria" | ⏳ Pendiente |
| Comunidad Cultural | "Grupo de Jóvenes" | ⏳ Pendiente |
| Teléfono | "3157778899" | ⏳ Pendiente |
| En Qué Eres Líder | "Monaguilla" | ⏳ Pendiente |
| Correo Electrónico | "ana.garcia@student.com" | ⏳ Pendiente |
| Enfermedad | "Ninguna" | ⏳ Pendiente |
| Necesidades Enfermo | "" (vacío) | ⏳ Pendiente |
| Solicitud Comunión Casa | ❌ No | ⏳ Pendiente |
| Profesión | "Estudiante" | ⏳ Pendiente |
| Motivo Celebrar | "Cumpleaños" | ⏳ Pendiente |
| Día Celebrar | "10" | ⏳ Pendiente |
| Mes Celebrar | "Mayo" | ⏳ Pendiente |
| Habilidades | "Dibujo, Música" | ⏳ Pendiente |
| Destrezas | "Canto, Guitarra" | ⏳ Pendiente |

#### 👦 Miembro 4 - Hijo Menor
| Campo | Valor de Prueba | Estado |
|-------|-----------------|--------|
| Nombres | "David Alejandro García Rodríguez" | ⏳ Pendiente |
| Fecha de Nacimiento | 22/11/2015 | ⏳ Pendiente |
| Tipo Identificación | "Registro Civil" | ⏳ Pendiente |
| Número Identificación | "5566778899" | ⏳ Pendiente |
| Sexo | "Masculino" | ⏳ Pendiente |
| Situación Civil | "Soltero" | ⏳ Pendiente |
| Parentesco | "Hijo" | ⏳ Pendiente |
| Talla Camisa | "XS" | ⏳ Pendiente |
| Talla Pantalón | "4" | ⏳ Pendiente |
| Talla Zapato | "32" | ⏳ Pendiente |
| Estudio | "Primaria" | ⏳ Pendiente |
| Comunidad Cultural | "Infancia Misionera" | ⏳ Pendiente |
| Teléfono | "" (vacío) | ⏳ Pendiente |
| En Qué Eres Líder | "Acólito" | ⏳ Pendiente |
| Correo Electrónico | "" (vacío) | ⏳ Pendiente |
| Enfermedad | "Asma" | ⏳ Pendiente |
| Necesidades Enfermo | "Inhalador de emergencia" | ⏳ Pendiente |
| Solicitud Comunión Casa | ❌ No | ⏳ Pendiente |
| Profesión | "Estudiante" | ⏳ Pendiente |
| Motivo Celebrar | "Primera Comunión" | ⏳ Pendiente |
| Día Celebrar | "22" | ⏳ Pendiente |
| Mes Celebrar | "Noviembre" | ⏳ Pendiente |
| Habilidades | "Deportes, Lectura" | ⏳ Pendiente |
| Destrezas | "Fútbol, Natación" | ⏳ Pendiente |

#### ✅ Validaciones a Verificar - FamilyGrid:
- [ ] El modal de agregar miembro se abre correctamente
- [ ] Todos los campos están disponibles y editables
- [ ] Los autocomplete cargan opciones correctamente
- [ ] El date picker funciona para fechas de nacimiento
- [ ] Las tallas se muestran en selectores adecuados
- [ ] Los campos de correo validan formato email
- [ ] Los campos numéricos solo aceptan números
- [ ] El checkbox de "Solicitud Comunión Casa" funciona
- [ ] Los campos de Habilidades y Destrezas permiten selección múltiple
- [ ] Se puede guardar un miembro con todos los campos completos
- [ ] Se pueden editar miembros ya guardados
- [ ] Se pueden eliminar miembros
- [ ] La tabla muestra correctamente todos los miembros
- [ ] Los datos persisten al cambiar de etapa y volver

#### 🐛 Problemas Detectados - Etapa 4 (FamilyGrid):
_Se documentarán aquí los errores encontrados_

---

### ✅ ETAPA 5: Difuntos de la Familia (DeceasedGrid)
**Objetivo**: Agregar información de familiares difuntos

#### 💐 Difunto 1 - Abuelo Paterno
| Campo | Tipo | Requerido | Valor de Prueba | Estado |
|-------|------|-----------|-----------------|--------|
| Nombres | Text | ✅ Sí | "Pedro Antonio García Pérez" | ⏳ Pendiente |
| Fecha de Fallecimiento | Date | ✅ Sí | 05/12/2020 | ⏳ Pendiente |
| Sexo | Autocomplete | ✅ Sí | "Masculino" | ⏳ Pendiente |
| Parentesco | Autocomplete | ✅ Sí | "Abuelo" | ⏳ Pendiente |
| Causa de Fallecimiento | Text | ❌ No | "Causas naturales - Edad avanzada" | ⏳ Pendiente |

#### 💐 Difunto 2 - Abuela Materna
| Campo | Valor de Prueba | Estado |
|-------|-----------------|--------|
| Nombres | "Rosa María López de Rodríguez" | ⏳ Pendiente |
| Fecha de Fallecimiento | 18/03/2018 | ⏳ Pendiente |
| Sexo | "Femenino" | ⏳ Pendiente |
| Parentesco | "Abuela" | ⏳ Pendiente |
| Causa de Fallecimiento | "Enfermedad cardiovascular" | ⏳ Pendiente |

#### ✅ Validaciones a Verificar - DeceasedGrid:
- [ ] El modal de agregar difunto se abre correctamente
- [ ] Todos los campos están disponibles y editables
- [ ] El date picker funciona para fechas de fallecimiento
- [ ] Los autocomplete de sexo y parentesco cargan correctamente
- [ ] Se puede guardar un difunto con todos los campos
- [ ] Se pueden editar difuntos ya guardados
- [ ] Se pueden eliminar difuntos
- [ ] La tabla muestra correctamente todos los difuntos
- [ ] Los datos persisten al cambiar de etapa

#### 🐛 Problemas Detectados - Etapa 5 (DeceasedGrid):
_Se documentarán aquí los errores encontrados_

---

### ✅ ETAPA 6: Observaciones y Consentimiento
**Objetivo**: Completar información final y autorización

#### Campos a Completar:
| Campo | Tipo | Requerido | Valor de Prueba | Estado |
|-------|------|-----------|-----------------|--------|
| Sustento de la Familia | Textarea | ❌ No | "Trabajo formal como ingeniero y enfermera. Ingresos estables. Ambos padres aportan al hogar." | ⏳ Pendiente |
| Observaciones del Encuestador | Textarea | ❌ No | "Familia muy colaboradora y participativa en actividades parroquiales. Casa en buen estado. Todos los miembros practican activamente su fe." | ⏳ Pendiente |
| Autorización de Datos | Checkbox | ✅ Sí | ✅ Sí (Marcado) | ⏳ Pendiente |

#### ✅ Validaciones a Verificar:
- [ ] Los campos textarea permiten texto largo
- [ ] El checkbox de autorización se muestra claramente
- [ ] No permite enviar sin marcar autorización de datos
- [ ] El botón "Enviar Encuesta" se habilita correctamente
- [ ] Muestra confirmación antes de enviar

#### 🐛 Problemas Detectados - Etapa 6:
_Se documentarán aquí los errores encontrados_

---

## 🔄 Flujos de Navegación a Probar

### ✅ Navegación Básica:
- [ ] Botón "Siguiente" avanza a siguiente etapa
- [ ] Botón "Anterior" retrocede a etapa previa
- [ ] Indicador de progreso muestra etapa actual correctamente
- [ ] Se pueden saltar etapas usando el indicador (si aplica)

### 💾 Guardado Automático:
- [ ] Los datos se guardan en localStorage automáticamente
- [ ] Al recargar la página se recupera el borrador
- [ ] El toast de "Borrador recuperado" aparece correctamente
- [ ] Los datos recuperados son exactos

### 🗑️ Funciones de Limpieza:
- [ ] Existe opción para limpiar borrador
- [ ] Existe opción para cancelar encuesta
- [ ] Las confirmaciones funcionan correctamente

### 📤 Envío Final:
- [ ] El botón "Enviar Encuesta" está disponible en etapa 6
- [ ] Muestra diálogo de confirmación antes de enviar
- [ ] Valida que todos los campos requeridos estén completos
- [ ] Muestra loading mientras se envía
- [ ] Muestra mensaje de éxito tras envío correcto
- [ ] Muestra mensaje de error si falla el envío
- [ ] Limpia el borrador tras envío exitoso
- [ ] Redirige a listado de encuestas tras envío

---

## 📊 Matriz de Validación de Datos

### Validaciones de Formato:
| Tipo de Campo | Validación Esperada | Estado |
|---------------|---------------------|--------|
| Email | Formato válido (xxx@xxx.xxx) | ⏳ Pendiente |
| Teléfono | Solo números, 10 dígitos | ⏳ Pendiente |
| Número Identificación | Solo números | ⏳ Pendiente |
| Fecha | Formato DD/MM/YYYY válido | ⏳ Pendiente |
| Fecha Nacimiento | No puede ser futura | ⏳ Pendiente |
| Fecha Fallecimiento | No puede ser futura | ⏳ Pendiente |

### Validaciones de Requeridos:
| Campo Requerido | Muestra Error | Bloquea Avance | Estado |
|-----------------|---------------|----------------|--------|
| Municipio | ⏳ | ⏳ | ⏳ Pendiente |
| Parroquia | ⏳ | ⏳ | ⏳ Pendiente |
| Fecha | ⏳ | ⏳ | ⏳ Pendiente |
| Apellido Familiar | ⏳ | ⏳ | ⏳ Pendiente |
| Sector | ⏳ | ⏳ | ⏳ Pendiente |
| Dirección | ⏳ | ⏳ | ⏳ Pendiente |
| Tipo Vivienda | ⏳ | ⏳ | ⏳ Pendiente |
| Autorización Datos | ⏳ | ⏳ | ⏳ Pendiente |

---

## 🎨 Validaciones de UI/UX

### Responsive Design:
- [ ] La encuesta se ve correctamente en desktop (1920x1080)
- [ ] La encuesta se ve correctamente en tablet (768px)
- [ ] La encuesta se ve correctamente en móvil (375px)
- [ ] Los modales son responsive
- [ ] Las tablas tienen scroll horizontal en móvil

### Accesibilidad:
- [ ] Todos los campos tienen labels visibles
- [ ] Los colores tienen suficiente contraste
- [ ] Se puede navegar con teclado (Tab)
- [ ] Los errores se anuncian claramente
- [ ] Los botones tienen tamaño adecuado (mínimo 44px)

### Performance:
- [ ] La carga inicial es rápida (< 3 segundos)
- [ ] Los autocomplete responden rápidamente
- [ ] No hay lag al escribir en campos
- [ ] Las transiciones son suaves
- [ ] No hay memory leaks

---

## 🐛 Reporte de Problemas Encontrados

### 🔴 Errores Críticos:
_Problemas que impiden completar la encuesta_

1. **[ERROR-001]** - Descripción del error
   - **Etapa**: 
   - **Campo**: 
   - **Descripción**: 
   - **Pasos para reproducir**: 
   - **Resultado esperado**: 
   - **Resultado actual**: 
   - **Prioridad**: 🔴 Crítica

### 🟡 Errores Menores:
_Problemas que afectan UX pero permiten completar encuesta_

1. **[WARN-001]** - Descripción del warning
   - **Etapa**: 
   - **Descripción**: 
   - **Prioridad**: 🟡 Media

### 🔵 Mejoras Sugeridas:
_Optimizaciones y mejoras de experiencia_

1. **[IMPROVE-001]** - Descripción de mejora
   - **Área**: 
   - **Descripción**: 
   - **Beneficio**: 
   - **Prioridad**: 🔵 Baja

---

## ✅ Checklist de Completitud

### Pre-Prueba:
- [x] Servidor de desarrollo corriendo
- [x] Base de datos disponible
- [x] Navegador actualizado
- [ ] LocalStorage vacío (borrador limpio)

### Durante Prueba:
- [ ] Documentar cada problema en tiempo real
- [ ] Capturar screenshots de errores
- [ ] Verificar console del navegador
- [ ] Probar diferentes navegadores (Chrome, Firefox, Edge)

### Post-Prueba:
- [ ] Compilar lista de errores
- [ ] Priorizar correcciones
- [ ] Crear issues en sistema de tracking
- [ ] Planificar fixes

---

## 📈 Resumen de Resultados

### Estadísticas de la Prueba:
- **Total de Campos Probados**: 0/150+
- **Campos Funcionando Correctamente**: 0
- **Campos con Errores**: 0
- **Errores Críticos Encontrados**: 0
- **Warnings Encontrados**: 0
- **Mejoras Identificadas**: 0

### Tiempo de Prueba:
- **Inicio**: [Pendiente]
- **Fin**: [Pendiente]
- **Duración Total**: [Pendiente]

### Cobertura:
- **Etapa 1**: ⏳ Pendiente
- **Etapa 2**: ⏳ Pendiente
- **Etapa 3**: ⏳ Pendiente
- **Etapa 4**: ⏳ Pendiente
- **Etapa 5**: ⏳ Pendiente
- **Etapa 6**: ⏳ Pendiente

---

## 🎯 Próximos Pasos

1. **Ejecutar Prueba Manual**: Seguir este documento paso a paso
2. **Documentar Problemas**: Actualizar secciones de errores
3. **Implementar Fixes**: Corregir errores encontrados
4. **Re-ejecutar Prueba**: Validar que fixes funcionan
5. **Crear Tests Automatizados**: Para prevenir regresiones

---

## 📝 Notas Adicionales

### Configuración de Prueba:
- **Sistema Operativo**: Windows
- **Navegador Principal**: Chrome
- **Resolución de Pantalla**: 1920x1080
- **Conexión**: Local (localhost:8081)

### Datos de Configuración Necesarios:
Verificar que existan las siguientes opciones en la base de datos:
- ✅ Municipios (Medellín, etc.)
- ✅ Parroquias (San Antonio de Padua, etc.)
- ✅ Sectores (Centro, etc.)
- ✅ Veredas (La Pradera, etc.)
- ✅ Tipos de Vivienda (Casa, Apartamento, etc.)
- ✅ Tipos de Identificación (CC, TI, RC, etc.)
- ✅ Sexos (Masculino, Femenino, etc.)
- ✅ Situaciones Civiles (Soltero, Casado, etc.)
- ✅ Parentescos (Jefe, Esposa, Hijo, etc.)
- ✅ Niveles de Estudio (Primaria, Secundaria, etc.)
- ✅ Comunidades Culturales
- ✅ Enfermedades
- ✅ Profesiones
- ✅ Habilidades
- ✅ Destrezas

---

**Documento creado**: 12 de octubre de 2025  
**Versión**: 1.0  
**Estado**: 📋 Pendiente de Ejecución
