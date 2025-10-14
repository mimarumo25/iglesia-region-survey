# 🎯 Guía Ejecutiva de Prueba - Encuesta Completa

## 📌 Resumen Ejecutivo

Esta guía proporciona instrucciones **paso a paso** para realizar una prueba completa del formulario de encuesta, llenando **TODOS los campos** sin excepción.

**Estado del Servidor**: ✅ Corriendo en http://localhost:8081/  
**Tiempo Estimado**: 30-45 minutos  
**Nivel de Dificultad**: Media

---

## ⚙️ Preparación Inicial

### 1. Limpiar LocalStorage
Abrir DevTools (F12) → Console → Ejecutar:
```javascript
localStorage.clear();
console.log('✅ LocalStorage limpiado');
```

### 2. Abrir Console para Monitoreo
- DevTools (F12) → Console
- Verificar que no haya errores rojos
- Mantener abierta durante toda la prueba

### 3. Navegar al Formulario
```
URL: http://localhost:8081/survey
```

**Verificación Inicial**:
- [ ] La página carga sin errores
- [ ] Se muestra "Etapa 1: Información General"
- [ ] El indicador de progreso muestra 16% (1/6)
- [ ] Los campos están visibles y editables

---

## 📝 ETAPA 1: Información General

### Instrucciones:
Llenar **TODOS** los campos siguientes:

| Campo | Tipo | Valor a Ingresar | Verificación |
|-------|------|------------------|--------------|
| **Municipio** * | Autocomplete | "Medellín" | [ ] Selecciona de lista |
| **Parroquia** * | Autocomplete | "San Antonio de Padua" | [ ] Se filtra por municipio |
| **Fecha** * | Date Picker | Hoy (12/10/2025) | [ ] Date picker funciona |
| **Apellido Familiar** * | Texto | "García Rodríguez" | [ ] Acepta texto |
| **Vereda** | Autocomplete | "La Pradera" | [ ] Opcional - permite dejar vacío |
| **Sector** * | Autocomplete | "Centro" | [ ] Selecciona de lista |
| **Dirección** * | Texto | "Calle 45 # 67-89 Apto 301" | [ ] Acepta texto |
| **Teléfono** | Texto | "3001234567" | [ ] Acepta números |
| **Número Contrato EPM** | Texto | "123456789" | [ ] Acepta números |

### Validaciones a Probar:

#### Test 1: Campos Requeridos
1. **Dejar Municipio vacío** → Intentar "Siguiente"
   - **Esperado**: ❌ No permite avanzar, muestra error
   - **Real**: _______________

2. **Dejar Parroquia vacío** → Intentar "Siguiente"
   - **Esperado**: ❌ No permite avanzar, muestra error
   - **Real**: _______________

3. **Llenar TODOS los campos requeridos** → Click "Siguiente"
   - **Esperado**: ✅ Avanza a Etapa 2
   - **Real**: _______________

#### Test 2: Dependencia Municipio-Parroquia
1. **Seleccionar Municipio**
2. **Abrir selector de Parroquia**
   - **Esperado**: Solo muestra parroquias de ese municipio
   - **Real**: _______________

#### Test 3: Date Picker
1. **Click en campo Fecha**
   - **Esperado**: Se abre calendario
   - **Real**: _______________

2. **Seleccionar fecha**
   - **Esperado**: Fecha se muestra en formato DD/MM/YYYY
   - **Real**: _______________

### ✅ Checklist Etapa 1:
- [ ] Todos los campos requeridos completados
- [ ] Todos los campos opcionales completados
- [ ] No hay errores en consola
- [ ] Botón "Siguiente" está habilitado
- [ ] Click en "Siguiente" avanza a Etapa 2

---

## 🏠 ETAPA 2: Información de Vivienda y Basuras

### Instrucciones:

| Campo | Tipo | Valor a Ingresar | Verificación |
|-------|------|------------------|--------------|
| **Tipo de Vivienda** * | Autocomplete | "Casa" | [ ] Selecciona de lista |
| **Disposición de Basura** | Multiple Checkbox | Ver abajo | [ ] Permite múltiple selección |

#### Opciones de Disposición de Basura a Marcar:
- [x] **Recolector municipal**
- [ ] Quemada
- [ ] Enterrada
- [x] **Recicla**
- [ ] Aire libre
- [ ] No aplica

### Validaciones a Probar:

#### Test 1: Autocomplete de Vivienda
1. **Click en Tipo de Vivienda**
   - **Esperado**: Se abre lista con opciones (Casa, Apartamento, etc.)
   - **Real**: _______________

