# 📱 Sistema de Tablas Responsive - Guía de Uso

## 🎯 Introducción

El sistema de tablas responsive de MIA permite mostrar datos de forma óptima en cualquier dispositivo, alternando automáticamente entre vista de tabla tradicional (desktop) y vista de cards (móvil/tablet).

## 🚀 Componentes Principales

### 1. ResponsiveTable

Componente principal que se adapta automáticamente al tamaño de pantalla.

```typescript
import { ResponsiveTable } from '@/components/ui/responsive-table';

<ResponsiveTable
  data={items}
  columns={columns}
  actions={actions}
  loading={loading}
  emptyState={{
    icon: <Icon className="w-16 h-16" />,
    title: "No hay datos",
    description: "Descripción del estado vacío"
  }}
  onRowClick={(item) => console.log('Clicked:', item)}
  itemKey="id"
/>
```

### 2. MobileTableCard

Componente de card individual usado en vista móvil.

```typescript
import { MobileTableCard } from '@/components/ui/mobile-table-card';

<MobileTableCard
  item={dataItem}
  fields={cardFields}
  actions={cardActions}
  onClick={(item) => console.log('Card clicked:', item)}
  index={0}
/>
```

### 3. useResponsiveTable Hook

Hook para detectar el tamaño de pantalla y determinar qué vista usar.

```typescript
import { useResponsiveTable } from '@/hooks/useResponsiveTable';

const { isMobile, isTablet, shouldUseMobileView, screenSize } = useResponsiveTable();
```

## 📝 Configuración de Columnas

### Definición de Columnas

```typescript
const columns: ResponsiveTableColumn[] = [
  {
    key: 'nombre',
    label: 'Nombre',
    priority: 'high',     // 'high' | 'medium' | 'low'
    hideOnMobile: false,  // No ocultar en móvil
    render: (value, item) => (
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="font-medium">{value}</span>
      </div>
    ),
  },
  {
    key: 'fecha',
    label: 'Fecha de Creación',
    priority: 'low',      // Se oculta en móviles pequeños
    hideOnMobile: true,   // Se oculta completamente en móvil
    render: (value) => (
      <Badge variant="outline">
        {new Date(value).toLocaleDateString('es-ES')}
      </Badge>
    ),
  },
  {
    key: 'estado',
    label: 'Estado',
    priority: 'medium',
    render: (value) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
];
```

### Prioridades de Columnas

- **`high`**: Siempre visible, se muestra prominentemente en móvil
- **`medium`**: Visible en tablet y desktop, puede ocultarse en móviles muy pequeños
- **`low`**: Solo visible en desktop, se oculta en móvil/tablet

## 🎬 Configuración de Acciones

```typescript
const actions: ResponsiveTableAction[] = [
  {
    label: 'Editar',
    icon: <Edit2 className="w-4 h-4" />,
    onClick: (item) => handleEdit(item),
    variant: 'ghost',
    primary: true,        // Se muestra prominentemente en móvil
  },
  {
    label: 'Eliminar',
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (item) => handleDelete(item),
    variant: 'destructive',
    primary: false,       // Botón secundario en móvil
  },
  {
    label: 'Ver Detalles',
    icon: <Eye className="w-4 h-4" />,
    onClick: (item) => handleView(item),
    variant: 'outline',
    primary: false,
  },
];
```

## 📱 Breakpoints y Comportamiento

### Breakpoints de Pantalla

- **`xs`**: 480px - Móviles muy pequeños
- **`sm`**: 640px - Móviles
- **`md`**: 768px - Tablets
- **`lg`**: 1024px - Desktop pequeño
- **`xl`**: 1280px+ - Desktop grande

### Comportamiento por Dispositivo

| Dispositivo | Vista | Columnas Visibles | Acciones |
|-------------|-------|-------------------|----------|
| Móvil (< 640px) | Cards | Solo `priority: 'high'` | Botones apilados |
| Tablet (640px - 1024px) | Cards | `high` + `medium` | Botones en línea |
| Desktop (> 1024px) | Tabla | Todas las columnas | Iconos en tabla |

## 🛠️ Migración desde Tabla Tradicional

### Antes (Tabla Tradicional)

