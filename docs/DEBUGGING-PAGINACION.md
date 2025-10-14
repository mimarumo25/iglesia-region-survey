# 🔍 Guía de Debugging - Paginación de Personas

## 🎯 Problema Reportado
La paginación no se visualiza en el módulo de Reportes de Personas.

---

## ✅ Verificaciones Implementadas

### 1. Console Logs Agregados

Se han agregado logs de debug en dos ubicaciones clave:

#### **PersonasTable.tsx** (Componente)
```typescript
console.log('📊 PersonasTable - Debug Paginación:', {
  total,           // Total de registros según API
  pageSize,        // Tamaño de página (100 por defecto)
  totalPages,      // Páginas calculadas
  currentPage,     // Página actual
  hasOnPageChange, // Si tiene función de cambio
  personasLength   // Cantidad de registros en array
});
```

#### **PersonasReport.tsx** (Página)
```typescript
console.log('🔍 PersonasReport - Respuesta API:', {
  endpoint,          // URL del endpoint
  params,            // Parámetros enviados
  total,             // Total de registros
  page,              // Página actual de respuesta
  limit,             // Límite de registros
  dataLength,        // Cantidad de datos recibidos
  calculatedPages    // Páginas calculadas
});
```

---

## 🧪 Pasos de Debugging

### Paso 1: Abrir DevTools
1. Presiona `F12` o clic derecho → "Inspeccionar"
2. Ve a la pestaña **Console**

### Paso 2: Navegar al Módulo
1. Accede a **Reportes de Personas** en el menú
2. Selecciona cualquier tab (Geográfico, Familia, etc.)
3. Haz clic en el botón **"Consultar"**

### Paso 3: Revisar Console Logs

Deberías ver dos tipos de logs:

#### Log 1: Respuesta de API
```
🔍 PersonasReport - Respuesta API: {
  endpoint: "/api/personas/consolidado/geografico",
  params: {page: 1, limit: 100},
  total: 350,        ← IMPORTANTE: Este número
  page: 1,
  limit: 100,
  dataLength: 100,   ← IMPORTANTE: Debería ser ≤ limit
  calculatedPages: 4
}
```

#### Log 2: Renderizado de Tabla
```
📊 PersonasTable - Debug Paginación: {
  total: 350,         ← Debe coincidir con API
  pageSize: 100,
  totalPages: 4,      ← Si es > 1, debería mostrar paginación
  currentPage: 1,
  hasOnPageChange: true,  ← DEBE ser true
  personasLength: 100
}
```

---

## 🚨 Casos Problemáticos

### Caso A: `totalPages = 1`
**Síntoma:** No aparece paginación aunque hay muchos registros

**Posibles causas:**
1. ❌ La API devuelve `total` incorrecto (menor a 100)
2. ❌ La API devuelve TODOS los registros en una sola página
3. ❌ `pageSize` no se está enviando correctamente

**Solución:**
```typescript
// Verificar en el log si:
total: 350,        // ✅ Correcto
dataLength: 350,   // ❌ PROBLEMA - Debería ser 100
```

Si `dataLength === total`, la API NO está paginando. Revisar backend.

---

### Caso B: `hasOnPageChange = false`
**Síntoma:** No aparece paginación aunque `totalPages > 1`

**Causa:** La función `handlePageChange` no se está pasando correctamente

**Solución:**
Verificar en `PersonasReport.tsx` que cada `<PersonasTable>` tenga:
```typescript
<PersonasTable 
  personas={personas} 
  isLoading={isLoading}
  total={total}
  currentPage={filtrosGeograficos.page || 1}
  pageSize={filtrosGeograficos.limit || 100}
  onPageChange={handlePageChange}  // ← IMPORTANTE
/>
```

---

### Caso C: Total de registros < 100
**Síntoma:** No aparece paginación

**Causa:** Si solo hay 50 registros, `totalPages = 1`

**Solución:** Esto es NORMAL. La paginación solo aparece si hay más de 1 página.

**Verificación:**
```typescript
totalPages = Math.ceil(50 / 100) = 1  // No muestra paginación
totalPages = Math.ceil(150 / 100) = 2 // Sí muestra paginación
```

---

## 🔧 Soluciones Aplicadas

### 1. Contador de Registros SIEMPRE Visible
Aunque no haya paginación, ahora se muestra:
```
Mostrando 1-45 de 45 registros
```

### 2. Información de Página Actual
Si hay múltiples páginas:
```
Mostrando 1-100 de 350 registros (Página 1 de 4)
```