2. **Seleccionar "Casa"**
   - **Esperado**: Se muestra en el campo
   - **Real**: _______________

#### Test 2: Checkboxes Múltiples
1. **Marcar "Recolector municipal"**
   - **Esperado**: Checkbox se marca
   - **Real**: _______________

2. **Marcar "Recicla"**
   - **Esperado**: Ambos checkboxes están marcados
   - **Real**: _______________

3. **Desmarcar "Recicla"**
   - **Esperado**: Solo queda marcado "Recolector municipal"
   - **Real**: _______________

4. **Volver a marcar "Recicla"**
   - **Esperado**: Ambos marcados nuevamente
   - **Real**: _______________

### ✅ Checklist Etapa 2:
- [ ] Tipo de vivienda seleccionado
- [ ] Al menos un método de basura seleccionado
- [ ] No hay errores en consola
- [ ] Click en "Siguiente" avanza a Etapa 3

---

## 💧 ETAPA 3: Acueducto y Aguas Residuales

### Instrucciones:

| Campo | Tipo | Valor a Ingresar | Verificación |
|-------|------|------------------|--------------|
| **Sistema de Acueducto** | Autocomplete | "Acueducto Público" | [ ] Selecciona de lista |
| **Aguas Residuales** | Multiple Checkbox | Ver abajo | [ ] Permite múltiple selección |

#### Opciones de Aguas Residuales a Marcar:
- [x] **Pozo Séptico**
- [ ] Letrina
- [ ] Campo Abierto

### Validaciones a Probar:

#### Test 1: Campos Opcionales
1. **Intentar "Siguiente" sin llenar nada**
   - **Esperado**: ✅ Permite avanzar (campos opcionales)
   - **Real**: _______________

2. **Volver con "Anterior"**
   - **Esperado**: Regresa a Etapa 2 con datos intactos
   - **Real**: _______________

3. **Llenar los campos**
   - **Esperado**: Campos se llenan correctamente
   - **Real**: _______________

### ✅ Checklist Etapa 3:
- [ ] Sistema de acueducto seleccionado
- [ ] Tipo de aguas residuales seleccionado
- [ ] Navegación Anterior/Siguiente funciona
- [ ] Click en "Siguiente" avanza a Etapa 4

---

## 👨‍👩‍👧‍👦 ETAPA 4: Información Familiar

**⚠️ IMPORTANTE**: Esta es la etapa más compleja. Prestar especial atención.

### MIEMBRO 1 - Jefe de Familia (Padre)

#### Instrucciones:
1. **Click en botón "Agregar Miembro"**
   - **Verificar**: Se abre modal de diálogo
   - **Estado**: _______________

2. **Llenar campos sección por sección**:

#### ✏️ Sección 1: Información Básica Personal

| Campo | Valor | Verificado |
|-------|-------|------------|
| **Nombres y Apellidos** * | "Juan Carlos García Rodríguez" | [ ] |
| **Fecha de Nacimiento** | 15/03/1980 | [ ] |
| **Tipo Identificación** * | "Cédula de Ciudadanía" | [ ] |
| **Número Identificación** * | "1234567890" | [ ] |
| **Sexo** * | "Masculino" | [ ] |
| **Situación Civil** | "Casado" | [ ] |
| **Parentesco** * | "Jefe de Familia" | [ ] |

#### 👕 Sección 2: Tallas y Medidas

| Campo | Valor | Verificado |
|-------|-------|------------|
| **Talla Camisa** | "L" | [ ] |
| **Talla Pantalón** | "34" | [ ] |
| **Talla Zapato** | "42" | [ ] |

#### 🎓 Sección 3: Educación y Comunidad

| Campo | Valor | Verificado |
|-------|-------|------------|
| **Nivel de Estudio** | "Profesional" | [ ] |
| **Comunidad Cultural** | "Ninguna" | [ ] |

#### 📞 Sección 4: Contacto

| Campo | Valor | Verificado |
|-------|-------|------------|
| **Teléfono** | "3001234567" | [ ] |
| **Correo Electrónico** | "juan.garcia@example.com" | [ ] |
| **En Qué Eres Líder** | "Líder de Jóvenes" | [ ] |

#### 🏥 Sección 5: Salud

| Campo | Valor | Verificado |
|-------|-------|------------|
| **Enfermedad** | "Diabetes" | [ ] |
| **Necesidades Enfermo** | "Insulina diaria" | [ ] |
| **Solicitud Comunión Casa** | ✅ Marcar | [ ] |

