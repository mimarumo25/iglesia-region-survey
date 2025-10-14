# 🧪 Prueba Completa de Encuesta - Octubre 2025

**Fecha de Prueba**: 13 de Octubre de 2025  
**URL de Prueba**: http://localhost:8081  
**Estado Inicial**: Formulario de miembro familiar reparado

---

## 📋 Objetivo de la Prueba

Ejecutar una prueba completa de una encuesta desde cero, validando:
1. ✅ Navegación entre etapas
2. ✅ Validación de campos obligatorios
3. ✅ Formulario de miembros de familia (recién reparado)
4. ✅ Guardado automático (localStorage)
5. ✅ Envío final de la encuesta
6. ✅ Persistencia de datos

---

## 🎯 Plan de Prueba Paso a Paso

### **Etapa 1: Información General** (9 campos)

**Campos a completar:**
```yaml
- Municipio: "Medellín" (obligatorio)
- Parroquia: "San José de los Carpinteros" (obligatorio)
- Fecha: "13/10/2025" (obligatorio)
- Apellido Familiar: "Rodríguez García" (obligatorio)
- Vereda: "El Poblado" (opcional)
- Sector: "Sector 1" (obligatorio)
- Dirección: "Calle 10 #45-67" (obligatorio)
- Teléfono: "300-123-4567" (opcional)
- Número Contrato EPM: "123456789" (opcional)
```

**Validaciones esperadas:**
- ✅ No permite avanzar si faltan campos obligatorios
- ✅ Autocompletados funcionan correctamente
- ✅ Fecha se selecciona desde el DatePicker moderno

---

### **Etapa 2: Información de Vivienda y Basuras** (2 campos)

**Campos a completar:**
```yaml
- Tipo de Vivienda: "Casa" (obligatorio)
- Disposición de Basura: [✓ Recolección pública, ✓ Reciclaje] (opcional, múltiple)
```

**Validaciones esperadas:**
- ✅ Selección múltiple de disposición de basura funciona
- ✅ Al menos el tipo de vivienda es obligatorio

---

### **Etapa 3: Acueducto y Aguas Residuales** (2 campos)

**Campos a completar:**
```yaml
- Sistema de Acueducto: "Acueducto Municipal" (opcional)
- Aguas Residuales: [✓ Alcantarillado público] (opcional, múltiple)
```

**Validaciones esperadas:**
- ✅ Puede avanzar sin completar (campos opcionales)
- ✅ Selección múltiple funciona correctamente

---

### **Etapa 4: Información Familiar** (Gestión de Miembros)

**⭐ PRUEBA CRÍTICA: Formulario de miembro recién reparado**

#### **Miembro 1 - Jefe de Familia**

**Sección 1: Información Básica Personal**
```yaml
- Nombres y Apellidos: "Juan Carlos Rodríguez García" ✅
- Fecha de Nacimiento: "15/03/1985" ✅
- Número de Identificación: "1234567890" ✅
- Tipo de Identificación: "Cédula de Ciudadanía" ✅
```

**Sección 2: Información de Contacto**
```yaml
- Teléfono: "300-123-4567"
- Correo Electrónico: "juan.rodriguez@email.com"
```

**Sección 3: Información Demográfica**
```yaml
- Sexo: "Masculino"
- Parentesco: "Jefe de familia"
- Situación Civil: "Casado"
```

**Sección 4: Información Educativa y Profesional**
```yaml
- Nivel de Estudios: "Universidad completa"
- Profesión: "Ingeniero"
```

**Sección 5: Información Cultural y de Salud**
```yaml
- Comunidad Cultural: "Mestizo"
- Enfermedad: "Ninguna"
- Necesidades del Enfermo: ""
- Solicitud de Comunión en Casa: ☐ No
```

**Sección 6: Información de Tallas**
```yaml
- Camisa/Blusa: "L"
- Pantalón: "32"
- Calzado: "42"
```

**Sección 7: Fechas a Celebrar**
```yaml
- Motivo: "Cumpleaños"
- Día: "15"
- Mes: "Marzo"
```

**Sección 8: Información de Servicios y Liderazgo**
```yaml
- ¿En qué eres líder?: "Grupo de oración"
```

