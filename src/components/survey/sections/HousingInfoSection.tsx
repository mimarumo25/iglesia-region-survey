/**
 * 🏠 HousingInfoSection
 * 
 * Sección que muestra toda la información relacionada con la vivienda:
 * tipo, servicios de agua, saneamiento y disposición de residuos
 */

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { SurveyResponseData } from '@/types/survey-responses'

interface HousingInfoSectionProps {
  survey: SurveyResponseData
}

export const HousingInfoSection: React.FC<HousingInfoSectionProps> = ({ survey }) => {
  return (
    <div className="space-y-6">
      {/* Tipo de Vivienda */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Tipo de Vivienda
        </label>
        <Badge className="bg-orange-600 text-white text-base px-3 py-2">
          {survey.tipo_vivienda?.nombre || 'Sin especificar'}
        </Badge>
      </div>

      {/* Servicios de Agua y Saneamiento */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 text-sm">
          Servicios de Agua y Saneamiento
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Sistema de Acueducto
            </label>
            <div className="bg-blue-50 rounded px-3 py-2">
              <p className="text-sm font-semibold text-gray-900">
                {survey.acueducto?.nombre || 'Sin especificar'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Aguas Residuales
            </label>
            <div className="bg-blue-50 rounded px-3 py-2">
              <p className="text-sm font-semibold text-gray-900">
                {survey.aguas_residuales?.nombre || '(No especificado)'}
              </p>
            </div>
          </div>
        </div>

        {/* Alerta si no hay agua residual */}
        {!survey.aguas_residuales && (
          <Alert>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-xs text-gray-700">
              No se especificó sistema de aguas residuales
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Disposición de Basura */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 text-sm">
          Disposición de Basura ({survey.basuras?.length || 0} {survey.basuras?.length === 1 ? 'método' : 'métodos'})
        </h4>

        {survey.basuras && survey.basuras.length > 0 ? (
          <div className="space-y-2">
            {survey.basuras.map((basura, index) => (
              <div key={`${basura.id}-${index}`} className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  {basura.nombre}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 italic">(No se especificaron métodos)</p>
          </div>
        )}
      </div>

      {/* Servicios Eléctricos */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 text-sm">
          ⚡ Servicio Eléctrico
        </h4>
        <div>
          <p className="text-xs text-gray-600 mb-2">Número de Contrato EPM</p>
          <code className="text-sm bg-orange-50 rounded px-3 py-2 font-mono font-semibold text-gray-900 block">
            {survey.numero_contrato_epm || 'Sin especificar'}
          </code>
        </div>
      </div>

      {/* Resumen Visual */}
      <div className="mt-6 p-4 bg-orange-100 rounded-lg border-l-4 border-orange-600">
        <p className="text-xs text-gray-600 mb-3 font-semibold">RESUMEN DE SERVICIOS</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Agua Potable</span>
            <Badge variant="secondary">
              {survey.acueducto?.nombre || 'N/A'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Saneamiento</span>
            <Badge variant="secondary">
              {survey.aguas_residuales?.nombre || '(No especificado)'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Vivienda</span>
            <Badge variant="secondary">
              {survey.tipo_vivienda?.nombre || 'N/A'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Métodos de Basura</span>
            <Badge variant="secondary">
              {survey.basuras?.length || 0}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