### 3. Controles de Navegación
Solo aparecen si `totalPages > 1`:
```
[< Previous]  [1]  [2]  [3]  [4]  [Next >]
```

---

## 📋 Checklist de Verificación

Usa esta lista para diagnosticar el problema:

- [ ] **API responde correctamente**
  - [ ] `total` refleja cantidad real de registros
  - [ ] `dataLength` es ≤ `limit` (100)
  - [ ] `page` y `limit` están en la respuesta

- [ ] **Frontend calcula correctamente**
  - [ ] `totalPages > 1` cuando hay más de 100 registros
  - [ ] `hasOnPageChange = true`
  - [ ] `currentPage` tiene valor correcto

- [ ] **UI renderiza correctamente**
  - [ ] Se ve el contador "Mostrando X-Y de Z registros"
  - [ ] Aparecen botones de navegación si `totalPages > 1`
  - [ ] Los botones funcionan al hacer clic

---

## 🐛 Problemas Conocidos y Soluciones

### Problema 1: API no pagina realmente
**Diagnóstico:**
```javascript
// En el console log verás:
total: 350
dataLength: 350  // ❌ Debería ser 100
```

**Solución Backend:**
```javascript
// El endpoint debe implementar paginación real:
const { page = 1, limit = 100 } = req.query;
const offset = (page - 1) * limit;

const personas = await db.query(`
  SELECT * FROM personas_consolidado
  LIMIT ${limit} OFFSET ${offset}
`);

const total = await db.query(`
  SELECT COUNT(*) FROM personas_consolidado
`);

res.json({
  data: personas,
  total: total[0].count,
  page: parseInt(page),
  limit: parseInt(limit)
});
```

---

### Problema 2: Props no llegan a PersonasTable
**Diagnóstico:**
```javascript
hasOnPageChange: false  // ❌ Debería ser true
```

**Solución:**
Verificar en cada tab que se pase `onPageChange`:
```typescript
// ✅ CORRECTO
<PersonasTable onPageChange={handlePageChange} />

// ❌ INCORRECTO (falta prop)
<PersonasTable />
```

---

### Problema 3: Filtros no tienen page/limit
**Diagnóstico:**
```javascript
params: {id_municipio: 3}  // ❌ Falta page y limit
```

**Solución:**
Asegurar que los filtros incluyan paginación:
```typescript
const [filtrosGeograficos, setFiltrosGeograficos] = useState({
  page: 1,      // ← IMPORTANTE
  limit: 100    // ← IMPORTANTE
});
```

---

## 📸 Capturas de Pantalla Esperadas

### Vista CON Paginación (> 100 registros)
```
┌──────────────────────────────────────────────────────────┐
│ Resultados de Consulta                                   │
│ Se encontraron 350 registros - Página 1 de 4            │
├──────────────────────────────────────────────────────────┤
│ [Tabla con 100 registros]                               │
├──────────────────────────────────────────────────────────┤
│ Mostrando 1-100 de 350 registros (Página 1 de 4)       │
│ [< Previous]  [1]  [2]  [3]  [4]  [Next >]             │
│                                                          │
│ 💡 Tip: Desplázate horizontalmente...                   │
└──────────────────────────────────────────────────────────┘
```

### Vista SIN Paginación (< 100 registros)
```
┌──────────────────────────────────────────────────────────┐
│ Resultados de Consulta                                   │
│ Se encontraron 45 registros - Página 1 de 1             │
├──────────────────────────────────────────────────────────┤
│ [Tabla con 45 registros]                                │
├──────────────────────────────────────────────────────────┤
│ Mostrando 1-45 de 45 registros                          │
│                                                          │
│ 💡 Tip: Desplázate horizontalmente...                   │
└──────────────────────────────────────────────────────────┘
```

---

## 🎬 Siguiente Paso

1. **Abre el navegador** en http://localhost:8081
2. **Ve a Reportes de Personas**
3. **Haz una consulta**
4. **Abre la consola** (F12)
5. **Toma captura** de los console logs
6. **Comparte** los valores que ves

Con esa información podremos identificar exactamente dónde está el problema.

---

## 📞 Contacto de Soporte

Si después de revisar los logs aún no aparece la paginación, comparte:
- ✅ Screenshot de la consola con los logs
- ✅ Screenshot de la tabla
- ✅ Cantidad de registros en base de datos
- ✅ Tab que estás usando (Geográfico, Familia, etc.)

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0
