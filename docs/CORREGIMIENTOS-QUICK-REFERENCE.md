# 🚀 Guía Rápida - CRUD Corregimientos

## Acceso a la Página
```
URL: http://localhost:3001/settings/corregimientos
Menú: ⚙️ Configuración → Corregimientos
```

---

## 📂 Estructura de Archivos

```
src/
├── types/corregimientos.ts              # Interfaces TypeScript
├── schemas/corregimientos.ts            # Validación con Zod
├── services/corregimientos.ts           # API calls (actualizado)
├── hooks/useCorregimientos.ts           # Custom hook (actualizado)
├── components/
│   └── corregimientos/
│       └── ResponsiveCorregimientosList.tsx  # Componente de lista
├── pages/
│   ├── Corregimientos.tsx               # Página principal
│   └── SettingsWrapper.tsx              # Router (actualizado)
└── config/
    ├── routes.ts                        # Rutas (actualizado)
    └── AppSidebar.tsx                   # Menú lateral (actualizado)
```

---

## 🎯 Funcionalidades

### 1️⃣ Crear
```bash
POST /api/catalog/corregimientos
{
  "nombre": "Corregimiento El Centro",
  "id_municipio": 1
}
```

### 2️⃣ Leer (Paginado)
```bash
GET /api/catalog/corregimientos?page=1&limit=10&sortBy=nombre&sortOrder=ASC
```

### 3️⃣ Actualizar
```bash
PUT /api/catalog/corregimientos/{id}
{
  "nombre": "Corregimiento Actualizado",
  "id_municipio": 2
}
```

### 4️⃣ Eliminar
```bash
DELETE /api/catalog/corregimientos/{id}
```

---

## 🔧 Componentes Utilizados

| Componente | Uso |
|-----------|-----|
| `ResponsiveCorregimientosList` | Tabla/Cards responsivos |
| `ConfigModal` | Modales Create/Edit/Delete |
| `RHFConfigFormField` | Campos de formulario |
| `ConfigPagination` | Control de paginación |
| `useCorregimientos` | Lógica de datos |

---

## ✅ Validaciones

```typescript
// Nombre
- Min: 3 caracteres
- Max: 100 caracteres
- Solo: letras, números, espacios, guiones, puntos

// Municipio
- Requerido
- ID válido > 0
```

---

## 📱 Responsividad

- **Desktop (>768px)**: Tabla HTML
- **Tablet**: Tabla con scroll
- **Móvil (<768px)**: Cards apiladas

---

## 🔌 Hooks Principales

### useCorregimientos
```typescript
const corregimientosHook = useCorregimientos()

// Query paginada
const { data, isLoading, refetch } = corregimientosHook.useCorregimientosQuery(
  page, limit, sortBy, sortOrder, searchTerm
)

// Mutaciones
const createMutation = corregimientosHook.useCreateCorregimientoMutation()
const updateMutation = corregimientosHook.useUpdateCorregimientoMutation()
const deleteMutation = corregimientosHook.useDeleteCorregimientoMutation()
```

### useMunicipios
```typescript
const { data: municipios } = municipiosHook.useAllMunicipiosQuery()
```

---

## 🎨 Ejemplo de Uso

```tsx
import Corregimientos from '@/pages/Corregimientos'

function App() {
  return <Corregimientos />
}
```

---

## 🧪 Testing

```bash
# Compilar
npm run build

# Desarrollo
npm run dev

# Ver en navegador
http://localhost:3001/settings/corregimientos
```

---

## 📊 Información Técnica

- **Framework**: React 18
- **Lenguaje**: TypeScript (Strict)
- **Validación**: Zod + React Hook Form
- **Estado**: React Query
- **UI**: shadcn/ui + Tailwind CSS
- **Iconos**: Lucide React

---

## 🔐 Seguridad

- ✅ Validación frontend (Zod)
- ✅ Validación backend (requerida)
- ✅ Sanitización de entrada
- ✅ Autenticación requerida
- ✅ Autorización por rol

---

## ⚡ Performance

- Query caching: 5 minutos
- Lazy loading de componentes
- Paginación: 10 registros/página (configurable)
- Debounce en búsqueda

---

## 📞 Soporte

Para reportar bugs o sugerencias:
1. Revisar logs en console
2. Verificar respuesta API en Network
3. Checar tipos TypeScript

---

*Última actualización: 21 de Octubre de 2025*
