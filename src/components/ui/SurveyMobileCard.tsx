/**
 * 📱 SurveyMobileCard - Componente Mobile para Lista de Encuestas
 * 
 * Card optimizada para móviles que muestra información esencial de cada encuesta
 * con diseño compacto y acciones rápidas
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  FileText,
  MapPin,
  Calendar,
  Users,
  Phone,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Loader2,
  Clock
} from "lucide-react";
import { EncuestaListItem } from "@/services/encuestas";
import { cn } from "@/lib/utils";

interface SurveyMobileCardProps {
  encuesta: EncuestaListItem;
  onViewDetails: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (encuesta: EncuestaListItem) => void;
  isDeleting?: boolean;
  compact?: boolean;
  className?: string;
}

// Función para obtener el color del badge de estado
const getStatusBadgeVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'completada':
      return 'default'; // Verde
    case 'pending':
    case 'pendiente':
      return 'secondary'; // Amarillo
    case 'in_progress':
    case 'en_progreso':
      return 'outline'; // Azul
    case 'cancelled':
    case 'cancelada':
      return 'destructive'; // Rojo
    default:
      return 'outline';
  }
};

// Función para obtener el texto legible del estado
const getStatusText = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'completada':
      return 'Completada';
    case 'pending':
    case 'pendiente':
      return 'Pendiente';
    case 'in_progress':
    case 'en_progreso':
      return 'En Progreso';
    case 'cancelled':
    case 'cancelada':
      return 'Cancelada';
    default:
      return status || 'Sin estado';
  }
};

// Función para formatear fechas
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return "-";
  }
};

export const SurveyMobileCard = ({
  encuesta,
  onViewDetails,
  onEdit,
  onDelete,
  isDeleting = false,
  compact = false,
  className
}: SurveyMobileCardProps) => {
  const surveyId = parseInt(encuesta.id_encuesta);

  return (
    <Card className={cn(
      "mobile-view-transition hover:shadow-md transition-all duration-200",
      "border border-gray-200 bg-white",
      className
    )}>
      <CardContent className={cn(
        "p-4 space-y-3",
        compact && "p-3 space-y-2"
      )}>
        {/* Header con familia y código */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <h3 className="font-semibold text-gray-900 truncate">
                {encuesta.apellido_familiar}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <Badge
                variant={getStatusBadgeVariant(encuesta.estado_encuesta)}
                className="text-xs font-medium"
              >
                {getStatusText(encuesta.estado_encuesta)}
              </Badge>
            </div>
          </div>

          {/* Menú de acciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 flex-shrink-0 text-gray-500 hover:text-gray-900 active:bg-gray-100"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MoreHorizontal className="w-5 h-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(surveyId)}>
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(surveyId)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(encuesta)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Información de ubicación */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-tight font-medium">
              {encuesta.direccion_familia}
            </p>
          </div>

          {/* Información adicional de ubicación */}
          {(encuesta.municipio?.nombre || encuesta.sector?.nombre) && (
            <div className="text-xs text-gray-500 ml-5">
              {encuesta.municipio?.nombre && (
                <span>{encuesta.municipio.nombre}</span>
              )}
              {encuesta.municipio?.nombre && encuesta.sector?.nombre && (
                <span> • </span>
              )}
              {encuesta.sector?.nombre && (
                <span>{encuesta.sector.nombre}</span>
              )}
            </div>
          )}

          {/* Teléfono si existe */}
          {encuesta.telefono && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-gray-400" />
              <p className="text-sm text-gray-700 font-medium">{encuesta.telefono}</p>
            </div>
          )}
        </div>

        {/* Estadísticas de familia */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{encuesta.miembros_familia?.total_miembros || 0} miembros</span>
            </div>

            {encuesta.personas_fallecidas?.total_fallecidos > 0 && (
              <div className="flex items-center gap-1">
                <span>💔</span>
                <span>{encuesta.personas_fallecidas.total_fallecidos} fallecidos</span>
              </div>
            )}
          </div>

          {/* Fechas */}
          <div className="flex flex-col items-end gap-1">
            {encuesta.metadatos?.fecha_creacion && (
              <div className="flex items-center gap-1 text-xs text-gray-500" title="Fecha Creación">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(encuesta.metadatos.fecha_creacion)}</span>
              </div>
            )}
            
            {(encuesta.metadatos?.fecha_actualizacion || encuesta.fecha_ultima_encuesta) && (
              <div className="flex items-center gap-1 text-xs text-gray-500" title="Última Actualización">
                <Clock className="w-3 h-3" />
                <span>{formatDate(encuesta.metadatos?.fecha_actualizacion || encuesta.fecha_ultima_encuesta)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Botón de acción rápida para móviles muy pequeños */}
        {compact && (
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => onViewDetails(surveyId)}
            >
              <Eye className="w-3 h-3 mr-2" />
              Ver Detalles
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurveyMobileCard;
