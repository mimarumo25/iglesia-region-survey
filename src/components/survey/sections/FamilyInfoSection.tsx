/**
 * 👨‍👩‍👧‍👦 FamilyInfoSection
 * 
 * Sección que muestra la información básica y administrativa de la familia
 */

import React from 'react'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { SurveyResponseData } from '@/types/survey-responses'

interface FamilyInfoSectionProps {
  survey: SurveyResponseData
}

export const FamilyInfoSection: React.FC<FamilyInfoSectionProps> = ({ survey }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Apellido Familiar
          </label>
          <p className="text-base bg-purple-50 rounded px-3 py-2 text-gray-900 font-semibold">
            {survey.apellido_familiar}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Teléfono
          </label>
          <p className="text-base bg-purple-50 rounded px-3 py-2 text-gray-900 font-semibold">
            {survey.telefono}
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700">
            Dirección
          </label>
          <p className="text-sm bg-purple-50 rounded px-3 py-2 text-gray-900 font-semibold">
            {survey.direccion_familia}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Tamaño de Familia
          </label>
          <Badge variant="secondary" className="text-base px-3 py-2">
            {survey.tamaño_familia} {survey.tamaño_familia === 1 ? 'persona' : 'personas'}
          </Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Contrato EPM
          </label>
          <p className="text-sm bg-purple-50 rounded px-3 py-2 text-gray-900 font-semibold">
            {survey.numero_contrato_epm || 'Sin especificar'}
          </p>
        </div>
      </div>

      {/* Código Familia */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Código Familia (Identificador único)</label>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-gray-100 rounded px-3 py-2 font-mono break-all">
            {survey.codigo_familia}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(survey.codigo_familia)}
            className="hover:bg-gray-200"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Encuestas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Total Encuestas</label>
          <Badge className="bg-purple-600 text-white text-base px-3 py-2">
            {survey.numero_encuestas}
          </Badge>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Última Encuesta</label>
          <p className="text-sm bg-purple-50 rounded px-3 py-2 text-gray-900 font-semibold">
            {new Date(survey.fecha_ultima_encuesta).toLocaleDateString('es-CO', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Información Religiosa */}
      <div className="p-4 bg-purple-100 rounded-lg border-l-4 border-purple-600 space-y-2">
        <p className="text-xs text-gray-600 font-semibold">INFORMACIÓN RELIGIOSA</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Comunión en Casa</span>
          <Badge variant={survey.comunion_en_casa ? 'default' : 'secondary'}>
            {survey.comunion_en_casa ? '✓ Sí' : '✗ No'}
          </Badge>
        </div>
      </div>
    </div>
  )
}
