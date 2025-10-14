# 🧪 Script de Prueba - Verificar Paginación de API

## 📋 Propósito
Verificar si la API está paginando correctamente los resultados.

---

## 🔧 Método 1: cURL (Desde Terminal)

### Prueba 1: Primera página (page=1, limit=10)
```bash
curl -X GET "http://localhost:3000/api/personas/consolidado/geografico?page=1&limit=10" \
  -H "Content-Type: application/json" | jq
```

**Resultado Esperado:**
```json
{
  "total": 350,
  "page": 1,
  "limit": 10,
  "data": [/* 10 registros */]
}
```

### Prueba 2: Segunda página (page=2, limit=10)
```bash
curl -X GET "http://localhost:3000/api/personas/consolidado/geografico?page=2&limit=10" \
  -H "Content-Type: application/json" | jq
```

**Resultado Esperado:**
```json
{
  "total": 350,
  "page": 2,
  "limit": 10,
  "data": [/* 10 registros DIFERENTES a la página 1 */]
}
```

---

## 🔧 Método 2: Desde Navegador DevTools

### Paso 1: Abrir Network Tab
1. F12 → Network
2. Filtrar por "XHR" o "Fetch"

### Paso 2: Hacer Consulta
1. Ve a Reportes de Personas
2. Haz clic en "Consultar"

### Paso 3: Verificar Request
Busca el request a `/api/personas/consolidado/...`

**Query Params esperados:**
```
page: 1
limit: 100
```

**Response esperada:**
```json
{
  "total": 350,
  "page": 1,
  "limit": 100,
  "data": [/* 100 registros */]  ← NO 350
}
```

---

## 🚨 Problema Común: API sin Paginación Real

### Síntoma
```json
{
  "total": 350,
  "page": 1,
  "limit": 100,
  "data": [/* 350 registros */]  ← ❌ INCORRECTO
}
```

### Causa
El backend NO está aplicando LIMIT y OFFSET en la query SQL.

### Solución Backend
El backend debe implementar paginación real:

```javascript
// ❌ INCORRECTO (sin paginación)
router.get('/api/personas/consolidado/geografico', async (req, res) => {
  const personas = await db.query('SELECT * FROM personas_consolidado');
  
  res.json({
    total: personas.length,
    page: 1,
    limit: 100,
    data: personas  // ← Devuelve TODOS
  });
});

// ✅ CORRECTO (con paginación)
router.get('/api/personas/consolidado/geografico', async (req, res) => {
  const { page = 1, limit = 100 } = req.query;
  const offset = (page - 1) * limit;
  
  // Obtener total de registros
  const countResult = await db.query(
    'SELECT COUNT(*) as total FROM personas_consolidado'
  );
  const total = countResult[0].total;
  
  // Obtener registros paginados
  const personas = await db.query(
    'SELECT * FROM personas_consolidado LIMIT ? OFFSET ?',
    [parseInt(limit), offset]
  );
  
  res.json({
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    data: personas  // ← Solo los de esta página
  });
});
```

---

## 🎯 Verificación Rápida

### Test 1: Cantidad de Registros
```javascript
// En la consola del navegador, después de hacer una consulta:
console.log('Total API:', total);           // Ej: 350
console.log('Registros recibidos:', personas.length);  // Debe ser ≤ 100

// Si personas.length === total, la API NO está paginando
```

### Test 2: Comparar Páginas
```javascript
// Hacer consulta página 1, guardar primer ID
const primerIdPagina1 = personas[0].id_personas;

// Cambiar a página 2, verificar que el primer ID sea diferente
const primerIdPagina2 = personas[0].id_personas;

console.log('Diferentes:', primerIdPagina1 !== primerIdPagina2);
// Debe imprimir: true
```

---

## 📊 Checklist de Verificación

- [ ] **Request tiene params correctos**
  - [ ] `page` está en query params
  - [ ] `limit` está en query params

- [ ] **Response tiene estructura correcta**
  - [ ] Campo `total` existe y es número
  - [ ] Campo `page` existe y es número
  - [ ] Campo `limit` existe y es número
  - [ ] Campo `data` es array

- [ ] **Paginación funciona**
  - [ ] `data.length` ≤ `limit`
  - [ ] Cambiar de página devuelve registros diferentes
  - [ ] Total se mantiene constante entre páginas

---

## 🔍 Herramientas Útiles

### Postman / Insomnia
Hacer requests manuales para probar:
```
GET http://localhost:3000/api/personas/consolidado/geografico
Query Params:
  - page: 1
  - limit: 10
```

### SQL Direct
Verificar en la base de datos:
```sql
-- Ver total de registros
SELECT COUNT(*) as total FROM personas_consolidado;

-- Simular página 1 (primeros 10)
SELECT * FROM personas_consolidado LIMIT 10 OFFSET 0;

-- Simular página 2 (siguientes 10)
SELECT * FROM personas_consolidado LIMIT 10 OFFSET 10;
```

---

## 📝 Reporte de Bug (Si aplica)

Si confirmas que la API NO está paginando:

**Título:** API de personas consolidado no implementa paginación real

**Descripción:**
```
Los endpoints de /api/personas/consolidado/* aceptan los parámetros 
`page` y `limit` pero devuelven TODOS los registros en lugar de 
paginarlos correctamente.

Request:
GET /api/personas/consolidado/geografico?page=1&limit=100

Response actual:
{
  "total": 350,
  "page": 1,
  "limit": 100,
  "data": [/* 350 registros */]  ← PROBLEMA
}

Response esperada:
{
  "total": 350,
  "page": 1,
  "limit": 100,
  "data": [/* 100 registros */]  ← CORRECTO
}
```

**Impacto:**
- Performance degradado con muchos registros
- Frontend no puede paginar correctamente
- Uso excesivo de memoria en cliente

**Solución sugerida:**
Implementar LIMIT y OFFSET en las queries SQL del backend.

---

## ✅ Resultado Esperado Final

Cuando la API esté funcionando correctamente:

1. **Console log en frontend:**
```javascript
🔍 PersonasReport - Respuesta API: {
  total: 350,
  dataLength: 100,  ← ✅ Correcto
  calculatedPages: 4
}
```

2. **Paginación visible:**
```
Mostrando 1-100 de 350 registros (Página 1 de 4)
[< Previous]  [1]  [2]  [3]  [4]  [Next >]
```

3. **Cambio de página funcional:**
- Click en "2" → Carga registros 101-200
- Click en "3" → Carga registros 201-300
- Etc.

---

**Fecha:** Octubre 2025  
**Versión:** 1.0
