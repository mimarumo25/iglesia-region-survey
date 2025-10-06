/**
 * 👤 Tabla de Miembros de Familia - Sistema MIA
 * 
 * Componente que muestra todos los miembros de una familia específica
 * en formato de tabla responsive con información detallada
 * 
 * @module components/familias/MiembrosFamiliaTable
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Heart,
  Briefcase,
  Users,
  Award,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import type { MiembroFamiliaConsolidado } from '@/types/familias';

interface MiembrosFamiliaTableProps {
  miembros: MiembroFamiliaConsolidado[];
}

/**
 * Calcula la edad desde una fecha de nacimiento
 */
const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

/**
 * Formatea una fecha ISO a formato legible
 */
const formatearFecha = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return fecha;
  }
};

const MiembrosFamiliaTable: React.FC<MiembrosFamiliaTableProps> = ({ miembros }) => {
  if (!miembros || miembros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">
          No hay miembros registrados en esta familia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vista de tabla para pantallas grandes */}
      <div className="hidden lg:block overflow-x-auto rounded-md border">
        <table className="w-full min-w-[1600px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left text-xs font-semibold">Identificación</th>
              <th className="p-3 text-left text-xs font-semibold">Nombre Completo</th>
              <th className="p-3 text-left text-xs font-semibold">F. Nacimiento</th>
              <th className="p-3 text-left text-xs font-semibold">Edad</th>
              <th className="p-3 text-left text-xs font-semibold">Sexo</th>
              <th className="p-3 text-left text-xs font-semibold">Parentesco</th>
              <th className="p-3 text-left text-xs font-semibold">Estado Civil</th>
              <th className="p-3 text-left text-xs font-semibold">Contacto</th>
              <th className="p-3 text-left text-xs font-semibold">Estudios</th>
              <th className="p-3 text-left text-xs font-semibold">Profesión</th>
              <th className="p-3 text-left text-xs font-semibold">Comunidad</th>
              <th className="p-3 text-left text-xs font-semibold">Enfermedades</th>
              <th className="p-3 text-left text-xs font-semibold">Necesidades</th>
              <th className="p-3 text-left text-xs font-semibold">Liderazgo</th>
              <th className="p-3 text-left text-xs font-semibold">Destrezas</th>
              <th className="p-3 text-left text-xs font-semibold">Comunión Casa</th>
            </tr>
          </thead>
          <tbody>
            {miembros.map((miembro, index) => (
              <tr 
                key={`${miembro.numero_identificacion}-${index}`}
                className="border-t hover:bg-muted/50 transition-colors"
              >
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{miembro.tipo_identificacio}</span>
                    <span className="font-mono text-xs font-medium">{miembro.numero_identificacion}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-primary/60" />
                    <span className="font-semibold text-sm">{miembro.nombre_completo}</span>
                  </div>
                </td>
                <td className="p-3 text-xs">{formatearFecha(miembro.fecha_nacimiento)}</td>
                <td className="p-3">
                  <Badge variant="secondary" className="text-xs">{miembro.edad} años</Badge>
                </td>
                <td className="p-3 text-xs">{miembro.sexo}</td>
                <td className="p-3">
                  <Badge variant="outline" className="text-xs">{miembro.parentesco}</Badge>
                </td>
                <td className="p-3 text-xs">{miembro.situacion_civil}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1 text-xs">
                    {miembro.telefono_personal && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{miembro.telefono_personal}</span>
                      </div>
                    )}
                    {miembro.email_personal && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[120px]" title={miembro.email_personal}>
                          {miembro.email_personal}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3 text-xs">{miembro.estudios || '-'}</td>
                <td className="p-3 text-xs">{miembro.profesion || '-'}</td>
                <td className="p-3 text-xs">{miembro.comunidad_cultural || '-'}</td>
                <td className="p-3">
                  {miembro.enfermedades ? (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">{miembro.enfermedades}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-3 text-xs">{miembro.necesidades_enfermo || '-'}</td>
                <td className="p-3 text-xs">{miembro.liderazgo || '-'}</td>
                <td className="p-3 text-xs">{miembro.destrezas || '-'}</td>
                <td className="p-3">
                  <Badge variant={miembro.comunion_casa ? "default" : "secondary"} className="text-xs">
                    {miembro.comunion_casa ? 'Sí' : 'No'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de cards para pantallas pequeñas y medianas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {miembros.map((miembro, index) => (
          <Card 
            key={`${miembro.numero_identificacion}-${index}`}
            className="hover:shadow-md transition-shadow overflow-hidden"
          >
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    {miembro.nombre_completo}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {miembro.tipo_identificacio}: <span className="font-mono">{miembro.numero_identificacion}</span>
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">{miembro.edad} años</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4 space-y-3">
              {/* Información Personal */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground font-medium">F. Nacimiento:</span>
                  <p className="font-semibold">{formatearFecha(miembro.fecha_nacimiento)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Sexo:</span>
                  <p className="font-semibold">{miembro.sexo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Parentesco:</span>
                  <p><Badge variant="outline" className="text-xs">{miembro.parentesco}</Badge></p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Estado Civil:</span>
                  <p className="font-semibold">{miembro.situacion_civil}</p>
                </div>
              </div>

              {/* Contacto */}
              {(miembro.telefono_personal || miembro.email_personal) && (
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Contacto</p>
                  {miembro.telefono_personal && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone className="h-3 w-3 text-primary" />
                      <span>{miembro.telefono_personal}</span>
                    </div>
                  )}
                  {miembro.email_personal && (
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="h-3 w-3 text-primary" />
                      <span className="truncate">{miembro.email_personal}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Formación y Trabajo */}
              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Formación & Trabajo</p>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {miembro.estudios && (
                    <div className="flex items-start gap-2">
                      <GraduationCap className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-muted-foreground">Estudios:</span>
                        <span className="ml-1 font-semibold">{miembro.estudios}</span>
                      </div>
                    </div>
                  )}
                  {miembro.profesion && (
                    <div className="flex items-start gap-2">
                      <Briefcase className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-muted-foreground">Profesión:</span>
                        <span className="ml-1 font-semibold">{miembro.profesion}</span>
                      </div>
                    </div>
                  )}
                  {miembro.comunidad_cultural && (
                    <div className="flex items-start gap-2">
                      <Users className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-muted-foreground">Comunidad:</span>
                        <span className="ml-1 font-semibold">{miembro.comunidad_cultural}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Habilidades y Liderazgo */}
              {(miembro.liderazgo || miembro.destrezas) && (
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Habilidades</p>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {miembro.liderazgo && (
                      <div className="flex items-start gap-2">
                        <Award className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-muted-foreground">Liderazgo:</span>
                          <span className="ml-1 font-semibold">{miembro.liderazgo}</span>
                        </div>
                      </div>
                    )}
                    {miembro.destrezas && (
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-3 w-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-muted-foreground">Destrezas:</span>
                          <span className="ml-1 font-semibold">{miembro.destrezas}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Salud */}
              {(miembro.enfermedades || miembro.necesidades_enfermo) && (
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Salud</p>
                  {miembro.enfermedades && (
                    <div className="flex items-start gap-2 text-xs">
                      <Heart className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="bg-red-50 border border-red-200 rounded-md px-2 py-1 flex-1">
                        <span className="text-muted-foreground font-medium">Enfermedades:</span>
                        <span className="ml-1 text-red-700 font-semibold">{miembro.enfermedades}</span>
                      </div>
                    </div>
                  )}
                  {miembro.necesidades_enfermo && (
                    <div className="flex items-start gap-2 text-xs">
                      <Heart className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="bg-orange-50 border border-orange-200 rounded-md px-2 py-1 flex-1">
                        <span className="text-muted-foreground font-medium">Necesidades:</span>
                        <span className="ml-1 text-orange-700 font-semibold">{miembro.necesidades_enfermo}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Información Religiosa */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Comunión en Casa:</span>
                  <Badge variant={miembro.comunion_casa ? "default" : "secondary"} className="text-xs">
                    {miembro.comunion_casa ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MiembrosFamiliaTable;
