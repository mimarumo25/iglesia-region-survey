# 🧪 Guía de Pruebas - Filtros de Difuntos

## 🎯 URL de la Aplicación
**Servidor funcionando en:** http://localhost:8080

## 🔍 Pasos para Probar los Filtros

### 1. **Navegación Inicial**
1. ✅ Abrir http://localhost:8080 en el navegador
2. ✅ La aplicación debe cargar correctamente
3. ✅ Navegar a la sección **"Reportes"** desde el menú lateral

### 2. **Acceso a Difuntos**
1. ✅ En la página de Reportes, buscar la sección de **"Difuntos"**
2. ✅ Debe mostrar un formulario de filtros con campos:
   - 📅 **Rango de Fechas** (fecha_inicio y fecha_fin)
   - 👥 **Parentesco** (dropdown)
   - 🏙️ **Municipio** (autocomplete)
   - ⛪ **Parroquia** (autocomplete)
   - 🏘️ **Sector** (autocomplete)

### 3. **Prueba de Console Logs (IMPORTANTE)**
1. ✅ **Abrir DevTools** (F12) → Pestaña **Console**
2. ✅ Limpiar la consola (Ctrl+L)
3. ✅ Aplicar cualquier filtro
4. ✅ Hacer clic en **"Buscar"**
5. ✅ **Verificar** que aparezcan estos logs:

```javascript
🔍 Filtros originales del formulario: {parentesco: "1", municipio: "2", fecha_inicio: "2020-01-01"}
🎯 Filtros mapeados para API: {id_parentesco: "1", id_municipio: "2", fecha_inicio: "2020-01-01"}
✨ Filtros limpios enviados: {id_parentesco: "1", id_municipio: "2", fecha_inicio: "2020-01-01"}
🌐 URL generada para la API: /api/difuntos?id_parentesco=1&id_municipio=2&fecha_inicio=2020-01-01
📋 Parámetros de consulta: id_parentesco=1&id_municipio=2&fecha_inicio=2020-01-01
```

### 4. **Prueba de Red (Network Tab)**
1. ✅ En DevTools → Pestaña **Network**
2. ✅ Aplicar filtros y buscar
3. ✅ **Verificar** que se haga una petición a:
   ```
   http://localhost:3000/api/difuntos?id_parentesco=X&id_municipio=Y&fecha_inicio=Z
   ```

### 5. **Escenarios de Prueba Específicos**

#### ✅ **Prueba 1: Solo Parentesco**
- Seleccionar un parentesco → Buscar
- **Esperado:** URL = `/api/difuntos?id_parentesco=X`

#### ✅ **Prueba 2: Solo Fechas**
- Establecer fecha_inicio y fecha_fin → Buscar  
- **Esperado:** URL = `/api/difuntos?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD`

#### ✅ **Prueba 3: Múltiples Filtros**
- Parentesco + Municipio + Fechas → Buscar
- **Esperado:** URL = `/api/difuntos?id_parentesco=X&id_municipio=Y&fecha_inicio=Z&fecha_fin=W`

#### ✅ **Prueba 4: Limpiar Filtros**
- Aplicar filtros → Limpiar → Buscar
- **Esperado:** URL = `/api/difuntos` (sin parámetros)

### 6. **Verificación de Mapeo Correcto**

Confirmar que los parámetros se convierten correctamente:

| Campo UI | Valor | Parámetro API | ✅ |
|----------|--------|---------------|-----|
| parentesco: "1" | → | id_parentesco=1 | ✅ |
| municipio: "2" | → | id_municipio=2 | ✅ |
| parroquia: "3" | → | id_parroquia=3 | ✅ |
| sector: "4" | → | id_sector=4 | ✅ |
| fecha_inicio: Date | → | fecha_inicio=YYYY-MM-DD | ✅ |
| fecha_fin: Date | → | fecha_fin=YYYY-MM-DD | ✅ |

## 🚨 Posibles Problemas y Soluciones

### **Si no aparecen los logs:**
- Verificar que DevTools esté abierto en la pestaña Console
- Limpiar la consola y probar de nuevo
- Verificar que se está haciendo clic en "Buscar", no solo cambiando filtros

### **Si la URL está mal:**
- Verificar que los parámetros tengan prefijo `id_` (excepto fechas)
- Comprobar que los valores no estén vacíos

### **Si hay errores de red:**
- Verificar que el backend esté corriendo en localhost:3000
- Comprobar configuración de CORS

## ✅ Resultado Esperado

Después de las pruebas, deberías ver:

1. **✅ Console logs** mostrando el mapeo correcto
2. **✅ Network requests** con parámetros correctos
3. **✅ URLs** en formato: `/api/difuntos?id_parentesco=1&id_municipio=1&id_sector=1`
4. **✅ Sin errores** en la consola del navegador

---

**URL de pruebas:** http://localhost:8080/reportes  
**Estado del servidor:** ✅ Funcionando en puerto 8080  
**Debug habilitado:** ✅ Console logs activos