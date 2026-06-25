/**
 * 👥 Tabs Detalladas de Miembros - Sistema MIA
 * 
 * Componente que organiza TODA la información de miembros de familia
 * en pestañas categorizadas para mejor visualización y navegación
 * 
 * @module components/familias/MiembrosDetailedTabs
 */

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  GraduationCap, 
  Heart, 
  Church,
  Phone,
  Mail
} from 'lucide-react';
import type { MiembroFamiliaConsolidado } from '@/types/familias';
import { formatCatalogOptionLabels } from '@/utils/catalogOptionFormatters';

interface MiembrosDetailedTabsProps {
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

const formatNecesidadesEnfermo = (miembro: MiembroFamiliaConsolidado): string => (
  formatCatalogOptionLabels((miembro as any).necesidadesEnfermo ?? miembro.necesidades_enfermo)
);

const MiembrosDetailedTabs: React.FC<MiembrosDetailedTabsProps> = ({ miembros }) => {
  if (!miembros || miembros.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay miembros registrados en esta familia
      </div>
    );
  }

  return (
    <Tabs defaultValue="basicos" className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
        <TabsTrigger value="basicos" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Datos Básicos</span>
          <span className="sm:hidden">Básicos</span>
        </TabsTrigger>
        <TabsTrigger value="formacion" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <span className="hidden sm:inline">Formación</span>
          <span className="sm:hidden">Estudios</span>
        </TabsTrigger>
        <TabsTrigger value="salud" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Salud</span>
          <span className="sm:hidden">Salud</span>
        </TabsTrigger>
        <TabsTrigger value="religioso" className="flex items-center gap-2">
          <Church className="h-4 w-4" />
          <span className="hidden sm:inline">Religiosa</span>
          <span className="sm:hidden">Fe</span>
        </TabsTrigger>
      </TabsList>

      {/* Tab 1: Datos Básicos */}
      <TabsContent value="basicos" className="mt-4">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[800px]">
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
              </tr>
            </thead>
            <tbody>
              {miembros.map((miembro, index) => (
                <tr 
                  key={`basico-${miembro.numero_identificacion}-${index}`}
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
                          <span className="truncate max-w-[150px]" title={miembro.email_personal}>
                            {miembro.email_personal}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* Tab 2: Formación y Trabajo */}
      <TabsContent value="formacion" className="mt-4">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[900px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold">Nombre</th>
                <th className="p-3 text-left text-xs font-semibold">Estudios</th>
                <th className="p-3 text-left text-xs font-semibold">Profesión</th>
                <th className="p-3 text-left text-xs font-semibold">Comunidad Cultural</th>
                <th className="p-3 text-left text-xs font-semibold">Liderazgo</th>
                <th className="p-3 text-left text-xs font-semibold">Destrezas</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((miembro, index) => (
                <tr 
                  key={`formacion-${miembro.numero_identificacion}-${index}`}
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-primary/60" />
                      <span className="font-semibold text-sm">{miembro.nombre_completo}</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs">{miembro.estudios || '-'}</td>
                  <td className="p-3 text-xs">{miembro.profesion || '-'}</td>
                  <td className="p-3 text-xs">{miembro.comunidad_cultural || '-'}</td>
                  <td className="p-3 text-xs">{miembro.liderazgo || '-'}</td>
                  <td className="p-3 text-xs max-w-[200px]">
                    {miembro.destrezas ? (
                      <span className="line-clamp-2" title={miembro.destrezas}>
                        {miembro.destrezas}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* Tab 3: Salud */}
      <TabsContent value="salud" className="mt-4">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[700px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold">Nombre</th>
                <th className="p-3 text-left text-xs font-semibold">Edad</th>
                <th className="p-3 text-left text-xs font-semibold">Enfermedades</th>
                <th className="p-3 text-left text-xs font-semibold">Necesidades del Enfermo</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((miembro, index) => (
                <tr 
                  key={`salud-${miembro.numero_identificacion}-${index}`}
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-primary/60" />
                      <span className="font-semibold text-sm">{miembro.nombre_completo}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">{miembro.edad} años</Badge>
                  </td>
                  <td className="p-3">
                    {miembro.enfermedades ? (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-600 max-w-[250px] line-clamp-2" title={miembro.enfermedades}>
                          {miembro.enfermedades}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin enfermedades registradas</span>
                    )}
                  </td>
                  <td className="p-3">
                    {formatNecesidadesEnfermo(miembro) !== '-' ? (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-600 max-w-[250px] line-clamp-2" title={formatNecesidadesEnfermo(miembro)}>
                          {formatNecesidadesEnfermo(miembro)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* Tab 4: Información Religiosa */}
      <TabsContent value="religioso" className="mt-4">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[500px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold">Nombre</th>
                <th className="p-3 text-left text-xs font-semibold">Parentesco</th>
                <th className="p-3 text-left text-xs font-semibold">Comunión en Casa</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((miembro, index) => (
                <tr 
                  key={`religioso-${miembro.numero_identificacion}-${index}`}
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-primary/60" />
                      <span className="font-semibold text-sm">{miembro.nombre_completo}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{miembro.parentesco}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge 
                      variant={miembro.comunion_casa ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {miembro.comunion_casa ? (
                        <span className="flex items-center gap-1">
                          <Church className="h-3 w-3" />
                          Sí recibe
                        </span>
                      ) : (
                        'No'
                      )}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MiembrosDetailedTabs;
