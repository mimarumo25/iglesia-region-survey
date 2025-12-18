/**
 * 📝 ObservationsSection
 * 
 * Sección que muestra las observaciones finales de la encuesta,
 * el sustento de la familia y el estado de la autorización de datos.
 */

import React from 'react'
import { FileText, Home, User, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { SurveyResponseData } from '@/types/survey-responses'

interface ObservationsSectionProps {
  survey: SurveyResponseData
}

export const ObservationsSection: React.FC<ObservationsSectionProps> = ({ survey }) => {
  // Helper para obtener valores considerando la estructura anidada o plana
  const sustento = survey.observaciones?.sustento_familia || survey.sustento_familia || "No especificado";
  const observaciones = survey.observaciones?.observaciones_encuestador || survey.observaciones_encuestador || "Sin observaciones registradas";
  const autorizacion = survey.observaciones?.autorizacion_datos ?? survey.autorizacion_datos ?? false;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sustento de la Familia */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <Home className="w-3 h-3 text-blue-500" />
            Sustento de la Familia
          </h5>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
            <p className="text-sm text-gray-700 italic">
              {sustento}
            </p>
          </div>
        </div>

        {/* Observaciones del Encuestador */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <User className="w-3 h-3 text-blue-500" />
            Observaciones del Encuestador
          </h5>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
            <p className="text-sm text-gray-700 italic">
              {observaciones}
            </p>
          </div>
        </div>
      </div>

      {/* Autorización de Datos */}
      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
        {autorizacion ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : (
          <XCircle className="w-6 h-6 text-gray-400" />
        )}
        <div>
          <p className="font-semibold text-green-900">Autorización de Datos</p>
          <p className="text-sm text-green-700">
            {autorizacion 
              ? "El usuario ha autorizado el tratamiento de sus datos personales para vincularse a la parroquia." 
              : "No se ha registrado autorización explícita en este campo."}
          </p>
        </div>
      </div>
    </div>
  )
}
