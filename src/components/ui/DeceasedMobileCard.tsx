/**
 * 💔 Card Móvil para Personas Fallecidas
 * 
 * Componente optimizado para mostrar información de personas fallecidas
 * en dispositivos móviles con layout card-based
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Calendar,
  User,
  FileText,
  Clock
} from "lucide-react";

// ============================================================================
// INTERFACES
// ============================================================================

interface DeceasedMobileCardProps {
  /** Datos de la persona fallecida */
  deceased: {
    id: string | number;
    nombre_completo: string;
    fecha_fallecimiento: string;
    era_padre: boolean;
    era_madre: boolean;
    causa_fallecimiento: string;
  };
  /** Índice para animaciones */
  index?: number;
  /** Estilo compacto para modales */
  compact?: boolean;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const DeceasedMobileCard = ({
  deceased,
  index = 0,
  compact = false
}: DeceasedMobileCardProps) => {

  // ========================================================================
  // FUNCIONES AUXILIARES
  // ========================================================================

  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Obtener iniciales para avatar
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Obtener el parentesco
   */
  const getRelationship = () => {
    if (deceased.era_padre && deceased.era_madre) {
      return { label: "Padre y Madre", color: "bg-purple-100 text-purple-700 border-purple-200" };
    } else if (deceased.era_padre) {
      return { label: "Padre", color: "bg-blue-100 text-blue-700 border-blue-200" };
    } else if (deceased.era_madre) {
      return { label: "Madre", color: "bg-pink-100 text-pink-700 border-pink-200" };
    } else {
      return { label: "Familiar", color: "bg-gray-100 text-gray-700 border-gray-200" };
    }
  };

  /**
   * Calcular tiempo transcurrido desde el fallecimiento
   */
  const getTimeAgo = (dateString: string) => {
    try {
      const deathDate = new Date(dateString);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - deathDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `Hace ${years} año${years > 1 ? 's' : ''}`;
      }
    } catch {
      return '';
    }
  };

  // ========================================================================
  // VARIABLES CALCULADAS
  // ========================================================================

  const relationship = getRelationship();
  const timeAgo = getTimeAgo(deceased.fecha_fallecimiento);

  // ========================================================================
  // RENDERIZADO
  // ========================================================================

  return (
    <Card 
      className={`
        relative transition-all duration-300 hover:shadow-lg border border-gray-200
        ${compact ? 'mb-3' : 'mb-4'}
        bg-white hover:bg-gray-50
      `}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.4s ease-out forwards'
      }}
    >
      <CardContent className={`${compact ? 'p-4' : 'p-5'} space-y-4`}>
        
        {/* Header con avatar y info principal */}
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12 flex-shrink-0 bg-gray-100">
            <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
              {getInitials(deceased.nombre_completo)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                  {deceased.nombre_completo}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={relationship.color}>
                    <Heart className="w-3 h-3 mr-1" />
                    {relationship.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de fallecimiento en grid */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          {/* Fecha de fallecimiento */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="w-3 h-3" />
              <span className="font-medium">Fecha de Fallecimiento</span>
            </div>
            <p className="text-gray-900 font-semibold">{formatDate(deceased.fecha_fallecimiento)}</p>
            {timeAgo && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
            )}
          </div>

          {!compact && (
            <>
              <Separator />

              {/* Causa de fallecimiento */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gray-500">
                  <FileText className="w-3 h-3" />
                  <span className="font-medium">Causa de Fallecimiento</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {deceased.causa_fallecimiento || "No especificada"}
                  </p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-blue-700 mb-1">
                  <User className="w-3 h-3" />
                  <span className="font-medium text-xs">Relación Familiar</span>
                </div>
                <p className="text-blue-900 text-sm">
                  {deceased.era_padre && deceased.era_madre 
                    ? "Era padre y madre de la familia"
                    : deceased.era_padre 
                      ? "Era el padre de la familia"
                      : deceased.era_madre 
                        ? "Era la madre de la familia"
                        : "Era un miembro de la familia"
                  }
                </p>
              </div>
            </>
          )}
        </div>

        {/* Borde inferior memorial */}
        <div className="border-b-2 border-gray-100 opacity-50"></div>
      </CardContent>
    </Card>
  );
};

export default DeceasedMobileCard;
