# 📊 Módulo de Estadísticas Completas - Sistema MIA

## 🎯 Descripción

Este módulo proporciona una visualización integral de las estadísticas del sistema MIA, incluyendo datos de población, salud, educación, vivienda, geografía y usuarios del sistema.

## 🚀 Características

### ✅ Visualizaciones Implementadas

#### 1. **Resumen General**
- Total de personas (vivas y difuntos)
- Total de familias
- Distribución geográfica (departamentos, municipios)
- Usuarios del sistema

#### 2. **Población**
- Distribución por sexo (gráfico de dona)
- Distribución por estado civil
- Distribución por edad
- Tipos de identificación

#### 3. **Salud**
- Personas con/sin enfermedades
- Top 10 enfermedades más comunes (gráfico de barras)
- Distribución por sexo y edad de cada enfermedad
- Familias afectadas

#### 4. **Educación**
- Top 5 profesiones (gráfico de barras horizontales)
- Top 5 habilidades y destrezas (gráfico de barras horizontales)
- Personas con profesión/habilidades
- Catálogos disponibles

#### 5. **Vivienda**
- Distribución por tipo de vivienda (gráfico de dona)
- Sistemas de acueducto (gráfico de dona)
- Disposición de aguas residuales (gráfico de dona)
- Resumen de categorías

#### 6. **Usuarios**
- Distribución por rol (gráfico de dona)
- Usuarios activos/inactivos
- Emails verificados
- Roles sin asignar
- Top 5 roles más usados

#### 7. **Geografía**
- Distribución territorial
- Catálogos del sistema
- Cobertura por departamento/municipio

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── estadisticas-completas.ts          # Tipos TypeScript
├── services/
│   └── estadisticas-completas.ts          # Servicio API
├── pages/
│   └── EstadisticasCompletas.tsx          # Página principal
└── components/
    └── dashboard/
        └── estadisticas/
            ├── index.ts                    # Exportaciones
            ├── ResumenGeneralCards.tsx     # Tarjetas de resumen
            ├── DistribucionPoblacion.tsx   # Gráficos de población
            ├── SaludVisualizacion.tsx      # Gráficos de salud
            ├── EducacionVisualizacion.tsx  # Gráficos de educación
            ├── ViviendaVisualizacion.tsx   # Gráficos de vivienda
            └── UsuariosVisualizacion.tsx   # Gráficos de usuarios
```

## 🔧 Uso del Módulo

### Importar en tu componente

```typescript
import { obtenerEstadisticasCompletas } from "@/services/estadisticas-completas"
import type { EstadisticasCompletasDatos } from "@/types/estadisticas-completas"
```

### Obtener estadísticas

```typescript
const [estadisticas, setEstadisticas] = useState<EstadisticasCompletasDatos | null>(null)

useEffect(() => {
  const cargarDatos = async () => {
    try {
      const data = await obtenerEstadisticasCompletas()
      setEstadisticas(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  cargarDatos()
}, [])
```

### Usar componentes de visualización

```typescript
import { 
  ResumenGeneralCards,
  SaludVisualizacion,
  EducacionVisualizacion
} from "@/components/dashboard/estadisticas"

<ResumenGeneralCards resumen={estadisticas.resumen} />
<SaludVisualizacion salud={estadisticas.salud} />
<EducacionVisualizacion educacion={estadisticas.educacion} />
```

## 🎨 Tecnologías Utilizadas

- **React 18** + **TypeScript**
- **Recharts** - Gráficos interactivos
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilos
- **Lucide Icons** - Iconografía
- **React Hook Form** - Gestión de formularios
- **date-fns** - Manejo de fechas

## 📊 Tipos de Gráficos

### Gráfico de Dona (PieChart)
- Distribución por sexo
- Tipos de vivienda
- Sistemas de acueducto
- Distribución de roles

### Gráfico de Barras (BarChart)
- Top enfermedades
- Top profesiones
- Top habilidades

### Tarjetas Estadísticas (Cards)
- Resumen general
- Métricas clave
- KPIs del sistema

## 🔌 API Endpoint

**Endpoint:** `GET /api/estadisticas/completas`

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta Exitosa:**
```json
{
  "exito": true,
  "mensaje": "Estadísticas completas obtenidas exitosamente",
  "datos": {
    "timestamp": "2025-10-14T00:25:59.099Z",
    "resumen": { /* ... */ },
    "geografia": { /* ... */ },
    "poblacion": { /* ... */ },
    "salud": { /* ... */ },
    "educacion": { /* ... */ },
    "vivienda": { /* ... */ },
    "usuarios": { /* ... */ }
  }
}
```

## 🎯 Acceso al Módulo

### Navegación

1. **Desde el Dashboard:**
   - Botón "Ver Estadísticas Completas" en la tarjeta principal

2. **Desde el Sidebar:**
   - Menú "Reportes" > "Estadísticas Completas"

3. **URL Directa:**
   - `/estadisticas`

## 🔒 Permisos

- **Requiere autenticación:** Sí
- **Roles permitidos:** Todos los usuarios autenticados
- **Permisos especiales:** No requiere

## 📱 Responsive Design

El módulo está completamente optimizado para:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Wide Screen** (1920px+)

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
--primary: #1e40af        /* Azul católico */
--secondary: #d97706      /* Dorado litúrgico */
--success: #10b981        /* Verde éxito */
--warning: #f59e0b        /* Amarillo advertencia */
--destructive: #ef4444    /* Rojo error */
```

### Espaciado
- Grid responsivo: `grid-cols-2 lg:grid-cols-4`
- Gap entre elementos: `gap-4 lg:gap-6`
- Padding de tarjetas: `p-4 lg:p-6`

## 🚀 Mejoras Futuras

- [ ] Exportación a PDF/Excel
- [ ] Filtros por fecha
- [ ] Comparación de períodos
- [ ] Gráficos de tendencias
- [ ] Mapas interactivos
- [ ] Drill-down en métricas
- [ ] Dashboard personalizable

## 🐛 Debugging

### Errores Comunes

**1. Error al cargar estadísticas:**
```typescript
// Verificar token de autenticación
// Verificar conexión con API
// Revisar CORS
```

**2. Gráficos no se renderizan:**
```typescript
// Verificar que Recharts esté instalado
// npm install recharts
```

**3. Tipos TypeScript:**
```typescript
// Verificar imports de tipos
import type { EstadisticasCompletasDatos } from "@/types/estadisticas-completas"
```

## 📚 Referencias

- [Documentación Recharts](https://recharts.org/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Sistema MIA - Guía de Desarrollo](../.github/instructions/documentos.instructions.md)

## 👨‍💻 Mantenimiento

- **Última actualización:** Octubre 2025
- **Versión:** 1.0.0
- **Autor:** Equipo MIA

---

**Nota:** Este módulo forma parte del Sistema MIA de Gestión Integral de Iglesias Católicas.
