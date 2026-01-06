/**
 * 👥 FamilyMembersSection
 * 
 * Sección que muestra detalles de todos los miembros vivos de la familia
 * con información completa: datos personales, contacto, educación, profesión, etc.
 */

import React, { useState } from 'react'
import { ChevronDown, Heart, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { SurveyResponseData, SurveyPerson } from '@/types/survey-responses'

/**
 * Helper function to parse JSON array strings or comma-separated strings into array
 */
const parseArrayField = (field: string | null | undefined): string[] => {
  if (!field) return [];
  
  try {
    const parsed = JSON.parse(field);
    if (Array.isArray(parsed)) {
      // Flatten array and split each element by comma
      return parsed
        .flatMap(item => 
          typeof item === 'string' && item.includes(',') 
            ? item.split(',').map(s => s.trim())
            : [item]
        )
        .filter(item => item && String(item).trim())
        .map(item => String(item).trim());
    }
  } catch {
    // Not valid JSON, continue
  }
  
  // Split by comma and filter empty items
  return field.split(',').map(item => item.trim()).filter(item => item);
};

interface FamilyMembersSectionProps {
  survey: SurveyResponseData
}

const PersonDetailCard: React.FC<{ person: SurveyPerson }> = ({ person }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getGenderColor = (sexo: string) => {
    return sexo.toLowerCase().includes('femenino') ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-auto py-3 px-4 hover:bg-gray-100 border border-gray-200 rounded-lg"
        >
          <div className="flex items-center gap-3 flex-1 text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
              {person.nombre_completo.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{person.nombre_completo}</p>
              <p className="text-xs text-gray-600">
                {person.parentesco?.nombre} • {person.edad} años
              </p>
            </div>
            <Badge className={getGenderColor(person.sexo?.nombre || '')}>
              {person.sexo?.nombre}
            </Badge>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pl-4 space-y-4 border-l-2 border-green-200 pt-2">
        {/* Identificación */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Identificación</h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 text-xs">Tipo</p>
              <p className="font-semibold text-gray-900">
                {person.identificacion?.tipo?.nombre || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Número</p>
              <p className="font-semibold text-gray-900 font-mono">
                {person.identificacion?.numero || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Contacto</h5>
          <div className="space-y-2">
            {person.telefono && (
              <div className="text-sm">
                <p className="text-gray-600 text-xs">Teléfono</p>
                <span className="text-gray-900 font-semibold">{person.telefono}</span>
              </div>
            )}
            {person.email && (
              <div className="text-sm">
                <p className="text-gray-600 text-xs">Email</p>
                <span className="text-gray-900 font-semibold break-all">{person.email}</span>
              </div>
            )}
            {person.direccion && (
              <div className="text-sm">
                <p className="text-gray-600 text-xs">Dirección</p>
                <span className="text-gray-900 font-semibold">{person.direccion}</span>
              </div>
            )}
          </div>
        </div>

        {/* Información Personal */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Información Personal</h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 text-xs">Fecha Nacimiento</p>
              <p className="font-semibold text-gray-900">
                {new Date(person.fecha_nacimiento).toLocaleDateString('es-CO')}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Edad</p>
              <p className="font-semibold text-gray-900">{person.edad} años</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Estado Civil</p>
              <p className="font-semibold text-gray-900">{person.estado_civil?.nombre || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Parentesco</p>
              <Badge variant="secondary">{person.parentesco?.nombre}</Badge>
            </div>
          </div>
        </div>

        {/* Educación y Profesión */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Educación y Trabajo</h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 text-xs">Estudios</p>
              <p className="font-semibold text-gray-900">{person.estudios?.nombre || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Profesión</p>
              <p className="font-semibold text-gray-900">{person.profesion?.nombre || 'Sin especificar'}</p>
            </div>
          </div>
        </div>

        {/* Comunidad Cultural y Liderazgo */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Contexto Social</h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 text-xs">Comunidad Cultural</p>
              <Badge variant="outline">{person.comunidad_cultural?.nombre || 'N/A'}</Badge>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Liderazgo</p>
              <div className="flex flex-wrap gap-1">
                {person.en_que_eres_lider ? (
                  parseArrayField(person.en_que_eres_lider).map((area, idx) => (
                    <Badge key={idx} variant="default" className="text-xs">
                      {area}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">No especificado</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tallas */}
        {person.tallas && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Tallas</h5>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600 text-xs">Camisa</p>
                <Badge variant="secondary">{person.tallas.camisa || 'N/A'}</Badge>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Pantalón</p>
                <Badge variant="secondary">{person.tallas.pantalon || 'N/A'}</Badge>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Zapato</p>
                <Badge variant="secondary">{person.tallas.zapato || 'N/A'}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Destrezas */}
        {person.destrezas && person.destrezas.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Destrezas</h5>
            <div className="flex flex-wrap gap-2">
              {person.destrezas.map((destreza) => (
                <Badge key={`${destreza.id}-destreza`} className="bg-purple-100 text-purple-800 border-purple-300">
                  {destreza.nombre}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Habilidades */}
        {person.habilidades && person.habilidades.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Habilidades</h5>
            <div className="space-y-2">
              {person.habilidades.map((habilidad) => (
                <div key={`${habilidad.id}-habilidad`} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{habilidad.nombre}</p>
                    {habilidad.descripcion && (
                      <p className="text-xs text-gray-600">{habilidad.descripcion}</p>
                    )}
                  </div>
                  {habilidad.nivel && <Badge variant="outline">{habilidad.nivel}</Badge>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Celebraciones */}
        {person.celebraciones && person.celebraciones.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Celebraciones</h5>
            <div className="flex flex-wrap gap-2">
              {person.celebraciones.map((celebracion, index) => (
                <Badge
                  key={`${celebracion.id}-celebracion-${index}`}
                  className="bg-yellow-100 text-yellow-800 border-yellow-300"
                >
                  {celebracion.motivo} ({celebracion.dia}/{celebracion.mes})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Enfermedades */}
        {person.enfermedades && person.enfermedades.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-red-700 uppercase tracking-wide">⚠️ Condiciones de Salud</h5>
            <div className="flex flex-wrap gap-2">
              {person.enfermedades.map((enfermedad, index) => (
                <Badge key={`${enfermedad.id}-enfermedad-${index}`} className="bg-red-100 text-red-800 border-red-300">
                  {enfermedad.nombre}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Necesidades del Enfermo */}
        {person.necesidad_enfermo && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-orange-700 uppercase tracking-wide flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Necesidades del Enfermo
            </h5>
            <div className="flex flex-wrap gap-2">
              {parseArrayField(person.necesidad_enfermo).map((necesidad, idx) => (
                <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-800 border-orange-300 text-xs">
                  {necesidad}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Solicitud de Comunión en Casa */}
        {person.solicitudComunionCasa && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Heart className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Solicita Comunión en Casa</p>
              <p className="text-xs text-blue-700">Este miembro ha solicitado recibir la comunión en su domicilio.</p>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

export const FamilyMembersSection: React.FC<FamilyMembersSectionProps> = ({ survey }) => {
  if (!survey.miembros_familia || survey.miembros_familia.personas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay miembros registrados en la familia</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-4">
        Se encontraron <span className="font-bold text-gray-900">{survey.miembros_familia.total_miembros}</span> miembros
        en esta familia
      </div>

      {survey.miembros_familia.personas.map((person) => (
        <PersonDetailCard key={person.id} person={person} />
      ))}
    </div>
  )
}
