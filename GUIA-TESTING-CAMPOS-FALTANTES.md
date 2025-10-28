# 🧪 Guía de Testing - Campos Faltantes Corregidos

## Pasos para Verificar que los Cambios Funcionan

### 1. Iniciar la Aplicación

```bash
npm run dev
```

Espera a que compile y luego abre: `http://localhost:8081`

---

## 2. Prueba A: Nuevo Borrador (Crear Nueva Encuesta)

### Pasos:
1. ✅ Haz clic en **"Nueva Encuesta"** o navega a `/surveys/new`
2. ✅ Completa el **Stage 1 "Información General"** con:
   - **Municipio**: Selecciona uno (ej: Medellín)
   - **Parroquia**: Selecciona una
   - **Sector**: Selecciona uno
   - **Vereda**: Selecciona una
   - **Corregimiento**: Selecciona uno (NUEVO - debería estar disponible)
   - **Centro Poblado**: Selecciona uno (NUEVO - debería estar disponible)
   - **Fecha**: Auto-completa (actual)
   - **Apellido Familiar**: Ingresa un valor
   - **Resto de campos**: Completa según sea necesario

### Verificación en Consola del Navegador:

1. ✅ Abre **DevTools**: `F12`
2. ✅ Vete a la pestaña **Console**
3. ✅ Ejecuta este comando:

```javascript
JSON.parse(localStorage.getItem('parish-survey-draft'))
```

### ✅ Resultado Esperado:

Deberías ver un objeto JSON como este:

```json
{
  "version": "2.0",
  "informacionGeneral": {
    "municipio": {
      "id": "123",
      "nombre": "Medellín"
    },
    "parroquia": {
      "id": "456",
      "nombre": "San Alonso"
    },
    "sector": {
      "id": "789",
      "nombre": "Centro"
    },
    "vereda": {
      "id": "101",
      "nombre": "La Mesa"
    },
    "corregimiento": {
      "id": "202",
      "nombre": "San Sebastián"
    },
    "centro_poblado": {
      "id": "303",
      "nombre": "El Pesebre"
    },
    "fecha": "2025-10-24",
    "apellido_familiar": "García López",
    "direccion": "Calle 50 # 35-20",
    "telefono": "3123456789",
    "numero_contrato_epm": "",
    "comunionEnCasa": false
  },
  "vivienda": { ... },
  "servicios_agua": { ... },
  "observaciones": { ... },
  "familyMembers": [],
  "deceasedMembers": [],
  "metadata": { ... }
}
```

### 🔴 Si algo Falta:

Si **corregimiento** o **centro_poblado** aparecen como `null` o vacíos, hay un problema.

---

## 3. Prueba B: Recuperación de Borrador

### Pasos:

1. ✅ Después de completar la Prueba A, **recarga la página**: `F5`
2. ✅ Verifica que los campos se hayan recuperado:
   - ¿El **Municipio** tiene valor?
   - ¿La **Parroquia** tiene valor?
   - ¿El **Sector** tiene valor?
   - ¿La **Vereda** tiene valor?
   - ¿El **Corregimiento** tiene valor? ⭐ (NUEVO)
   - ¿El **Centro Poblado** tiene valor? ⭐ (NUEVO)

### ✅ Resultado Esperado:

Todos los campos deberían estar rellenos con los valores que ingresaste antes de recargar.

### 🔴 Si algo Falta:

Si los campos dinámicos (Corregimiento, Centro Poblado) están vacíos, el localStorage no se recuperó correctamente.

---

## 4. Prueba C: Edición de Encuesta

### Pasos:

1. ✅ Navega a **Dashboard** → **Encuestas Completadas** (si tienes alguna)
2. ✅ Abre una encuesta existente (haz clic en una fila)
3. ✅ El formulario debería pre-llenar con:
   - Municipio ✅
   - Parroquia ✅
   - Sector ✅
   - Vereda ✅
   - **Corregimiento** ⭐ (NUEVO)
   - **Centro Poblado** ⭐ (NUEVO)

### ✅ Resultado Esperado:

Los campos `Corregimiento` y `Centro Poblado` deberían cargarse desde la API y aparecer pre-seleccionados.

### 🔴 Si algo Falta:

Si estos campos están vacíos en modo edición, la transformación desde la API necesita revisión.

---

## 5. Prueba D: Verificar en DevTools (Network)

### Pasos:

1. ✅ Abre **DevTools** → **Network tab**
2. ✅ Completa un formulario completo y **envíalo**
3. ✅ Busca el request POST a `/api/...`
4. ✅ Verifica el payload enviado (click en el request → Preview o Response)

### ✅ Resultado Esperado:

El JSON enviado debería incluir:
```json
{
  "corregimiento": { "id": "...", "nombre": "..." },
  "centro_poblado": { "id": "...", "nombre": "..." },
  ...
}
```

---

## 🐛 Solución de Problemas

### Problema: Los campos siguen vacíos en localStorage

**Soluciones:**
1. ✅ Limpia el localStorage completamente:
   ```javascript
   localStorage.clear()
   ```
2. ✅ Recarga la página: `Ctrl + Shift + R` (hard refresh)
3. ✅ Ingresa nuevamente los datos y verifica

### Problema: Los campos dinámicos no cargan cuando cambio de municipio

**Soluciones:**
1. ✅ Asegúrate que el municipio esté correctamente seleccionado
2. ✅ Espera a que las opciones de corregimiento/centro_poblado se carguen
3. ✅ Revisa en DevTools → Console si hay errores de red

### Problema: Error de compilación

**Soluciones:**
```bash
# Limpia node_modules y reinstala
rm -r node_modules
npm install

# Limpia caché de Vite
rm -r dist

# Intenta de nuevo
npm run dev
```

---

## ✅ Checklist Final

- [ ] Compilación exitosa (`npm run build`)
- [ ] Los campos Corregimiento y Centro Poblado aparecen en el formulario
- [ ] Se guardan en localStorage correctamente
- [ ] Se recuperan al recargar la página
- [ ] Se cargan correctamente en modo edición desde la API
- [ ] Se envían al backend en el JSON correcto
- [ ] No hay errores en la consola del navegador
- [ ] Los otros campos (vereda, sector) también funcionan

---

## 📝 Notas

- Los cambios son **retrocompatibles** - los borradores antiguos seguirán funcionando
- Si hay borradores antiguos sin estos campos, se llenarán como `null` (sin error)
- La estructura es **versionada** - permite migrar formatos en el futuro si es necesario

---

## 🆘 Reporte de Errores

Si encuentras algún problema, por favor reporta:

1. **Qué paso exacto hace que falle**
2. **Error en consola** (F12 → Console)
3. **Valor esperado vs actual**
4. **Navegador y SO**

Ejemplo:
```
Paso: Seleccionar Centro Poblado
Error en consola: TypeError: dynamicCentroPobladoOptions is undefined
Valor esperado: { id: "123", nombre: "El Pesebre" }
Valor actual: null
Navegador: Chrome 131.0
SO: Windows 11
```

