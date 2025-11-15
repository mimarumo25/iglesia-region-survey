# 📊 Guía de Integración - Nuevos Componentes de Visualización de Encuestas

## 📋 Resumen Ejecutivo

Se han creado nuevos componentes TypeScript/React para visualizar encuestas con una estructura clara y etiquetada. Los componentes están diseñados para mostrar toda la información de una encuesta de forma organizada en secciones expandibles (accordion).

### ✅ Componentes Creados

1. **`SurveyDetailCard.tsx`** - Componente principal integrador
2. **`LocationSection.tsx`** - Información geográfica
3. **`FamilyInfoSection.tsx`** - Información familiar
4. **`HousingInfoSection.tsx`** - Información de vivienda
5. **`FamilyMembersSection.tsx`** - Miembros vivos
6. **`DeceasedMembersSection.tsx`** - Miembros fallecidos
7. **`MetadataSection.tsx`** - Control y metadata

### 📦 Tipos TypeScript Creados

**Archivo:** `src/types/survey-responses.ts`

Nuevas interfaces que mapean exactamente la respuesta del API:
- `LocationItem` - Elemento básico (id + nombre)
- `SurveyLocationData` - Ubicación completa
- `PersonIdentification` - Identificación de persona
- `PersonSize` - Tallas
- `PersonCelebration` - Celebraciones
- `PersonSkill` - Habilidades
- `SurveyPerson` - Persona completa
- `SurveyFamilyMembers` - Miembros de familia
- `DeceasedMember` - Miembro fallecido
- `SurveyMetadata` - Metadata de encuesta
- `SurveyResponseData` - Respuesta completa de una encuesta
- `SurveysListResponse` - Lista de encuestas con paginación

---

## 🚀 Cómo Usar

### 1. **Importar el Componente Principal**

```typescript
import { SurveyDetailCard } from '@/components/survey/SurveyDetailCard'
import type { SurveyResponseData } from '@/types/survey-responses'
```

### 2. **Usar en una Página o Vista**

```typescript
// Ejemplo: En una página de detalles de encuesta
import React, { useState, useEffect } from 'react'
import { SurveyDetailCard } from '@/components/survey/SurveyDetailCard'
import type { SurveyResponseData } from '@/types/survey-responses'

export default function SurveyDetailPage({ surveyId }: { surveyId: string }) {
  const [survey, setSurvey] = useState<SurveyResponseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Obtener la encuesta del API
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/encuestas/${surveyId}`)
        const data = await response.json()
        setSurvey(data.data[0]) // O el que corresponda según tu API
      } catch (error) {
        console.error('Error cargando encuesta:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSurvey()
  }, [surveyId])

  if (!survey && !isLoading) {
    return <div>Encuesta no encontrada</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SurveyDetailCard
        survey={survey!}
        isLoading={isLoading}
        onEdit={() => console.log('Editar encuesta')}
        onExport={() => console.log('Exportar encuesta')}
        onShare={() => console.log('Compartir encuesta')}
      />
    </div>
  )
}
```

### 3. **Props Disponibles del SurveyDetailCard**

```typescript
interface SurveyDetailCardProps {
  survey: SurveyResponseData          // ✅ REQUERIDO: Datos de la encuesta
  onEdit?: () => void                 // Callback cuando hace click en editar
  onExport?: () => void               // Callback cuando hace click en exportar
  onShare?: () => void                // Callback cuando hace click en compartir
  className?: string                  // Clases CSS adicionales
  isLoading?: boolean                 // Mostrar estado de carga (default: false)
}
```

---

## 📊 Estructura de Datos Esperada

La respuesta del API debe tener esta estructura:

```typescript
{
  status: "success",
  message: "Encuestas obtenidas exitosamente",
  data: [
    {
      // 🆔 IDENTIFICADORES
      id_encuesta: "47",
      codigo_familia: "FAM_1762664689433_d09e4dca",

      // 👨‍👩‍👧‍👦 INFORMACIÓN FAMILIAR
      apellido_familiar: "Rodriguez Peña",
      direccion_familia: "calle 55 # 32-27",
      telefono: "4339153",
      tamaño_familia: 2,

      // 📊 ESTADO
      estado_encuesta: "completed",
      numero_encuestas: 1,
      fecha_ultima_encuesta: "2025-11-09",

      // 📍 UBICACIÓN GEOGRÁFICA (MEJORADO)
      sector: { id: "28", nombre: "CENTRAL 3" },
      municipio: { id: "1110", nombre: "Yolombó" },
      vereda: { id: "13", nombre: "ALTO DE MENDEZ" },
      parroquia: { id: "3", nombre: "Jesús Crucificado" },
      corregimiento: { id: "6", nombre: "Corregimiento San Mike" },  // ✅ NUEVO
      centro_poblado: null,  // ✅ NUEVO

      // 🏠 VIVIENDA
      tipo_vivienda: { id: "2", nombre: "Apartamento" },
      basuras: [
        { id: "1", nombre: "Recolección Pública" },
        { id: "2", nombre: "Quema" }
      ],
      acueducto: { id: "1", nombre: "Acueducto Público" },
      aguas_residuales: { id: "1", nombre: "Alcantarillado Público" },
      comunion_en_casa: true,
      numero_contrato_epm: "123490",

      // 👥 MIEMBROS (MEJORADO)
      miembros_familia: {
        total_miembros: 1,
        personas: [
          {
            id: "53",
            nombre_completo: "Raquel Rodriguez",
            identificacion: {
              numero: "1267884443",
              tipo: { id: "1", nombre: "Cédula de Ciudadanía", codigo: "CC" }
            },
            telefono: "3013445333",
            email: "raquel@email.com",
            fecha_nacimiento: "2000-10-31",
            direccion: "calle 55 # 32-27",
            estudios: { id: "5", nombre: "Bachillerato Incompleto" },
            edad: 25,
            sexo: { id: "2", nombre: "Femenino" },
            estado_civil: { id: 1, nombre: "Soltero(a)" },
            tallas: { camisa: "12", pantalon: "28", zapato: "37" },
            destrezas: [],
            habilidades: [
              { id: "7", nombre: "Adaptabilidad", descripcion: "...", nivel: "Intermedio" }
            ],
            en_que_eres_lider: null,
            profesion: { id: "1", nombre: "Agricultor" },
            parentesco: { id: "2", nombre: "Jefa de Hogar" },
            comunidad_cultural: { id: "9", nombre: "Afrocolombiano" },
            celebraciones: [
              { id_personas: "53", id: 2, motivo: "Cumpleaños", dia: "12", mes: "11", ... }
            ],
            enfermedades: []
          }
        ]
      },

      // ⚰️ FALLECIDOS
      deceasedMembers: [
        {
          nombres: "Juan Camilo Valencia",
          fechaFallecimiento: "2025-11-28",
          sexo: { id: 1, nombre: "Masculino" },
          parentesco: { id: 41, nombre: "Ahijado" },
          causaFallecimiento: "muerte natural"
        }
      ],

      // 📅 METADATA
      metadatos: {
        fecha_creacion: "2025-11-09",
        estado: "completed",
        version: "1.0"
      }
    }
  ],
  pagination: {
    currentPage: 1,
    totalPages: 3,
    totalItems: 21,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false
  }
}
```

---

## 🎨 Características de los Componentes

### SurveyDetailCard (Componente Principal)

```
┌─ HEADER ────────────────────────────────────────┐
│ Encuesta #47 | Badge Estado | Botones Acción   │
└─────────────────────────────────────────────────┘

