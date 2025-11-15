/**
 * 📍 LocationSection
 * 
 * Sección que muestra la información geográfica completa de la encuesta
 * Incluye: Municipio, Parroquia, Sector, Vereda, Corregimiento, Centro Poblado
 */

import React from 'react'
import type { SurveyResponseData } from '@/types/survey-responses'

interface LocationSectionProps {
  survey: SurveyResponseData
}

export const LocationSection: React.FC<LocationSectionProps> = ({ survey }) => {
  const locationFields = [
    { label: 'Municipio', value: survey.municipio?.nombre || 'N/A' },
    { label: 'Parroquia', value: survey.parroquia?.nombre || 'N/A' },
    { label: 'Sector', value: survey.sector?.nombre || 'N/A' },
    { label: 'Vereda', value: survey.vereda?.nombre || 'N/A' },
    { label: 'Corregimiento', value: survey.corregimiento?.nombre || '(No especificado)' },
    { label: 'Centro Poblado', value: survey.centro_poblado?.nombre || '(No especificado)' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locationFields.map((field) => (
          <div key={field.label} className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              {field.label}
            </label>
            <p className="text-sm bg-blue-50 rounded px-3 py-2 text-gray-900 font-medium">
              {field.value}
            </p>
          </div>
        ))}
      </div>

      {/* Ubicación Completa */}
      <div className="mt-6 p-4 bg-blue-100 rounded-lg border-l-4 border-blue-600">
        <p className="text-xs text-gray-600 mb-1 font-semibold">UBICACIÓN COMPLETA</p>
        <p className="text-sm font-semibold text-gray-900">
          {survey.municipio?.nombre}, {survey.parroquia?.nombre} • {survey.sector?.nombre} •{' '}
          {survey.vereda?.nombre}
          {survey.corregimiento ? ` • ${survey.corregimiento.nombre}` : ''}
          {survey.centro_poblado ? ` • ${survey.centro_poblado.nombre}` : ''}
        </p>
      </div>
    </div>
  )
}
