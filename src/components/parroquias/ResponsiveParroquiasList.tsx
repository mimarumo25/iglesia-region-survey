import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Church,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
} from 'lucide-react';
import { formatTelefono } from '@/schemas/parroquias';
import { Parroquia } from '@/types/parroquias';

interface ResponsiveParroquiasListProps {
  parroquias: Parroquia[];
  onEdit: (parroquia: Parroquia) => void;
  onDelete: (parroquia: Parroquia) => void;
  loading?: boolean;
}

/**
 * Componente híbrido que muestra tabla en desktop y cards en móviles
 */
export const ResponsiveParroquiasList: React.FC<ResponsiveParroquiasListProps> = ({
  parroquias,
  onEdit,
  onDelete,
  loading = false,
}) => {
  // Vista de tabla para desktop
  const TableView = () => (
    <div className="hidden lg:block">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead className="font-semibold text-foreground">ID</TableHead>
            <TableHead className="font-semibold text-foreground">Nombre</TableHead>
            <TableHead className="font-semibold text-foreground">Dirección</TableHead>
            <TableHead className="font-semibold text-foreground">Teléfono</TableHead>
            <TableHead className="font-semibold text-foreground">Email</TableHead>
            <TableHead className="font-semibold text-foreground">Municipio</TableHead>
            <TableHead className="text-right font-semibold text-primary">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parroquias.map((parroquia, index) => (
            <TableRow 
              key={parroquia.id_parroquia}
              className="hover:bg-muted/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-medium text-foreground">
                {parroquia.id_parroquia}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Church className="w-4 h-4 text-primary" />
                  <span className="font-medium">{parroquia.nombre}</span>
                </div>
              </TableCell>
              <TableCell>
                {parroquia.direccion}
              </TableCell>
              <TableCell>
               {parroquia.telefono ? formatTelefono(parroquia.telefono) : 'N/A'}
              </TableCell>
              <TableCell>
                {parroquia.email || 'N/A'}
              </TableCell>
              <TableCell>
               {parroquia.municipio?.nombre_municipio || 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(parroquia)}
                    className="hover:bg-primary/10 hover:text-primary hover:shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(parroquia)}
                    className="hover:bg-destructive/10 hover:text-destructive hover:shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Vista de cards para móviles y tablets
  const CardsView = () => (
    <div className="lg:hidden space-y-4">
      {parroquias.map((parroquia, index) => (
        <Card 
          key={parroquia.id_parroquia}
          className="shadow-sm hover:shadow-md transition-shadow duration-200"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-4">
            {/* Header con ID y acciones */}
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="text-xs">
                ID: {parroquia.id_parroquia}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(parroquia)}
                  className="hover:bg-primary/10 hover:text-primary h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(parroquia)}
                  className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Nombre principal */}
            <div className="flex items-center gap-2 mb-3">
              <Church className="w-5 h-5 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-lg text-foreground leading-tight">
                {parroquia.nombre}
              </h3>
            </div>

            {/* Información en grid responsive */}
            <div className="space-y-3">
              {/* Dirección */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                  <p className="text-sm text-foreground break-words">{parroquia.direccion}</p>
                </div>
              </div>

              {/* Municipio */}
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Municipio</p>
                  <p className="text-sm text-foreground">
                    {parroquia.municipio?.nombre_municipio || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Grid para teléfono y email en tablets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Teléfono */}
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                    <p className="text-sm text-foreground">
                      {parroquia.telefono ? formatTelefono(parroquia.telefono) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground break-all">
                      {parroquia.email || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <TableView />
      <CardsView />
    </>
  );
};