import { useEffect, useState } from 'react';
import { Corregimiento } from '@/types/corregimientos';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Edit2, Trash2 } from 'lucide-react';

interface CorregimientosListProps {
  corregimientos: Corregimiento[];
  isLoading?: boolean;
  onEdit?: (corregimiento: Corregimiento) => void;
  onDelete?: (corregimiento: Corregimiento) => void;
}

export const ResponsiveCorregimientosList = ({
  corregimientos,
  isLoading = false,
  onEdit,
  onDelete,
}: CorregimientosListProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Cargando corregimientos...</p>
      </div>
    );
  }

  if (!corregimientos || corregimientos.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No hay corregimientos disponibles</p>
      </div>
    );
  }

  // Vista de escritorio - Tabla
  if (!isMobile) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Municipio</TableHead>
              <TableHead className="font-semibold">Creado</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {corregimientos.map((corregimiento) => (
              <TableRow key={corregimiento.id_corregimiento} className="hover:bg-muted/50">
                <TableCell className="font-medium">{corregimiento.nombre}</TableCell>
                <TableCell>{corregimiento.municipio?.nombre_municipio || 'N/A'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {corregimiento.created_at ? formatDate(corregimiento.created_at) : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(corregimiento)}
                      className="h-8 w-8 p-0"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(corregimiento)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Vista de móvil - Cards
  return (
    <div className="space-y-3">
      {corregimientos.map((corregimiento) => (
        <Card key={corregimiento.id_corregimiento} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">{corregimiento.nombre}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {corregimiento.municipio?.nombre_municipio || 'Municipio N/A'}
                </p>
                {corregimiento.created_at && (
                  <span className="text-xs text-muted-foreground block mt-2">
                    Creado: {formatDate(corregimiento.created_at)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(corregimiento)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(corregimiento)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResponsiveCorregimientosList;