#### 🎉 Sección 6: Profesión y Celebración

| Campo | Valor | Verificado |
|-------|-------|------------|
| **Profesión** | "Ingeniero" | [ ] |
| **Motivo Celebrar** | "Cumpleaños" | [ ] |
| **Día** | "15" | [ ] |
| **Mes** | "Marzo" | [ ] |

#### 💪 Sección 7: Habilidades y Destrezas

| Campo | Valores | Verificado |
|-------|---------|------------|
| **Habilidades** | "Carpintería", "Electricidad" | [ ] |
| **Destrezas** | "Liderazgo", "Canto" | [ ] |

#### ✅ Guardar Miembro 1
3. **Click en botón "Guardar Miembro"**
   - **Verificar**: 
     - [ ] Modal se cierra
     - [ ] Miembro aparece en la tabla
     - [ ] Nombre completo visible
     - [ ] Identificación visible
     - [ ] Botones de Editar y Eliminar visibles

---

### MIEMBRO 2 - Madre

#### Instrucciones:
1. **Click en botón "Agregar Miembro"** nuevamente

2. **Llenar todos los campos**:

| Sección | Campo | Valor |
|---------|-------|-------|
| **Básica** | Nombres | "María Fernanda Rodríguez López" |
| | Fecha Nacimiento | 20/08/1982 |
| | Tipo ID | "Cédula de Ciudadanía" |
| | Número ID | "9876543210" |
| | Sexo | "Femenino" |
| | Situación Civil | "Casada" |
| | Parentesco | "Esposa" |
| **Tallas** | Camisa | "M" |
| | Pantalón | "10" |
| | Zapato | "37" |
| **Educación** | Estudio | "Técnico" |
| | Comunidad | "Ninguna" |
| **Contacto** | Teléfono | "3009876543" |
| | Email | "maria.rodriguez@example.com" |
| | Líder en | "Catequesis de Niños" |
| **Salud** | Enfermedad | "Ninguna" |
| | Necesidades | (dejar vacío) |
| | Comunión Casa | ❌ No marcar |
| **Celebración** | Profesión | "Enfermera" |
| | Motivo | "Santo" |
| | Día | "20" |
| | Mes | "Agosto" |
| **Habilidades** | Habilidades | "Cocina", "Costura" |
| | Destrezas | "Enseñanza", "Paciencia" |

3. **Click "Guardar Miembro"**
   - **Verificar**: [ ] 2 miembros en la tabla

---

### MIEMBRO 3 - Hija Mayor

| Sección | Campo | Valor |
|---------|-------|-------|
| **Básica** | Nombres | "Ana Sofía García Rodríguez" |
| | Fecha Nacimiento | 10/05/2010 |
| | Tipo ID | "Tarjeta de Identidad" |
| | Número ID | "1122334455" |
| | Sexo | "Femenino" |
| | Situación Civil | "Soltera" |
| | Parentesco | "Hija" |
| **Tallas** | Camisa | "S" |
| | Pantalón | "6" |
| | Zapato | "35" |
| **Educación** | Estudio | "Secundaria" |
| | Comunidad | "Grupo de Jóvenes" |
| **Contacto** | Teléfono | "3157778899" |
| | Email | "ana.garcia@student.com" |
| | Líder en | "Monaguilla" |
| **Salud** | Enfermedad | "Ninguna" |
| | Necesidades | (vacío) |
| | Comunión Casa | ❌ No |
| **Celebración** | Profesión | "Estudiante" |
| | Motivo | "Cumpleaños" |
| | Día | "10" |
| | Mes | "Mayo" |
| **Habilidades** | Habilidades | "Dibujo", "Música" |
| | Destrezas | "Canto", "Guitarra" |

**Guardar**: [ ] 3 miembros en tabla

---

### MIEMBRO 4 - Hijo Menor

| Sección | Campo | Valor |
|---------|-------|-------|
| **Básica** | Nombres | "David Alejandro García Rodríguez" |
| | Fecha Nacimiento | 22/11/2015 |
| | Tipo ID | "Registro Civil" |
| | Número ID | "5566778899" |
| | Sexo | "Masculino" |
| | Situación Civil | "Soltero" |
| | Parentesco | "Hijo" |
| **Tallas** | Camisa | "XS" |
| | Pantalón | "4" |
| | Zapato | "32" |
| **Educación** | Estudio | "Primaria" |
| | Comunidad | "Infancia Misionera" |
| **Contacto** | Teléfono | (dejar vacío) |
| | Email | (dejar vacío) |
| | Líder en | "Acólito" |
| **Salud** | Enfermedad | "Asma" |
| | Necesidades | "Inhalador de emergencia" |
| | Comunión Casa | ❌ No |
| **Celebración** | Profesión | "Estudiante" |
| | Motivo | "Primera Comunión" |
| | Día | "22" |
| | Mes | "Noviembre" |
| **Habilidades** | Habilidades | "Deportes", "Lectura" |
| | Destrezas | "Fútbol", "Natación" |