**Sección 9: Habilidades y Destrezas**
```yaml
- Habilidades: ["Administración", "Liderazgo"]
- Destrezas: ["Carpintería", "Electricidad"]
```

**Acciones esperadas:**
1. ✅ Clic en "Agregar Miembro"
2. ✅ Modal se abre correctamente
3. ✅ Completar todos los campos
4. ✅ Clic en "Agregar Miembro" (botón del formulario)
5. ✅ Modal se cierra automáticamente
6. ✅ Mensaje toast: "Miembro agregado"
7. ✅ Miembro aparece en la tabla

---

#### **Miembro 2 - Cónyuge**

**Datos reducidos para agilizar:**
```yaml
Sección 1:
- Nombres: "María Elena García López" ✅
- Fecha Nacimiento: "20/07/1988" ✅
- Número Identificación: "9876543210" ✅
- Tipo Identificación: "Cédula de Ciudadanía" ✅

Sección 2:
- Teléfono: "310-987-6543"
- Email: "maria.garcia@email.com"

Sección 3:
- Sexo: "Femenino"
- Parentesco: "Cónyuge"
- Situación Civil: "Casada"

Sección 4:
- Estudios: "Técnico completo"
- Profesión: "Enfermera"

Sección 6:
- Camisa: "M"
- Pantalón: "30"
- Calzado: "38"
```

**Acciones esperadas:**
1. ✅ Clic en "Agregar Miembro"
2. ✅ Completar campos obligatorios
3. ✅ Guardar exitosamente
4. ✅ Ahora hay 2 miembros en la tabla

---

#### **Pruebas de Edición y Eliminación**

**Editar Miembro 1:**
1. ✅ Clic en botón "Editar" (lápiz) del primer miembro
2. ✅ Modal se abre con datos pre-cargados
3. ✅ Cambiar teléfono a "301-111-2222"
4. ✅ Guardar cambios
5. ✅ Mensaje toast: "Miembro actualizado"
6. ✅ Cambio reflejado en la tabla

**Eliminar y Re-agregar:**
1. ✅ Intentar avanzar sin miembros (debe fallar)
2. ✅ Agregar de nuevo un miembro
3. ✅ Poder avanzar exitosamente

---

### **Etapa 5: Difuntos de la Familia**

**Difunto 1:**
```yaml
- Nombres: "Pedro Rodríguez Martínez"
- Parentesco: "Abuelo"
- Fecha de Defunción: "10/05/2020"
- Observaciones: "Falleció en casa, requiere misa mensual"
```

**Acciones esperadas:**
1. ✅ Agregar difunto exitosamente
2. ✅ Puede dejarse vacío (opcional)
3. ✅ Avanzar a siguiente etapa

---

### **Etapa 6: Observaciones y Consentimiento**

**Campos a completar:**
```yaml
- Sustento de la Familia: "Trabajo estable, ingresos de ambos cónyuges"
- Observaciones del Encuestador: "Familia colaboradora y participativa en actividades parroquiales"
- Autorización de datos: ☑ SÍ (obligatorio)
```

**Validaciones esperadas:**
- ✅ No permite enviar sin autorización de datos
- ✅ Observaciones son opcionales
- ✅ Botón "Enviar Encuesta" habilitado

---

## 🚀 Envío y Validación Final

### **Proceso de Envío**

1. **Antes de enviar:**
   - ✅ Revisar resumen de datos
   - ✅ Verificar que todos los miembros están guardados
   - ✅ Confirmar autorización de datos

2. **Al hacer clic en "Enviar Encuesta":**
   - ✅ Mostrar spinner de carga
   - ✅ Botón deshabilitado durante envío
   - ✅ Mensaje de "Enviando encuesta..."

3. **Respuesta exitosa:**
   - ✅ Mensaje toast: "Encuesta enviada exitosamente"
   - ✅ Redirección automática al listado de encuestas
   - ✅ localStorage limpiado
   - ✅ Encuesta visible en el listado

4. **Respuesta con error:**
   - ✅ Mensaje de error descriptivo
   - ✅ Datos NO se pierden
   - ✅ Permitir reintentar

