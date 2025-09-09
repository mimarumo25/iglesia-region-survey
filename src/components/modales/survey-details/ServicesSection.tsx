/**
 * 💧 Sección de Servicios
 * 
 * Muestra información sobre servicios de la vivienda (acueducto, residuales, basuras)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Droplets,
  Trash2,
  Waves,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

import { EncuestaListItem } from "@/services/encuestas";

interface ServicesSectionProps {
  data: EncuestaListItem;
}

export const ServicesSection = ({ data }: ServicesSectionProps) => {
  
  /**
   * Obtener icono y estilo para el estado del servicio
   */
  const getServiceStatus = (hasService: boolean, serviceName: string) => {
    return hasService ? (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Disponible</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-red-600">
        <XCircle className="w-4 h-4" />
        <span className="text-sm font-medium">No disponible</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Servicios de Agua */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Servicios de Agua
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sistema de Acueducto */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900">Sistema de Acueducto</h4>
              {getServiceStatus(!!data.acueducto, "acueducto")}
            </div>
            
            {data.acueducto ? (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">{data.acueducto.nombre}</p>
                    {data.acueducto.id && (
                      <p className="text-xs text-blue-700">ID: {data.acueducto.id}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-sm">No cuenta con sistema de acueducto</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Aguas Residuales */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900">Aguas Residuales</h4>
              {getServiceStatus(!!data.aguas_residuales, "aguas residuales")}
            </div>
            
            {data.aguas_residuales ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Waves className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">{data.aguas_residuales.nombre}</p>
                    {data.aguas_residuales.id && (
                      <p className="text-xs text-green-700">ID: {data.aguas_residuales.id}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-sm">No especificado el sistema de aguas residuales</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Disposición de Basuras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-orange-600" />
            Disposición de Basuras
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.basuras && data.basuras.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">
                Métodos de disposición de basuras utilizados por la familia:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.basuras.map((basura, index) => (
                  <div key={index} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-orange-900">{basura.nombre}</p>
                        {basura.id && (
                          <p className="text-xs text-orange-700">ID: {basura.id}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-sm">No se ha especificado el método de disposición de basuras</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de Servicios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            Resumen de Servicios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Acueducto */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-blue-900">Acueducto</div>
              <div className="text-xs text-blue-700 mt-1">
                {data.acueducto ? '✅ Disponible' : '❌ No disponible'}
              </div>
            </div>

            {/* Aguas Residuales */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Waves className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm font-medium text-green-900">Aguas Residuales</div>
              <div className="text-xs text-green-700 mt-1">
                {data.aguas_residuales ? '✅ Disponible' : '⚠️ No especificado'}
              </div>
            </div>

            {/* Basuras */}
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trash2 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-sm font-medium text-orange-900">Disposición Basuras</div>
              <div className="text-xs text-orange-700 mt-1">
                {data.basuras && data.basuras.length > 0 
                  ? `✅ ${data.basuras.length} método(s)` 
                  : '⚠️ No especificado'
                }
              </div>
            </div>
          </div>

          {/* Indicadores de Completitud */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Estado de Información de Servicios:</p>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className={data.acueducto ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
              >
                {data.acueducto ? '✅' : '❌'} Acueducto
              </Badge>
              <Badge 
                variant="outline" 
                className={data.aguas_residuales ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}
              >
                {data.aguas_residuales ? '✅' : '⚠️'} Aguas Residuales
              </Badge>
              <Badge 
                variant="outline" 
                className={data.basuras && data.basuras.length > 0 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}
              >
                {data.basuras && data.basuras.length > 0 ? '✅' : '⚠️'} Disposición Basuras
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesSection;
