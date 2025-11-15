/**
 * 🗺️ Sección de Ubicación
 * 
 * Muestra información geográfica y de ubicación de la familia
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Map,
  Building2,
  Church,
  Trees
} from "lucide-react";

import { EncuestaListItem } from "@/services/encuestas";

interface LocationSectionProps {
  data: EncuestaListItem;
}

export const LocationSection = ({ data }: LocationSectionProps) => {
  
  return (
    <div className="space-y-6">
      {/* Ubicación Administrativa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Ubicación Administrativa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Municipio</p>
              <p className="text-lg font-medium text-gray-900">
                {data.municipio?.nombre || "No especificado"}
              </p>
              {data.municipio?.id && (
                <p className="text-xs text-gray-500 mt-1">ID: {data.municipio.id}</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Sector</p>
              <Badge variant="outline" className="w-fit">
                {data.sector?.nombre || "General"}
              </Badge>
              {data.sector?.id && (
                <p className="text-xs text-gray-500 mt-1">ID: {data.sector.id}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ubicación Eclesiástica y Territorial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="w-5 h-5 text-purple-600" />
            Ubicación Eclesiástica y Territorial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Parroquia</p>
              {data.parroquia ? (
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {data.parroquia.nombre}
                  </p>
                  {data.parroquia.id && (
                    <p className="text-xs text-gray-500 mt-1">ID: {data.parroquia.id}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No asignada</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Vereda</p>
              {data.vereda ? (
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {data.vereda.nombre}
                  </p>
                  {data.vereda.id && (
                    <p className="text-xs text-gray-500 mt-1">ID: {data.vereda.id}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No especificada</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Corregimiento</p>
              {data.corregimiento ? (
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {data.corregimiento.nombre}
                  </p>
                  {data.corregimiento.id && (
                    <p className="text-xs text-gray-500 mt-1">ID: {data.corregimiento.id}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No especificado</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Centro Poblado</p>
              {data.centro_poblado ? (
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {data.centro_poblado.nombre}
                  </p>
                  {data.centro_poblado.id && (
                    <p className="text-xs text-gray-500 mt-1">ID: {data.centro_poblado.id}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No especificado</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dirección Completa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Dirección Detallada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  {data.direccion_familia}
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📍 {data.municipio?.nombre || "Municipio no especificado"}</p>
                  {data.vereda && <p>🌿 {data.vereda.nombre}</p>}
                  {data.corregimiento && <p>🗺️ Corregimiento: {data.corregimiento.nombre}</p>}
                  {data.centro_poblado && <p>🏘️ Centro Poblado: {data.centro_poblado.nombre}</p>}
                  {data.sector && <p>� Sector: {data.sector.nombre}</p>}
                  {data.parroquia && <p>⛪ Parroquia: {data.parroquia.nombre}</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Contacto Relacionada */}
      {data.telefono && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Teléfono:</span>
              <p className="text-gray-700 font-mono">{data.telefono}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapa Conceptual de Ubicación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-indigo-600" />
            Estructura Territorial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Jerarquía Territorial */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {data.municipio?.nombre || "Municipio"}
              </Badge>
              <span className="text-gray-400">→</span>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {data.parroquia?.nombre || "Sin Parroquia"}
              </Badge>
              <span className="text-gray-400">→</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {data.vereda?.nombre || "Sin Vereda"}
              </Badge>
              {data.corregimiento && (
                <>
                  <span className="text-gray-400">→</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {data.corregimiento.nombre}
                  </Badge>
                </>
              )}
              {data.centro_poblado && (
                <>
                  <span className="text-gray-400">→</span>
                  <Badge variant="outline" className="bg-pink-50 text-pink-700">
                    {data.centro_poblado.nombre}
                  </Badge>
                </>
              )}
              <span className="text-gray-400">→</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {data.sector?.nombre || "Sector General"}
              </Badge>
            </div>

            {/* Completitud de la información */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Completitud de Ubicación:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className={`flex items-center gap-1 ${data.municipio ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{data.municipio ? '✅' : '❌'}</span>
                  Municipio
                </div>
                <div className={`flex items-center gap-1 ${data.parroquia ? 'text-green-600' : 'text-yellow-600'}`}>
                  <span>{data.parroquia ? '✅' : '⚠️'}</span>
                  Parroquia
                </div>
                <div className={`flex items-center gap-1 ${data.vereda ? 'text-green-600' : 'text-yellow-600'}`}>
                  <span>{data.vereda ? '✅' : '⚠️'}</span>
                  Vereda
                </div>
                <div className={`flex items-center gap-1 ${data.corregimiento ? 'text-green-600' : 'text-yellow-600'}`}>
                  <span>{data.corregimiento ? '✅' : '⚠️'}</span>
                  Corregimiento
                </div>
                <div className={`flex items-center gap-1 ${data.centro_poblado ? 'text-green-600' : 'text-yellow-600'}`}>
                  <span>{data.centro_poblado ? '✅' : '⚠️'}</span>
                  Centro Poblado
                </div>
                <div className={`flex items-center gap-1 ${data.sector ? 'text-green-600' : 'text-yellow-600'}`}>
                  <span>{data.sector ? '✅' : '⚠️'}</span>
                  Sector
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSection;
