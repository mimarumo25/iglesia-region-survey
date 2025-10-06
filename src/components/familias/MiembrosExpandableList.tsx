/**
 * 👥 Lista Expandible de Miembros - Sistema MIA
 * 
 * Componente que muestra miembros con acordeón anidado:
 * - Resumen básico visible (tabla compacta)
 * - Click en miembro → Expansión con TODA la información
 * - Organización en secciones temáticas
 * 
 * @module components/familias/MiembrosExpandableList
 */

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Phone, 
  Mail,
  Calendar,
  GraduationCap, 
  Briefcase,
  Users,
  Award,
  Heart,
  Church,
  Ruler,
  Sparkles
} from 'lucide-react';
import type { MiembroFamiliaConsolidado } from '@/types/familias';

interface MiembrosExpandableListProps {
  miembros: MiembroFamiliaConsolidado[];
}

/**
 * Formatea fecha a formato DD/MM/YYYY
 */
const formatearFecha = (fecha: string | null | undefined): string => {
  if (!fecha) return '-';
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  } catch {
    return '-';
  }
};

const MiembrosExpandableList: React.FC<MiembrosExpandableListProps> = ({ miembros }) => {
  if (!miembros || miembros.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay miembros registrados en esta familia
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen General - Tabla compacta */}
      <div className="rounded-md border overflow-hidden">
        <div className="bg-muted/50 px-4 py-3 border-b">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Resumen de Miembros ({miembros.length})
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Haz click en cualquier miembro para ver toda su información detallada
          </p>
        </div>

        {/* Tabla de resumen */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-3 text-left text-xs font-semibold">Nombre</th>
                <th className="p-3 text-left text-xs font-semibold">Identificación</th>
                <th className="p-3 text-left text-xs font-semibold">Edad</th>
                <th className="p-3 text-left text-xs font-semibold">Sexo</th>
                <th className="p-3 text-left text-xs font-semibold">Parentesco</th>
                <th className="p-3 text-left text-xs font-semibold hidden md:table-cell">Contacto</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((miembro, index) => (
                <tr 
                  key={`resumen-${miembro.numero_identificacion}-${index}`}
                  className="border-t hover:bg-muted/30 transition-colors text-xs"
                >
                  <td className="p-3 font-semibold">{miembro.nombre_completo}</td>
                  <td className="p-3">
                    <span className="font-mono">{miembro.numero_identificacion}</span>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">{miembro.edad}</Badge>
                  </td>
                  <td className="p-3">{miembro.sexo}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{miembro.parentesco}</Badge>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {miembro.telefono_personal || miembro.email_personal || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Separator />

      {/* Acordeón de detalles por miembro */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-muted-foreground px-1">
          📋 Información Detallada por Miembro
        </h4>
        
        <Accordion type="single" collapsible className="space-y-2">
          {miembros.map((miembro, index) => (
            <AccordionItem 
              key={`detalle-${miembro.numero_identificacion}-${index}`}
              value={`miembro-${index}`}
              className="border rounded-lg overflow-hidden bg-card"
            >
              <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs">
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {miembro.nombre_completo}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                        <span>{miembro.parentesco}</span>
                        <span>•</span>
                        <span>{miembro.edad} años</span>
                        <span>•</span>
                        <span className="font-mono">{miembro.numero_identificacion}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="hidden sm:block">
                    Ver detalles
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Sección 1: Información Personal */}
                  <Card className="border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Información Personal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-muted-foreground">Tipo ID:</span>
                          <p className="font-medium">{miembro.tipo_identificacio}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Número ID:</span>
                          <p className="font-mono font-medium">{miembro.numero_identificacion}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">F. Nacimiento:</span>
                          <p className="font-medium">{formatearFecha(miembro.fecha_nacimiento)}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Edad:</span>
                          <p className="font-medium">{miembro.edad} años</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Sexo:</span>
                          <p className="font-medium">{miembro.sexo}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Estado Civil:</span>
                          <p className="font-medium">{miembro.situacion_civil}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sección 2: Contacto */}
                  <Card className="border-blue-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-500" />
                        Información de Contacto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {miembro.telefono_personal ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Teléfono</p>
                            <p className="font-medium">{miembro.telefono_personal}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Sin teléfono registrado</p>
                      )}
                      {miembro.email_personal ? (
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium text-xs break-all">{miembro.email_personal}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Sin email registrado</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Sección 3: Formación y Trabajo */}
                  <Card className="border-purple-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-purple-500" />
                        Formación & Trabajo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Estudios</span>
                        </div>
                        <p className="font-medium">{miembro.estudios || 'No especificado'}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Profesión</span>
                        </div>
                        <p className="font-medium">{miembro.profesion || 'No especificado'}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Comunidad Cultural</span>
                        </div>
                        <p className="font-medium">{miembro.comunidad_cultural || 'No especificado'}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sección 4: Habilidades y Liderazgo */}
                  <Card className="border-yellow-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        Habilidades & Liderazgo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Liderazgo</span>
                        </div>
                        <p className="font-medium">{miembro.liderazgo || 'No especificado'}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Destrezas</span>
                        </div>
                        <p className="font-medium">{miembro.destrezas || 'No especificado'}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sección 5: Salud */}
                  <Card className="border-red-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Información de Salud
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-muted-foreground">Enfermedades</span>
                        </div>
                        {miembro.enfermedades ? (
                          <div className="bg-red-50 border border-red-200 rounded-md p-2">
                            <p className="text-red-700 font-medium text-xs">{miembro.enfermedades}</p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-xs">Sin enfermedades registradas</p>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-muted-foreground">Necesidades del Enfermo</span>
                        </div>
                        {miembro.necesidades_enfermo ? (
                          <div className="bg-orange-50 border border-orange-200 rounded-md p-2">
                            <p className="text-orange-700 font-medium text-xs">{miembro.necesidades_enfermo}</p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-xs">No especificado</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sección 6: Información Religiosa */}
                  <Card className="border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Church className="h-4 w-4 text-primary" />
                        Información Religiosa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Comunión en Casa</span>
                        <Badge variant={miembro.comunion_casa ? "default" : "secondary"}>
                          {miembro.comunion_casa ? (
                            <span className="flex items-center gap-1">
                              <Church className="h-3 w-3" />
                              Sí recibe
                            </span>
                          ) : (
                            'No'
                          )}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sección 7: Tallas y Medidas */}
                  <Card className="border-cyan-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-cyan-500" />
                        Tallas & Medidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Ruler className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Camisa</span>
                          </div>
                          <Badge variant="outline" className="w-full justify-center">
                            {miembro.talla_camisa || '-'}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Ruler className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Pantalón</span>
                          </div>
                          <Badge variant="outline" className="w-full justify-center">
                            {miembro.talla_pantalon || '-'}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Ruler className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Zapato</span>
                          </div>
                          <Badge variant="outline" className="w-full justify-center">
                            {miembro.talla_zapato || '-'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default MiembrosExpandableList;