**Guardar**: [ ] 4 miembros en tabla

---

### 🧪 Tests de Funcionalidad - Miembros de Familia

#### Test 1: Edición de Miembro
1. **Click en botón "Editar" del Miembro 1**
   - **Verificar**: Se abre modal con datos cargados
   - **Estado**: _______________

2. **Cambiar el teléfono a "3001111111"**
3. **Click "Guardar Miembro"**
   - **Verificar**: Cambio se refleja en tabla
   - **Estado**: _______________

#### Test 2: Validación de Campos Requeridos en Modal
1. **Click "Agregar Miembro"**
2. **Dejar "Nombres" vacío y click "Guardar"**
   - **Esperado**: ❌ No guarda, muestra error
   - **Real**: _______________

3. **Llenar "Nombres", dejar "Número ID" vacío, click "Guardar"**
   - **Esperado**: ❌ No guarda, muestra error
   - **Real**: _______________

4. **Click "Cancelar" para cerrar modal**

#### Test 3: Validación de Email
1. **Editar Miembro 2**
2. **Cambiar email a "correo-invalido"** (sin @)
3. **Intentar guardar**
   - **Esperado**: ❌ Muestra error de formato
   - **Real**: _______________

4. **Corregir email y guardar**

### ✅ Checklist Etapa 4:
- [ ] 4 miembros agregados correctamente
- [ ] Todos los campos de cada miembro completos
- [ ] Tabla muestra todos los miembros
- [ ] Edición funciona correctamente
- [ ] Validaciones de campos requeridos funcionan
- [ ] No hay errores en consola
- [ ] Click en "Siguiente" avanza a Etapa 5

---

## 💐 ETAPA 5: Difuntos de la Familia

### DIFUNTO 1 - Abuelo Paterno

#### Instrucciones:
1. **Click en botón "Agregar Difunto"**
   - **Verificar**: Se abre modal
   - **Estado**: _______________

2. **Llenar todos los campos**:

| Campo | Valor | Verificado |
|-------|-------|------------|
| **Nombres** * | "Pedro Antonio García Pérez" | [ ] |
| **Fecha de Fallecimiento** * | 05/12/2020 | [ ] |
| **Sexo** * | "Masculino" | [ ] |
| **Parentesco** * | "Abuelo" | [ ] |
| **Causa de Fallecimiento** | "Causas naturales - Edad avanzada" | [ ] |

3. **Click "Guardar Difunto"**
   - **Verificar**: Difunto aparece en tabla
   - **Estado**: _______________

---

### DIFUNTO 2 - Abuela Materna

| Campo | Valor | Verificado |
|-------|-------|------------|
| **Nombres** * | "Rosa María López de Rodríguez" | [ ] |
| **Fecha de Fallecimiento** * | 18/03/2018 | [ ] |
| **Sexo** * | "Femenino" | [ ] |
| **Parentesco** * | "Abuela" | [ ] |
| **Causa de Fallecimiento** | "Enfermedad cardiovascular" | [ ] |

**Guardar**: [ ] 2 difuntos en tabla

---

### 🧪 Tests de Funcionalidad - Difuntos

#### Test 1: Validación de Fecha Futura
1. **Click "Agregar Difunto"**
2. **Intentar seleccionar fecha futura (2026)**
   - **Esperado**: ❌ No permite o muestra error
   - **Real**: _______________

3. **Cancelar**

#### Test 2: Edición de Difunto
1. **Click "Editar" en Difunto 1**
2. **Cambiar causa a "Edad avanzada - 95 años"**
3. **Guardar**
   - **Verificar**: Cambio se refleja
   - **Estado**: _______________

### ✅ Checklist Etapa 5:
- [ ] 2 difuntos agregados
- [ ] Todos los campos completos
- [ ] Fechas de fallecimiento válidas (pasadas)
- [ ] No hay errores en consola
- [ ] Click en "Siguiente" avanza a Etapa 6

---

## 📋 ETAPA 6: Observaciones y Consentimiento

### Instrucciones:

