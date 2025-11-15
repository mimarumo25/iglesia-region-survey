# 🎨 Diagrama Visual - Estructura de Componentes

## 📊 Árbol de Componentes

```
SurveyDetailCard (Componente Principal)
│
├── Header
│   ├── Título con Número de Encuesta
│   ├── Badge de Estado
│   └── Botones de Acción (Editar, Descargar, Compartir)
│
├── Contacto Rápido (Card)
│   ├── Teléfono
│   ├── Dirección
│   ├── Tamaño de Familia
│   └── Contrato EPM
│
└── Accordion (6 Secciones Expandibles)
    │
    ├── 📍 Ubicación Geográfica [LocationSection]
    │   ├── Municipio
    │   ├── Parroquia
    │   ├── Sector
    │   ├── Vereda
    │   ├── Corregimiento (✨ NUEVO)
    │   ├── Centro Poblado (✨ NUEVO)
    │   └── Resumen de Ubicación Completa
    │
    ├── 👨‍👩‍👧‍👦 Información Familiar [FamilyInfoSection]
    │   ├── Apellido Familiar
    │   ├── Teléfono
    │   ├── Dirección
    │   ├── Tamaño de Familia
    │   ├── Contrato EPM
    │   ├── Código Familia (copiable)
    │   ├── Total Encuestas
    │   ├── Última Encuesta
    │   └── Información Religiosa (Comunión en Casa)
    │
    ├── 🏠 Información de Vivienda [HousingInfoSection]
    │   ├── Tipo de Vivienda
    │   ├── Sistema de Acueducto
    │   ├── Aguas Residuales
    │   ├── Disposición de Basura (múltiples)
    │   ├── Servicio Eléctrico (EPM)
    │   └── Resumen de Servicios
    │
    ├── 👥 Miembros de la Familia [FamilyMembersSection]
    │   └── Para cada miembro (Collapsible)
    │       ├── Información Personal
    │       │   ├── Identificación (Tipo y Número)
    │       │   ├── Contacto (Teléfono, Email)
    │       │   ├── Dirección
    │       │   ├── Fecha Nacimiento
    │       │   ├── Edad
    │       │   └── Estado Civil
    │       ├── Educación y Trabajo
    │       │   ├── Estudios
    │       │   └── Profesión
    │       ├── Contexto Social
    │       │   ├── Comunidad Cultural
    │       │   └── Liderazgo
    │       ├── Tallas (Camisa, Pantalón, Zapato)
    │       ├── Destrezas (Array de etiquetas)
    │       ├── Habilidades (con Nivel y Descripción)
    │       ├── Celebraciones (con Fecha)
    │       └── Condiciones de Salud (Enfermedades)
    │
    ├── ⚰️ Miembros Fallecidos [DeceasedMembersSection]
    │   └── Para cada difunto (Collapsible)
    │       ├── Información Básica
    │       │   ├── Parentesco
    │       │   └── Sexo
    │       ├── Fecha de Fallecimiento
    │       ├── Causa de Fallecimiento
    │       └── Nota Pastoral
    │
    └── 📅 Información de Control [MetadataSection]
        ├── Estado de la Encuesta
        ├── Versión del Sistema
        ├── Historial
        │   ├── Fecha de Creación
        │   └── Última Actualización
        ├── Estadísticas
        │   ├── Total de Encuestas
        │   ├── Miembros Vivos
        │   ├── Miembros Fallecidos
        │   └── Tamaño de Familia
        ├── ID de Encuesta
        └── Información de Control (Resumen)
```

---

## 🎨 Estructura Visual en Navegador

