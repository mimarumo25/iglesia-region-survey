import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useResponsiveTypography } from '@/hooks/useTypography';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
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
}

export default function ConfigurationTable<T = any>({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onRowClick,
  emptyState,
}: ConfigurationTableProps<T>) {
  const { getResponsiveTypographyClass } = useResponsiveTypography();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className={`ml-2 text-muted-foreground ${getResponsiveTypographyClass('body')}`}>
          Cargando datos...
        </span>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground/50 mb-4 flex justify-center">
          {emptyState.icon}
        </div>
        <h3 className={`font-semibold mb-2 ${getResponsiveTypographyClass('h3')}`}>
          {emptyState.title}
        </h3>
        <p className={`text-muted-foreground ${getResponsiveTypographyClass('body')}`}>
          {emptyState.description}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`${getResponsiveTypographyClass('caption')} font-semibold ${column.className || ''}`}
              >
                {column.title}
              </TableHead>
            ))}
            {(onEdit || onDelete) && (
              <TableHead className={`text-right font-semibold ${getResponsiveTypographyClass('caption')}`}>
                Acciones
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={index}
              className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={`${getResponsiveTypographyClass('body')} ${column.className || ''}`}
                >
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item);
                        }}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