```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nombre</TableHead>
      <TableHead>Fecha</TableHead>
      <TableHead>Acciones</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.nombre}</TableCell>
        <TableCell>{item.fecha}</TableCell>
        <TableCell>
          <Button onClick={() => edit(item)}>Editar</Button>
          <Button onClick={() => delete(item)}>Eliminar</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Después (Tabla Responsive)

```typescript
<ResponsiveTable
  data={data}
  columns={[
    {
      key: 'nombre',
      label: 'Nombre',
      priority: 'high',
    },
    {
      key: 'fecha', 
      label: 'Fecha',
      priority: 'medium',
      hideOnMobile: true,
    },
  ]}
  actions={[
    {
      label: 'Editar',
      icon: <Edit2 className="w-4 h-4" />,
      onClick: edit,
      primary: true,
    },
    {
      label: 'Eliminar', 
      icon: <Trash2 className="w-4 h-4" />,
      onClick: delete,
      variant: 'destructive',
    },
  ]}
  itemKey="id"
/>
```

## 🎨 Personalización y Estilos

### Estilos Móviles Personalizados

```typescript
// En MobileTableCard
const fields: MobileCardField[] = [
  {
    key: 'nombre',
    label: 'Nombre Completo',
    primary: true,        // Se muestra prominentemente
    className: 'font-bold text-lg',
    render: (value) => (
      <div className="flex items-center gap-2">
        <Avatar src={item.avatar} />
        <span>{value}</span>
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Correo',
    hideOnVerySmall: true, // Se oculta en pantallas muy pequeñas
    render: (value) => (
      <a href={`mailto:${value}`} className="text-blue-600 underline">
        {value}
      </a>
    ),
  },
];
```

### Clases CSS Responsive

```css
/* En tu CSS personalizado */
.mobile-card-fade-in {
  animation: fadeInUp 0.3s ease-out;
}

.table-scroll-indicator {
  background: linear-gradient(
    to right, 
    transparent, 
    rgba(255,255,255,0.8), 
    white
  );
}

/* Smooth scroll en móvil */
.responsive-table-container {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
```

## ⚡ Optimizaciones de Performance

### Lazy Loading de Componentes

```typescript
// Para tablas grandes, usar lazy loading
const ResponsiveTable = lazy(() => import('@/components/ui/responsive-table'));

<Suspense fallback={<TableSkeleton />}>
  <ResponsiveTable {...props} />
</Suspense>
```

### Virtualización para Datasets Grandes

```typescript
// Para más de 1000 elementos, considerar virtualización
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => isMobile ? 120 : 60, // Height por fila/card
});
```

## 🧪 Testing

### Test de Responsive Behavior

```typescript
import { render, screen } from '@testing-library/react';
import { ResponsiveTable } from '@/components/ui/responsive-table';

// Mock del hook de responsive
jest.mock('@/hooks/useResponsiveTable', () => ({
  useResponsiveTable: () => ({
    isMobile: true,
    shouldUseMobileView: true,
    screenSize: 'mobile',
  }),
}));

