/**
 * ⚙️ Sección de Metadatos
 * 
 * Muestra información técnica y metadatos de la encuesta
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Calendar,
  FileText,
  Database,
  Info,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

import { EncuestaListItem } from "@/services/encuestas";

interface MetadataSectionProps {
  data: EncuestaListItem;
}

export const MetadataSection = ({ data }: MetadataSectionProps) => {
  
  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificada";
    
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3 mr-1" />
            En Progreso
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  /**
   * Calcular días desde creación
   */
  const getDaysSinceCreation = () => {
    try {
      if (!data.metadatos?.fecha_creacion) return null;
      const creation = new Date(data.metadatos.fecha_creacion);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - creation.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  /**
   * Calcular completitud de datos
   */
  const calculateCompleteness = () => {
    const fields = [
      data.apellido_familiar,
      data.direccion_familia,
      data.telefono,
      data.municipio?.nombre,
      data.parroquia?.nombre,
      data.sector?.nombre,
      data.tipo_vivienda?.nombre,
      data.acueducto?.nombre,
      data.miembros_familia?.total_miembros > 0,
    ];
    
    const completed = fields.filter(Boolean).length;
    const total = fields.length;
    
    return {
      percentage: Math.round((completed / total) * 100),
      completed,
      total
    };
  };

  const completeness = calculateCompleteness();
  const daysSince = getDaysSinceCreation();

  return (
    <div className="space-y-6">
      {/* Información General de la Encuesta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">ID de Encuesta</p>
              <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded-md">
                {data.id_encuesta}
              </code>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Código de Familia</p>
              <code className="text-lg font-mono bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                {data.codigo_familia}
              </code>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Estado Actual</p>
              {getStatusBadge(data.estado_encuesta)}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Versión</p>
              <Badge variant="outline" className="text-sm">
                v{data.metadatos?.version || 'N/A'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fechas y Temporal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Información Temporal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm">{formatDate(data.metadatos?.fecha_creacion)}</p>
              </div>
              {daysSince && (
                <p className="text-xs text-gray-500 mt-1">Hace {daysSince} días</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Actualización</p>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <p className="text-sm">{formatDate(data.metadatos?.fecha_actualizacion || data.metadatos?.fecha_creacion)}</p>
              </div>
            </div>

            {data.fecha_ultima_encuesta && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Última Encuesta</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="text-sm">{formatDate(data.fecha_ultima_encuesta)}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Número de Encuestas</p>
              <Badge variant="outline" className="text-sm">
                {data.numero_encuestas} encuesta(s)
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Estado Técnico</p>
              <Badge variant="outline" className="text-sm">
                {data.metadatos?.estado || 'N/A'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completitud de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            Completitud de Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de progreso */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Campos Completados</span>
                <span className="text-sm text-gray-500">
                  {completeness.completed} de {completeness.total} ({completeness.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    completeness.percentage >= 80 ? 'bg-green-500' :
                    completeness.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${completeness.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Checklist de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "Apellido Familiar", value: data.apellido_familiar },
                { label: "Dirección", value: data.direccion_familia },
                { label: "Teléfono", value: data.telefono },
                { label: "Municipio", value: data.municipio?.nombre },
                { label: "Parroquia", value: data.parroquia?.nombre },
                { label: "Sector", value: data.sector?.nombre },
                { label: "Tipo Vivienda", value: data.tipo_vivienda?.nombre },
                { label: "Acueducto", value: data.acueducto?.nombre },
                { label: "Miembros Familia", value: (data.miembros_familia?.total_miembros || 0) > 0 }
              ].map((field) => (
                <div key={field.label} className="flex items-center gap-2">
                  <span className={`text-sm ${field.value ? 'text-green-600' : 'text-red-600'}`}>
                    {field.value ? '✅' : '❌'}
                  </span>
                  <span className="text-sm text-gray-600">{field.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Contenido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" />
            Estadísticas de Contenido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.miembros_familia?.total_miembros || 0}
              </div>
              <div className="text-xs text-blue-700">Miembros Vivos</div>
            </div>

            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {data.deceasedMembers?.length || 0}
              </div>
              <div className="text-xs text-red-700">Fallecidos</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.tamaño_familia}
              </div>
              <div className="text-xs text-green-700">Tamaño Familia</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {data.numero_encuestas}
              </div>
              <div className="text-xs text-purple-700">Total Encuestas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Técnica del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Información Técnica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">ID Interno:</span>
                <code className="ml-2 text-gray-600">{data.id_encuesta || 'N/A'}</code>
              </div>
              <div>
                <span className="font-medium text-gray-700">Versión Sistema:</span>
                <span className="ml-2 text-gray-600">v{data.metadatos?.version || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Estado Backend:</span>
                <span className="ml-2 text-gray-600">{data.metadatos?.estado || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tipo Registro:</span>
                <span className="ml-2 text-gray-600">Encuesta Familiar</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-gray-500">
            <p>
              Esta información técnica es utilizada por el sistema para mantener la integridad 
              y trazabilidad de los datos de la encuesta familiar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetadataSection;