┌─ CONTACTO RÁPIDO ───────────────────────────────┐
│ Teléfono | Dirección | Tamaño | EPM             │
└─────────────────────────────────────────────────┘

┌─ ACCORDION DE SECCIONES ────────────────────────┐
│                                                  │
│ 📍 UBICACIÓN GEOGRÁFICA ▼                       │
│   └─ Municipio, Parroquia, Sector, Vereda,     │
│      Corregimiento, Centro Poblado            │
│                                                  │
│ 👨‍👩‍👧‍👦 INFORMACIÓN FAMILIAR ▼                      │
│   └─ Apellido, Dirección, Teléfono, etc.      │
│                                                  │
│ 🏠 INFORMACIÓN DE VIVIENDA ▼                    │
│   └─ Tipo, Agua, Saneamiento, Basura          │
│                                                  │
│ 👥 MIEMBROS DE LA FAMILIA (1) ▼                │
│   └─ [Tarjeta Expandible de Cada Persona]     │
│                                                  │
│ ⚰️ MIEMBROS FALLECIDOS (1) ▼                  │
│   └─ [Tarjeta Expandible de Cada Difunto]     │
│                                                  │
│ 📅 INFORMACIÓN DE CONTROL ▼                    │
│   └─ Fechas, Estado, Versión, Estadísticas   │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Características por Sección

#### 📍 LocationSection
- ✅ Muestra municipio, parroquia, sector, vereda
- ✅ Nuevos campos: corregimiento, centro_poblado
- ✅ Ubicación completa en un resumen inferior

#### 👨‍👩‍👧‍👦 FamilyInfoSection
- ✅ Apellido familiar
- ✅ Teléfono y dirección
- ✅ Tamaño de familia
- ✅ Código familia con botón copiar
- ✅ Información religiosa (comunión en casa)

#### 🏠 HousingInfoSection
- ✅ Tipo de vivienda
- ✅ Servicios de agua (acueducto + aguas residuales)
- ✅ Disposición de basura (múltiples opciones)
- ✅ Servicio eléctrico (EPM)
- ✅ Resumen visual de servicios

#### 👥 FamilyMembersSection
- ✅ Lista de miembros expandibles
- ✅ Información completa de cada persona:
  - Identificación (cédula, pasaporte, etc.)
  - Contacto (teléfono, email)
  - Educación y profesión
  - Tallas
  - Destrezas y habilidades
  - Celebraciones
  - Condiciones de salud