---

## 🔍 Validaciones de Guardado Automático

### **Prueba de Recuperación de Sesión**

1. **Durante completar Etapa 2:**
   - ✅ Recargar página (F5)
   - ✅ Datos de Etapa 1 se mantienen
   - ✅ Continuar en Etapa 2 donde se quedó

2. **Después de agregar 1 miembro:**
   - ✅ Recargar página
   - ✅ Miembro agregado sigue visible
   - ✅ Datos de etapas anteriores intactos

3. **Antes de enviar:**
   - ✅ Cerrar pestaña del navegador
   - ✅ Abrir nueva pestaña en la URL
   - ✅ Datos completos recuperados
   - ✅ Mensaje: "Sesión recuperada"

---

## 📊 Checklist de Validación Final

### **Funcionalidades Básicas**
- [ ] Navegación entre etapas fluida
- [ ] Campos obligatorios validados correctamente
- [ ] Autocompletados cargan y funcionan
- [ ] DatePicker moderno funciona en todos los campos de fecha
- [ ] Validación de teléfono y email

### **Gestión de Miembros de Familia** ⭐
- [ ] Modal se abre correctamente
- [ ] Formulario completo visible (9 secciones)
- [ ] Campos obligatorios validados
- [ ] Botón "Agregar Miembro" funciona
- [ ] Modal se cierra automáticamente
- [ ] Mensaje de confirmación aparece
- [ ] Miembro aparece en tabla
- [ ] Edición de miembros funciona
- [ ] Eliminación de miembros funciona
- [ ] Validación de campos únicos (número identificación)

### **Gestión de Difuntos**
- [ ] Agregar difunto funciona
- [ ] Campos opcionales validados
- [ ] Editar difunto funciona
- [ ] Eliminar difunto funciona

### **Guardado y Persistencia**
- [ ] Guardado automático tras cada cambio
- [ ] Recuperación después de recargar
- [ ] LocalStorage actualizado correctamente
- [ ] Migración de datos antiguos funciona

### **Envío y Finalización**
- [ ] Validación completa antes de enviar
- [ ] Spinner de carga visible
- [ ] Mensaje de éxito aparece
- [ ] Redirección automática funciona
- [ ] Datos visibles en listado de encuestas
- [ ] LocalStorage limpiado después de envío exitoso

### **Manejo de Errores**
- [ ] Errores de red manejados correctamente
- [ ] Mensajes de error descriptivos
- [ ] Datos no se pierden en caso de error
- [ ] Posibilidad de reintentar envío

---

## 🐛 Registro de Problemas Encontrados

| # | Problema | Severidad | Estado | Solución |
|---|----------|-----------|--------|----------|
| 1 | Modal de miembro no guardaba | 🔴 Crítico | ✅ Resuelto | Eliminado doble trigger del Dialog |
| 2 | (Agregar según se encuentren) | | | |

---

## ✅ Resultado Final de la Prueba

**Fecha de Ejecución**: [A completar]  
**Duración Total**: [A completar]  
**Estado General**: [A completar]

### Resumen:
- **Total de pasos ejecutados**: __/50
- **Pasos exitosos**: __/50
- **Problemas críticos**: __
- **Problemas menores**: __
- **Funcionalidad general**: ⭐⭐⭐⭐⭐ (__ de 5)

---

## 📝 Notas Adicionales

- El formulario de miembro familiar fue reparado hoy (13/10/2025) eliminando conflictos de gestión de estado del Dialog
- Se eliminaron múltiples `setTimeout` que causaban condiciones de carrera
- El patrón correcto de shadcn/ui Dialog se implementó correctamente

---

## 🎯 Próximos Pasos

1. [ ] Ejecutar esta prueba completa
2. [ ] Documentar cualquier problema encontrado
3. [ ] Validar integración con backend real
4. [ ] Pruebas de estrés con múltiples miembros (10+)
5. [ ] Pruebas en diferentes navegadores
6. [ ] Pruebas en dispositivos móviles

---

**Preparado por**: GitHub Copilot  
**Versión del Sistema**: 1.0 (Octubre 2025)  
**Última actualización**: 13 de Octubre de 2025
