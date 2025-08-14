import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Parroquia } from '@/types/parroquias';
import {
  Church,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Calendar,
} from 'lucide-react';

interface ParroquiaCardProps {
  parroquia: Parroquia;
  onEdit?: (parroquia: Parroquia) => void;
  onDelete?: (parroquia: Parroquia) => void;
  showActions?: boolean;
}

export const ParroquiaCard: React.FC<ParroquiaCardProps> = ({
  parroquia,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Church className="w-5 h-5 text-primary" />
            {parroquia.nombre}
          </CardTitle>
          {showActions && (
            <div className="flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(parroquia)}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(parroquia)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Información básica */}
        <div className="space-y-2">
          {parroquia.direccion && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{parroquia.direccion}</span>
            </div>
          )}
          
          {parroquia.telefono && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{parroquia.telefono}</span>
            </div>
          )}
          
          {parroquia.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{parroquia.email}</span>
            </div>
          )}
        </div>

        {/* Badges informativos */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            ID: {parroquia.id_parroquia}
          </Badge>
          
          {parroquia.municipio && (
            <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
              {parroquia.municipio.nombre_municipio}
            </Badge>
          )}
          
          {parroquia.created_at && (
            <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(parroquia.created_at)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParroquiaCard;