#### ⚰️ DeceasedMembersSection
- ✅ Lista de fallecidos expandibles
- ✅ Información: nombre, parentesco, sexo
- ✅ Fecha de fallecimiento con cálculo de días
- ✅ Causa del fallecimiento
- ✅ Contexto pastoral

#### 📅 MetadataSection
- ✅ Estado de la encuesta
- ✅ Versión del sistema
- ✅ Fechas de creación y última actualización
- ✅ Estadísticas: total miembros, fallecidos, etc.
- ✅ IDs únicos de control

---

## 🔧 Integraciones Necesarias

### 1. Verificar que existan los componentes shadcn/ui

Los componentes usan estos componentes de shadcn/ui:
```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add button
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add collapsible
npx shadcn-ui@latest add alert
```

### 2. Verificar que lucide-react esté instalado

```bash
npm install lucide-react
```

### 3. Importar el tipo en tus servicios de API

```typescript
// services/surveyService.ts
import type { SurveysListResponse, SurveyResponseData } from '@/types/survey-responses'

export const fetchSurveys = async (): Promise<SurveysListResponse> => {
  const response = await fetch('/api/encuestas')
  return response.json()
}

export const fetchSurveyById = async (id: string): Promise<SurveyResponseData> => {
  const response = await fetch(`/api/encuestas/${id}`)
  const data = await response.json()
  return data.data[0] // Según tu estructura
}
```

---

## 📱 Ventajas de esta Solución

### ✅ Para Usuarios
- **Claridad**: Cada sección tiene un label que explica qué contiene
- **Organización**: Información estructurada en acordeones
- **Facilidad**: Expandir/contraer según necesidad
- **Completitud**: Muestra todos los datos sin necesidad de scroll excesivo

### ✅ Para Desarrolladores
- **Escalabilidad**: Fácil agregar nuevos campos
- **Reutilización**: Componentes independientes
- **Mantenibilidad**: Código limpio y bien documentado
- **Type-Safe**: TypeScript completo

### ✅ Para Funcionalidad
- **Responsive**: Funciona en móvil/tablet/desktop
- **Accesibilidad**: Semántica HTML correcta
- **Performance**: Componentes optimizados
- **Interactividad**: Botones para acciones comunes

---

## 📝 Ejemplo Completo de Implementación

### En una vista/página de detalles:

```typescript
// pages/SurveyDetailView.tsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SurveyDetailCard } from '@/components/survey/SurveyDetailCard'
import { fetchSurveyById } from '@/services/surveyService'
import type { SurveyResponseData } from '@/types/survey-responses'

export function SurveyDetailView() {
  const { id } = useParams<{ id: string }>()
  const [survey, setSurvey] = useState<SurveyResponseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadSurvey = async () => {
      try {
        const data = await fetchSurveyById(id)
        setSurvey(data)
        setError(null)
      } catch (err) {
        setError('Error cargando la encuesta')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSurvey()
  }, [id])

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-red-600 text-center">
          <p>❌ {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SurveyDetailCard
        survey={survey!}
        isLoading={isLoading}
        onEdit={() => {
          // Navegar a página de edición
          console.log('Editar encuesta:', survey?.id_encuesta)
        }}
        onExport={() => {
          // Exportar a PDF o Excel
          console.log('Exportar encuesta:', survey?.id_encuesta)
        }}
        onShare={() => {
          // Compartir encuesta
          console.log('Compartir encuesta:', survey?.id_encuesta)
        }}
      />
    </div>
  )
}
```

---

## 🎯 Próximos Pasos Recomendados

1. **Actualizar el servicio de API** para usar los nuevos tipos
2. **Crear una página de listado** de encuestas que use `SurveysListResponse`
3. **Integrar con formularios de edición** para mantener sincronización
4. **Agregar exportación** a PDF/Excel con esta misma estructura
5. **Crear reportes** basados en estos datos estructurados

---

## 📚 Referencias de Archivos

| Archivo | Propósito |
|---------|----------|
| `src/types/survey-responses.ts` | Tipos TypeScript para respuestas de API |
| `src/components/survey/SurveyDetailCard.tsx` | Componente principal integrador |
| `src/components/survey/sections/LocationSection.tsx` | Sección de ubicación |
| `src/components/survey/sections/FamilyInfoSection.tsx` | Sección familiar |
| `src/components/survey/sections/HousingInfoSection.tsx` | Sección de vivienda |
| `src/components/survey/sections/FamilyMembersSection.tsx` | Sección miembros vivos |
| `src/components/survey/sections/DeceasedMembersSection.tsx` | Sección fallecidos |
| `src/components/survey/sections/MetadataSection.tsx` | Sección metadata |
| `src/components/survey/sections/index.ts` | Exportación central |

---

## ✨ Conclusión

Esta nueva estructura proporciona una forma clara, organizada y profesional de mostrar los datos de las encuestas. Cada sección está etiquetada y es fácil de entender para los usuarios finales, mientras que mantiene la flexibilidad necesaria para desarrolladores.

Los datos ahora reflejan correctamente la nueva estructura del API con los campos `corregimiento` y `centro_poblado`, y la información está mejor organizada para una visualización intuitiva.
