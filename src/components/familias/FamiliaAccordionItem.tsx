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
      <AccordionTrigger className="hover:bg-muted/50 px-4 py-4 hover:no-underline">
        <div className="flex items-center justify-between w-full pr-4">
          {/* Información principal de la familia */}
          <div className="flex items-start gap-4 flex-1">
            {/* Número de familia */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
              #{index + 1}
            </div>

            {/* Detalles de la familia */}
            <div className="flex flex-col items-start gap-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-left">{familia.apellido_familiar}</h3>
                <Badge variant="outline" className="font-mono text-xs">
                  {familia.codigo_familia}
                </Badge>
              </div>

              {/* Información secundaria en una línea */}
              <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                {familia.direccion_familia && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{familia.direccion_familia}</span>
                  </div>
                )}
                {familia.telefono && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{familia.telefono}</span>
                  </div>
                )}
              </div>

              {/* Ubicación geográfica */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {familia.departamento_nombre && (
                  <Badge variant="secondary" className="text-xs">
                    🏛️ {familia.departamento_nombre}
                  </Badge>
                )}
                {familia.municipio_nombre && (
                  <Badge variant="secondary" className="text-xs">
                    🏙️ {familia.municipio_nombre}
                  </Badge>
                )}
                {familia.parroquia_nombre && (
                  <Badge variant="secondary" className="text-xs">
                    ⛪ {familia.parroquia_nombre}
                  </Badge>
                )}
                {familia.sector_nombre && (
                  <Badge variant="outline" className="text-xs">
                    📍 {familia.sector_nombre}
                  </Badge>
                )}
                {familia.vereda_nombre && (
                  <Badge variant="outline" className="text-xs">
                    🌄 {familia.vereda_nombre}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{totalMiembros}</span>
              <span className="text-xs text-muted-foreground">miembros</span>
            </div>
            {totalDifuntos > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="font-semibold">{totalDifuntos}</span>
                <span className="text-xs text-muted-foreground">difuntos</span>
              </div>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 pt-2">
        {/* Información detallada de la familia */}
        <div className="space-y-4">
          {/* Información de infraestructura y servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {familia.tipo_vivienda && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/30">
                <Home className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground">Tipo de Vivienda</div>
                  <div className="text-sm font-semibold">{familia.tipo_vivienda}</div>
                </div>
              </div>
            )}

            {familia.sistema_acueducto && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/30">
                <Droplet className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground">Sistema Acueducto</div>
                  <div className="text-sm font-semibold">{familia.sistema_acueducto}</div>
                </div>
              </div>
            )}

            {familia.tipos_agua_residuales && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/30">
                <Building className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground">Aguas Residuales</div>
                  <div className="text-sm font-semibold">{familia.tipos_agua_residuales}</div>
                </div>
              </div>
            )}

            {familia.dispocision_basura && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/30">
                <Trash2 className="h-4 w-4 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground">Disposición Basura</div>
                  <div className="text-sm font-semibold">{familia.dispocision_basura}</div>
                </div>
              </div>
            )}
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
