/**
 * 📅 MetadataSection
 * 
 * Sección que muestra información de control y metadata de la encuesta
 */

import React from 'react'
import { Badge } from '@/components/ui/badge'
import type { SurveyResponseData } from '@/types/survey-responses'

interface MetadataSectionProps {
  survey: SurveyResponseData
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({ survey }) => {
  const getStatusColor = (estado: string) => {
    const statusMap: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
    }
    return statusMap[estado] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (estado: string) => {
    const labels: Record<string, string> = {
      completed: 'Completada',
      in_progress: 'En Progreso',
      pending: 'Pendiente',
      draft: 'Borrador',
    }
    return labels[estado] || estado
  }

  const creationDate = new Date(survey.metadatos.fecha_creacion)
  const lastUpdateDate = new Date(survey.fecha_ultima_encuesta)
  const daysSinceCreation = Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysSinceUpdate = Math.floor((Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      {/* Estado y Versión */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Estado
          </label>
          <Badge className={`text-base px-3 py-2 ${getStatusColor(survey.metadatos.estado)}`}>
            {getStatusLabel(survey.metadatos.estado)}
          </Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Versión del Sistema</label>
          <Badge variant="outline" className="text-base px-3 py-2">
            v{survey.metadatos.version}
          </Badge>
        </div>
      </div>

      {/* Fechas */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 text-sm">Historial de Encuesta</h4>

        <div className="space-y-3">
          {/* Fecha de Creación */}
          <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-slate-400">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Fecha de Creación</p>
            <p className="text-sm font-semibold text-slate-900">
              {creationDate.toLocaleDateString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {creationDate.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-xs text-slate-500 mt-1">Hace {daysSinceCreation} días</p>
          </div>

          {/* Última Actualización */}
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Última Actualización</p>
            <p className="text-sm font-semibold text-blue-900">
              {lastUpdateDate.toLocaleDateString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {lastUpdateDate.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-xs text-blue-500 mt-1">Hace {daysSinceUpdate} días</p>
          </div>
        </div>
      </div>

      {/* Estadísticas de Encuestas */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">
          Estadísticas
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 font-semibold mb-1">Total de Encuestas</p>
            <p className="text-2xl font-bold text-purple-900">{survey.numero_encuestas}</p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 font-semibold mb-1">Miembros Vivos</p>
            <p className="text-2xl font-bold text-green-900">{survey.miembros_familia.total_miembros}</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Miembros Fallecidos</p>
            <p className="text-2xl font-bold text-gray-900">{survey.deceasedMembers?.length || 0}</p>
          </div>

          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-600 font-semibold mb-1">Tamaño de Familia</p>
            <p className="text-2xl font-bold text-orange-900">{survey.tamaño_familia}</p>
          </div>
        </div>
      </div>

      {/* ID Encuesta */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">ID de Encuesta (Identificador único del sistema)</label>
        <code className="block text-xs bg-gray-100 rounded px-3 py-2 font-mono break-all text-gray-900">
          {survey.id_encuesta}
        </code>
      </div>

      {/* Información de Control */}
      <div className="p-4 bg-slate-100 rounded-lg border-l-4 border-slate-600">
        <p className="text-xs text-slate-700 font-semibold mb-2">INFORMACIÓN DE CONTROL</p>
        <ul className="space-y-1 text-xs text-slate-700">
          <li>✓ Encuesta Número: {survey.numero_encuestas}</li>
          <li>✓ Estado Actual: {getStatusLabel(survey.estado_encuesta)}</li>
          <li>✓ Registrada hace: {daysSinceCreation} días</li>
          <li>✓ Actualizada hace: {daysSinceUpdate} días</li>
          <li>✓ Versión del Sistema: {survey.metadatos.version}</li>
        </ul>
      </div>
    </div>
  )
}
