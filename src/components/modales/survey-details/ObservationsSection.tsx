/**
 * 📝 Sección de Observaciones
 * 
 * Muestra las observaciones y información adicional de la encuesta
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  FileText,
  Shield,
  Heart,
  CheckCircle,
  XCircle,
  User
} from "lucide-react";

import { EncuestaListItem } from "@/services/encuestas";

interface ObservationsSectionProps {
  data: EncuestaListItem;
}

export const ObservationsSection = ({ data }: ObservationsSectionProps) => {
  
  const authorized = data.observaciones?.autorizacion_datos ?? data.autorizacion_datos ?? false;

  /**
   * Obtener badge de autorización
   */
  const getAuthorizationBadge = (authorized?: boolean) => {
    if (authorized) {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Autorizado
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-700">
          <XCircle className="w-3 h-3 mr-1" />
          No Autorizado
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sustento de Familia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-blue-600" />
            Sustento de la Familia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {data.observaciones?.sustento_familia || data.sustento_familia || (
                <span className="text-gray-400 italic">Sin información sobre el sustento familiar</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones del Encuestador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Observaciones del Encuestador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {data.observaciones?.observaciones_encuestador || data.observaciones_encuestador || (
                <span className="text-gray-400 italic">Sin observaciones del encuestador</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Autorización de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Protección de Datos Personales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-700">Estado de Autorización</p>
                <p className="text-sm text-gray-500">Tratamiento de datos personales según normativa vigente</p>
              </div>
              <div>
                {getAuthorizationBadge(authorized)}
              </div>
            </div>

            {authorized && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-800">Consentimiento Otorgado</p>
                </div>
                <p className="text-xs text-green-700">
                  La familia ha autorizado el tratamiento de sus datos personales conforme 
                  a la Ley de Protección de Datos Personales.
                </p>
              </div>
            )}

            {!authorized && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800">Pendiente de Autorización</p>
                </div>
                <p className="text-xs text-yellow-700">
                  Se requiere obtener el consentimiento para el tratamiento de datos personales.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Observaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Resumen de Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {data.observaciones?.sustento_familia ? '✅' : '❌'}
              </div>
              <div className="text-xs text-blue-700">Sustento Documentado</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {data.observaciones?.observaciones_encuestador ? '✅' : '❌'}
              </div>
              <div className="text-xs text-purple-700">Observaciones Registradas</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {data.observaciones?.autorizacion_datos ? '✅' : '❌'}
              </div>
              <div className="text-xs text-green-700">Datos Autorizados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-xs text-gray-500">
        <p>
          Esta sección muestra las observaciones adicionales registradas durante 
          la encuesta, incluyendo información sobre el sustento familiar y 
          el estado de autorización para el tratamiento de datos personales.
        </p>
      </div>
    </div>
  );
};

export default ObservationsSection;