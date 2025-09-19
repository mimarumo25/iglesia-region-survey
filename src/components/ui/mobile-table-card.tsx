import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useResponsiveTypography } from '@/hooks/useTypography';
import { cn } from '@/lib/utils';

export interface MobileCardField {
  key: string;
  label: string;
  value: any;
  /** Función personalizada para renderizar el valor */
  render?: (value: any, item: any) => React.ReactNode;
  /** Si es true, este campo se mostrará de forma prominente */
  primary?: boolean;
  /** Clases CSS adicionales para el campo */
  className?: string;
  /** Si es true, el campo se ocultará en vista móvil muy pequeña */
  hideOnVerySmall?: boolean;
}

export interface MobileCardAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: any) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  /** Si es true, la acción se ocultará en vista móvil muy pequeña */
  hideOnVerySmall?: boolean;
}

interface MobileTableCardProps {
  /** Datos del elemento */
  item: any;
  /** Campos a mostrar en la card */
  fields: MobileCardField[];
  /** Acciones disponibles para el elemento */
  actions?: MobileCardAction[];
  /** Click handler para toda la card */
  onClick?: (item: any) => void;
  /** Clases CSS adicionales */
  className?: string;
  /** Índice del elemento (para alternar colores) */
  index?: number;
}

/**
 * Componente para mostrar datos de tabla en formato card optimizado para móviles
 * Reemplaza las filas de tabla tradicionales en pantallas pequeñas
 */
export const MobileTableCard: React.FC<MobileTableCardProps> = ({
  item,
  fields,
  actions = [],
  onClick,
  className,
  index = 0,
}) => {
  const { getResponsiveTypographyClass } = useResponsiveTypography();

  const handleCardClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const renderFieldValue = (field: MobileCardField) => {
    const value = item[field.key];
    
    if (field.render) {
      return field.render(value, item);
    }
    
    // Renderizado por defecto según el tipo de datos
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground text-sm">No especificado</span>;
    }
    
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'} className="text-xs">
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      );
    }
    
    // Detectar campos de fecha
    if (field.key.toLowerCase().includes('fecha') || field.key.toLowerCase().includes('date')) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return (
          <Badge variant="outline" className="text-xs">
            {date.toLocaleDateString('es-ES')}
          </Badge>
        );
      }
    }
    
    return value?.toString() || '-';
  };

  // Separar campos primarios y secundarios
  const primaryFields = fields.filter(field => field.primary);
  const secondaryFields = fields.filter(field => !field.primary);

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md border border-border',
        onClick && 'cursor-pointer hover:bg-muted/30',
        index % 2 === 0 ? 'bg-muted/10' : 'bg-background',
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Campos primarios - Más prominentes */}
        {primaryFields.length > 0 && (
          <div className="space-y-2">
            {primaryFields.map((field, fieldIndex) => (
              <div key={field.key} className={cn("space-y-1", field.className)}>
                <div className="flex items-start justify-between gap-2">
                  <span className={cn(
                    "font-medium text-foreground line-clamp-2",
                    getResponsiveTypographyClass('body')
                  )}>
                    {renderFieldValue(field)}
                  </span>
                </div>
                <span className={cn(
                  "text-muted-foreground uppercase tracking-wide",
                  getResponsiveTypographyClass('caption')
                )}>
                  {field.label}
                </span>
              </div>
            ))}
            {secondaryFields.length > 0 && <Separator className="my-3" />}
          </div>
        )}

        {/* Campos secundarios - En formato de grilla */}
        {secondaryFields.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {secondaryFields.map((field) => (
              <div 
                key={field.key} 
                className={cn(
                  "flex items-center justify-between gap-2",
                  field.hideOnVerySmall && "hidden xs:flex",
                  field.className
                )}
              >
                <span className={cn(
                  "text-muted-foreground font-medium",
                  getResponsiveTypographyClass('bodySmall')
                )}>
                  {field.label}:
                </span>
                <div className="text-right">
                  {renderFieldValue(field)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Acciones */}
        {actions.length > 0 && (
          <>
            <Separator className="my-3" />
            <div className="flex flex-wrap gap-2 justify-end">
              {actions.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  variant={action.variant || 'outline'}
                  size={action.size || 'sm'}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(item);
                  }}
                  className={cn(
                    "flex items-center gap-1",
                    action.hideOnVerySmall && "hidden xs:flex",
                    action.className
                  )}
                >
                  {action.icon}
                  <span className={getResponsiveTypographyClass('caption')}>
                    {action.label}
                  </span>
                </Button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileTableCard;
