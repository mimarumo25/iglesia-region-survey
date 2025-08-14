import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Edit2, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useResponsiveTypography } from '@/hooks/useTypography';

// Tipos para las columnas de la tabla
export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: any) => React.ReactNode;
}

// Tipos para los datos de paginación
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Tipos para las acciones
export interface TableAction {
  type: 'edit' | 'delete' | 'custom';
  label: string;
  icon?: React.ReactNode;
  color?: 'default' | 'destructive' | 'primary' | 'secondary';
  onClick: (item: any) => void;
  show?: (item: any) => boolean;
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
  
  // Personalización
  className?: string;
  title?: string;
  titleIcon?: React.ReactNode;
}

// Componente de acción con tooltip
const ActionButton: React.FC<{
  action: TableAction;
  item: any;
}> = ({ action, item }) => {
  if (action.show && !action.show(item)) {
    return null;
  }

  const getButtonClasses = () => {
    switch (action.color) {
      case 'destructive':
        return 'hover:bg-destructive/10 hover:text-destructive';
      case 'primary':
        return 'hover:bg-primary/10 hover:text-primary';
      case 'secondary':
        return 'hover:bg-secondary/10 hover:text-secondary';
      default:
        return 'hover:bg-muted/50';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => action.onClick(item)}
            className={getButtonClasses()}
          >
            {action.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{action.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Componente principal
export const ConfigurationTable: React.FC<ConfigurationTableProps> = ({
  data,
  columns,
  loading = false,
  loadingText = 'Cargando datos...',
  emptyIcon = <Trash2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />,
  emptyTitle = 'No se encontraron datos',
  emptyDescription,
  actions = [],
  pagination,
  onPageChange,
  showPagination = true,
  searchTerm,
  className = '',
  title,
  titleIcon,
}) => {
  const { getResponsiveTypographyClass } = useResponsiveTypography();
  // Renderizar el valor de una celda
  const renderCellValue = (column: TableColumn, item: any) => {
    const value = item[column.key];
    
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

  // Obtener acciones por defecto
  const getDefaultActions = (): TableAction[] => [
    {
      type: 'edit',
      label: 'Editar',
      icon: <Edit2 className="w-4 h-4" />,
      color: 'primary',
      onClick: () => {},
    },
    {
      type: 'delete',
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      color: 'destructive',
      onClick: () => {},
    },
  ];

  const finalActions = actions.length > 0 ? actions : getDefaultActions();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Título de la tabla */}
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {titleIcon}
          <h3 className={`${getResponsiveTypographyClass('h3')} text-foreground`}>{title}</h3>
        </div>
      )}

      {/* Estado de carga */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className={`ml-2 text-muted-foreground ${getResponsiveTypographyClass('body')}`}>
            {loadingText}
          </span>
        </div>
      ) : data.length === 0 ? (
        /* Estado vacío */
        <div className="text-center py-8">
          {emptyIcon}
          <p className={`text-muted-foreground font-medium ${getResponsiveTypographyClass('body')}`}>
            {emptyTitle}
          </p>
          {emptyDescription && (
            <p className={`text-muted-foreground/70 mt-1 ${getResponsiveTypographyClass('bodySmall')}`}>
              {emptyDescription}
            </p>
          )}
          {searchTerm && (
            <p className={`text-muted-foreground/70 mt-1 ${getResponsiveTypographyClass('bodySmall')}`}>
              Intenta con otros términos de búsqueda
            </p>
          )}
        </div>
      ) : (
        /* Tabla con datos */
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`${getResponsiveTypographyClass('tableHeader')} ${
                      column.align === 'right' ? 'text-right' : 
                      column.align === 'center' ? 'text-center' : ''
                    }`}
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </TableHead>
                ))}
                {finalActions.length > 0 && (
                  <TableHead className={`text-right ${getResponsiveTypographyClass('tableHeader')}`}>
                    Acciones
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow 
                  key={item.id || index}
                  className="hover:bg-muted/50"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`${getResponsiveTypographyClass('tableCell')} ${
                        column.align === 'right' ? 'text-right' : 
                        column.align === 'center' ? 'text-center' : ''
                      }`}
                    >
                      {renderCellValue(column, item)}
                    </TableCell>
                  ))}
                  {finalActions.length > 0 && (
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {finalActions.map((action, actionIndex) => (
                          <ActionButton
                            key={actionIndex}
                            action={action}
                            item={item}
                          />
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
                  Anterior
                </Button>
                <span className="flex items-center px-3 text-sm font-medium text-foreground bg-muted/50 rounded-md">
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConfigurationTable;