test('should render cards in mobile view', () => {
  render(<ResponsiveTable data={mockData} columns={mockColumns} />);
  
  // En móvil debe mostrar cards, no tabla
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  expect(screen.getAllByTestId('mobile-card')).toHaveLength(mockData.length);
});
```

## 📚 Ejemplos Prácticos

### 1. Lista de Usuarios

```typescript
const UsersTable = () => {
  const users = useUsers();
  
  return (
    <ResponsiveTable
      data={users}
      columns={[
        {
          key: 'nombre',
          label: 'Usuario',
          priority: 'high',
          render: (value, user) => (
            <div className="flex items-center gap-3">
              <Avatar src={user.avatar} fallback={user.initials} />
              <div>
                <p className="font-medium">{value}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ),
        },
        {
          key: 'rol',
          label: 'Rol',
          priority: 'medium',
          render: (value) => (
            <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
              {value}
            </Badge>
          ),
        },
        {
          key: 'ultimo_acceso',
          label: 'Último Acceso',
          priority: 'low',
          hideOnMobile: true,
          render: (value) => (
            <time className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(value), { locale: es })}
            </time>
          ),
        },
      ]}
      actions={[
        {
          label: 'Editar',
          icon: <Edit2 className="w-4 h-4" />,
          onClick: handleEditUser,
          primary: true,
        },
        {
          label: 'Desactivar',
          icon: <UserX className="w-4 h-4" />,
          onClick: handleDeactivateUser,
          variant: 'destructive',
        },
      ]}
      emptyState={{
        icon: <Users className="w-16 h-16" />,
        title: 'No hay usuarios',
        description: 'Aún no se han registrado usuarios en el sistema',
      }}
    />
  );
};
```

### 2. Lista de Productos con Filtros

```typescript
const ProductsTable = () => {
  const { data: products, loading } = useProducts();
  const { isMobile } = useResponsiveTable();
  
  return (
    <div className="space-y-4">
      {/* Filtros responsive */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <SearchInput placeholder="Buscar productos..." />
        <CategoryFilter />
        <PriceRangeFilter />
      </div>
      
      <ResponsiveTable
        data={products}
        loading={loading}
        columns={[
          {
            key: 'nombre',
            label: 'Producto',
            priority: 'high',
            render: (value, product) => (
              <div className="flex items-center gap-3">
                <img 
                  src={product.imagen} 
                  alt={value}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium">{value}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: 'precio',
            label: 'Precio',
            priority: 'high',
            render: (value) => (
              <span className="font-semibold text-green-600">
                ${value.toLocaleString('es-CO')}
              </span>
            ),
          },
          {
            key: 'stock',
            label: 'Stock',
            priority: 'medium',
            render: (value) => (
              <Badge 
                variant={value > 10 ? 'default' : value > 0 ? 'secondary' : 'destructive'}
              >
                {value} unidades
              </Badge>
            ),
          },
          {
            key: 'categoria',
            label: 'Categoría',
            priority: 'low',
            hideOnMobile: true,
          },
        ]}
        actions={[
          {
            label: 'Editar',
            icon: <Edit2 className="w-4 h-4" />,
            onClick: handleEditProduct,
            primary: true,
          },
          {
            label: 'Ver Stock',
            icon: <Package className="w-4 h-4" />,
            onClick: handleViewStock,
            variant: 'outline',
          },
        ]}
      />
    </div>
  );
};
```

## 🚀 Mejores Prácticas

### 1. Diseño Mobile-First

- Prioriza la información más importante con `priority: 'high'`
- Usa renderizado condicional para campos complejos
- Mantén las acciones primarias visibles en móvil

### 2. Performance

- Limita el número de columnas renderizadas en móvil
- Usa `hideOnMobile` para campos secundarios
- Implementa paginación para datasets grandes

### 3. UX/UI

- Mantén consistencia en los iconos y colores
- Usa badges para estados y categorías
- Proporciona feedback visual en las acciones

### 4. Accesibilidad

- Incluye `aria-labels` en acciones
- Mantén contraste adecuado en todos los temas
- Asegura navegación por teclado

## 🔧 Troubleshooting

### Problemas Comunes

1. **Cards no se muestran en móvil**
   - Verifica que `useResponsiveTable` esté importado correctamente
   - Confirma que los breakpoints en Tailwind estén configurados

2. **Acciones no funcionan en cards**
   - Asegúrate de usar `onClick` en lugar de event handlers directos
   - Verifica que `e.stopPropagation()` esté implementado

3. **Scroll horizontal problemático**
   - Confirma que el contenedor padre tenga `overflow-x-auto`
   - Verifica que `min-width` esté configurado en la tabla

### Debug Helpers

```typescript
// Debug del estado responsive
const DebugResponsive = () => {
  const responsive = useResponsiveTable();
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Responsive State:', responsive);
  }
  
  return null;
};
```

---

## 📄 Conclusión

El sistema de tablas responsive de MIA proporciona una experiencia de usuario óptima en todos los dispositivos, manteniendo la funcionalidad completa mientras se adapta a las limitaciones de espacio en móviles.

Para más información, consulta la documentación técnica en `/docs/arquitectura-tecnica.md` o revisa los ejemplos en `/src/components/ui/responsive-table.tsx`.