| Campo | Valor a Ingresar | Verificado |
|-------|------------------|------------|
| **Sustento de la Familia** | "Trabajo formal como ingeniero y enfermera. Ingresos estables. Ambos padres aportan al hogar. La familia cuenta con seguridad social y estabilidad económica." | [ ] |
| **Observaciones del Encuestador** | "Familia muy colaboradora y participativa en actividades parroquiales. Casa en buen estado, bien ubicada en el sector. Todos los miembros practican activamente su fe y asisten regularmente a misa dominical." | [ ] |
| **Autorización de Datos** * | ✅ **MARCAR CHECKBOX** | [ ] |

### 🧪 Tests de Funcionalidad - Etapa Final

#### Test 1: Validación de Autorización
1. **Dejar checkbox SIN marcar**
2. **Intentar click en "Enviar Encuesta"**
   - **Esperado**: ❌ No permite enviar, muestra error
   - **Real**: _______________

3. **Marcar checkbox de autorización**
   - **Esperado**: ✅ Botón "Enviar" se habilita
   - **Real**: _______________

#### Test 2: Revisión Final Antes de Envío
1. **Click en indicador de "Etapa 1" en el progreso**
   - **Verificar**: Vuelve a Etapa 1 con datos intactos
   - **Estado**: _______________

2. **Navegar por todas las etapas usando el indicador**
   - **Verificar**: Todos los datos se mantienen
   - **Estado**: _______________

3. **Volver a Etapa 6**

### ✅ Checklist Etapa 6:
- [ ] Sustento de familia completado
- [ ] Observaciones completadas
- [ ] Checkbox de autorización MARCADO
- [ ] Botón "Enviar Encuesta" está habilitado

---

## 🚀 ENVÍO FINAL

### Instrucciones para Envío:

1. **Revisar Console** (F12)
   - **Verificar**: No hay errores rojos
   - **Estado**: _______________

2. **Click en botón "Enviar Encuesta"**
   - **Esperado**: Se muestra diálogo de confirmación
   - **Real**: _______________

3. **Confirmar envío**
   - **Esperado**: 
     - Muestra loading/spinner
     - Se envía al servidor
     - Muestra toast de éxito
     - Limpia localStorage
     - Redirige a dashboard en 3 segundos
   - **Real**: _______________

### 🔍 Verificaciones Post-Envío:

1. **Abrir DevTools → Application → Local Storage**
   - **Verificar**: 
     - [ ] No existe `parish-survey-draft`
     - [ ] Existe `parish-survey-completed` (opcional)

2. **Verificar en Console**:
   - **Buscar**: Mensaje "📝 Creando nueva encuesta"
   - **Estado**: _______________

3. **Verificar Redirección**
   - **Esperado**: En 3 segundos redirige a `/dashboard`
   - **Real**: _______________

4. **En Dashboard, verificar**:
   - **Buscar**: Encuesta "García Rodríguez" en listado
   - **Estado**: _______________

---

## 📊 REPORTE DE RESULTADOS

### ✅ Resumen de Ejecución:

| Etapa | Estado | Errores Encontrados |
|-------|--------|---------------------|
| 1. Información General | ⏳ | |
| 2. Vivienda y Basuras | ⏳ | |
| 3. Acueducto y Aguas | ⏳ | |
| 4. Miembros de Familia | ⏳ | |
| 5. Difuntos | ⏳ | |
| 6. Observaciones | ⏳ | |
| **Envío Final** | ⏳ | |

### 🐛 Errores Críticos Encontrados:
_Documentar aquí cualquier error que impida completar la prueba_

1. 
2. 
3. 

### ⚠️ Warnings o Errores Menores:
_Documentar aquí errores que no impiden completar pero afectan UX_

1. 
2. 
3. 

### ✨ Aspectos Positivos:
_Documentar funcionalidades que funcionaron correctamente_

1. 
2. 
3. 

### 💡 Mejoras Sugeridas:
_Ideas para mejorar la experiencia del usuario_

1. 
2. 
3. 

---

## 🎯 Conclusión

**Prueba Completada**: ⏳ Pendiente  
**Encuesta Enviada Exitosamente**: ⏳ Pendiente  
**Tiempo Total de Prueba**: ___________ minutos

**Calificación General**: ___ / 10

**Recomendación**: 
- [ ] ✅ Aprobado - Listo para producción
- [ ] ⚠️ Aprobado con observaciones - Requiere mejoras menores
- [ ] ❌ No aprobado - Requiere correcciones críticas

---

**Documento Creado**: 12 de octubre de 2025  
**Versión**: 1.0  
**Tester**: _______________  
**Fecha de Ejecución**: _______________
