# 📊 Documentación de Endpoints Consolidados - Sistema MIA

## 🎯 Resumen Ejecutivo

Los **endpoints consolidados** son endpoints unificados que reemplazan múltiples consultas individuales, optimizando el rendimiento y simplificando el acceso a datos complejos del sistema parroquial.

**Fecha de creación**: Octubre 3, 2025  
**Versión API**: 2.0.0  
**URL Base**: `http://206.62.139.100:3001`

---

## 📋 Endpoints Consolidados Disponibles

### 1. 👨‍👩‍👧‍👦 Familias Consolidado

**Ruta base**: `/api/familias`

**Descripción**: Sistema unificado de consultas familiares que consolida 10+ endpoints. Permite consultar familias, madres, padres, familias sin padre/madre con estadísticas completas e inferencia de parentesco.

#### Endpoints disponibles:

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/familias` | Consulta consolidada de familias y personas |
| GET | `/api/familias/estadisticas` | Obtener estadísticas agregadas de familias |
| GET | `/api/familias/madres` | Consultar madres específicamente |
| GET | `/api/familias/padres` | Consultar padres específicamente |
| GET | `/api/familias/sin-padre` | Consultar familias sin padre |
| GET | `/api/familias/sin-madre` | Consultar familias sin madre |
| GET | `/api/familias/excel-completo` | Generar reporte Excel completo |

#### Parámetros de consulta (Query Parameters):

```typescript
interface FiltrosFamiliasAPI {
  id_parroquia?: number;  // ID específico de la parroquia
  id_municipio?: number;  // ID específico del municipio
  id_sector?: number;     // ID específico del sector
  id_vereda?: number;     // ID específico de la vereda
  limite?: number;        // Límite de resultados por página (default: 100)
  offset?: number;        // Offset para paginación (default: 0)
}
```

#### Respuesta exitosa (200):

```json
{
  "exito": boolean,
  "mensaje": string,
  "datos": [
    {
      // PersonaFamilia object
      "id_persona": number,
      "nombres": string,
      "apellidos": string,
      "sexo": string,
      "edad": number,
      "parentesco": string,
      // ... más campos
    }
  ],
  "total": number,
  "estadisticas": {
    // Estadísticas agregadas
  },
  "filtros_aplicados": {
    // Filtros utilizados en la consulta
  }
}
```

---

### 2. ⚰️ Difuntos Consolidado

**Ruta base**: `/api/difuntos-consolidado` *(pendiente de confirmar)*

**Descripción**: Endpoint unificado que reemplaza múltiples consultas de difuntos con estadísticas automáticas, aniversarios próximos e inferencia de parentesco.

**Filtros**:
- Parentesco
- Fechas (rango)
- Municipio
- Sector

**Incluye**:
- Estadísticas automáticas
- Aniversarios próximos
- Inferencia de parentesco

---

### 3. 🩺 Salud Consolidado

**Ruta base**: `/api/salud` *(pendiente de confirmar)*

**Descripción**: Consultas de salud de personas con filtros avanzados y análisis de enfermedades.

**Filtros**:
- Enfermedades específicas
- Edades (rango)
- Sexo
- Ubicación geográfica

**Incluye**:
- Estadísticas de salud
- Distribución por edades
- Análisis de enfermedades comunes
- Tendencias epidemiológicas

---

### 4. 🏡 Parroquias Consolidado

**Ruta base**: `/api/parroquias-consolidado` *(pendiente de confirmar)*

**Descripción**: Endpoint unificado para consultas de infraestructura parroquial.

**Filtros**:
- Municipio
- Tipos de vivienda
- Sistema de acueducto
- Aguas residuales
- Disposición de basura

**Incluye**:
- Estadísticas de infraestructura
- Análisis demográfico
- Distribución de servicios
- Cobertura de necesidades básicas

---

## 🔐 Autenticación

Todos los endpoints consolidados requieren autenticación mediante **Bearer Token** JWT.

### Obtener token:

```bash
POST /api/auth/login
Content-Type: application/json

{
  "correo_electronico": "admin@parroquia.com",
  "contrasena": "Admin123!"
}
```

### Usar token:

```bash
GET /api/familias?limite=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Ejemplos de Uso

### Ejemplo 1: Obtener familias de un municipio específico

```typescript
const response = await fetch(
  'http://206.62.139.100:3001/api/familias?id_municipio=1&limite=50',
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(`Total familias: ${data.total}`);
console.log(`Datos:`, data.datos);
```

### Ejemplo 2: Obtener familias sin padre con estadísticas

```bash
curl -X GET 'http://206.62.139.100:3001/api/familias/sin-padre?id_parroquia=5&limite=20' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json'
```

### Ejemplo 3: Generar reporte Excel de familias

```bash
curl -X GET 'http://206.62.139.100:3001/api/familias/excel-completo?id_municipio=1' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -o familias_completo.xlsx
```

---

## 🚀 Implementación en Frontend

### Servicio de API (TypeScript)

```typescript
import { getApiClient, API_ENDPOINTS } from '@/config/api';

// Obtener familias consolidadas
export const getFamiliasConsolidado = async (filtros?: {
  id_parroquia?: number;
  id_municipio?: number;
  id_sector?: number;
  id_vereda?: number;
  limite?: number;
  offset?: number;
}) => {
  const api = getApiClient();
  
  const queryParams = new URLSearchParams();
  if (filtros) {
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  
  const queryString = queryParams.toString();
  const url = queryString 
    ? `${API_ENDPOINTS.CONSOLIDADO.FAMILIAS}?${queryString}` 
    : API_ENDPOINTS.CONSOLIDADO.FAMILIAS;
  
  const response = await api.get(url);
  return response.data;
};
```

---

## ⚠️ Notas Importantes

1. **Paginación**: Todos los endpoints consolidados soportan paginación mediante `limite` y `offset`
2. **Rendimiento**: Los límites recomendados son:
   - Consultas generales: 50-100 registros
   - Reportes: 500-1000 registros
   - Excel completo: Sin límite (usa streaming)

3. **Caché**: Los endpoints consolidados pueden tener caché de hasta 5 minutos para estadísticas

4. **Rate Limiting**: Límite de 100 peticiones por minuto por usuario autenticado

---

## 🔄 Estado de Implementación

### ✅ Completado en Frontend:
- [x] Tipos TypeScript completos (`src/types/consolidados.ts`)
- [x] Servicio de API (`src/services/consolidados.ts`)
- [x] Componentes de filtros comunes
- [x] Configuración de endpoints

### 🚧 Pendiente:
- [ ] Componentes específicos de cada consolidado
- [ ] Página principal de Consolidados con tabs
- [ ] Integración con navegación (AppSidebar)
- [ ] Pruebas de integración con API real
- [ ] Documentación JSDoc completa

---

## 📝 Próximos Pasos

1. **Validar rutas exactas** con equipo backend para:
   - `/api/difuntos-consolidado` (verificar nombre exacto)
   - `/api/salud` (verificar nombre y estructura)
   - `/api/parroquias-consolidado` (verificar nombre exacto)

2. **Obtener schemas completos** de respuesta para cada endpoint

3. **Implementar componentes** de visualización para cada consolidado

4. **Testing exhaustivo** con datos reales

---

## 📞 Soporte

- **API Documentation**: http://206.62.139.100:3001/api-docs
- **Servidor de Pruebas**: http://206.62.139.100:3001
- **Contacto**: support@parroquia.com

---

**Última actualización**: Octubre 3, 2025  
**Mantenedor**: Equipo de Desarrollo MIA