```
┌────────────────────────────────────────────────────────────────────┐
│                         SURVEY DETAIL CARD                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌───────────────────────────────┬──────────────────────────────┐ │
│  │ 📋 Encuesta #47              │ 🟢 COMPLETADA              │ │
│  │ Familia: Rodriguez Peña       │ [Editar] [Descargar]       │ │
│  └───────────────────────────────┴──────────────────────────────┘ │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 📱 4339153  | 📍 calle 55 # 32-27 | 👥 2 | ⚡ 123490      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▼ 📍 UBICACIÓN GEOGRÁFICA                                 │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ • Municipio: Yolombó         • Sector: CENTRAL 3          │  │
│  │ • Parroquia: Jesús Crucificado  • Vereda: ALTO DE MENDEZ │  │
│  │ • Corregimiento: San Mike    • Centro: (No especificado)  │  │
│  │                                                            │  │
│  │ ⭐ UBICACIÓN COMPLETA:                                    │  │
│  │ Yolombó, Jesús Crucificado • CENTRAL 3 • ALTO DE MENDEZ  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▼ 👨‍👩‍👧‍👦 INFORMACIÓN FAMILIAR                             │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ Apellido: Rodriguez Peña      Teléfono: 4339153          │  │
│  │ Dirección: calle 55 # 32-27   Tamaño: 2 personas         │  │
│  │ Código: FAM_1762664689433_d09e4dca                       │  │
│  │ Comunión en Casa: ✓ Sí                                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▼ 🏠 INFORMACIÓN DE VIVIENDA                              │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ Tipo: Apartamento                                         │  │
│  │ Agua: Acueducto Público                                   │  │
│  │ Saneamiento: Alcantarillado Público                       │  │
│  │ Basura: [Recolección Pública] [Quema] [Campo Abierto]    │  │
│  │ EPM: 123490                                               │  │
│  │                                                            │  │
│  │ 📊 RESUMEN DE SERVICIOS                                   │  │
│  │ Agua: Acueducto Público | Saneamiento: Alcantarillado    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▼ 👥 MIEMBROS DE LA FAMILIA (1)                           │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ ┌──────────────────────────────────────────────────────┐  │  │
│  │ │ ▼ [👤] Raquel Rodriguez  | 🔴 Femenino             │  │  │
│  │ │   Jefa de Hogar • 25 años                           │  │  │
│  │ ├──────────────────────────────────────────────────────┤  │  │
│  │ │ 📋 IDENTIFICACIÓN                                  │  │  │
│  │ │ Tipo: Cédula de Ciudadanía  |  Número: 1267884443  │  │  │
│  │ │ 📞 CONTACTO                                        │  │  │
│  │ │ ☎️ 3013445333  📧 raquel@email.com                │  │  │
│  │ │ 📚 EDUCACIÓN Y TRABAJO                             │  │  │
│  │ │ 🎓 Bachillerato Incompleto  |  💼 Agricultor       │  │  │
│  │ │ 👥 CONTEXTO SOCIAL                                 │  │  │
│  │ │ Comunidad: Afrocolombiano  |  Liderazgo: (ninguno) │  │  │
│  │ │ 👕 TALLAS: Camisa 12 | Pantalón 28 | Zapato 37     │  │  │
│  │ │ 🎯 HABILIDADES: [Adaptabilidad - Intermedio]       │  │  │
│  │ │ 🎉 CELEBRACIONES: [Cumpleaños - 12/11]             │  │  │
│  │ └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▼ ⚰️ MIEMBROS FALLECIDOS (1)                             │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ ┌──────────────────────────────────────────────────────┐  │  │
│  │ │ ▼ [👤] Juan Camilo Valencia Julio  | 🔵 Masculino   │  │  │
│  │ │   Ahijado • Falleció: 28/11/2025                    │  │  │
│  │ ├──────────────────────────────────────────────────────┤  │  │
│  │ │ 📅 FALLECIMIENTO: Miércoles, 28 de Noviembre 2025   │  │  │
│  │ │ ⚰️  CAUSA: muerte natural                            │  │  │
│  │ │ ℹ️ Se registra el fallecimiento de Juan Camilo...   │  │  │
│  │ └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▼ 📅 INFORMACIÓN DE CONTROL                              │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ Estado: [COMPLETADA]     |  Versión: v1.0.0              │  │
│  │                                                            │  │
│  │ 📅 HISTORIAL DE ENCUESTA                                 │  │
│  │ Creación: Sábado, 9 de Noviembre 2025 • Hace 6 días      │  │
│  │ Actualización: Sábado, 9 de Noviembre 2025 • Hace 6 días │  │
│  │                                                            │  │
│  │ 📊 ESTADÍSTICAS                                          │  │
│  │ Encuestas: 1  |  Vivos: 1  |  Fallecidos: 1  |  Total: 2 │  │
│  │                                                            │  │
│  │ 🆔 ID ENCUESTA: 47                                        │  │
│  │ 🎫 CÓDIGO FAMILIA: FAM_1762664689433_d09e4dca            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Flujo de Datos

```
API Response
    ↓
SurveysListResponse
    ↓
SurveyResponseData (cada encuesta)
    ↓
SurveyDetailCard
    │
    ├─ Header (muestra estado)
    ├─ ContactoRápido
    └─ Accordion
        ├─ LocationSection
        │   └ mapea: municipio, parroquia, sector, vereda, corregimiento, centro_poblado
        │
        ├─ FamilyInfoSection
        │   └ mapea: apellido, dirección, teléfono, tamaño, código, comunión
        │
        ├─ HousingInfoSection
        │   └ mapea: tipo_vivienda, acueducto, aguas_residuales, basuras, epm
        │
        ├─ FamilyMembersSection
        │   └ mapea: miembros_familia.personas[] con expansión de cada uno
        │
        ├─ DeceasedMembersSection
        │   └ mapea: deceasedMembers[] con expansión de cada uno
        │
        └─ MetadataSection
            └ mapea: metadatos, estadísticas, control
