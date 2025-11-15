# 🔍 Guía Paso a Paso: Cómo Verificar en DevTools

## 📱 Requisitos
- Navegador Chrome/Firefox/Edge (con DevTools)
- Aplicación corriendo (`npm run dev`)
- Llenar un formulario de encuesta completamente

---

## ✅ VERIFICACIÓN 1: Consola (Console Tab)

### Paso 1: Abre DevTools
- Windows/Linux: `F12` o `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

### Paso 2: Ve a la pestaña "Console"

### Paso 3: Llena el formulario completo
- Etapa 1: Información General
- Etapa 2: Vivienda
- Etapa 3: Agua y Saneamiento
- Etapa 4: Familia
- Etapa 5: Difuntos
- Etapa 6: Revisión

### Paso 4: Haz click en "Guardar Encuesta"

### Paso 5: Mira la Consola
Deberías ver exactamente esto:

```
💾 GUARDADO EN LOCALSTORAGE:
{
  "version": "2.0",
  "informacionGeneral": {
    "municipio": {
      "id": 1,
      "nombre": "Medellín"
    },
    ...
  },
  "familyMembers": [
    {
      "nombres": "Juan",
      "numeroIdentificacion": "123456789",
      ...
      "profesionMotivoFechaCelebrar": {
        "celebraciones": [
          {
            "motivo": "Cumpleaños",
            "dia": "15",
            "mes": "05"
          }
        ]
      }
    }
  ],
  "deceasedMembers": [
    {
      "nombres": "María",
      "sexo": {
        "id": 2,
        "nombre": "Femenino"
      },
      ...
    }
  ]
}
```

### ⚠️ ¿Qué NO deberías ver?
- ❌ `"id": "1702657452927"` en familyMembers
- ❌ `"id": "celebracion-1702657452927-abc123"` en celebraciones
- ❌ `"id": "1762657452927"` en deceasedMembers

✅ **Si no ves esos IDs = Correcto!**

---

## ✅ VERIFICACIÓN 2: localStorage

### Paso 1: En la Consola, copia este código:

```javascript
const stored = JSON.parse(localStorage.getItem('parish-survey-completed'));
console.log('📦 CONTENIDO DE LOCALSTORAGE:');
console.log(JSON.stringify(stored, null, 2));
```

### Paso 2: Presiona Enter

### Paso 3: Verifica que sea idéntico al log anterior

✅ **Si el contenido es idéntico = Correcto!**

### Paso 4: Verificar específicamente los IDs

```javascript
// En la consola, ejecuta esto:
const stored = JSON.parse(localStorage.getItem('parish-survey-completed'));

// Verificar familyMembers
console.log('familyMembers tienen id?', stored.familyMembers.some(m => 'id' in m));
// Debería mostrar: false ✅

// Verificar celebraciones
console.log('Celebraciones tienen id?', 
  stored.familyMembers.some(m => 
    m.profesionMotivoFechaCelebrar?.celebraciones?.some(c => 'id' in c)
  )
);
// Debería mostrar: false ✅

// Verificar deceasedMembers
console.log('deceasedMembers tienen id?', stored.deceasedMembers.some(d => 'id' in d));
// Debería mostrar: false ✅
```

---

## ✅ VERIFICACIÓN 3: Network Request (Red)

### Paso 1: Abre DevTools y ve a "Network" tab

### Paso 2: En la lista, desactiva el filtro (si está activo)
- Haz click en "All"

### Paso 3: Llena el formulario y click "Guardar Encuesta"

### Paso 4: Busca una solicitud POST a `/api/encuestas`
- Debería ser de color verde (200 OK)

### Paso 5: Haz click en esa solicitud

### Paso 6: Ve a la pestaña "Request" o "Payload"

### Paso 7: Busca el JSON enviado
```json
{
  "informacionGeneral": {...},
  "familyMembers": [...],  // ← Sin IDs
  "deceasedMembers": [...]  // ← Sin IDs
}
```

### Paso 8: Verifica que NO tenga IDs temporales
```javascript
// Copia el payload en consola y verifica:
const payload = { /* paste aqui */ };
console.log('Tiene IDs temporales?', JSON.stringify(payload).includes('id'));
// Debería mostrar: false (o mostrar solo los IDs config: "id": 1, "id": 2, etc)
```

---

## ✅ VERIFICACIÓN 4: Response (Respuesta del Servidor)

### Paso 1: Sigue pasos 1-5 de VERIFICACIÓN 3

### Paso 2: Ve a la pestaña "Response"

### Paso 3: Deberías ver algo como:
```json
{
  "success": true,
  "surveyId": "abc123def456",
  "message": "Encuesta guardada exitosamente"
}
```

✅ **Si ves `"success": true` = La encuesta se guardó en el backend!**

---

## 🚀 COMPARATIVA: Consola vs localStorage vs Network

```javascript
// En consola, ejecuta esto para comparar los 3:

// 1. Lo que se mostró en consola
console.log('1️⃣ CONSOLA LOG:');
console.log('Ver arriba en el panel de consola');

// 2. Lo que está en localStorage
console.log('\n2️⃣ LOCALSTORAGE:');
const stored = JSON.parse(localStorage.getItem('parish-survey-completed'));
console.log(JSON.stringify(stored, null, 2));

// 3. Deberían ser IDÉNTICOS
console.log('\n3️⃣ ¿Son idénticos?');
console.log('Sí, si tanto consola como localStorage muestran lo mismo sin IDs temporales');
```

---

## ⚙️ Tabla de Referencia

| Dónde | Qué buscar | ✅ Correcto | ❌ Incorrecto |
|-------|-----------|-----------|-------------|
| **Consola** | Primeras líneas después de "Guardar" | Sin IDs temp | Tiene `"id": "1702..."` |
| **localStorage** | `JSON.stringify()` del contenido | Sin IDs temp | Tiene `"id": "1702..."` |
| **Network** | POST /api/encuestas Payload | Sin IDs temp | Tiene `"id": "1702..."` |
| **Response** | `"success": true` | 200 OK | Error 4xx/5xx |

---

## 🎯 Checklist de Verificación

Después de hacer "Guardar Encuesta", verifica:

- [ ] ✅ Consola muestra JSON sin IDs temporales
- [ ] ✅ localStorage contiene el mismo JSON
- [ ] ✅ Network request POST sin IDs temporales
- [ ] ✅ Response es `"success": true`
- [ ] ✅ Redirige a /surveys automáticamente
- [ ] ✅ Se muestra toast "Encuesta creada exitosamente"

Si todos los checkboxes están ✅, **¡el sistema está funcionando perfecto!**

---

## 🐛 Troubleshooting

### Problema: Consola muestra IDs temporales
**Solución**: 
- Verifica que `removeCelebracionIds()` esté siendo llamado
- Verifica que `prepareFamilyMembersForSubmission()` esté siendo llamado
- Recarga la página (Ctrl+Shift+Delete para limpiar cache)

### Problema: localStorage diferente a consola
**Solución**:
- localStorage se guarda DESPUÉS de mostrar en consola
- Si es diferente, hay un bug en `saveSurveyToLocalStorage()`
- Verifica que la función no esté haciendo transformaciones adicionales

### Problema: Network request diferente a localStorage
**Solución**:
- Network request se transforma para API con `transformSurveyDataForAPI()`
- Es normal que tenga cambios en nombres de campos
- Pero NO debe tener IDs temporales

### Problema: Response es error
**Solución**:
- Verifica que el backend esté corriendo
- Verifica la URL en la consola: `/api/encuestas`
- Revisa los logs del servidor

---

## 📞 Contacto para Soporte

Si encuentras algo incorrecto, anota:
1. Paso exacto donde ocurrió el problema
2. Screenshot de la consola
3. Contenido de localStorage (en consola ejecuta: `copy(localStorage.getItem('parish-survey-completed'))`)
4. Network request payload (en DevTools Network tab)

---

**Guía completada**: 8 Noviembre 2025  
**Validada**: ✅ Por desarrollo
