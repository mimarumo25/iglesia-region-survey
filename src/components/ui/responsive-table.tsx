import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MobileTableCard, MobileCardField, MobileCardAction } from '@/components/ui/mobile-table-card';
import { useResponsiveTable } from '@/hooks/useResponsiveTable';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResponsiveTableColumn {
  key: string;
  label: string;
  /** Ancho de la columna en vista desktop */
  width?: string;
  /** Alineación del contenido */
  align?: 'left' | 'center' | 'right';
  /** Función personalizada para renderizar el contenido */
  render?: (value: any, item: any) => React.ReactNode;
  /** Clases CSS adicionales para la columna */
  className?: string;
  /** Si es true, esta columna es prioritaria y se muestra en móvil */
  priority?: 'high' | 'medium' | 'low';
  /** Si es true, la columna se oculta en tablet */
  hideOnTablet?: boolean;
  /** Si es true, la columna se oculta en móvil */
  hideOnMobile?: boolean;
}

export interface ResponsiveTableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: any) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  /** Si es true, la acción se muestra prominentemente en móvil */
  primary?: boolean;
}

interface ResponsiveTableProps {
  /** Datos a mostrar en la tabla */
  data: any[];
  /** Definición de las columnas */
  columns: ResponsiveTableColumn[];
  /** Acciones disponibles para cada fila */
  actions?: ResponsiveTableAction[];
  /** Estado de carga */
  loading?: boolean;
  /** Texto de carga personalizado */
  loadingText?: string;
  /** Props para estado vacío */
  emptyState?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
  };
  /** Click handler para las filas/cards */
  onRowClick?: (item: any) => void;
  /** Clases CSS adicionales */
  className?: string;
  /** Key único para cada elemento (por defecto 'id') */
  itemKey?: string;
  /** Forzar vista móvil incluso en desktop (para testing) */
  forceMobileView?: boolean;
}

/**
 * Componente de tabla responsive que se adapta automáticamente al tamaño de pantalla
 * Muestra tabla tradicional en desktop y cards en móvil/tablet
 */
export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  actions = [],
  loading = false,
  loadingText = 'Cargando datos...',
  emptyState,
  onRowClick,
  className,
  itemKey = 'id',
  forceMobileView = false,
}) => {
  const { shouldUseMobileView, isMobile } = useResponsiveTable();
  const useMobileView = forceMobileView || shouldUseMobileView;

  // Convertir columnas a campos para MobileTableCard
  const getMobileFields = (item: any): MobileCardField[] => {
    return columns
      .filter(col => !col.hideOnMobile)
      .map(col => ({
        key: col.key,
        label: col.label,
        value: item[col.key],
        render: col.render,
        primary: col.priority === 'high',
        hideOnVerySmall: col.priority === 'low',
        className: col.className,
      }));
  };

  // Convertir acciones para MobileTableCard
  const getMobileActions = (): MobileCardAction[] => {
    return actions.map(action => ({
      label: action.label,
      icon: action.icon,
      onClick: action.onClick,
      variant: action.variant || 'outline',
      size: 'sm' as const,
      hideOnVerySmall: !action.primary,
    }));
  };

  // Filtrar columnas según el tamaño de pantalla
  const getVisibleColumns = () => {
    if (useMobileView) {
      return columns.filter(col => !col.hideOnMobile);
    }
    return columns.filter(col => !col.hideOnTablet || !shouldUseMobileView);
  };

  const visibleColumns = getVisibleColumns();

  // Estados de carga y vacío
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">{loadingText}</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        {emptyState?.icon && (
          <div className="text-muted-foreground/50 mb-4 flex justify-center">
            {emptyState.icon}
          </div>
        )}
        {emptyState?.title && (
          <h3 className="font-semibold mb-2 text-foreground">
            {emptyState.title}
          </h3>
        )}
        {emptyState?.description && (
          <p className="text-muted-foreground text-sm">
            {emptyState.description}
          </p>
        )}
      </div>
    );
  }

  // Vista móvil con cards
  if (useMobileView) {
    return (
      <div className={cn("space-y-3", className)}>
        {data.map((item, index) => (
          <MobileTableCard
            key={item[itemKey] || index}
            item={item}
            fields={getMobileFields(item)}
            actions={getMobileActions()}
            onClick={onRowClick}
            index={index}
          />
        ))}
      </div>
    );
  }

  // Vista desktop con tabla tradicional
  return (
    <div className={cn("w-full", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  column.align === 'right' ? 'text-right' : 
                  column.align === 'center' ? 'text-center' : '',
                  column.className
                )}
                style={{ width: column.width }}
              >
                {column.label}
              </TableHead>
            ))}
            {actions.length > 0 && (
              <TableHead className="text-right">
                Acciones
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item[itemKey] || index}
              className={cn(
                "hover:bg-muted/50 transition-colors",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(item)}
            >
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.key}
                  className={cn(
                    column.align === 'right' ? 'text-right' : 
                    column.align === 'center' ? 'text-center' : '',
                    column.className
                  )}
                >
                  {column.render 
                    ? column.render(item[column.key], item)
                    : item[column.key] || '-'
                  }
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(item);
                        }}
                        className={cn(
                          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          "disabled:pointer-events-none disabled:opacity-50",
                          "h-8 w-8 hover:bg-muted",
                          action.variant === 'destructive' && "hover:bg-destructive/10 hover:text-destructive"
                        )}
                        title={action.label}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResponsiveTable;
