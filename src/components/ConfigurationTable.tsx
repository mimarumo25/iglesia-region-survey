import React from 'react';
import { ResponsiveTable, ResponsiveTableColumn, ResponsiveTableAction } from '@/components/ui/responsive-table';
import { ConfigPagination, ConfigPaginationVariant } from '@/components/ui/config-pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { useResponsiveTypography } from '@/hooks/useTypography';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  /** Prioridad para vista móvil */
  priority?: 'high' | 'medium' | 'low';
  /** Ocultar en móvil */
  hideOnMobile?: boolean;
}

export interface ConfigurationTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  // ✅ Soporte opcional para paginación
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    variant?: ConfigPaginationVariant;
  };
}

export default function ConfigurationTable<T = any>({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onRowClick,
  emptyState,
  pagination,
}: ConfigurationTableProps<T>) {
  const { getResponsiveTypographyClass } = useResponsiveTypography();

  // Convertir columnas para ResponsiveTable
  const responsiveColumns: ResponsiveTableColumn[] = columns.map(column => ({
    key: column.key,
    label: column.title,
    priority: column.priority || 'medium',
    hideOnMobile: column.hideOnMobile,
    className: column.className,
    render: column.render ? (value: any, item: any) => column.render!(item) : undefined,
  }));

  // Crear acciones
  const actions: ResponsiveTableAction[] = [];
  
  if (onEdit) {
    actions.push({
      label: 'Editar',
      icon: <Edit2 className="w-4 h-4" />,
      onClick: onEdit,
      variant: 'ghost',
      primary: true,
    });
  }
  
  if (onDelete) {
    actions.push({
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete,
      variant: 'destructive',
      primary: false,
    });
  }

  return (
    <div className="space-y-4">
      <ResponsiveTable
        data={data}
        columns={responsiveColumns}
        actions={actions}
        loading={loading}
        loadingText="Cargando datos..."
        emptyState={emptyState}
        onRowClick={onRowClick}
      />
      
      {/* ✅ Paginación opcional usando ConfigPagination */}
      {pagination && (
        <ConfigPagination
          variant={pagination.variant || 'simple'}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
