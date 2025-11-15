/**
 * 📋 SurveyDetailCard
 * 
 * Componente principal para mostrar detalles completos de una encuesta
 * con estructura organizada en secciones etiquetadas.
 * 
 * Características:
 * - Secciones expandibles con accordion
 * - Labels descriptivos para cada sección
 * - Información clara y estructurada
 * - Responsive design
 * - Accesibilidad mejorada
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  MapPin,
  Users,
  Home,
  Droplets,
  Trash2,
  Zap,
  Cross,
  UserX,
  Calendar,
  FileText,
  ChevronDown,
  Phone,
  Mail,
  Edit2,
  Download,
  Share2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SurveyResponseData } from '@/types/survey-responses'
import { LocationSection } from './sections/LocationSection'
import { FamilyInfoSection } from './sections/FamilyInfoSection'
import { HousingInfoSection } from './sections/HousingInfoSection'
import { FamilyMembersSection } from './sections/FamilyMembersSection'
import { DeceasedMembersSection } from './sections/DeceasedMembersSection'
import { MetadataSection } from './sections/MetadataSection'

interface SurveyDetailCardProps {
  survey: SurveyResponseData
  onEdit?: () => void
  onExport?: () => void
  onShare?: () => void
  className?: string
  isLoading?: boolean
}

export const SurveyDetailCard: React.FC<SurveyDetailCardProps> = ({
  survey,
  onEdit,
  onExport,
  onShare,
  className,
  isLoading = false,
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['location', 'family-info', 'housing'])

  const getStatusColor = (estado: string) => {
    const statusMap: Record<string, string> = {
      completed: 'bg-green-100 text-green-800 border-green-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      draft: 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return statusMap[estado] || statusMap.pending
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

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-gray-600">Cargando encuesta...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Información Principal */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Encuesta #{survey.id_encuesta}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Familia: <span className="font-semibold">{survey.apellido_familiar}</span>
                </p>
              </div>
              <Badge className={cn('text-sm font-medium', getStatusColor(survey.estado_encuesta))}>
                {getStatusLabel(survey.estado_encuesta)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Código Familia</p>
                <p className="font-mono text-xs font-semibold break-all">
                  {survey.codigo_familia}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Última Actualización</p>
                <p className="font-semibold">
                  {new Date(survey.fecha_ultima_encuesta).toLocaleDateString('es-CO')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="w-full justify-start"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            )}
            {onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShare}
                className="w-full justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contacto Rápido */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <div className="text-sm">
                <p className="text-gray-600">Teléfono</p>
                <p className="font-semibold">{survey.telefono}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <div className="text-sm">
                <p className="text-gray-600">Dirección</p>
                <p className="font-semibold text-xs">{survey.direccion_familia}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div className="text-sm">
                <p className="text-gray-600">Tamaño</p>
                <p className="font-semibold">{survey.tamaño_familia} personas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-500" />
              <div className="text-sm">
                <p className="text-gray-600">EPM</p>
                <p className="font-semibold text-xs">{survey.numero_contrato_epm || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secciones Principales - Accordion */}
      <Card>
        <CardContent className="pt-6">
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={setOpenSections}
            className="w-full"
          >
            {/* 📍 UBICACIÓN GEOGRÁFICA */}
            <AccordionItem value="location" className="border-0 mb-4">
              <AccordionTrigger className="bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-3 transition-colors">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">📍 Ubicación Geográfica</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-4">
                <LocationSection survey={survey} />
              </AccordionContent>
            </AccordionItem>

            {/* 👨‍👩‍👧‍👦 INFORMACIÓN FAMILIAR */}
            <AccordionItem value="family-info" className="border-0 mb-4">
              <AccordionTrigger className="bg-purple-50 hover:bg-purple-100 rounded-lg px-4 py-3 transition-colors">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">👨‍👩‍👧‍👦 Información Familiar</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-4">
                <FamilyInfoSection survey={survey} />
              </AccordionContent>
            </AccordionItem>

            {/* 🏠 INFORMACIÓN DE VIVIENDA */}
            <AccordionItem value="housing" className="border-0 mb-4">
              <AccordionTrigger className="bg-orange-50 hover:bg-orange-100 rounded-lg px-4 py-3 transition-colors">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-900">🏠 Información de Vivienda</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-4">
                <HousingInfoSection survey={survey} />
              </AccordionContent>
            </AccordionItem>

            {/* 👥 MIEMBROS DE LA FAMILIA */}
            <AccordionItem value="members" className="border-0 mb-4">
              <AccordionTrigger className="bg-green-50 hover:bg-green-100 rounded-lg px-4 py-3 transition-colors">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">
                    👥 Miembros de la Familia ({survey.miembros_familia.total_miembros})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-4">
                <FamilyMembersSection survey={survey} />
              </AccordionContent>
            </AccordionItem>

            {/* ⚰️ MIEMBROS FALLECIDOS */}
            {survey.deceasedMembers && survey.deceasedMembers.length > 0 && (
              <AccordionItem value="deceased" className="border-0 mb-4">
                <AccordionTrigger className="bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
                  <div className="flex items-center gap-2">
                    <UserX className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      ⚰️ Miembros Fallecidos ({survey.deceasedMembers.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pl-4">
                  <DeceasedMembersSection survey={survey} />
                </AccordionContent>
              </AccordionItem>
            )}

            {/* 📅 METADATA */}
            <AccordionItem value="metadata" className="border-0">
              <AccordionTrigger className="bg-slate-50 hover:bg-slate-100 rounded-lg px-4 py-3 transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <span className="font-semibold text-slate-900">📅 Información de Control</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-4">
                <MetadataSection survey={survey} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

export default SurveyDetailCard
