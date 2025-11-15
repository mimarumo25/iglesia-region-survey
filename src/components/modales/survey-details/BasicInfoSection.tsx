/**
 * 🏠 Sección de Información Básica
 * 
 * Muestra la información general y básica de la familia y vivienda
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  MapPin,
  Calendar,
  FileText,
  Users
} from "lucide-react";

import { EncuestaListItem } from "@/services/encuestas";

interface BasicInfoSectionProps {
  data: EncuestaListItem;
}

export const BasicInfoSection = ({ data }: BasicInfoSectionProps) => {
  
  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificada";
    
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
   * Obtener badge de estado
   */
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">✅ Completada</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700">🔄 En Progreso</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">❌ Cancelada</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">⏳ Pendiente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Información Principal de la Familia */}
      <Card>
        <CardHeader>
          <CardTitle>
            Información Principal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Apellido Familiar</p>
                <p className="text-lg font-semibold text-gray-900">{data.apellido_familiar || 'No especificado'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Código de Familia</p>
                <code className="text-sm bg-gray-100 px-3 py-1 rounded-md font-mono">
                  {data.codigo_familia || 'N/A'}
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Estado de la Encuesta</p>
                {getStatusBadge(data.estado_encuesta)}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Dirección Completa</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{data.direccion_familia || 'No especificada'}</p>
                </div>
              </div>

              {data.telefono && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Teléfono de Contacto</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700">{data.telefono}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tamaño de Familia</p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-700">{data.tamaño_familia || 0} miembros</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de la Vivienda */}
      <Card>
        <CardHeader>
          <CardTitle>
            Datos de la Vivienda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Tipo de Vivienda</p>
              <Badge variant="outline" className="text-sm">
                🏠 {data.tipo_vivienda?.nombre || "No especificado"}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Dirección de la Vivienda</p>
              <p className="text-gray-700">{data.direccion_familia || 'No especificada'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Resumen de Integrantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.miembros_familia?.total_miembros || 0}
              </div>
              <div className="text-sm text-blue-700">Miembros Activos</div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {data.deceasedMembers?.length || 0}
              </div>
              <div className="text-sm text-red-700">Personas Fallecidas</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.numero_encuestas || 0}
              </div>
              <div className="text-sm text-green-700">Total Encuestas</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {data.tamaño_familia || 0}
              </div>
              <div className="text-sm text-yellow-700">Tamaño Familia</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fechas Importantes */}
      <Card>
        <CardHeader>
          <CardTitle>
            Fechas Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-gray-700">{formatDate(data.metadatos?.fecha_creacion)}</p>
              </div>
            </div>

            {data.estado_encuesta === 'completed' && data.fecha_ultima_encuesta && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Última Actualización</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-700">{formatDate(data.fecha_ultima_encuesta)}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Estado Técnico</p>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">Versión {data.metadatos?.version || 'N/A'}</span>
              <Badge variant="outline">{data.metadatos?.estado || 'Desconocido'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoSection;
