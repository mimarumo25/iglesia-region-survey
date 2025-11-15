/**
 * ⚰️ DeceasedMembersSection
 * 
 * Sección que muestra información sobre miembros fallecidos de la familia
 */

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { SurveyResponseData, DeceasedMember } from '@/types/survey-responses'

interface DeceasedMembersSectionProps {
  survey: SurveyResponseData
}

const DeceasedMemberCard: React.FC<{ member: DeceasedMember; index: number }> = ({ member, index }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getGenderColor = (sexo: string) => {
    return sexo.toLowerCase().includes('femenino') ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-auto py-3 px-4 hover:bg-gray-100 border border-gray-300 rounded-lg"
        >
          <div className="flex items-center gap-3 flex-1 text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold">
              {member.nombres.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-700">{member.nombres}</p>
              <p className="text-xs text-gray-600">
                {member.parentesco?.nombre} • Falleció: {new Date(member.fechaFallecimiento).toLocaleDateString('es-CO')}
              </p>
            </div>
            <Badge className={getGenderColor(member.sexo?.nombre || '')}>
              {member.sexo?.nombre}
            </Badge>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pl-4 space-y-3 border-l-2 border-gray-300 pt-2">
        {/* Información Básica */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Información Básica</h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 text-xs">Parentesco</p>
              <Badge variant="secondary">{member.parentesco?.nombre || 'N/A'}</Badge>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Sexo</p>
              <Badge className={getGenderColor(member.sexo?.nombre || '')}>
                {member.sexo?.nombre || 'N/A'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Fecha de Fallecimiento */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Fallecimiento</h5>
          <div className="bg-gray-50 rounded px-3 py-2">
            <p className="text-sm font-semibold text-gray-900">
              {new Date(member.fechaFallecimiento).toLocaleDateString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-xs text-gray-600">
              {Math.floor((Date.now() - new Date(member.fechaFallecimiento).getTime()) / (1000 * 60 * 60 * 24))} días atrás
            </p>
          </div>
        </div>

        {/* Causa de Fallecimiento */}
        {member.causaFallecimiento && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Causa de Fallecimiento</h5>
            <p className="text-sm bg-gray-50 rounded px-3 py-2 text-gray-900 font-medium">
              {member.causaFallecimiento}
            </p>
          </div>
        )}

        {/* Nota Pastoral */}
        <div className="p-3 bg-gray-100 rounded-lg border-l-4 border-gray-500">
          <p className="text-xs text-gray-600 mb-1">⚰️ Registro de Duelo Familiar</p>
          <p className="text-sm text-gray-900">
            Se registra el fallecimiento de <span className="font-semibold">{member.nombres}</span> como{' '}
            <span className="font-semibold">{member.parentesco?.nombre?.toLowerCase()}</span> de la familia, para
            acompañamiento pastoral y oración.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const DeceasedMembersSection: React.FC<DeceasedMembersSectionProps> = ({ survey }) => {
  if (!survey.deceasedMembers || survey.deceasedMembers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay registros de miembros fallecidos</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-4">
        Se encontraron <span className="font-bold text-gray-900">{survey.deceasedMembers.length}</span> miembros
        fallecidos registrados en esta familia
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          ℹ️ Estos registros se mantienen para acompañamiento pastoral, memoria familiar y oración perpetua.
        </p>
      </div>

      <div className="space-y-3">
        {survey.deceasedMembers.map((member, index) => (
          <DeceasedMemberCard key={`deceased-${index}`} member={member} index={index} />
        ))}
      </div>
    </div>
  )
}