```

---

## 🔀 Tipos de Datos

```
┌─────────────────────────────────────────────────────────┐
│ SurveysListResponse                                    │
├─────────────────────────────────────────────────────────┤
│ • status: "success" | "error"                          │
│ • message: string                                      │
│ • data: SurveyResponseData[]                           │
│ • pagination: SurveysPaginationInfo                    │
└─────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────┐
│ SurveyResponseData                                     │
├─────────────────────────────────────────────────────────┤
│ • id_encuesta: string                                  │
│ • codigo_familia: string                               │
│ • apellido_familiar: string                            │
│ • direccion_familia: string                            │
│ • telefono: string                                     │
│ • tamaño_familia: number                               │
│ • estado_encuesta: "completed" | "in_progress"...      │
│ • numero_encuestas: number                             │
│ • fecha_ultima_encuesta: string                        │
│ • sector: LocationItem                                 │
│ • municipio: LocationItem                              │
│ • vereda: LocationItem                                 │
│ • parroquia: LocationItem                              │
│ • corregimiento: LocationItem | null  ✨ NUEVO         │
│ • centro_poblado: LocationItem | null  ✨ NUEVO        │
│ • tipo_vivienda: LocationItem                          │
│ • basuras: LocationItem[]                              │
│ • acueducto: LocationItem                              │
│ • aguas_residuales: LocationItem | null                │
│ • comunion_en_casa: boolean                            │
│ • numero_contrato_epm: string | null                   │
│ • miembros_familia: SurveyFamilyMembers                │
│ • deceasedMembers: DeceasedMember[]                    │
│ • metadatos: SurveyMetadata                            │
└─────────────────────────────────────────────────────────┘
           ↓
    ┌─────────────────────┐
    │ SurveyFamilyMembers │
    ├─────────────────────┤
    │ • total_miembros: n │
    │ • personas: []      │
    └─────────────────────┘
           ↓
    ┌──────────────────────┐
    │ SurveyPerson[]       │
    ├──────────────────────┤
    │ • id                 │
    │ • nombre_completo    │
    │ • identificacion     │
    │ • telefono           │
    │ • email              │
    │ • ... (12+ campos)   │
    └──────────────────────┘
```

---

## 📱 Responsive Design

### Desktop (>1024px)
```
┌─────────────────────────────────────────────────────────────┐
│ Header (Full Width)                                        │
├─────────────────────────────────────────────────────────────┤
│ Contacto (Full Width)                                      │
├─────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Accordion Sections (Full Width)                       │ │
│ │ [Section] [Section] [Section]                         │ │
│ └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌────────────────────────────────────────┐
│ Header (Full Width)                   │
├────────────────────────────────────────┤
│ Contacto (Full Width)                 │
├────────────────────────────────────────┤
│ Sections (Full Width)                 │
│ [Accordion Items]                     │
└────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────┐
│ Header           │
├──────────────────┤
│ Contacto         │
├──────────────────┤
│ Sections (Stack) │
│ [Item 1]         │
│ [Item 2]         │
│ [Item 3]         │
└──────────────────┘
```

---

## 🎨 Color Scheme

| Sección | Color | Icono | Uso |
|---------|-------|-------|-----|
| Ubicación | 🔵 Blue (50-600) | 📍 | LocationSection |
| Familia | 🟣 Purple (50-900) | 👨‍👩‍👧‍👦 | FamilyInfoSection |
| Vivienda | 🟠 Orange (50-600) | 🏠 | HousingInfoSection |
| Miembros | 🟢 Green (50-600) | 👥 | FamilyMembersSection |
| Fallecidos | ⚫ Gray (50-600) | ⚰️ | DeceasedMembersSection |
| Control | 🩶 Slate (50-600) | 📅 | MetadataSection |

---

## 🚀 Performance Optimizations

```
Optimizaciones Implementadas:
├─ Componentes Memoizados
├─ Lazy Loading de Secciones (Accordion)
├─ Virtualization para Listas Largas
├─ CSS-in-JS Minimizado
├─ Icons Optimizados (lucide-react)
└─ Type Safety (TypeScript)
```

---

Este diagrama visual proporciona una vista clara de la estructura, flujo de datos, diseño responsive y organización del componente SurveyDetailCard con todas sus secciones.
