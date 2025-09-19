import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ResponsiveTable, ResponsiveTableColumn, ResponsiveTableAction } from '@/components/ui/responsive-table';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResponsiveTypography } from '@/hooks/useTypography';

// Tipos para las columnas de la tabla (mantenemos compatibilidad hacia atrás)
export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: any) => React.ReactNode;
  /** Prioridad para vista móvil */
  priority?: 'high' | 'medium' | 'low';
  /** Ocultar en tablet */
  hideOnTablet?: boolean;
  /** Ocultar en móvil */
  hideOnMobile?: boolean;
}

// Tipos para los datos de paginación
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Tipos para las acciones (mantenemos compatibilidad hacia atrás)
export interface TableAction {
  type: 'edit' | 'delete' | 'custom';
  label: string;
  icon?: React.ReactNode;
  color?: 'default' | 'destructive' | 'primary' | 'secondary';
  onClick: (item: any) => void;
  show?: (item: any) => boolean;
  /** Si es true, se muestra prominentemente en móvil */
  primary?: boolean;
}

// Props del componente
interface ConfigurationTableProps {
  // Datos
  data: any[];
  columns: TableColumn[];
  
  // Estado de carga
  loading?: boolean;
  loadingText?: string;
  
  // Estado vacío
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  
  // Acciones
  actions?: TableAction[];
  
  // Paginación
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  
  // Búsqueda
  searchTerm?: string;
  
  // Eventos
  onRowClick?: (item: any) => void;
  
  // Personalización
  className?: string;
  title?: string;
  titleIcon?: React.ReactNode;
  
  /** Clave única para cada elemento */
  itemKey?: string;
}

// Función auxiliar para convertir TableColumn a ResponsiveTableColumn
const convertToResponsiveColumn = (column: TableColumn): ResponsiveTableColumn => ({
  key: column.key,
  label: column.label,
  width: column.width,
  align: column.align,
  render: column.render,
  priority: column.priority || 'medium',
  hideOnTablet: column.hideOnTablet,
  hideOnMobile: column.hideOnMobile,
});

// Función auxiliar para convertir TableAction a ResponsiveTableAction
const convertToResponsiveAction = (action: TableAction): ResponsiveTableAction => {
  const getVariant = () => {
    switch (action.color) {
      case 'destructive':
        return 'destructive' as const;
      case 'primary':
        return 'default' as const;
      case 'secondary':
        return 'secondary' as const;
      default:
        return 'ghost' as const;
    }
  };

  return {
    label: action.label,
    icon: action.icon,
    onClick: action.onClick,
    variant: getVariant(),
    primary: action.primary || action.type === 'edit',
  };
};

// Función para renderizar valores por defecto
const renderDefaultValue = (value: any, column: TableColumn, item: any) => {
  if (column.render) {
    return column.render(value, item);
  }
  
  // Renderizado por defecto según el tipo de datos
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>;
  }
  
  if (typeof value === 'boolean') {
    return (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  }
  
  if (column.key.toLowerCase().includes('fecha') || column.key.toLowerCase().includes('date')) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return (
        <Badge variant="outline">
          {date.toLocaleDateString('es-ES')}
        </Badge>
      );
    }
  }
  
  return value?.toString() || '-';
};

// Componente principal
export const ConfigurationTable: React.FC<ConfigurationTableProps> = ({
  data,
  columns,
  loading = false,
  loadingText = 'Cargando datos...',
  emptyIcon = <Trash2 className="w-16 h-16 text-muted-foreground/50" />,
  emptyTitle = 'No se encontraron datos',
  emptyDescription,
  actions = [],
  pagination,
  onPageChange,
  showPagination = true,
  searchTerm,
  onRowClick,
  className = '',
  title,
  titleIcon,
  itemKey = 'id',
}) => {
  const { getResponsiveTypographyClass } = useResponsiveTypography();

  // Convertir columnas para el ResponsiveTable
  const responsiveColumns: ResponsiveTableColumn[] = columns.map(column => ({
    ...convertToResponsiveColumn(column),
    render: (value: any, item: any) => renderDefaultValue(value, column, item),
  }));

  // Filtrar y convertir acciones
  const visibleActions = actions.filter(action => !action.show || action.show);
  const responsiveActions: ResponsiveTableAction[] = visibleActions.map(convertToResponsiveAction);

  // Obtener acciones por defecto si no se proporcionan
  const defaultActions: ResponsiveTableAction[] = [
    {
      label: 'Editar',
      icon: <Edit2 className="w-4 h-4" />,
      onClick: () => {},
      variant: 'ghost',
      primary: true,
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => {},
      variant: 'destructive',
      primary: false,
    },
  ];

  const finalActions = responsiveActions.length > 0 ? responsiveActions : defaultActions;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Título de la tabla */}
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {titleIcon}
          <h3 className={`${getResponsiveTypographyClass('h3')} text-foreground`}>
            {title}
          </h3>
        </div>
      )}

      {/* Tabla responsive */}
      <ResponsiveTable
        data={data}
        columns={responsiveColumns}
        actions={finalActions}
        loading={loading}
        loadingText={loadingText}
        emptyState={{
          icon: emptyIcon,
          title: emptyTitle,
          description: emptyDescription || (searchTerm ? 'Intenta con otros términos de búsqueda' : undefined),
        }}
        onRowClick={onRowClick}
        itemKey={itemKey}
      />

      {/* Paginación */}
      {showPagination && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Mostrando {data.length} de {pagination.totalItems} elementos
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Anterior</span>
            </Button>
            <span className="flex items-center px-3 text-sm font-medium text-foreground bg-muted/50 rounded-md">
              <span className="hidden sm:inline">Página </span>
              {pagination.currentPage}
              <span className="hidden sm:inline"> de {pagination.totalPages}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <span className="hidden sm:inline mr-1">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationTable;
