/**
 * 📋 Lista de Familias en Acordeón - Sistema MIA
 * 
 * Componente contenedor que renderiza todas las familias en formato de acordeón,
 * mostrando estadísticas generales y permitiendo expandir cada familia individualmente
 * 
 * @module components/familias/FamiliasAccordionList
 */

import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Home,
  Heart,
  BarChart3,
  MapPin
} from 'lucide-react';
import type { FamiliaConsolidada } from '@/types/familias';
import FamiliaAccordionItem from './FamiliaAccordionItem';
import { getEstadisticasFamilias } from '@/services/familias';

interface FamiliasAccordionListProps {
  familias: FamiliaConsolidada[];
  isLoading?: boolean;
}

const FamiliasAccordionList: React.FC<FamiliasAccordionListProps> = ({ 
  familias, 
  isLoading = false 
}) => {
  // Calcular estadísticas
  const estadisticas = getEstadisticasFamilias(familias);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Cargando familias...</p>
      </div>
    );
  }

  if (!familias || familias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No se encontraron familias</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          No hay familias que coincidan con los filtros seleccionados. 
          Intenta ajustar los criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Familias</p>
                <p className="text-xl sm:text-2xl font-bold">{estadisticas.totalFamilias}</p>
              </div>
              <Home className="h-6 w-6 sm:h-8 sm:w-8 text-primary/60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Miembros</p>
                <p className="text-xl sm:text-2xl font-bold">{estadisticas.totalMiembros}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500/60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Promedio/Familia</p>
                <p className="text-xl sm:text-2xl font-bold">{estadisticas.promedioMiembrosPorFamilia}</p>
              </div>
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-secondary/60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Difuntos</p>
                <p className="text-xl sm:text-2xl font-bold">{estadisticas.totalDifuntos}</p>
              </div>
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-500/60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      
      {/* Lista de familias en acordeón */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span>Listado de Familias</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Haz clic en cada familia para ver los detalles completos
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <Accordion type="single" collapsible className="w-full">
            {familias.map((familia, index) => (
              <FamiliaAccordionItem
                key={familia.id_familia}
                familia={familia}
                index={index}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamiliasAccordionList;
