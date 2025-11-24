/**
 * 🏠 Item de Acordeón de Familia - Sistema MIA
 * 
 * Componente individual que representa una familia en el acordeón,
 * mostrando un resumen en el header y detalles completos al expandir
 * 
 * @module components/familias/FamiliaAccordionItem
 */

import React from 'react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home,
  MapPin,
  Phone,
  Users,
  Heart,
  Droplet,
  Trash2,
  Building
} from 'lucide-react';
import type { FamiliaConsolidada } from '@/types/familias';
import MiembrosTableWithDialog from "./MiembrosTableWithDialog";
import DifuntosFamiliaTable from "./DifuntosFamiliaTable";

interface FamiliaAccordionItemProps {
  familia: FamiliaConsolidada;
  index: number;
}

const FamiliaAccordionItem: React.FC<FamiliaAccordionItemProps> = ({ familia, index }) => {
  const totalMiembros = familia.miembros_familia?.length || 0;
  const totalDifuntos = familia.difuntos_familia?.length || 0;

  return (
    <AccordionItem value={`familia-${familia.id_familia}`} className="border rounded-lg mb-3 overflow-hidden">
      <AccordionTrigger className="hover:bg-muted/50 px-3 sm:px-4 py-3 sm:py-4 hover:no-underline">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full pr-2 sm:pr-4 gap-3">
          {/* Información principal de la familia */}
          <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full min-w-0">
            {/* Número de familia */}
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary font-bold text-sm sm:text-base flex-shrink-0">
              #{index + 1}
            </div>

            {/* Detalles de la familia */}
            <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
              {/* Nombre y código */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-left">{familia.apellido_familiar}</h3>
                <Badge variant="outline" className="font-mono text-xs">
                  {familia.codigo_familia}
                </Badge>
              </div>

              {/* Contacto y dirección */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap text-xs text-muted-foreground w-full">
                {familia.direccion_familia && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{familia.direccion_familia}</span>
                  </div>
                )}
                {familia.telefono && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span>{familia.telefono}</span>
                  </div>
                )}
              </div>

              {/* Ubicación geográfica - Grid responsive */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 flex-wrap text-xs w-full">
                {familia.departamento_nombre && (
                  <Badge variant="secondary" className="text-xs justify-center sm:justify-start">
                    🏛️ {familia.departamento_nombre}
                  </Badge>
                )}
                {familia.municipio_nombre && (
                  <Badge variant="secondary" className="text-xs justify-center sm:justify-start">
                    🏙️ {familia.municipio_nombre}
                  </Badge>
                )}
                {familia.parroquia_nombre && (
                  <Badge variant="secondary" className="text-xs justify-center sm:justify-start col-span-2">
                    ⛪ {familia.parroquia_nombre}
                  </Badge>
                )}
                {familia.sector_nombre && (
                  <Badge variant="outline" className="text-xs justify-center sm:justify-start">
                    📍 {familia.sector_nombre}
                  </Badge>
                )}
                {familia.corregimiento_nombre && (
                  <Badge variant="outline" className="text-xs justify-center sm:justify-start">
                    🏘️ {familia.corregimiento_nombre}
                  </Badge>
                )}
                {familia.centro_poblado_nombre && (
                  <Badge variant="outline" className="text-xs justify-center sm:justify-start col-span-2">
                    🏡 {familia.centro_poblado_nombre}
                  </Badge>
                )}
                {familia.vereda_nombre && (
                  <Badge variant="outline" className="text-xs justify-center sm:justify-start">
                    🌄 {familia.vereda_nombre}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas - Visible en desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{totalMiembros}</span>
              <span className="text-xs text-muted-foreground">miembros</span>
            </div>
            {totalDifuntos > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="font-semibold">{totalDifuntos}</span>
                <span className="text-xs text-muted-foreground">difuntos</span>
              </div>
            )}
          </div>
          
          {/* Estadísticas móviles - Visible en mobile/tablet */}
          <div className="flex lg:hidden items-center gap-3 self-start sm:self-center">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="font-semibold">{totalMiembros}</span>
            </Badge>
            {totalDifuntos > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span className="font-semibold">{totalDifuntos}</span>
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-3 sm:px-4 pb-4 pt-2">
        {/* Información detallada de la familia */}
        <div className="space-y-4 sm:space-y-6">
          {/* Sección: Información de Infraestructura y Servicios */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <Home className="h-4 w-4" />
              Infraestructura y Servicios
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
              {familia.tipo_vivienda && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/10">
                  <Home className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Tipo de Vivienda</div>
                    <div className="text-sm font-semibold break-words">{familia.tipo_vivienda}</div>
                  </div>
                </div>
              )}

              {familia.sistema_acueducto && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <Droplet className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Sistema Acueducto</div>
                    <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 break-words">
                      {familia.sistema_acueducto}
                    </div>
                  </div>
                </div>
              )}

              {familia.tipos_agua_residuales && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <Building className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Aguas Residuales</div>
                    <div className="text-xs font-medium text-green-700 dark:text-green-400">
                      {familia.tipos_agua_residuales.split(',').map((tipo, idx) => (
                        <Badge key={idx} variant="outline" className="mr-1 mb-1 text-xs bg-green-100 dark:bg-green-900/30 border-green-300">
                          {tipo.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {familia.dispocision_basura && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                  <Trash2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Disposición Basura</div>
                    <div className="text-xs font-medium text-orange-700 dark:text-orange-400">
                      {familia.dispocision_basura.split(',').map((metodo, idx) => (
                        <Badge key={idx} variant="outline" className="mr-1 mb-1 text-xs bg-orange-100 dark:bg-orange-900/30 border-orange-300">
                          {metodo.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Tabs para miembros y difuntos */}
          <Tabs defaultValue="miembros" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="miembros" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Miembros ({totalMiembros})
              </TabsTrigger>
              <TabsTrigger value="difuntos" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Difuntos ({totalDifuntos})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="miembros" className="mt-4">
              <MiembrosTableWithDialog miembros={familia.miembros_familia || []} />
            </TabsContent>

            <TabsContent value="difuntos" className="mt-4">
              <DifuntosFamiliaTable difuntos={familia.difuntos_familia || []} />
            </TabsContent>
          </Tabs>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FamiliaAccordionItem;
