# ⚡ Quick Reference - Testing Campos Dinámicos

## 🚀 Start

```bash
npm run dev
```

Navega a: `http://localhost:8081`

---

## ✅ Test 1: Verificar que Vereda se Guarda

### Pasos
1. Nueva Encuesta → Stage 1
2. Selecciona:
   - Municipio: Cualquiera
   - Parroquia: Cualquiera
   - Sector: Cualquiera
   - **Vereda**: Cualquiera ← IMPORTANTE
   - Corregimiento: Cualquiera
   - Centro Poblado: Cualquiera
3. Otros campos: completa según sea necesario

### Verificar en DevTools
```javascript
// F12 → Console
JSON.parse(localStorage.getItem('parish-survey-draft')).informacionGeneral.vereda
```

### Resultado Esperado
```json
{
  "id": "101",
  "nombre": "La Mesa"
}
```

### Resultado Actual (si falla)
```
null  ← Problema aún existe
```

---

## ✅ Test 2: Recargar y Verificar Recuperación

### Pasos
1. Después de Test 1, presiona **F5**
2. Espera a que la página cargue

### Verificar
- ¿El Sector tiene valor?
- ¿La Vereda tiene valor?
- ¿El Corregimiento tiene valor?
- ¿El Centro Poblado tiene valor?

### Resultado Esperado
Todos deben estar **llenos** (no vacíos)

---

## ✅ Test 3: Editar Encuesta Existente

### Pasos
1. Dashboard → Encuestas Completadas
2. Abre una encuesta existente
3. Observa que Stage 1 se pre-llene

### Verificar en DevTools
```javascript
JSON.parse(localStorage.getItem('parish-survey-draft')).informacionGeneral
```

### Resultado Esperado
Todos los campos dinámicos con sus valores correctos:
- sector: { id, nombre }
- vereda: { id, nombre }
- corregimiento: { id, nombre }
- centro_poblado: { id, nombre }

---

## 🐛 Troubleshooting

### Problema: Vereda sigue siendo null
```
Solución:
1. Limpia localStorage: localStorage.clear()
2. Hard refresh: Ctrl + Shift + R
3. Intenta nuevamente
```

### Problema: Los campos no cargan opciones
```
Solución:
1. Verifica que seleccionaste Municipio primero
2. Espera a que cargue la lista de opciones
3. Revisa Console (F12) por errores de red
```

### Problema: Error en compilación
```bash
# Limpia y reinstala
rm -r node_modules dist
npm install
npm run dev
```

---

## 📊 Expected JSON Output

```json
{
  "informacionGeneral": {
    "municipio": { "id": "x", "nombre": "Medellín" },
    "parroquia": { "id": "y", "nombre": "San Alonso" },
    "sector": { "id": "a", "nombre": "Centro" },
    "vereda": { "id": "b", "nombre": "La Mesa" },
    "corregimiento": { "id": "c", "nombre": "San Sebastián" },
    "centro_poblado": { "id": "d", "nombre": "El Pesebre" },
    "fecha": "2025-10-24",
    "apellido_familiar": "García López",
    "direccion": "Calle 50 #35",
    "comunionEnCasa": false
  }
}
```

---

## 🎯 Success Criteria

- [x] Compilación exitosa
- [ ] Vereda tiene valor (no null)
- [ ] Sector tiene valor
- [ ] Corregimiento tiene valor
- [ ] Centro Poblado tiene valor
- [ ] Recuperación al recargar funciona
- [ ] Edición de encuestas funciona
- [ ] No hay errores en Console

---

## 📞 Si Algo Falla

Reporta:
1. Qué test falló (1, 2 o 3)
2. Valor actual vs esperado
3. Error en Console (copiar y pegar)
4. Navegador y SO

Ejemplo:
```
Test: 1 - Verificar que Vereda se Guarda
Error: 
  Resultado Actual: null
  Resultado Esperado: { id: "101", nombre: "La Mesa" }
  Navegador: Chrome 131
  SO: Windows 11
```

